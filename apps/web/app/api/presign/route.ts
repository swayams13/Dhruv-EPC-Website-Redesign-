import { NextResponse } from 'next/server'
import { PresignRequest } from '@vedanta/schemas'

export async function POST(request: Request) {
  const body = await request.json() as unknown
  const parsed = PresignRequest.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 })
  }

  // ponytail: stub — Phase 3 wires R2/S3 presigned PUT
  // Requirements per TRD §T-4:
  //   - Scoped to uploads/ prefix only
  //   - Short expiry (e.g. 10 minutes)
  //   - Key returned to client for RFQSubmission.uploadedFileKeys
  //   - AV scan triggered via hook after PUT completes

  return NextResponse.json(
    { error: 'Presign endpoint not yet configured — set STORAGE_BUCKET env var' },
    { status: 501 },
  )
}
