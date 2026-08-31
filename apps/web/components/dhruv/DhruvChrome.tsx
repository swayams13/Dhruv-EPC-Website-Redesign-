'use client'
// Dhruv nav chrome — Header (§17) + MobileDrawer wiring (client state).
// Menu content comes from the seeded equipment list; entity contact from the
// EntityRecord (never hard-coded — CLAUDE.md).
import { useState } from 'react'
import Link from 'next/link'
import { Header, MobileDrawer } from '@vedanta/datum-ui'
import { dhruvEquipment } from '../../lib/site-data'

const GROUPS = [
  { label: 'Static Equipment', items: dhruvEquipment['static-equipment'] },
  { label: 'Skids & Packages', items: dhruvEquipment['skids-packages'] },
  { label: 'Fabrication & Machining', items: dhruvEquipment['fabrication-machining'] },
]

const LINKS = [
  { label: 'Capabilities', href: '/dhruv-epc/capabilities' },
  { label: 'Proof', href: '/dhruv-epc/proof' },
]

export function DhruvChrome({ phoneHref, whatsappHref }: { phoneHref: string; whatsappHref: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Header
        logo={<span className="font-display text-h4 font-bold">Dhruv EPC</span>}
        homeHref="/dhruv-epc"
        menuLabel="Equipment"
        menuGroups={GROUPS.map((g) => ({
          label: g.label,
          items: g.items.map(({ name, scope, href }) => ({ name, scope, href })),
        }))}
        capabilityRail={{ label: 'Max sizes, materials & codes', href: '/dhruv-epc/capabilities' }}
        links={LINKS}
        phoneHref={phoneHref}
        whatsappHref={whatsappHref}
        rfqHref="/request-a-quote?company=dhruv"
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
        rfqHref="/request-a-quote?company=dhruv"
        linkComponent={Link}
      />
    </>
  )
}
