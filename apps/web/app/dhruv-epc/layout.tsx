// Dhruv EPC — arc amber accent (§5, semanticDhruv)
// data-company="dhruv" scopes CSS variables to arc values
// Session 7: chrome (Header/§17 + drawer) and Footer/§18 wrap every Dhruv route.

import Link from 'next/link'
import { Footer } from '@vedanta/datum-ui'
import { DhruvChrome } from '../../components/dhruv/DhruvChrome'
import { StickyQuoteChip } from '../../components/StickyQuoteChip'
import { getEntity, phoneHref, whatsappHref } from '../../lib/content-loader'

const dhruvEntity = getEntity('dhruv-epc')
const dhruvPhoneHref = phoneHref(dhruvEntity)
const dhruvWhatsappHref = whatsappHref(dhruvEntity)

const FOOTER_COLUMNS = [
  {
    heading: 'Equipment',
    links: [
      { label: 'Pressure Vessels', href: '/dhruv-epc/products/static-equipment/pressure-vessels/' },
      { label: 'Heat Exchangers', href: '/dhruv-epc/products/static-equipment/heat-exchangers/' },
      { label: 'Process Skids', href: '/dhruv-epc/products/skids-packages/process-skids/' },
      { label: 'Pipe Spools', href: '/dhruv-epc/products/skids-packages/pipe-spools/' },
    ],
  },
  {
    heading: 'Capabilities',
    links: [
      { label: 'Capability Matrix', href: '/dhruv-epc/capabilities' },
      { label: 'Proof', href: '/dhruv-epc/proof' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Vedanta Group', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export default function DhruvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-company="dhruv">
      <DhruvChrome phoneHref={dhruvPhoneHref} whatsappHref={dhruvWhatsappHref} />
      {children}
      <Footer
        entity={dhruvEntity}
        columns={FOOTER_COLUMNS}
        certificationsHref="/dhruv-epc/proof"
        privacyHref="/privacy"
        termsHref="/terms"
        whatsappHref={dhruvWhatsappHref}
        linkComponent={Link}
      />
      <StickyQuoteChip href="/request-a-quote?company=dhruv" />
    </div>
  )
}
