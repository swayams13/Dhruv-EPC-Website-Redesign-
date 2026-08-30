// Presigned PUT issuance — TRD §T-4: scoped to uploads/ prefix, short expiry,
// key returned for RFQSubmission.uploadedFileKeys. Direct-to-storage per
// validation addendum §3.1 (Vercel 4.5MB body limit).
import { NextResponse } from 'next/server'
import { PresignRequest } from '@vedanta/schemas'
import { presignPutUrl } from '../../../lib/presign'
import { recordIssuedKey } from '../../../lib/presign-keys'

export const dynamic = 'force-dynamic'

const EXPIRY_SECONDS = 600 // 10 minutes per §T-4

// ponytail: in-memory rate limit, copied from app/api/rfq/route.ts rather than
// extracted to a shared module (one extra file for two call sites isn't worth
// it yet). Correct on a single instance, resets on redeploy — see
// docs/mistakes.md B8 for the duplication note. Tighter window than RFQ
// submit since this only issues a URL, not a completed lead.
const RATE_WINDOW_MS = 60 * 1000
const RATE_MAX = 10
const rateLog = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (rateLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  rateLog.set(ip, [...recent, now])
  return recent.length >= RATE_MAX
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests — please wait a moment and retry.' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const parsed = PresignRequest.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 })
  }

  const { STORAGE_ENDPOINT, STORAGE_BUCKET, STORAGE_REGION, STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY } =
    process.env
  if (!STORAGE_ENDPOINT || !STORAGE_BUCKET || !STORAGE_ACCESS_KEY_ID || !STORAGE_SECRET_ACCESS_KEY) {
    return NextResponse.json(
      { error: 'File upload is temporarily unavailable. Please submit without drawings and email them instead.' },
      { status: 503 },
    )
  }

  // Scoped key: uploads/ prefix only, uuid folder prevents overwrites/enumeration,
  // file name sanitized to a safe charset (extension already Zod-validated).
  const safeName = parsed.data.fileName.replace(/[^A-Za-z0-9._-]/g, '_')
  const key = `uploads/${crypto.randomUUID()}/${safeName}`

  const url = presignPutUrl(
    {
      endpoint: STORAGE_ENDPOINT,
      bucket: STORAGE_BUCKET,
      region: STORAGE_REGION ?? 'auto',
      accessKeyId: STORAGE_ACCESS_KEY_ID,
      secretAccessKey: STORAGE_SECRET_ACCESS_KEY,
    },
    key,
    EXPIRY_SECONDS,
    parsed.data.fileSizeBytes,
  )

  // Record the issue before responding: /api/rfq's key check (D4) needs
  // this row to exist by the time any client could plausibly reference it.
  await recordIssuedKey(key, new Date(Date.now() + EXPIRY_SECONDS * 1000))

  return NextResponse.json({ url, key })
}
