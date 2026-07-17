'use client'
// Group nav chrome — Header + MobileDrawer for the (group) route layout.
// Shows both companies' product lines in the mega-menu.
// phoneHref / whatsappHref omitted: no single group-level contact line.
import { useState } from 'react'
import Link from 'next/link'
import { Header, MobileDrawer } from '@vedanta/datum-ui'
import { dhruvEquipment } from '../../lib/content/dhruv-epc'
import { preciseProducts } from '../../lib/content/precise-engineers'

const GROUPS = [
  {
    label: 'Dhruv EPC Solutions — Static Equipment',
    items: [
      ...dhruvEquipment['static-equipment'],
      ...dhruvEquipment['skids-packages'],
    ],
  },
  {
    label: 'Dhruv EPC Solutions — Fabrication & Machining',
    items: dhruvEquipment['fabrication-machining'],
  },
  {
    label: 'Precise Engineers — Flexible Elements',
    items: [
      ...preciseProducts['expansion-joints'],
      ...preciseProducts['flow-control'],
    ],
  },
]

const LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function GroupChrome() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Header
        logo={
          <span className="flex items-baseline gap-2">
            <span className="font-display text-h4 font-extrabold leading-none tracking-tight">
              VEDANTA
            </span>
            <span className="font-mono text-logo-sub font-medium uppercase tracking-widest text-steel-500">
              Group of Companies
            </span>
          </span>
        }
        homeHref="/"
        menuLabel="Products"
        menuGroups={GROUPS.map((g) => ({
          label: g.label,
          items: g.items.map(({ name, scope, href }) => ({ name, scope, href })),
        }))}
        capabilityRail={{ label: 'Two works · ASME U/U2 · EJMA certified', href: '/about' }}
        links={LINKS}
        rfqHref="/request-a-quote"
        onMenuOpen={() => setDrawerOpen(true)}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={GROUPS.map((g) => ({
          label: g.label,
          items: g.items.map(({ name, href }) => ({ label: name, href })),
        }))}
        links={LINKS}
        rfqHref="/request-a-quote"
        linkComponent={Link}
      />
    </>
  )
}
