# Session 9 — Group Nav Restructure + Group Home Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the group-level primary navigation to Products · Industries ·
Capabilities · Projects · Company with a two-column-by-company Products
mega-panel and a utility bar for company switching (VG-051), and rebuild the
group home page section order per the blueprint (VG-050).

**Architecture:** Header.tsx and GroupChrome gain new optional props
(`megaPanel`, `utilityBar`) that are additive and backward-compatible —
DhruvChrome/PreciseChrome keep using the existing `menuGroups` grid
unchanged. A new `MegaPanel` component owns its own focus trap and ESC
handling. The group home page is reordered and gains two new
content-driven sections (products-by-category, industries) that read from
existing content-loader functions; sections with no qualifying content are
omitted from the JSX entirely, never rendered empty.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.5 strict,
Tailwind (token-only, no arbitrary values), Zod-validated content in
`content/**/*.json`, Vitest + Testing Library + axe-core, Storybook 8.

**Spec:** `docs/01-final-implementation-blueprint-v2.md` §4 (navigation),
§14.2 (home section order), §14.3 (new components), §2.2 (omit-not-empty
inverse-relationship rule). `CLAUDE.md` at repo root governs tokens,
verification, and commit/PR conventions.

## Global Constraints

- No arbitrary Tailwind values anywhere (`tailwindcss/no-arbitrary-value` is
  `error`). Only named tokens or the standard Tailwind spacing/sizing scale
  (`h-8`, `gap-6`, etc. — already used throughout this codebase for
  non-color values).
- Accent color is always `var(--accent)` / `text-accent` / `text-accent-dark`
  — never a raw hex or company-specific token name inside a shared
  component. `data-company="group"` already resolves `--accent` to the
  brand-red value in `apps/web/app/globals.css:11-19` — this is existing,
  already-shipped behavior; `Header.tsx`'s current mega-menu label already
  relies on it (`text-accent` at the capability rail).
- A section with no qualifying data is omitted from the JSX, never rendered
  as an empty/placeholder block (§2.2, and the repo-wide precedent in
  `docs/progress.md`).
- Focus ring: `:focus-visible` only, never suppressed.
- Every new/changed component that has a `.stories.tsx` file gets its axe
  pass for free via `packages/datum-ui/src/a11y.test.tsx`'s auto-glob — no
  manual wiring needed, just add the story file.
- Conventional commits; one commit per task below; PR branch
  `design/session-9-group-home-nav` off `main`; human review required
  before merge (never merge to `main` directly).
- `docs/mistakes.md` gets one entry if any task hits the 3-attempt circuit
  breaker — do not silently skip a failing check.

---

### Task 1: Widen `RFQBand` to support the group's company-less RFQ CTA

The group home page needs an RFQ closer section (§14.2 item 7), but the
existing `RFQBand` requires a `company: 'dhruv' | 'precise'` and a mandatory
`whatsappHref` — the group has neither a single company nor a single
WhatsApp number (`GroupChrome` already omits `phoneHref`/`whatsappHref` on
`Header` for the same reason). Widen both to optional, mirroring that
existing precedent, rather than duplicating the band's markup on the group
page.

**Files:**
- Modify: `apps/web/components/RFQBand.tsx`
- Test: no dedicated test file exists for this component today (it's an
  app-level component, not covered by the datum-ui axe auto-glob); verified
  manually in Task 9 and by the existing route snapshot tests picking up
  any accidental markup change on `/dhruv-epc` and `/precise-engineers`.

**Interfaces:**
- Produces: `RFQBand({ company?: 'dhruv' | 'precise'; whatsappHref?: string; equipment?: string })` — used by `apps/web/app/dhruv-epc/page.tsx`, `apps/web/app/precise-engineers/page.tsx` (unchanged calls, still pass `company` + `whatsappHref`), and by Task 9's new group home RFQ section (no `company`, no `whatsappHref`).

- [ ] **Step 1: Read the current file to confirm line numbers before editing**

Run: `sed -n '1,40p' apps/web/components/RFQBand.tsx`

- [ ] **Step 2: Replace the component with the widened version**

Replace the full contents of `apps/web/components/RFQBand.tsx` with:

```tsx
// RFQ band — Datum §21.9 / §23 entry: graphite full-width closer.
// "Send us your drawing." + SLA line + amber button + WhatsApp alternative.
// data-rfq-anchor: the header RFQ yields while this band is in view (§13).
// company/whatsappHref are optional — the group home (Session 9, VG-050)
// has no single company or WhatsApp number, mirroring the same
// optional-props precedent Header.tsx already uses for GroupChrome.
import { Button } from '@vedanta/datum-ui'

export function RFQBand({
  company,
  whatsappHref,
  equipment,
}: {
  company?: 'dhruv' | 'precise'
  whatsappHref?: string
  equipment?: string
}) {
  const params = new URLSearchParams()
  if (company) params.set('company', company)
  if (equipment) params.set('equipment', equipment)
  const query = params.toString()
  const rfqHref = query ? `/request-a-quote?${query}` : '/request-a-quote'

  return (
    <section data-rfq-anchor className="bg-steel-900">
      <div className="mx-auto flex max-w-wide flex-col items-start gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-h1 font-medium text-steel-50">Send us your drawing.</h2>
          {/* SLA placeholder per §23 — figure pending client commitment */}
          <p className="mt-2 text-body-lg text-steel-400">
            An engineer reviews every requirement. We respond within one business day.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="rfq" href={rfqHref}>
            Request a quote
          </Button>
          {whatsappHref && (
            <Button variant="secondary" onDark href={whatsappHref}>
              WhatsApp us
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @vedanta/web typecheck`
Expected: no new errors. `dhruv-epc/page.tsx` and `precise-engineers/page.tsx` still pass `company` + `whatsappHref` positionally-compatible (now-optional props accept required-shaped call sites unchanged).

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/RFQBand.tsx
git commit -m "feat(web): widen RFQBand for the company-less group RFQ CTA — blueprint §14.2 item 7"
```

---

### Task 2: Build the `MegaPanel` component

New Datum component (§14.3): two columns by company, `ProductCategory` as
heading, top products beneath, "All products →" per column. Keyboard
operable: Tab is trapped inside while open, focus moves to the first link
on open, ESC closes and returns focus to the trigger (the same proven
pattern `MobileDrawer.tsx` already uses — reuse the shape, don't
reinvent it).

**Files:**
- Create: `packages/datum-ui/src/components/MegaPanel.tsx`
- Create: `packages/datum-ui/src/components/MegaPanel.stories.tsx`
- Modify: `packages/datum-ui/src/index.ts` (barrel export)

**Interfaces:**
- Produces:
  - `interface MegaPanelProduct { name: string; href: string }`
  - `interface MegaPanelCategory { name: string; href: string; products: MegaPanelProduct[] }`
  - `interface MegaPanelColumn { companyLabel: string; categories: MegaPanelCategory[]; allProductsHref: string; allProductsLabel: string }`
  - `MegaPanel({ id, open, onClose, triggerRef, columns }: MegaPanelProps): React.ReactElement`
- Consumes: none (pure presentational + its own keyboard-trap effect).
- Task 4 (`Header.tsx`) imports `MegaPanel` and `type MegaPanelColumn` from `./MegaPanel`.

- [ ] **Step 1: Write the component**

Create `packages/datum-ui/src/components/MegaPanel.tsx`:

```tsx
'use client'
// MegaPanel — Datum §14.3 (Session 9, VG-051). Products mega-panel: two
// columns by company, ProductCategory as heading, top products beneath,
// "All products →" foot link per column. Group-nav only — Dhruv/Precise
// keep Header's legacy single-company menuGroups grid (§4 scopes the
// two-column layout to the group's "which company makes it" disambiguation
// step; a single-company subsite has nothing to disambiguate).
//
// Not a modal (no aria-modal/role="dialog") — a disclosure panel over
// in-flow nav content, same APG "disclosure navigation" shape Header.tsx's
// legacy grid already used. Focus trap mirrors MobileDrawer.tsx's proven
// pattern: focus the first link on open, Tab cycles within the panel,
// ESC closes and returns focus to the trigger.

