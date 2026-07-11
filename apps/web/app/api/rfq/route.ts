// RFQ submission — TRD §T-4 pipeline: server Zod re-validation → spam gates
// (honeypot in schema, time-trap here) → rate limit → idempotency → notify
// email + WhatsApp → reference number. A lost lead is the one unacceptable
// failure mode (FR-3): every failure returns a plain error so the client can
// preserve state and offer retry + fallback.
import { NextResponse } from 'next/server'
import { RFQSubmission } from '@vedanta/schemas'
import { sendLeadEmail, whatsappNotifier } from '../../../lib/notify'

export const dynamic = 'force-dynamic'

const SUBMIT_ERROR =
  'Your requirement could not be sent. Your entries are preserved — please retry, or email us directly.'

// ponytail: in-memory rate limit + idempotency — correct on a single instance,
// resets on redeploy. Move to Vercel KV/Upstash if instances scale past one.
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const rateLog = new Map<string, number[]>()
const seenSubmissions = new Map<string, { referenceNumber: string; expires: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (rateLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  rateLog.set(ip, [...recent, now])
  return recent.length >= RATE_MAX
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many submissions — please wait a few minutes and retry.' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)

  // Server-side re-validation (client Zod is trust-but-verify); the schema's
  // honeypot z.literal('') is the first spam gate
  const parsed = RFQSubmission.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', issues: parsed.error.issues }, { status: 400 })
  }
  const { data } = parsed

  // Time-trap spam gate: reject if submitted faster than 5 seconds (bots don't read forms)
  if (Date.now() - data.submittedAt < 5000) {
    return NextResponse.json({ error: 'Submission rejected' }, { status: 400 })
  }

  // Uploaded keys must be presign-issued (uploads/ scope) — anything else is forged
  if (!data.uploadedFileKeys.every((k) => k.startsWith('uploads/'))) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  // Idempotency: a retry after a timed-out-but-delivered submit must not
  // create a duplicate lead — return the original reference
  const prior = seenSubmissions.get(data.idempotencyKey)
  if (prior && prior.expires > Date.now()) {
    return NextResponse.json({ referenceNumber: prior.referenceNumber, duplicate: true })
  }

  const referenceNumber = `VG-${Date.now().toString(36).toUpperCase()}`

  try {
    await sendLeadEmail(data, referenceNumber)
  } catch (err) {
    console.error(`[rfq] lead ${referenceNumber} email failed:`, err)
    return NextResponse.json({ error: SUBMIT_ERROR }, { status: 502 })
  }

  // WhatsApp ping is best-effort — the lead is already safe in the inbox
  await whatsappNotifier.send(data, referenceNumber).catch((err) => {
    console.error(`[rfq] lead ${referenceNumber} whatsapp ping failed:`, err)
  })

  seenSubmissions.set(data.idempotencyKey, { referenceNumber, expires: Date.now() + 24 * 60 * 60 * 1000 })

  // TODO (later phase): AV scan hook on uploaded file keys; persist lead to database

  return NextResponse.json({ referenceNumber })
}
