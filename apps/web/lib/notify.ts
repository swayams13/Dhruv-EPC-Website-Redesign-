// Lead notifications — TRD §T-4: email + WhatsApp notify after server validation.
import type { RFQSubmission } from '@vedanta/schemas'

// WhatsApp ping stubbed behind an interface (FR-3) — real impl is a
// WhatsApp Business API call in a later phase; the RFQ route already
// consumes the interface so wiring it is a one-file change.
export interface WhatsAppNotifier {
  send(lead: RFQSubmission, referenceNumber: string): Promise<void>
}

export const whatsappNotifier: WhatsAppNotifier = {
  // ponytail: no-op stub — Phase 5 wires WhatsApp Business API
  async send() {},
}

function leadText(lead: RFQSubmission, ref: string): string {
  return [
    `Reference: ${ref}`,
    `Company of interest: ${lead.company ?? 'not specified'}`,
    `Equipment: ${lead.equipmentType}`,
    lead.designCode && `Design code: ${lead.designCode}`,
    lead.moc && `MOC: ${lead.moc}`,
    lead.quantity && `Quantity: ${lead.quantity}`,
    lead.timeline && `Timeline: ${lead.timeline}`,
    '',
    lead.message,
    '',
    `From: ${lead.name}, ${lead.contactCompany}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    '',
    lead.uploadedFileKeys.length
      ? `Drawings (${lead.uploadedFileKeys.length}):\n${lead.uploadedFileKeys.join('\n')}`
      : 'No drawings attached.',
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n')
}

/** Sends the lead email via Resend REST API. Throws on any failure —
 *  the caller must surface a real error; a silently dropped lead is the
 *  one unacceptable failure mode (FR-3). */
export async function sendLeadEmail(lead: RFQSubmission, referenceNumber: string): Promise<void> {
  const { RESEND_API_KEY, RFQ_NOTIFY_TO, RFQ_NOTIFY_FROM } = process.env

  if (!RESEND_API_KEY || !RFQ_NOTIFY_TO || !RFQ_NOTIFY_FROM) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[rfq] email not configured — lead ${referenceNumber} logged only:\n${leadText(lead, referenceNumber)}`)
      return
    }
    throw new Error('RFQ email notification is not configured')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: RFQ_NOTIFY_FROM,
      to: RFQ_NOTIFY_TO,
      reply_to: lead.email,
      subject: `RFQ ${referenceNumber} — ${lead.equipmentType} (${lead.contactCompany})`,
      text: leadText(lead, referenceNumber),
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend rejected the notification (${res.status}): ${await res.text()}`)
  }
}
