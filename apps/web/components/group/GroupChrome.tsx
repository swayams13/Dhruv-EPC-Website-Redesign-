'use client'
// Group nav chrome — Header + MobileDrawer wiring for the (group) route
// layout. Session 9 (VG-051): primary nav restructured to Products ·
// Industries · Capabilities · Projects · Company; company switching moved
// out of primary nav into the utility bar. megaPanelColumns is built
// server-side in (group)/layout.tsx from real ProductCategory/Product
// content (content-loader.ts does node:fs reads and can't be imported
// into this 'use client' component directly).
import { useState } from 'react'
import Link from 'next/link'
import { Header, MobileDrawer, type MegaPanelColumn } from '@vedanta/datum-ui'
import { Logo } from '../Logo'
import { projectsIndexHref } from '../../lib/product-urls'

const LINKS = [
  { label: 'Industries', href: '/industries' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Projects', href: projectsIndexHref() },
  { label: 'Company', href: '/about' },
]

const UTILITY_BAR = [
  { label: 'Dhruv EPC Solutions', href: '/dhruv-epc' },
  { label: 'Precise Engineers', href: '/precise-engineers' },
]

// Mobile drawer keeps the two accordion groups from megaPanelColumns
// (category-level, matching the desktop panel) plus the same 4 flat
// links, plus the company-switch links the utility bar has no mobile
// equivalent for.
function drawerGroups(megaPanelColumns: MegaPanelColumn[]) {
  return megaPanelColumns.map((column) => ({
    label: column.companyLabel,
    items: column.categories.map((c) => ({ label: c.name, href: c.href })),
  }))
}

export function GroupChrome({ megaPanelColumns }: { megaPanelColumns: MegaPanelColumn[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Header
        logo={(scrolled) => (
          <Logo company="group" size={scrolled ? 'header-scrolled' : 'header'} priority />
        )}
        homeHref="/"
        menuLabel="Products"
        megaPanel={megaPanelColumns}
        links={LINKS}
        utilityBar={UTILITY_BAR}
        rfqHref="/request-a-quote"
        onMenuOpen={() => setDrawerOpen(true)}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={drawerGroups(megaPanelColumns)}
        links={[...LINKS, ...UTILITY_BAR]}
        rfqHref="/request-a-quote"
        linkComponent={Link}
      />
    </>
  )
}
