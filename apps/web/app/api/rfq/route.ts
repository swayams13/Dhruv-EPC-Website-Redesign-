import { NextResponse } from 'next/server'
import { RFQSubmission } from '@vedanta/schemas'

export async function POST(request: Request) {
  const body = await request.json() as unknown

  // Server-side re-validation (client Zod is trust-but-verify)
  const parsed = RFQSubmission.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', issues: parsed.error.issues }, { status: 400 })
  }

  const { data } = parsed

  // Time-trap spam gate: reject if submitted faster than 5 seconds (bots don't read forms)
  const elapsedMs = Date.now() - data.submittedAt
  if (elapsedMs < 5000) {
    return NextResponse.json({ error: 'Submission rejected' }, { status: 400 })
  }

  // ponytail: stubs — Phase 3 implementation
  // TODO: AV scan hook on uploaded file keys
  // TODO: persist lead to database
  // TODO: send Resend/SES notification email
  // TODO: optional WhatsApp Business API ping

  const referenceNumber = `VG-${Date.now().toString(36).toUpperCase()}`

  return NextResponse.json({
    referenceNumber,
    message: 'Your requirement has been received. An engineer will review and respond within one business day.',
  })
}
