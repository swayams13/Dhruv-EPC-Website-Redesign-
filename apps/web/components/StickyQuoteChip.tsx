'use client'
// Sticky desktop CTA — appears when no [data-rfq-anchor] (hero or RFQ band)
// is in view. Desktop (lg+) only; mobile is covered by MobileBottomBar.
// Uses variant="secondary" so it never competes with the amber law accent.
import { useRfqAnchorInView } from '@vedanta/datum-ui'
import { Button } from '@vedanta/datum-ui'

export function StickyQuoteChip({ href }: { href: string }) {
  const rfqInView = useRfqAnchorInView()
  return (
    <div
      className={`fixed bottom-6 right-6 z-40 hidden transition-all duration-deliberate lg:flex ${
        rfqInView ? 'pointer-events-none translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <Button variant="secondary" href={href}>
        Get a quote
      </Button>
    </div>
  )
}
