// Group holding page — steel-only, no color accent (§5)
// data-company="group" scopes CSS variables to neutral steel values

import Link from 'next/link'
import { Footer } from '@vedanta/datum-ui'
import { GroupChrome } from '../../components/group/GroupChrome'
import { getEntity } from '../../lib/content-loader'

const groupEntity = getEntity('group')

const FOOTER_COLUMNS = [
  {
    heading: 'Dhruv EPC Solutions',
    links: [
      { label: 'Pressure Vessels', href: '/dhruv-epc/products/static-equipment/pressure-vessels/' },
      { label: 'Heat Exchangers', href: '/dhruv-epc/products/static-equipment/heat-exchangers/' },
      { label: 'Process Skids', href: '/dhruv-epc/products/skids-packages/process-skids/' },
      { label: 'All Equipment', href: '/dhruv-epc' },
    ],
  },
  {
    heading: 'Precise Engineers',
    links: [
      { label: 'Metallic Bellows', href: '/precise-engineers/products/expansion-joints/metallic-bellows-expansion-joint/' },
      { label: 'Dismantling Joints', href: '/precise-engineers/products/expansion-joints/dismantling-joint/' },
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
      {/* certificationsHref: stamps link to the group home proof strip —
          carried over from the removed per-page Footers (audit P0-1). */}
      <Footer
        entity={groupEntity}
        columns={FOOTER_COLUMNS}
        certificationsHref="/#proof"
        privacyHref="/privacy"
        termsHref="/terms"
        linkComponent={Link}
      />
    </div>
  )
}
