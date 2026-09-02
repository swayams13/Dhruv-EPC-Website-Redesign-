// RFQ band — Datum §21.9 / §23 entry: graphite full-width closer.
// "Send us your drawing." + SLA line + amber button + WhatsApp alternative.
// data-rfq-anchor: the header RFQ yields while this band is in view (§13).
// company/whatsappHref are optional — the group home (Session 9, VG-050)
// has no single company or WhatsApp number, mirroring the same
// optional-props precedent Header.tsx already uses for GroupChrome.
import { Button } from '@vedanta/datum-ui'

export function RFQBand({
  company,
  whatsappHref,
  equipment,
}: {
  company?: 'dhruv' | 'precise'
  whatsappHref?: string
  equipment?: string
}) {
  const params = new URLSearchParams()
  if (company) params.set('company', company)
  if (equipment) params.set('equipment', equipment)
  const query = params.toString()
  const rfqHref = query ? `/request-a-quote?${query}` : '/request-a-quote'

  return (
    <section data-rfq-anchor className="bg-steel-900">
      <div className="mx-auto flex max-w-wide flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-h1 font-medium text-steel-50">Send us your drawing.</h2>
          {/* SLA placeholder per §23 — figure pending client commitment */}
          <p className="mt-2 text-body-lg text-steel-400">
            An engineer reviews every requirement. We respond within one business day.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="rfq" href={rfqHref}>
            Request a quote
          </Button>
          {whatsappHref && (
            <Button variant="secondary" onDark href={whatsappHref}>
              WhatsApp us
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
