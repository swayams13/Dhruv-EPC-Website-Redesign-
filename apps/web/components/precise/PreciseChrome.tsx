'use client'
// Precise nav chrome — Header (§17) + MobileDrawer wiring (client state).
// Menu content comes from the seeded product list; entity contact from the
// EntityRecord (never hard-coded — CLAUDE.md). Mirrors DhruvChrome.
import { useState } from 'react'
import Link from 'next/link'
import { Header, MobileDrawer } from '@vedanta/datum-ui'
import { Logo } from '../Logo'
import { preciseProducts } from '../../lib/site-data'

const GROUPS = [
  { label: 'Expansion Joints', items: preciseProducts['expansion-joints'] },
  { label: 'Flow Control', items: preciseProducts['flow-control'] },
]

const LINKS = [
  { label: 'Capabilities', href: '/precise-engineers/capabilities' },
  { label: 'Proof', href: '/precise-engineers/proof' },
  { label: 'Company', href: '/precise-engineers/company' },
]

export function PreciseChrome({ phoneHref, whatsappHref }: { phoneHref: string; whatsappHref: string }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Header
        logo={(scrolled) => (
          <Logo company="precise-engineers" size={scrolled ? 'header-scrolled' : 'header'} priority />
        )}
        homeHref="/precise-engineers"
        menuLabel="Products"
        menuGroups={GROUPS.map((g) => ({
          label: g.label,
          items: g.items.map(({ name, scope, href }) => ({ name, scope, href })),
        }))}
        capabilityRail={{ label: 'Sizes, materials & codes', href: '/precise-engineers/capabilities' }}
        links={LINKS}
        phoneHref={phoneHref}
        whatsappHref={whatsappHref}
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
        linkComponent={Link}
      />
    </>
  )
}
