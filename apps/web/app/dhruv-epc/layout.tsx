// Dhruv EPC — arc amber accent (§5, semanticDhruv)
// data-company="dhruv" scopes CSS variables to arc values
// Session 7: chrome (Header/§17 + drawer) and Footer/§18 wrap every Dhruv route.

import { Footer } from '@vedanta/datum-ui'
import { DhruvChrome } from '../../components/dhruv/DhruvChrome'
import { dhruvEntity } from '../../lib/content/dhruv-epc'

const FOOTER_COLUMNS = [
  {
    heading: 'Equipment',
    links: [
      { label: 'Pressure Vessels', href: '/dhruv-epc/equipment/pressure-vessels' },
      { label: 'Heat Exchangers', href: '/dhruv-epc/equipment/heat-exchangers' },
      { label: 'Process Skids', href: '/dhruv-epc/equipment/process-skids' },
      { label: 'Pipe Spools', href: '/dhruv-epc/equipment/pipe-spools' },
    ],
  },
  {
    heading: 'Capabilities',
    links: [
      { label: 'Capability Matrix', href: '/dhruv-epc/capabilities' },
      { label: 'Projects', href: '/dhruv-epc/projects' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/dhruv-epc/company' },
      { label: 'Vedanta Group', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export default function DhruvLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-company="dhruv">
      <DhruvChrome />
      {children}
      <Footer
        entity={dhruvEntity}
        columns={FOOTER_COLUMNS}
        certificationsHref="/dhruv-epc/proof/certifications"
        privacyHref="/privacy"
        termsHref="/terms"
      />
    </div>
  )
}
