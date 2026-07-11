'use client'
// Precise nav chrome — Header (§17) + MobileDrawer wiring (client state).
// Menu content comes from the seeded product list; entity contact from the
// EntityRecord (never hard-coded — CLAUDE.md). Mirrors DhruvChrome.
import { useState } from 'react'
import { Header, MobileDrawer } from '@vedanta/datum-ui'
import { precisePhoneHref, preciseProducts, preciseWhatsappHref } from '../../lib/content/precise-engineers'

const GROUPS = [
  { label: 'Expansion Joints', items: preciseProducts['expansion-joints'] },
  { label: 'Flow Control', items: preciseProducts['flow-control'] },
]

const LINKS = [
  { label: 'Capabilities', href: '/precise-engineers/capabilities' },
  { label: 'Projects', href: '/precise-engineers/projects' },
  { label: 'Company', href: '/precise-engineers/company' },
]

export function PreciseChrome() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Header
        logo={<span className="font-display text-h4 font-medium">Precise Engineers</span>}
        homeHref="/precise-engineers"
        menuLabel="Products"
        menuGroups={GROUPS.map((g) => ({
          label: g.label,
          items: g.items.map(({ name, scope, href }) => ({ name, scope, href })),
        }))}
        capabilityRail={{ label: 'Sizes, materials & codes', href: '/precise-engineers/capabilities' }}
        links={LINKS}
        phoneHref={precisePhoneHref}
        whatsappHref={preciseWhatsappHref}
        rfqHref="/request-a-quote?company=precise"
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
        rfqHref="/request-a-quote?company=precise"
      />
    </>
  )
}