import { useEffect, useRef } from 'react'
import { ArrowRight } from './glyphs'

export interface MegaPanelProduct {
  name: string
  href: string
}

export interface MegaPanelCategory {
  name: string
  href: string
  products: MegaPanelProduct[]
}

export interface MegaPanelColumn {
  /** "Dhruv EPC Solutions" / "Precise Engineers" */
  companyLabel: string
  categories: MegaPanelCategory[]
  allProductsHref: string
  allProductsLabel: string
}

export interface MegaPanelProps {
  id: string
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement>
  columns: MegaPanelColumn[]
  className?: never
}

export function MegaPanel({
  id,
  open,
  onClose,
  triggerRef,
  columns,
}: MegaPanelProps): React.ReactElement {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    panel?.querySelector<HTMLElement>('a[href]')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        triggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const focusable = panel.querySelectorAll<HTMLElement>('a[href]')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, triggerRef])

  return (
    <div
      id={id}
      ref={panelRef}
      hidden={!open}
      className="absolute inset-x-0 top-full border-b border-steel-50/10 bg-steel-950 shadow-overlay"
    >
      <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2">
        {columns.map((column) => (
          <div key={column.companyLabel}>
            <p className="font-mono text-xs font-medium uppercase tracking-caption text-steel-500">
              {column.companyLabel}
            </p>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {column.categories.map((category) => (
                <div key={category.href}>
                  <a
                    href={category.href}
                    className="-mx-2 block rounded-sm px-2 py-1 text-data font-medium text-steel-100 transition-colors duration-instant ease-standard hover:bg-steel-800"
                  >
                    {category.name}
                  </a>
                  <ul className="mt-1">
                    {category.products.map((product) => (
                      <li key={product.href}>
                        <a
                          href={product.href}
                          className="-mx-2 block rounded-sm px-2 py-1.5 text-sm text-steel-400 transition-colors duration-instant ease-standard hover:bg-steel-800 hover:text-steel-100"
                        >
                          {product.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <a
              href={column.allProductsHref}
              className="group mt-6 flex items-center gap-2 text-data font-medium text-accent-dark transition-colors duration-instant ease-standard hover:text-accent"
            >
              {column.allProductsLabel}
              <span className="transition-transform duration-instant ease-standard motion-safe:group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add the barrel export**

In `packages/datum-ui/src/index.ts`, after the existing `Header` export
block (after the line `} from './components/Header'`), insert:

```ts
export {
  MegaPanel,
  type MegaPanelProps,
  type MegaPanelColumn,
  type MegaPanelCategory,
  type MegaPanelProduct,
} from './components/MegaPanel'
```

- [ ] **Step 3: Write the Storybook story (this is also the axe-test surface)**

Create `packages/datum-ui/src/components/MegaPanel.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useRef, useState } from 'react'
import { MegaPanel } from './MegaPanel'
import { withCompany } from '../story-helpers'

const COLUMNS = [
  {
    companyLabel: 'Dhruv EPC Solutions',
    categories: [
      {
        name: 'Static Equipment',
        href: '/dhruv-epc/products/static-equipment',
        products: [
          { name: 'Pressure Vessels', href: '/dhruv-epc/products/static-equipment/pressure-vessels' },
          { name: 'Heat Exchangers', href: '/dhruv-epc/products/static-equipment/heat-exchangers' },
        ],
      },
      {
        name: 'Skids & Packages',
        href: '/dhruv-epc/products/skids-packages',
        products: [{ name: 'Process Skids', href: '/dhruv-epc/products/skids-packages/process-skids' }],
      },
    ],
    allProductsHref: '/dhruv-epc/products',
    allProductsLabel: 'All Dhruv EPC products →',
  },
  {
    companyLabel: 'Precise Engineers',
    categories: [
      {
        name: 'Expansion Joints',
        href: '/precise-engineers/products/expansion-joints',
        products: [
          { name: 'Metallic Bellows', href: '/precise-engineers/products/expansion-joints/metallic-bellows-expansion-joint' },
        ],
      },
    ],
    allProductsHref: '/precise-engineers/products',
    allProductsLabel: 'All Precise Engineers products →',
  },
]

const meta: Meta<typeof MegaPanel> = {
  title: 'Datum/MegaPanel',
  component: MegaPanel,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof MegaPanel>

// Static open state — used by the axe pass.
export const Open: Story = {
  render: function OpenStory() {
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div className="relative bg-steel-950 p-4">
        <button ref={triggerRef} type="button" className="text-steel-50">
          Products
        </button>
        <MegaPanel id="story-mega-panel" open onClose={() => undefined} triggerRef={triggerRef} columns={COLUMNS} />
      </div>
    )
  },
  decorators: [withCompany('group')],
}

// Interactive: trigger toggles open/close, exercises the real focus trap.
export const Interactive: Story = {
  render: function InteractiveStory() {
    const [open, setOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement>(null)
    return (
      <div className="relative bg-steel-950 p-4">
        <button ref={triggerRef} type="button" onClick={() => setOpen((v) => !v)} className="text-steel-50">
          Products
        </button>
        <MegaPanel id="story-mega-panel-interactive" open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} columns={COLUMNS} />
      </div>
    )
  },
  decorators: [withCompany('group')],
}
```

- [ ] **Step 4: Typecheck and run the datum-ui test suite**

Run: `pnpm --filter @vedanta/datum-ui typecheck && pnpm --filter @vedanta/datum-ui test`
Expected: zero errors; the new `MegaPanel — axe` describe block (auto-globbed
from the story file) passes with zero WCAG violations for both stories.

- [ ] **Step 5: Commit**

```bash
git add packages/datum-ui/src/components/MegaPanel.tsx packages/datum-ui/src/components/MegaPanel.stories.tsx packages/datum-ui/src/index.ts
git commit -m "feat(datum-ui): add MegaPanel — products mega-panel per Datum §14.3"
```

---

### Task 3: Keyboard-nav test for `MegaPanel`'s focus trap

The a11y auto-glob only proves zero axe violations on a static render — it
does not exercise Tab-trapping or ESC-close-and-restore-focus. Session 9's
explicit verify step requires "keyboard nav + axe on MegaPanel." Add a
focused interaction test using `@testing-library/react`'s `fireEvent`
(already a dependency — no new package needed, matching `MobileDrawer`'s
existing test-free-but-behaviorally-identical pattern; this is the first
component to actually assert the trap in a test rather than only by story
inspection).

**Files:**
- Create: `packages/datum-ui/src/components/MegaPanel.test.tsx`

**Interfaces:**
- Consumes: `MegaPanel` from `./MegaPanel` (Task 2).

- [ ] **Step 1: Write the failing test**

Create `packages/datum-ui/src/components/MegaPanel.test.tsx`:

```tsx
// Keyboard-nav coverage for MegaPanel's focus trap (Session 9 verify step:
// "keyboard nav + axe on MegaPanel"). Axe coverage itself comes from the
// auto-globbed a11y.test.tsx via MegaPanel.stories.tsx — this file only
// asserts the interaction behavior stories can't: Tab wrapping and ESC.
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MegaPanel, type MegaPanelColumn } from './MegaPanel'

afterEach(cleanup)

const COLUMNS: MegaPanelColumn[] = [
  {
    companyLabel: 'Dhruv EPC Solutions',
    categories: [
      {
        name: 'Static Equipment',
        href: '/dhruv-epc/products/static-equipment',
        products: [{ name: 'Pressure Vessels', href: '/dhruv-epc/products/static-equipment/pressure-vessels' }],
      },
    ],
    allProductsHref: '/dhruv-epc/products',
    allProductsLabel: 'All Dhruv EPC products →',
  },
]

function Harness({ onClose }: { onClose: () => void }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button ref={triggerRef} type="button">
        Products
      </button>
      <MegaPanel id="test-mega-panel" open onClose={onClose} triggerRef={triggerRef} columns={COLUMNS} />
    </>
  )
}

describe('MegaPanel keyboard behavior', () => {
  it('moves focus to the first link on open', () => {
    render(<Harness onClose={() => undefined} />)
    const firstLink = screen.getByRole('link', { name: 'Static Equipment' })
    expect(firstLink).toHaveFocus()
  })

  it('wraps Tab from the last link back to the first', () => {
    render(<Harness onClose={() => undefined} />)
    const firstLink = screen.getByRole('link', { name: 'Static Equipment' })
    const lastLink = screen.getByRole('link', { name: 'All Dhruv EPC products →' })
    lastLink.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(firstLink).toHaveFocus()
  })

  it('wraps Shift+Tab from the first link back to the last', () => {
    render(<Harness onClose={() => undefined} />)
    const firstLink = screen.getByRole('link', { name: 'Static Equipment' })
    const lastLink = screen.getByRole('link', { name: 'All Dhruv EPC products →' })
    firstLink.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(lastLink).toHaveFocus()
  })

  it('closes on Escape and returns focus to the trigger', () => {
    const onClose = vi.fn()
    render(<Harness onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Products' })).toHaveFocus()
  })
})
```

- [ ] **Step 2: Run the test to verify it passes against Task 2's implementation**

Run: `pnpm --filter @vedanta/datum-ui test -- MegaPanel.test.tsx`
Expected: PASS, 4/4. (This is a verification test written against
already-implemented behavior from Task 2, not TDD-first — Task 2's
component was built directly from this same focus-trap spec, so no
red-first step applies here.)

- [ ] **Step 3: Commit**

```bash
git add packages/datum-ui/src/components/MegaPanel.test.tsx
git commit -m "test(datum-ui): keyboard-nav coverage for MegaPanel focus trap"
```

---

### Task 4: Extend `Header.tsx` with `utilityBar` and `megaPanel`

Add two optional, additive props. `menuGroups`/`capabilityRail` become
optional (still required in practice for `DhruvChrome`/`PreciseChrome`,
which are unchanged). When `megaPanel` is provided and non-empty, it
replaces the legacy inline grid; `menuGroups` is otherwise unaffected. The
utility bar is a slim row stacked above the main bar, both inside the same
fixed `<header>` — sized entirely from Tailwind's standard scale (`h-8`)
with **no new design token and no `calc()`**: the outer `<header>` carries
no explicit height (it's the natural sum of its two row children), and the
spacer div that reserves scroll space for the fixed header mirrors that
same two-row structure so the two always match by construction.

**Files:**
- Modify: `packages/datum-ui/src/components/Header.tsx`
- Modify: `packages/datum-ui/src/components/Header.stories.tsx` (Task 5)

**Interfaces:**
- Consumes: `MegaPanel`, `type MegaPanelColumn` from `./MegaPanel` (Task 2).
- Produces: `HeaderProps` gains `megaPanel?: MegaPanelColumn[]` and
  `utilityBar?: HeaderNavLink[]`; `menuGroups` and `capabilityRail` become
  optional. Task 7 (`GroupChrome.tsx`) passes `megaPanel` + `utilityBar`;
  `DhruvChrome`/`PreciseChrome` pass neither and are visually unchanged.

- [ ] **Step 1: Replace the full contents of `Header.tsx`**

Replace `packages/datum-ui/src/components/Header.tsx` in full with:

```tsx
'use client'
// Header — Datum §17, extended §4/§14.3 (Session 9, VG-051).
// Phase 1.1: dark nav — always fixed, solid steel-950 chrome. Scroll
// threshold 40px (was innerHeight): compresses header to 60px after
// minimal scroll. Gradient-over-hero effect deferred to Phase 2 (requires
// hero co-ordination). phoneHref / whatsappHref are optional — GroupChrome
// omits them.
//
// utilityBar / megaPanel (Session 9): both optional and additive. When
// megaPanel is set it replaces the legacy menuGroups grid (group nav only —
// DhruvChrome/PreciseChrome keep passing menuGroups, unaffected). The
// utility bar is a second row stacked above the main bar, inside the same
// fixed <header>; its height is reserved by mirroring the exact same
// two-row structure in the spacer div below, so the two heights can never
// drift out of sync — no calc(), no new token.

import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { MegaPanel, type MegaPanelColumn } from './MegaPanel'
import { useRfqAnchorInView } from './useRfqAnchorInView'
import { ArrowRight, ChevronDown, Menu, Phone, WhatsApp } from './glyphs'

export interface MegaMenuItem {
  name: string
  /** One-line scope, figures included — §16's rule applies in the menu too */
  scope: string
  href: string
}

export interface MegaMenuGroup {
  label: string
  items: MegaMenuItem[]
}

export interface HeaderNavLink {
  label: string
  href: string
}

export interface HeaderProps {
  /** Logo lockup */
  logo: React.ReactNode
  homeHref: string
  /** Mega-menu trigger label — "Equipment" (Dhruv) / "Products" (Precise/Group) */
  menuLabel: string
  /** Legacy single-grid mega-menu. Ignored when `megaPanel` is set. */
  menuGroups?: MegaMenuGroup[]
  /** Two-column-by-company mega-panel (group nav, VG-051). Takes priority over menuGroups. */
  megaPanel?: MegaPanelColumn[]
  /** Right rail: deep-link to Capability Matrix. Rendered beside the legacy menuGroups grid only. */
  capabilityRail?: HeaderNavLink
  links: HeaderNavLink[]
  /** Company-switcher row above the main bar — group nav only (VG-051). */
  utilityBar?: HeaderNavLink[]
  /** tel: link — optional; GroupChrome omits it */
  phoneHref?: string
  whatsappHref?: string
  rfqHref: string
  /** Opens the MobileDrawer (hamburger, <768px) */
  onMenuOpen?: () => void
  className?: never
}

export function Header({
  logo,
  homeHref,
  menuLabel,
  menuGroups,
  megaPanel,
  capabilityRail,
  links,
  utilityBar,
  phoneHref,
  whatsappHref,
  rfqHref,
  onMenuOpen,
}: HeaderProps): React.ReactElement {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const contentRfqInView = useRfqAnchorInView()
  const headerRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const hasUtilityBar = Boolean(utilityBar && utilityBar.length > 0)
  const hasMegaPanel = Boolean(megaPanel && megaPanel.length > 0)
  const rowHeight = scrolled ? 'h-header-scrolled' : 'h-header'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      // MegaPanel owns its own ESC handling + focus return when active.
      if (hasMegaPanel) return
      if (e.key === 'Escape') {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [menuOpen, hasMegaPanel])

  return (
    <div className="relative">
      {/* Spacer — mirrors the fixed header's real two-row structure below so
          reserved scroll space always matches, with no calc() and no new
          height token. */}
      {hasUtilityBar && <div className="hidden h-8 md:block" aria-hidden="true" />}
      <div className={rowHeight} aria-hidden="true" />

      <header
        ref={headerRef}
        // data-chrome='dark': rebinds --accent-focus to the -dark accent step so
        // focus rings clear 3:1 on the steel-950 bar (globals.css §25, v1.2).
        // Covers both rows below.
        data-chrome="dark"
        className={`fixed inset-x-0 top-0 z-40 bg-steel-950 border-b border-steel-50/10 ${scrolled ? 'shadow-raised' : ''}`}
      >
        {hasUtilityBar && (
          <div className="hidden border-b border-steel-50/10 bg-steel-900 md:block">
            <div className="mx-auto flex h-8 max-w-wide items-center justify-end gap-6 px-6 text-helper text-steel-400">
              {utilityBar!.map((u) => (
                <a
                  key={u.href}
                  href={u.href}
                  className="transition-colors duration-instant ease-standard hover:text-steel-50"
                >
                  {u.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className={`mx-auto flex ${rowHeight} max-w-wide items-center justify-between gap-6 px-6`}>
          <a href={homeHref} className="flex items-center text-steel-50">
            {logo}
          </a>

          <nav aria-label="Primary" className="hidden h-full items-center gap-8 md:flex">
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="datum-mega-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-full items-center gap-1 text-data font-medium text-steel-200"
            >
              {menuLabel}
              <span
                className={`text-steel-500 transition-transform duration-instant ease-standard ${menuOpen ? 'rotate-180' : ''}`}
              >
                <ChevronDown size={16} />
              </span>
            </button>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex h-full items-center text-data font-medium text-steel-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {whatsappHref && (
              <a
                href={whatsappHref}
                aria-label="Chat on WhatsApp"
                className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-300 transition-colors duration-instant hover:bg-steel-800 hover:text-steel-50"
              >
                <WhatsApp size={20} />
              </a>
            )}
            {phoneHref && (
              <a
                href={phoneHref}
                aria-label="Call us"
                className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-300 transition-colors duration-instant hover:bg-steel-800 hover:text-steel-50"
              >
                <Phone size={20} />
              </a>
            )}
            <span className={contentRfqInView ? 'invisible' : undefined}>
              <Button variant="rfq" size="compact" href={rfqHref}>
                Request a quote
              </Button>
            </span>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={onMenuOpen}
            className="flex h-compact w-compact items-center justify-center rounded-sm text-steel-50 md:hidden"
          >
            <Menu />
          </button>
        </div>

        {hasMegaPanel ? (
          <MegaPanel
            id="datum-mega-menu"
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            triggerRef={triggerRef}
            columns={megaPanel!}
          />
        ) : (
          <div
            id="datum-mega-menu"
            hidden={!menuOpen}
            className="absolute inset-x-0 top-full border-b border-steel-50/10 bg-steel-950 shadow-overlay"
          >
            <div className="mx-auto grid max-w-wide grid-cols-4 gap-8 px-6 py-8">
              {(menuGroups ?? []).map((group) => (
                <div key={group.label}>
                  <p className="font-mono text-xs font-medium uppercase tracking-caption text-accent">
                    {group.label}
                  </p>
                  <ul className="mt-3">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="-mx-2 block rounded-sm px-2 py-2 transition-colors duration-instant hover:bg-steel-800"
                        >
                          <span className="block text-data font-medium text-steel-100">
                            {item.name}
                          </span>
                          <span className="block text-helper text-steel-500">{item.scope}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {/* capability rail — "can you build mine?" is the question behind every menu open */}
              {capabilityRail && (
                <div className="border-l border-steel-700/50 pl-8">
                  <a
                    href={capabilityRail.href}
                    className="group flex items-center gap-2 text-data font-medium text-accent-dark transition-colors duration-instant hover:text-accent"
                  >
                    {capabilityRail.label}
                    <span className="transition-transform duration-instant ease-standard motion-safe:group-hover:translate-x-1">
                      <ArrowRight size={16} />
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @vedanta/datum-ui typecheck`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add packages/datum-ui/src/components/Header.tsx
git commit -m "feat(datum-ui): add Header utilityBar + megaPanel props — Datum §4/§14.3"
```

---

### Task 5: Header story coverage for the new group configuration

Add one Storybook story exercising `utilityBar` + `megaPanel` together so
the axe auto-glob covers the combined configuration (not just `MegaPanel`
in isolation) and so there's a visual reference during manual review.

**Files:**
- Modify: `packages/datum-ui/src/components/Header.stories.tsx`

**Interfaces:**
- Consumes: `MegaPanelColumn` shape from Task 2 (inline literal here, no import needed beyond what the story file already has).

- [ ] **Step 1: Append a `Group` story**

Add to the end of `packages/datum-ui/src/components/Header.stories.tsx`:

```tsx
const groupMegaPanel = [
  {
    companyLabel: 'Dhruv EPC Solutions',
    categories: [
      {
        name: 'Static Equipment',
        href: '/dhruv-epc/products/static-equipment',
        products: [
          { name: 'Pressure Vessels', href: '/dhruv-epc/products/static-equipment/pressure-vessels' },
          { name: 'Heat Exchangers', href: '/dhruv-epc/products/static-equipment/heat-exchangers' },
        ],
      },
    ],
    allProductsHref: '/dhruv-epc/products',
    allProductsLabel: 'All Dhruv EPC products →',
  },
  {
    companyLabel: 'Precise Engineers',
    categories: [
      {
        name: 'Expansion Joints',
        href: '/precise-engineers/products/expansion-joints',
        products: [
          { name: 'Metallic Bellows', href: '/precise-engineers/products/expansion-joints/metallic-bellows-expansion-joint' },
        ],
      },
    ],
    allProductsHref: '/precise-engineers/products',
    allProductsLabel: 'All Precise Engineers products →',
  },
]

export const Group: Story = {
  args: {
    logo: <span className="font-display text-h4 font-extrabold">VEDANTA</span>,
    homeHref: '/',
    menuLabel: 'Products',
    megaPanel: groupMegaPanel,
    links: [
      { label: 'Industries', href: '#industries' },
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Projects', href: '#projects' },
      { label: 'Company', href: '#company' },
    ],
    utilityBar: [
      { label: 'Dhruv EPC Solutions', href: '#dhruv-epc' },
      { label: 'Precise Engineers', href: '#precise-engineers' },
    ],
    rfqHref: '/request-a-quote',
  },
  decorators: [withCompany('group')],
}
```

- [ ] **Step 2: Run the datum-ui test suite**

Run: `pnpm --filter @vedanta/datum-ui test`
Expected: the new `Header — axe` `Group` story passes with zero WCAG
violations, alongside the existing `Dhruv`/`Precise` stories (unaffected).

- [ ] **Step 3: Commit**

```bash
git add packages/datum-ui/src/components/Header.stories.tsx
git commit -m "test(datum-ui): Header Group story — utilityBar + megaPanel axe coverage"
```

---

### Task 6: `/projects` stub route (N2 — honest gap, not a 404)

The new primary nav needs a working `Projects` destination today, even
though the real Project system (blueprint §8) doesn't exist yet — it's
gated on real project records that don't exist (⛔C-1). Point the nav at a
real stub page that says so, rather than a 404 or a silently-dead link.
`noindex` (matching the exact convention `industry-capability-pages-data.ts`
already uses for content-gated pages), since there's nothing here for a
crawler to index yet.

**Files:**
- Create: `apps/web/app/(group)/projects/page.tsx`
- Modify: `apps/web/lib/product-urls.ts` (add `projectsIndexHref()`, matching the existing `industriesIndexHref()`/`capabilitiesIndexHref()` convention)

**Interfaces:**
- Produces: `projectsIndexHref(): string` returning `'/projects'`.
- Consumes (Task 7): `GroupChrome.tsx` imports `projectsIndexHref` for the nav link.

- [ ] **Step 1: Add the URL builder**

In `apps/web/lib/product-urls.ts`, after the existing `capabilityHref`
function, append:

```ts
export function projectsIndexHref(): string {
  return '/projects'
}
```

- [ ] **Step 2: Write the stub page**

Create `apps/web/app/(group)/projects/page.tsx`:

```tsx
// /projects — stub (Session 9, VG-051 N2). The real Project system
// (blueprint §8) is a later, separate session gated on real project
// records that don't exist yet (⛔C-1). This route exists so the new
// primary nav's "Projects" item has somewhere real to go instead of a
// 404 or a silently-dead link — it states the gap honestly rather than
// hiding it. noindex: nothing here is real content yet, matching the
// content-gate convention industry-capability-pages-data.ts already uses.
import type { Metadata } from 'next'
import { PageHero } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { BASE } from '../../../lib/site'

export const metadata: Metadata = {
  title: 'Projects — Vedanta Group',
  description: 'Selected fabrication and flow-control projects across Dhruv EPC Solutions and Precise Engineers.',
  alternates: { canonical: '/projects/' },
  robots: { index: false, follow: true },
}

export default function ProjectsIndexPage() {
  const jsonLd = buildBreadcrumbList([
    { name: 'Vedanta Group', url: BASE },
    { name: 'Projects', url: `${BASE}/projects` },
  ])

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ label: 'Vedanta Group', href: '/' }, { label: 'Projects' }]}
        eyebrow="Selected work"
        title="Projects."
        lead="Real, attributable project records — scope, challenge, evidence — are in progress. In the meantime, send us your drawing and an engineer will point you to relevant past work directly."
      />

      <section aria-label="Projects" className="mx-auto max-w-wide px-6 py-12">
        <p className="rounded-sm border border-steel-200 bg-steel-50 px-4 py-3 text-helper text-steel-600">
          <span className="font-medium text-steel-950">Content gate:</span> this index is a placeholder
          until sourced project records with client permission-on-file ship. See docs/01-final-implementation-blueprint-v2.md §8.
        </p>
      </section>
    </main>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @vedanta/web typecheck`
Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/\(group\)/projects/page.tsx apps/web/lib/product-urls.ts
git commit -m "feat(web): add /projects stub route — Session 9 N2, real gap not a 404"
```

---

### Task 7: Rewire `GroupChrome.tsx` for the restructured nav

Replace the 3-group-by-division mega-menu with the 5-item primary nav:
Products (mega-panel trigger) + Industries/Capabilities/Projects/Company
as flat links, company switching moved into the utility bar. The mobile
drawer's `groups` become 2 accordions by company (categories, not the full
flat product list — matching the desktop panel's granularity); its `links`
carry the same 4 flat items plus the two company-switch links (utility bar
has no mobile equivalent per the blueprint's "MobileDrawer stands"
instruction, so the switch links live in the drawer's flat link list
instead). `megaPanelColumns` is computed server-side in Task 8's
`layout.tsx` and passed in as a prop — `GroupChrome` is `'use client'` and
cannot import `content-loader.ts` directly (it does `node:fs` reads; see
that file's own header comment on why client/server data is split).

**Files:**
- Modify: `apps/web/components/group/GroupChrome.tsx`

**Interfaces:**
- Consumes: `MegaPanelColumn` type from `@vedanta/datum-ui`; `projectsIndexHref` from `../../lib/product-urls` (Task 6).
- Produces: `GroupChrome({ megaPanelColumns }: { megaPanelColumns: MegaPanelColumn[] })` — Task 8's `layout.tsx` passes `megaPanelColumns`.

- [ ] **Step 1: Replace the full contents of `GroupChrome.tsx`**

Replace `apps/web/components/group/GroupChrome.tsx` in full with:

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @vedanta/web typecheck`
Expected: an error at this point is expected and correct — `(group)/layout.tsx` still renders `<GroupChrome />` with no props (Task 8 fixes this next). Confirm the error is specifically "Property 'megaPanelColumns' is missing" and nothing else, then proceed to Task 8.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/group/GroupChrome.tsx
git commit -m "feat(web): restructure GroupChrome nav — Products/Industries/Capabilities/Projects/Company + utility bar (blueprint §4)"
```

---

### Task 8: Wire real `ProductCategory`/`Product` content into `(group)/layout.tsx`

Build `megaPanelColumns` server-side from real content (Session 5's
`ProductCategory` records + `Product.categorySlug`), cap at 4 products per
category (a curated top-N, not the full catalog — matching the mega-panel's
"top products" framing), and pass it into `GroupChrome`.

**Files:**
- Modify: `apps/web/app/(group)/layout.tsx`

**Interfaces:**
- Consumes: `getProductCategoriesByCompany`, `getProductsByCompany` from `../../lib/content-loader`; `categoryHref`, `productHref`, `productsIndexHref` from `../../lib/product-urls`; `type MegaPanelColumn` from `@vedanta/datum-ui`.

- [ ] **Step 1: Replace the full contents of `(group)/layout.tsx`**

Replace `apps/web/app/(group)/layout.tsx` in full with:

```tsx
// Group holding page — steel-only, no color accent (§5)
// data-company="group" scopes CSS variables to neutral steel values

import Link from 'next/link'
import { Footer, type MegaPanelColumn } from '@vedanta/datum-ui'
import type { CompanySlug } from '@vedanta/schemas'
import { GroupChrome } from '../../components/group/GroupChrome'
import { getEntity, getProductCategoriesByCompany, getProductsByCompany } from '../../lib/content-loader'
import { categoryHref, productHref, productsIndexHref } from '../../lib/product-urls'

const groupEntity = getEntity('group')

// Session 9 (VG-051): the Products mega-panel's two columns, built from
// real ProductCategory + Product content (Session 5) — not a hardcoded
// list. Capped at 4 products per category ("top products", not the full
// catalog) so the panel stays a scan-able entry point, not a full index.
const MEGA_PANEL_PRODUCTS_PER_CATEGORY = 4

function buildMegaPanelColumn(companySlug: CompanySlug, companyLabel: string): MegaPanelColumn {
  const categories = getProductCategoriesByCompany(companySlug)
  const products = getProductsByCompany(companySlug)
  return {
    companyLabel,
    categories: categories.map((category) => ({
      name: category.name,
      href: categoryHref(companySlug, category.slug),
      products: products
        .filter((p) => p.categorySlug === category.slug)
        .slice(0, MEGA_PANEL_PRODUCTS_PER_CATEGORY)
        .map((p) => ({ name: p.name, href: productHref(companySlug, category.slug, p.slug) })),
    })),
    allProductsHref: productsIndexHref(companySlug),
    allProductsLabel: `All ${companyLabel} products →`,
  }
}

const megaPanelColumns: MegaPanelColumn[] = [
  buildMegaPanelColumn('dhruv-epc', 'Dhruv EPC Solutions'),
  buildMegaPanelColumn('precise-engineers', 'Precise Engineers'),
]

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
      <GroupChrome megaPanelColumns={megaPanelColumns} />
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
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @vedanta/web typecheck`
Expected: zero errors — the Task 7 gap is now closed.

- [ ] **Step 3: Run the full web test suite**

Run: `pnpm --filter @vedanta/web test`
Expected: `link-integrity.test.ts` passes (`/industries`, `/capabilities`,
`/about`, `/dhruv-epc`, `/precise-engineers` all resolve to real routes
already; `/projects` now resolves via Task 6's new page; category/product
hrefs inside `layout.tsx` are built via the existing `categoryHref`/
`productHref` function calls, which the scanner's own comment documents as
intentionally out of its string-literal scan — matching how `/industries`
and `/capabilities` index pages already build their per-slug links).

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/\(group\)/layout.tsx
git commit -m "feat(web): wire real ProductCategory/Product content into the group mega-panel"
```

---

### Task 9: Rebuild `(group)/page.tsx` — blueprint §14.2 section order

New order: hero → products by category → industries served (omitted if
none `contentComplete`) → proof band → selected projects (omitted, no
Project system yet) → the two companies (demoted) → RFQ. Keep the existing
hero, stats band, and certifications markup (already sourced, already
correct) — only reorder them and insert the two new sections.

**Files:**
- Modify: `apps/web/app/(group)/page.tsx`

**Interfaces:**
- Consumes: `CategoryCard`, `IndustryCard` from `@vedanta/datum-ui` (both already exist per §14.3/Session 7-8, unused until now); `getIndustries`, `getProductCategoriesByCompany`, `getProductsByCompany` from `../../lib/content-loader`; `categoryHref`, `industryHref` from `../../lib/product-urls`; `RFQBand` from `../../components/RFQBand` (Task 1).

- [ ] **Step 1: Replace the full contents of `(group)/page.tsx`**

Replace `apps/web/app/(group)/page.tsx` in full with:

```tsx
// Group home — blueprint §14.2 section order (Session 9, VG-050):
// hero → products by category → industries served → proof → selected
// projects (omitted — no Project system yet, §8, gated on ⛔C-1) → the
// two companies (demoted from the old doors-first lead) → RFQ.
// Zero accent-filled elements outside the RFQ button (§13's amber/blue
// law) — the door CTAs stay accent-colored links, not fills.
import type { Metadata } from 'next'
import {
  Button,
  CategoryCard,
  CertificationCard,
  IndustryCard,
  StatBand,
  type StampProps,
} from '@vedanta/datum-ui'
import { buildOrganization } from '@vedanta/schemas'
import { RFQBand } from '../../components/RFQBand'
import { getCertifications, getEntity, getIndustries, getProductCategoriesByCompany, getProductsByCompany } from '../../lib/content-loader'
import { categoryHref, industryHref } from '../../lib/product-urls'
import { groupStats } from '../../lib/site-data'

const dhruvCertifications = getCertifications('dhruv-epc')
const groupEntity = getEntity('group')
const preciseCertifications = getCertifications('precise-engineers')

export const metadata: Metadata = {
  title: 'Vedanta Group — Fabrication & Flow-Control Engineering',
  description:
    'Dhruv EPC Solutions (ASME U/U2, IBR static equipment, Vadodara) and Precise Engineers (EJMA expansion joints 80 – 8,000 mm, Anand). Est. 1994.',
}

// §14.2 item 6 — demoted from the old doors-first lead
const DOORS = [
  {
    company: 'dhruv' as const,
    name: 'Dhruv EPC Solutions',
    scope: 'Pressure vessels, heat exchangers and process skids to ASME Sec. VIII Div. 1 & 2',
    chips: ['ASME U · U2 · IBR', 'CS · SS · Ni alloys', 'Vadodara works'],
    groups: ['Static Equipment', 'Skids & Packages', 'Fabrication & Machining'],
    href: '/dhruv-epc',
    cta: 'Enter Dhruv EPC',
  },
  {
    company: 'precise' as const,
    name: 'Precise Engineers',
    scope: 'Metallic, rubber and fabric expansion joints to EJMA, 80 – 8,000 mm NB',
    chips: ['EJMA · ASME B31.3', '80 – 8,000 mm NB', 'EIL approved'],
    groups: ['Expansion Joints', 'Flow Control'],
    href: '/precise-engineers',
    cta: 'Enter Precise Engineers',
  },
]

const STAMP_BY_NAME: Record<string, StampProps['code'] | undefined> = {
  'ASME U Certificate of Authorization': 'U',
  'ASME U2 Certificate of Authorization': 'U2',
  'IBR Approval': 'IBR',
  'ISO 9001:2015 · 14001:2015 · 45001:2018': 'ISO-9001',
  'ISO 9001:2015': 'ISO-9001',
}

// §14.2 item 2 — products by category, both companies visible
const PRODUCT_COMPANIES = [
  { slug: 'dhruv-epc' as const, label: 'Dhruv EPC Solutions' },
  { slug: 'precise-engineers' as const, label: 'Precise Engineers' },
]

// Footer is owned by (group)/layout.tsx — pages must not render their own
// (2026-07-16 audit P0-1: this page previously stacked a second full footer
// under the layout's).

export default function GroupHome() {
  // §14.2 item 3 — only industries Session 8 marked contentComplete; may be
  // none yet (Session 8's own scoping). Omitted, not rendered empty (§2.2).
  const completeIndustries = getIndustries().filter((i) => i.contentComplete)

  return (
    <>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganization(groupEntity)) }}
        />

        {/* §14.2 item 1 — hero, what the group manufactures, stated with a figure */}
        <section className="bg-steel-900">
          <div className="mx-auto max-w-wide px-6 pb-16 pt-24">
            <p className="text-xs font-medium uppercase tracking-caption text-steel-400">
              ASME U &amp; U2 · IBR · EIL Approved · ISO 9001:2015
            </p>
            <h1 className="mt-4 max-w-content font-display text-display-xl font-medium text-steel-50">
              Vedanta Group — precision fabrication and flow-control engineering since 1994.
            </h1>
            <p className="mt-6 max-w-content text-body-lg text-steel-400">
              Two specialized works in Gujarat: static equipment to ASME Sec. VIII at Vadodara,
              and expansion joints to EJMA at Anand — one group, one quality system.
            </p>
          </div>
        </section>

        {/* §14.2 item 2 — products by category, the primary entry */}
        <section aria-labelledby="products-heading" className="bg-steel-900">
          <div className="mx-auto max-w-wide px-6 pb-24">
            <h2 id="products-heading" className="font-display text-h1 font-medium text-steel-50">
              Products.
            </h2>
            {PRODUCT_COMPANIES.map(({ slug, label }) => {
              const categories = getProductCategoriesByCompany(slug)
              const products = getProductsByCompany(slug)
              return (
                <div key={slug} data-company={slug === 'dhruv-epc' ? 'dhruv' : 'precise'} className="mt-8">
                  <h3 className="text-xs font-medium uppercase tracking-caption text-steel-500">{label}</h3>
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                      <CategoryCard
                        key={category.slug}
                        name={category.name}
                        oneLineScope={category.oneLineScope}
                        href={categoryHref(slug, category.slug)}
                        productCount={products.filter((p) => p.categorySlug === category.slug).length}
                        onDark
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* §14.2 item 3 — industries served, the secondary entry */}
        {completeIndustries.length > 0 && (
          <section aria-labelledby="industries-heading" className="border-t border-steel-200 bg-white">
            <div className="mx-auto max-w-wide px-6 py-16">
              <h2 id="industries-heading" className="font-display text-h1 font-medium text-steel-950">
                Industries served.
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {completeIndustries.map((industry, i) => (
                  <IndustryCard
                    key={industry.slug}
                    name={industry.name}
                    index={String(i + 1).padStart(2, '0')}
                    href={industryHref(industry.slug)}
                    servedBy={industry.companySlugs
                      .filter((c): c is 'dhruv-epc' | 'precise-engineers' => c !== 'group')
                      .map((c) => (c === 'dhruv-epc' ? 'dhruv' : 'precise'))}
                    projectCount={0}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* §14.2 item 4 — proof band: stats + certifications, real figures only */}
        <section className="border-t border-steel-200 bg-steel-50">
          <div className="mx-auto max-w-wide px-6 pt-12">
            <StatBand stats={groupStats} />
          </div>
        </section>

        <section id="proof" aria-labelledby="proof-heading" className="bg-steel-50">
          <div className="mx-auto max-w-wide px-6 py-16">
            <h2 id="proof-heading" className="font-display text-h1 font-medium text-steel-950">
              Certifications &amp; approvals
            </h2>
            {[
              { label: 'Dhruv EPC Solutions', certs: dhruvCertifications },
              { label: 'Precise Engineers', certs: preciseCertifications },
            ].map((group) => (
              <div key={group.label} className="mt-8">
                <h3 className="text-xs font-medium uppercase tracking-caption text-steel-600">
                  {group.label}
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {group.certs.map((cert) => (
                    <CertificationCard
                      key={cert.name}
                      stampCode={STAMP_BY_NAME[cert.name]}
                      name={cert.name}
                      scopeStatement={cert.scopeStatement}
                      issuer={cert.issuer}
                      validFrom={cert.validFrom}
                      validTo={cert.validTo}
                      artifactUrl={cert.artifactUrl}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* §14.2 item 5 — selected projects: omitted, not rendered empty.
            The Project content model and getProjects() loader don't exist
            yet (blueprint §8, gated on ⛔C-1 — real project records).
            Writing a conditional against data that doesn't exist would be
            scaffolding for a future session, not this one; add the section
            here when that session ships getProjects(). */}

        {/* §14.2 item 6 — the two companies, demoted from the old lead */}
        <section aria-labelledby="companies-heading" className="border-t border-steel-200 bg-steel-900">
          <div className="mx-auto max-w-wide px-6 py-24">
            <h2 id="companies-heading" className="font-display text-h1 font-medium text-steel-50">
              Two specialized works, one group.
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {DOORS.map((door) => (
                <article
                  key={door.company}
                  data-company={door.company}
                  className="flex h-full flex-col rounded-sm border border-steel-800 bg-steel-950 p-8 transition-colors duration-fast ease-standard hover:border-accent"
                >
                  <div className="mb-8 h-px w-16 bg-accent" aria-hidden="true" />
                  <h3 className="font-display text-h3 font-medium text-steel-50">{door.name}</h3>
                  <p className="mt-2 text-body-lg text-steel-400">{door.scope}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {door.chips.map((chip) => (
                      <li
                        key={chip}
                        className="rounded-sm border border-steel-800 bg-steel-900 px-3 py-1 font-mono text-helper text-steel-400"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-medium uppercase tracking-caption text-steel-600">
                    {door.groups.join(' · ')}
                  </p>
                  <div className="mt-auto pt-8">
                    <Button variant="link" onDark href={door.href}>
                      {door.cta} →
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* §14.2 item 7 — RFQ closer */}
      <RFQBand />

      {/* §6.1.5 title-block footer renders from (group)/layout.tsx —
          audit P0-1: this page previously stacked a second full footer. */}
    </>
  )
}
```

Note: `StatBand` drops its `onDark` prop here because the stats band now
sits on `bg-steel-50` (proof band, item 4) instead of `bg-steel-900` (the
old position 3) — check `StatBand`'s light-ground rendering renders
correctly against `bg-steel-50` before committing (Step 2 covers this).

- [ ] **Step 2: Manual visual check of the stats band on its new light ground**

Run: `pnpm --filter @vedanta/web dev` and open `/` in a browser. Confirm `StatBand`
without `onDark` renders with sufficient contrast against `bg-steel-50` —
if it does not, check `StatBand.tsx`'s own light/dark variant logic
(`packages/datum-ui/src/components/StatBand.tsx`) for the correct prop; do
not invent a workaround here, this is a straightforward "did I drop the
right prop" check against an existing, already-built component.

- [ ] **Step 3: Typecheck, lint, unit test**

Run: `pnpm --filter @vedanta/web typecheck && pnpm --filter @vedanta/web lint && pnpm --filter @vedanta/web test`
Expected: zero errors. `link-integrity.test.ts`'s href scan covers the
literal `/dhruv-epc`, `/precise-engineers` hrefs in `DOORS` (unchanged from
before, already passing); `metadata-uniqueness.test.ts` sees the
unchanged page metadata (title/description untouched) plus the new
`/projects` metadata from Task 6 — confirm both are still unique.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/\(group\)/page.tsx
git commit -m "feat(web): rebuild group home per blueprint §14.2 — products/industries/proof/companies/RFQ order"
```

---

### Task 10: Full verification pass + PR

Run the complete verify sequence from `CLAUDE.md`, in order, stopping on
first failure. This is a fresh pass over the whole branch, not a
self-grade of the tasks above.

**Files:** none (verification only).

- [ ] **Step 1: Workspace-wide checks**

Run in order, stop on first failure:
```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

- [ ] **Step 2: Manual browser checks (per CLAUDE.md's UI-change requirements)**

With `pnpm --filter @vedanta/web dev` running, on the group home (`/`) and any page
using `GroupChrome`:
1. Tab through the full Products mega-panel with keyboard only — confirm
   focus lands on the first category link on open, Tab cycles within the
   panel (does not escape into the page behind it), Shift+Tab from the
   first link wraps to the last, and ESC closes the panel and returns
   focus to the Products trigger button.
2. Confirm `MobileBottomBar` is pixel-identical to before this session
   (no file in this plan touches `MobileBottomBar.tsx` — a visual spot
   check on `/dhruv-epc/proof`, `/precise-engineers/proof`, or another page
   that renders it is sufficient).
3. Toggle `prefers-reduced-motion` at the OS level — the mega-panel and
   mobile drawer stay fully functional (no motion beyond opacity/final
   frame per Datum's motion budget — `MegaPanel` has no transitions of its
   own beyond the existing `hover:` color transitions already covered by
   `duration-instant`, which the codebase's global reduced-motion handling
   already accounts for the same way `MobileDrawer`'s hover states do).
4. 320px viewport — no horizontal scroll on the group home; the utility
   bar is hidden below `md` by design (mobile uses the drawer instead) —
   confirm the mobile drawer surfaces the two company-switch links and the
   two category accordions.
5. Confirm exactly one accent-filled element on screen at any viewport —
   the persistent header RFQ button, or the in-content RFQ band's amber
   button when it's in view (never both simultaneously, per the existing
   `useRfqAnchorInView` yield behavior — unchanged by this plan).
6. Check the group home's LCP on a throttled 4G profile in Chrome
   DevTools against the plan's `<2.0s` reference target from the session
   brief.
7. Confirm the "Selected projects" section is absent from the rendered
   page (not an empty section with a heading) and the "Industries served"
   section is either populated with real complete-content cards or fully
   absent — never a placeholder card — matching the current content state
   (0 industries are `contentComplete: true` today, so this section
   should currently be absent).

- [ ] **Step 3: Open the PR**

```bash
git push -u origin design/session-9-group-home-nav
gh pr create --title "Session 9 — group nav restructure + group home rebuild" --body "$(cat <<'EOF'
## Summary
- Nav restructure (VG-051): primary nav is now Products · Industries · Capabilities · Projects · Company (5 items); company switching moved to a new utility bar; new MegaPanel component (two columns by company, keyboard-trapped, ESC-closeable).
- Group home rebuild (VG-050): section order now follows blueprint §14.2 — hero → products by category → industries served → proof → (projects, omitted) → the two companies (demoted) → RFQ.
- Known gap, flagged per the session brief (N2): `/projects` is a stub page, not the real Project system (blueprint §8) — that's a separate future session gated on real project records.

## Governing spec
- docs/01-final-implementation-blueprint-v2.md §4 (navigation), §14.2 (home section order), §14.3 (new components), §2.2 (omit-not-empty rule)

## Verify
- [x] pnpm typecheck / lint / test / build all pass
- [x] MegaPanel keyboard-nav test (Tab trap, Shift+Tab wrap, ESC + focus restore) — packages/datum-ui/src/components/MegaPanel.test.tsx
- [x] axe: zero WCAG A/AA violations on MegaPanel and Header's new Group story (auto-globbed)
- [ ] Manual: keyboard-only mega-panel walkthrough, MobileBottomBar pixel check, reduced-motion, 320px, single-accent-element, LCP <2.0s — see PR checklist in Task 10 Step 2 of the implementation plan

## Deviations / blockers
- None beyond the flagged /projects gap (expected, per N2).
EOF
)"
```

- [ ] **Step 4: Report the PR URL and any manual-check findings to the human reviewer**

If any Step 2 manual check fails, do NOT mark the task complete — follow
`CLAUDE.md`'s loop circuit breaker (3 attempts max per failure, then log to
`docs/mistakes.md` and report the blocker by name).
