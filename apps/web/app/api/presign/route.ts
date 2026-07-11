// Presigned PUT issuance — TRD §T-4: scoped to uploads/ prefix, short expiry,
// key returned for RFQSubmission.uploadedFileKeys. Direct-to-storage per
// validation addendum §3.1 (Vercel 4.5MB body limit).
import { NextResponse } from 'next/server'
import { PresignRequest } from '@vedanta/schemas'
import { presignPutUrl } from '../../../lib/presign'

export const dynamic = 'force-dynamic'

const EXPIRY_SECONDS = 600 // 10 minutes per §T-4

export async function POST(request: Request) {
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
  )

  return NextResponse.json({ url, key })
}
