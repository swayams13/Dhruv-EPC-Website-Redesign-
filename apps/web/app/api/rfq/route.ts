// RFQ submission — TRD §T-4 pipeline: server Zod re-validation → spam gates
// (honeypot in schema, time-trap here) → presign-key check → idempotency →
// rate limit → persist → respond → notify email + WhatsApp as best-effort
// side effects. A lost lead is the one unacceptable failure mode (FR-3):
// the lead is durably in Postgres before the HTTP response is sent, so a
// notification failure downstream can never lose it (VG-040).
import { NextResponse } from 'next/server'
import { RFQSubmission } from '@vedanta/schemas'
import { sendLeadEmail, whatsappNotifier } from '../../../lib/notify'
import { findByIdempotencyKey, insertLead, isRateLimited, updateNotificationStatus } from '../../../lib/leads'
import { verifyIssuedKeys } from '../../../lib/presign-keys'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // x-forwarded-for is spoofable by anything that talks to us directly.
  // Railway's edge proxy sets it for traffic that actually passes through
  // it, but there is no second, more-trusted header available here to
  // cross-check against (no Railway-specific "real client IP" header is
  // documented) — noted, not solved. Rate limiting by this value is a
  // deterrent, not a hard guarantee.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const sourcePage = request.headers.get('referer')

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

  // Uploaded keys must have actually been issued by /api/presign, not just
  // shaped like one (D4 — replaces the startsWith('uploads/') string check)
  if (!(await verifyIssuedKeys(data.uploadedFileKeys))) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  // Idempotency: a retry after a timed-out-but-delivered submit must not
  // create a duplicate lead — return the original reference. Checked against
  // the leads table itself (VG-041), not an in-memory Map.
  const prior = await findByIdempotencyKey(data.idempotencyKey)
  if (prior) {
    return NextResponse.json({ referenceNumber: prior.reference, duplicate: true })
  }

  if (await isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many submissions — please wait a few minutes and retry.' }, { status: 429 })
  }

  // Persist first — everything after this point is best-effort and must
  // never change the response or lose the lead.
  const { reference, duplicate } = await insertLead(data, ip, sourcePage)
  const response = NextResponse.json({ referenceNumber: reference, ...(duplicate ? { duplicate: true } : {}) })

  // Fire-and-forget: this relies on the process staying alive after
  // `return` below, which holds on the Railway container running
  // `next start` (long-lived Node process, not a serverless function that
  // freezes on response) — see apps/web/lib/db.ts.
  void notifyBestEffort(data, reference)

  return response
}

async function notifyBestEffort(data: RFQSubmission, referenceNumber: string): Promise<void> {
  try {
    await sendLeadEmail(data, referenceNumber)
    await updateNotificationStatus(referenceNumber, { email: 'sent' })
  } catch (err) {
    console.error(`[rfq] lead ${referenceNumber} email failed:`, err)
    await updateNotificationStatus(referenceNumber, { email: 'failed' }).catch((updateErr) =>
      console.error(`[rfq] lead ${referenceNumber} notification_status update failed:`, updateErr),
    )
  }

  try {
    await whatsappNotifier.send(data, referenceNumber)
    await updateNotificationStatus(referenceNumber, { whatsapp: 'sent' })
  } catch (err) {
    console.error(`[rfq] lead ${referenceNumber} whatsapp ping failed:`, err)
    await updateNotificationStatus(referenceNumber, { whatsapp: 'failed' }).catch((updateErr) =>
      console.error(`[rfq] lead ${referenceNumber} notification_status update failed:`, updateErr),
    )
  }
}
