// Precise Engineers — flex blue accent (§5, semanticPrecise)
// data-company="precise" scopes CSS variables to flex values
// Session 8: chrome (Header/§17 + drawer) and Footer/§18 wrap every Precise route.

import Link from 'next/link'
import { Footer } from '@vedanta/datum-ui'
import { PreciseChrome } from '../../components/precise/PreciseChrome'
import { StickyQuoteChip } from '../../components/StickyQuoteChip'
import { preciseEntity, preciseWhatsappHref } from '../../lib/content/precise-engineers'

const FOOTER_COLUMNS = [
  {
    heading: 'Products',
    links: [
      { label: 'Metallic Bellows Expansion Joints', href: '/precise-engineers/products/metallic-bellows-expansion-joint' },
      { label: 'Telescopic Expansion Joints', href: '/precise-engineers/products/telescopic-expansion-joint' },
      { label: 'Dismantling Joints', href: '/precise-engineers/products/dismantling-joint' },
      { label: 'Zero Velocity Valves', href: '/precise-engineers/products/zero-velocity-valve' },
    ],
  },
  {
    heading: 'Capabilities',
    links: [
      { label: 'Capability Matrix', href: '/precise-engineers/capabilities' },
      { label: 'Proof', href: '/precise-engineers/proof' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/precise-engineers/company' },
      { label: 'Vedanta Group', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export default function PreciseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-company="precise">
      <PreciseChrome />
      {children}
      <Footer
        entity={preciseEntity}
        columns={FOOTER_COLUMNS}
        certificationsHref="/precise-engineers/proof"
        privacyHref="/privacy"
        termsHref="/terms"
        whatsappHref={preciseWhatsappHref}
        linkComponent={Link}
      />
      <StickyQuoteChip href="/request-a-quote?company=precise" />
    </div>
  )
}
