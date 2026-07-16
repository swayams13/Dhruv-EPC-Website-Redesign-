// Group holding page — steel-only, no color accent (§5)
// data-company="group" scopes CSS variables to neutral steel values

import { Footer } from '@vedanta/datum-ui'
import { GroupChrome } from '../../components/group/GroupChrome'
import { groupEntity } from '../../lib/content/group'

const FOOTER_COLUMNS = [
  {
    heading: 'Dhruv EPC Solutions',
    links: [
      { label: 'Pressure Vessels', href: '/dhruv-epc/equipment/pressure-vessels' },
      { label: 'Heat Exchangers', href: '/dhruv-epc/equipment/heat-exchangers' },
      { label: 'Process Skids', href: '/dhruv-epc/equipment/process-skids' },
      { label: 'All Equipment', href: '/dhruv-epc' },
    ],
  },
  {
    heading: 'Precise Engineers',
    links: [
      { label: 'Metallic Bellows', href: '/precise-engineers/products/metallic-bellows-expansion-joint' },
      { label: 'Dismantling Joints', href: '/precise-engineers/products/dismantling-joint' },
      { label: 'All Products', href: '/precise-engineers' },
    ],
  },
  {
    heading: 'Group',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Request a Quote', href: '/request-a-quote' },
    ],
  },
]

export default function GroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-company="group">
      <GroupChrome />
      {children}
      <Footer
        entity={groupEntity}
        columns={FOOTER_COLUMNS}
        privacyHref="/privacy"
        termsHref="/terms"
      />
    </div>
  )
}
