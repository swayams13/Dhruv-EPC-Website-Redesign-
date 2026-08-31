# Session 6 — Golden Page (Pressure Vessels) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the new golden-page product-detail layout (persistent spec rail with
sourced/unverified provenance marks, plus a wired-in inspection/approvals record) for
exactly one product — Dhruv EPC's Pressure Vessels — leaving every other product page
byte-identical to how it rendered after Session 5.

**Architecture:** One new datum-ui component (`SpecRail`, mobile + desktop halves,
mirroring the existing `AnchorRailMobile`/`AnchorRailDesktop` split) plus two small
schema additions (optional `provenance`/`sourceNote` on `SpecTableRow`) are the only new
surface area. The "inspection record" requirement is **not** a new component — Session 4
already built `ApprovalsMatrix` and `CertificationCard` and never wired them into any
page; this session wires them into the golden page using data that already exists in
`content/approvals/` and `content/certifications/`. The golden page itself is a single
`slug === 'pressure-vessels'` early-return branch inside the shared
`apps/web/lib/product-detail-page.tsx` factory — deliberately not generalized (Session
7's job once this is reviewed).

**Tech Stack:** Next.js 14 (static export), React, Tailwind (Datum preset), Zod
(`@vedanta/schemas`), Vitest, Storybook + `@storybook/addon-a11y`, Playwright +
`@axe-core/playwright`.

**Spec:** `docs/design-docs/Vedanta Product Page Directions.html` (direction 1c,
"Structured Hybrid" — the recommended direction) and
`docs/design-docs/Vedanta Component Specs.html` (confirmed to spec `CategoryCard`/
`IndustryCard` only — **not** SpecRail; see Deviations below). Prose summary:
`docs/01-final-implementation-blueprint-v2.md` — HTML wins on conflict.

## Global Constraints

- No arbitrary Tailwind values anywhere — every class must resolve to a named token in
  `packages/tokens` (steel-*, brand-*/accent-*, flex-*, signal-*, shadow-raised/overlay,
  rounded-sm, space scale, duration-instant/fast/standard). `tailwindcss/no-arbitrary-value`
  is `error` in CI; there is no suppression.
- Every Datum component prop interface ends with `className?: never` (existing repo-wide
  convention — see `SpecTable`, `ApprovalsMatrix`, `CertificationCard`, `Testimonial`).
- New content fields must be **optional** in Zod so the other 16 products (which won't
  carry this data) still validate.
- No fabricated content. Anything the spec implies but the content record lacks gets the
  `"DEMO figure — engineering data pending"` note convention already used 28x across 12
  files in `content/` (not the one-off `"DEMO-PLACEHOLDER: ..."` string, which appears
  exactly once, in `storage-tanks.json`, and is not the dominant convention).
- Only the pressure-vessels route may visually change. Every other `/dhruv-epc/` and
  `/precise-engineers/` product page must render byte-identical to Session 5.
- WCAG 2.2 AA is a build constraint: `:focus-visible` ring on every interactive element,
  real `<table>`/`scope`, 44×44 touch targets, `prefers-reduced-motion` collapses
  animation to opacity/final-frame.
- One accent-filled (RFQ) element visible per view — SpecRail's CTA must participate in
  the existing `[data-rfq-anchor]` / `useRfqAnchorInView` yield mechanism, not create a
  second live RFQ button alongside the header/bottom bar.
- Branch `design/session-6-golden-page` off `main`. PR for human review — not a
  rubber-stamp CI pass.

## Deviations from the session brief (flag prominently in the PR)

1. **The two named spec files are not what the brief assumed.**
   `Vedanta Component Specs.html` specs `CategoryCard` (already built, Session 5) and
   `IndustryCard` (not built, out of scope — group-home component, not product-detail).
   Neither is a golden-page component. `Vedanta Product Page Directions.html` is a
   three-direction comparison doc; the winning direction (1c) *names* `SpecRail`,
   `SectionNav`, `CapabilityEnvelopeTable` in a one-line "new components implied"
   footnote with **no prop table, no state list, no per-company variant spec**. Per
   CLAUDE.md's Ambiguity Protocol, this was surfaced to the human before building (see
   session transcript) — approved direction: infer a minimal `SpecRail` shape from the
   mockup captions/behavior notes and flag it explicitly as inferred, not specced.
2. **`SectionNav` already exists** as `AnchorRailMobile`/`AnchorRailDesktop`
   (`apps/web/components/AnchorRail.tsx`) — a horizontal mobile chip strip + sticky
   desktop sidebar nav, functionally identical to what the mockup describes. This plan
   reuses it rather than building a duplicate.
3. **No `ProvenanceMark` or `InspectionRecord` component is built.** The data the
   "Inspection record" band needs (LRS/BV/DNV as `Approval` records with
   `entityClass: 'TPIA'`, `category: 'Third-party inspection'`; IBR/ASME U/ASME
   U2/ISO 9001 as `Certification` records) already exists verbatim in
   `content/approvals/dhruv-epc-*.json` and `content/certifications/dhruv-epc-*.json`,
   and the components to render them (`ApprovalsMatrix`, `CertificationCard`) were built
   in Session 4 and never wired into a page. Building a new component here would
   duplicate both the data model and the rendering — this plan wires the existing pair
   in instead.
4. **`CapabilityEnvelopeTable` is out of scope for this session.** It has even less
   detail in the spec than SpecRail (a single "already on the build list" mention, no
   mockup annotations at all) and isn't part of G1's expected set. Not building it.

---

### Task 1: `SpecTableRow` provenance fields (schema + component type)

**Files:**
- Modify: `packages/schemas/src/cms.ts` (the `SpecTableRow` Zod object)
- Modify: `packages/datum-ui/src/components/SpecTable.tsx` (the plain-TS `SpecTableRow`
  interface — this repo keeps this type hand-duplicated rather than imported from
  `@vedanta/schemas`, an existing inconsistency; matching it, not fixing it, since fixing
  it is out of scope for this task)
- Test: `packages/schemas/src/cms.test.ts`

**Interfaces:**
- Produces: `SpecTableRow.provenance?: 'sourced' | 'unverified'` and
  `SpecTableRow.sourceNote?: string` — consumed by Task 3's `SpecRail` and by Task 4's
  content record.

- [ ] **Step 1: Write the failing schema test**

Add to `packages/schemas/src/cms.test.ts` (find the existing `describe('SpecTableRow'`
block or the nearest `SpecTableRow`-parsing test and add alongside it):

```ts
it('accepts optional provenance and sourceNote fields', () => {
  const row = SpecTableRow.parse({
    param: 'Shell diameter',
    value: '300 – 5,000',
    unit: 'mm',
    provenance: 'unverified',
    sourceNote: 'DEMO figure — engineering data pending',
  })
  expect(row.provenance).toBe('unverified')
  expect(row.sourceNote).toBe('DEMO figure — engineering data pending')
})

it('rejects an invalid provenance value', () => {
  expect(() =>
    SpecTableRow.parse({ param: 'x', value: 'y', provenance: 'confirmed' }),
  ).toThrow()
})

it('still accepts a row with neither field (existing 16 products)', () => {
  const row = SpecTableRow.parse({ param: 'x', value: 'y' })
  expect(row.provenance).toBeUndefined()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @vedanta/schemas test -- cms.test.ts -t "provenance"`
Expected: FAIL — `provenance`/`sourceNote` are not recognized keys (Zod strips unknown
keys silently by default, so the first assertion — `row.provenance` — fails as
`undefined` rather than `'unverified'`).

- [ ] **Step 3: Add the fields to the Zod schema**

In `packages/schemas/src/cms.ts`, find:
```ts
export const SpecTableRow = z.object({
  param: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  note: z.string().optional(),
})
```
Replace with:
```ts
export const SpecTableRow = z.object({
  param: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional(),
  note: z.string().optional(),
  /** Rail-only provenance mark. Omit entirely for the 16 products that don't
      carry a SpecRail yet — never default one in. */
  provenance: z.enum(['sourced', 'unverified']).optional(),
  /** Footnote shown under the SpecRail row when a mark is present. */
  sourceNote: z.string().optional(),
})
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @vedanta/schemas test -- cms.test.ts -t "provenance"`
Expected: PASS

- [ ] **Step 5: Mirror the fields onto the datum-ui `SpecTableRow` interface**

In `packages/datum-ui/src/components/SpecTable.tsx`, find:
```ts
export interface SpecTableRow {
  param: string
  value: string
  unit?: string | undefined
  note?: string | undefined
}
```
Replace with:
```ts
export interface SpecTableRow {
  param: string
  value: string
  unit?: string | undefined
  note?: string | undefined
  /** Rail-only provenance mark — SpecTable itself does not render it (§15's
      table anatomy is unchanged); SpecRail reads it off the same row data. */
  provenance?: 'sourced' | 'unverified' | undefined
  sourceNote?: string | undefined
}
```
This is additive-only — `SpecTable`'s own rendering logic (`unitNote`, the `<table>`
and `<dl>` branches) is untouched, so all 17 products' existing `SpecTable` output is
unaffected.

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: zero errors (both packages compile with the widened type)

- [ ] **Step 7: Commit**

```bash
git add packages/schemas/src/cms.ts packages/schemas/src/cms.test.ts packages/datum-ui/src/components/SpecTable.tsx
git commit -m "feat(schemas): add optional provenance/sourceNote to SpecTableRow — golden page G3"
```

---

### Task 2: `Check`/`Triangle` glyphs for the provenance marks

**Files:**
- Modify: `packages/datum-ui/src/components/glyphs.tsx`

**Interfaces:**
- Produces: `Check(props: GlyphProps)`, `Triangle(props: GlyphProps)` — same signature as
  every other glyph in the file (`{ size?: 16 | 20 | 24 }`, `aria-hidden`,
  `currentColor` stroke). Consumed by Task 3's `SpecRail`.

- [ ] **Step 1: Add the two glyphs**

Append to `packages/datum-ui/src/components/glyphs.tsx`, matching the existing
`svgProps`/stroke-only convention used by every glyph in this file (1.5px stroke,
squared caps, 24×24 grid, decorative/`aria-hidden`):

```tsx
export function Check(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M4 12l6 6L20 6" />
    </svg>
  )
}

export function Triangle(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M12 4l9 16H3L12 4zM12 10v4M12 17h.01" />
    </svg>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add packages/datum-ui/src/components/glyphs.tsx
git commit -m "feat(datum-ui): add Check/Triangle glyphs for SpecRail provenance marks"
```

---

### Task 3: `SpecRail` component (mobile + desktop, inferred spec)

**Files:**
- Create: `packages/datum-ui/src/components/SpecRail.tsx`
- Create: `packages/datum-ui/src/components/SpecRail.stories.tsx`
- Modify: `packages/datum-ui/src/index.ts` (barrel export)

**Interfaces:**
- Consumes: `SpecTableRow` from `./SpecTable` (Task 1's widened type), `Check`/`Triangle`
  from `./glyphs` (Task 2).
- Produces:
  ```ts
  export interface SpecRailCta {
    label: string
    href: string
  }
  export interface SpecRailProps {
    rows: SpecTableRow[]
    primaryCta: SpecRailCta
    secondaryCta?: SpecRailCta
    className?: never
  }
  export function SpecRailMobile(props: { rows: SpecTableRow[] }): React.ReactElement
  export function SpecRailDesktop(props: SpecRailProps): React.ReactElement
  ```
  Consumed by Task 5's page wiring.

**Inferred-spec note to put at the top of the file** (this is the load-bearing comment —
copy it verbatim, it's what makes the inference legible to reviewers):

```tsx
// SpecRail — INFERRED, not formally specced. Vedanta Product Page Directions.html
// direction 1c (the recommended "Structured Hybrid") names "SpecRail (sticky)" and
// "SectionNav" as implied new components in a one-line footnote, with no prop table,
// state list, or per-company variant spec — unlike CategoryCard/IndustryCard in
// Vedanta Component Specs.html, which get full sheets. This shape is inferred from:
//  - the mockup caption "Dhruv EPC · 360 px — rail collapses above the column, nav
//    becomes a sticky chip row, RFQ moves to a bottom bar" (mobile behavior)
//  - the direction notes: "Two RFQ buttons are visible at once (rail + header) —
//    resolved by the existing useRfqAnchorInView hook: the header yields while the
//    rail is in view" (dual-RFQ handling — reuses [data-rfq-anchor], no new hook call)
//  - "Same template, accent remapped... no structural change was needed for the
//    second company" (accent comes free from Tailwind's accent-* classes, no company
//    prop, matching every other Datum component)
// Mirrors the existing AnchorRailMobile/AnchorRailDesktop split
// (apps/web/components/AnchorRail.tsx) for the mobile/desktop DOM-position problem,
// per CLAUDE.md's ambiguity protocol step 2 ("check how an existing component solved
// the same problem — consistency > novelty"). Flagged in the PR as a design-review
// item: confirm this shape before it's replicated to other products in Session 7.
```

**Rows shown on the rail**: the rail is "key figures," a curated subset of the product's
full `specTable`, not all of it. For Pressure Vessels this plan selects the single-value
rows (`Vessel types`, `Shell diameter`, `Max unit weight`, `Design pressure`, `Design
temperature`, `Inspection` — 6 rows) and excludes the two multi-value list rows (`Design
codes`, `Materials`, which stay in the main `SpecTable` body where they read better as
prose/pills). This selection is done by the **page** (Task 5), not inside `SpecRail`
itself — `SpecRail` just renders whatever `rows` it's given, so it stays reusable for a
product with a different curation later.

- [ ] **Step 1: Write the component**

```tsx
// packages/datum-ui/src/components/SpecRail.tsx
// SpecRail — INFERRED, not formally specced. Vedanta Product Page Directions.html
// direction 1c (the recommended "Structured Hybrid") names "SpecRail (sticky)" and
// "SectionNav" as implied new components in a one-line footnote, with no prop table,
// state list, or per-company variant spec — unlike CategoryCard/IndustryCard in
// Vedanta Component Specs.html, which get full sheets. This shape is inferred from:
//  - the mockup caption "Dhruv EPC · 360 px — rail collapses above the column, nav
//    becomes a sticky chip row, RFQ moves to a bottom bar" (mobile behavior)
//  - the direction notes: "Two RFQ buttons are visible at once (rail + header) —
//    resolved by the existing useRfqAnchorInView hook: the header yields while the
//    rail is in view" (dual-RFQ handling — reuses [data-rfq-anchor], no new hook call)
//  - "Same template, accent remapped... no structural change was needed for the
//    second company" (accent comes free from Tailwind's accent-* classes, no company
//    prop, matching every other Datum component)
// Mirrors the existing AnchorRailMobile/AnchorRailDesktop split
// (apps/web/components/AnchorRail.tsx) for the mobile/desktop DOM-position problem,
// per CLAUDE.md's ambiguity protocol step 2 ("check how an existing component solved
// the same problem — consistency > novelty"). Flagged in the PR as a design-review
// item: confirm this shape before it's replicated to other products in Session 7.

import { Check, Triangle } from './glyphs'
import type { SpecTableRow } from './SpecTable'

export interface SpecRailCta {
  label: string
  href: string
}

export interface SpecRailProps {
  rows: SpecTableRow[]
  primaryCta: SpecRailCta
  secondaryCta?: SpecRailCta
  className?: never
}

function ProvenanceMark({ row }: { row: SpecTableRow }): React.ReactElement | null {
  if (!row.provenance) return null
  const sourced = row.provenance === 'sourced'
  return (
    <span
      className={`inline-flex items-center gap-1 text-helper ${
        sourced ? 'text-signal-success' : 'text-signal-warn'
      }`}
    >
      {sourced ? <Check size={16} /> : <Triangle size={16} />}
      <span className="sr-only">{sourced ? 'Sourced' : 'Unverified'}</span>
    </span>
  )
}

function RailRow({ row }: { row: SpecTableRow }): React.ReactElement {
  return (
    <div className="border-b border-steel-200 py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-2">
        <dt className="text-sm font-medium text-steel-600">{row.param}</dt>
        <ProvenanceMark row={row} />
      </div>
      <dd className="font-mono text-data text-steel-950">
        {row.value}
        {row.unit && <span className="ml-1 text-helper text-steel-600">{row.unit}</span>}
      </dd>
      {row.sourceNote && <p className="mt-1 text-helper text-steel-500">{row.sourceNote}</p>}
    </div>
  )
}

function CtaRow({
  primaryCta,
  secondaryCta,
}: {
  primaryCta: SpecRailCta
  secondaryCta?: SpecRailCta
}): React.ReactElement {
  return (
    // data-rfq-anchor: same yield contract as ProductHero/RFQBand (Datum §13,
    // amber law) — Header/MobileBottomBar hide their own RFQ CTA while this is
    // in view, so the rail's button never creates a second live accent element.
    <div data-rfq-anchor className="mt-4 flex flex-col gap-2">
      <a
        href={primaryCta.href}
        className="flex min-h-control items-center justify-center rounded-sm bg-action-rfq px-4 text-data font-medium text-action-rfqFg transition-colors duration-instant hover:bg-action-rfqHover active:bg-action-rfqPressed"
      >
        {primaryCta.label}
      </a>
      {secondaryCta && (
        <a
          href={secondaryCta.href}
          className="flex min-h-control items-center justify-center rounded-sm border border-steel-200 px-4 text-data font-medium text-steel-950 transition-colors duration-instant hover:border-steel-400"
        >
          {secondaryCta.label}
        </a>
      )}
    </div>
  )
}

/** Static block placed BEFORE the content grid, hidden on lg+. No CTA buttons —
    MobileBottomBar (already rendered globally) owns RFQ at this width, per the
    360px mockup caption ("RFQ moves to a bottom bar"). */
export function SpecRailMobile({ rows }: { rows: SpecTableRow[] }): React.ReactElement {
  return (
    <div className="rounded-sm border border-steel-200 bg-white p-6 lg:hidden">
      <p className="text-xs font-medium uppercase tracking-caption text-steel-600">Key figures</p>
      <dl className="mt-3">
        {rows.map((row) => (
          <RailRow key={row.param} row={row} />
        ))}
      </dl>
    </div>
  )
}

/** Sticky sidebar — place inside the lg:grid-cols-12 grid as lg:col-span-4,
    below AnchorRailDesktop (native CSS sticky stacking pushes this rail below
    the nav's sticky box once both are pinned — no extra offset math needed). */
export function SpecRailDesktop({
  rows,
  primaryCta,
  secondaryCta,
}: SpecRailProps): React.ReactElement {
  return (
    <div className="sticky top-24 mt-6 hidden rounded-sm border border-steel-200 bg-white p-6 lg:block">
      <p className="text-xs font-medium uppercase tracking-caption text-steel-600">Key figures</p>
      <dl className="mt-3">
        {rows.map((row) => (
          <RailRow key={row.param} row={row} />
        ))}
      </dl>
      <CtaRow primaryCta={primaryCta} secondaryCta={secondaryCta} />
    </div>
  )
}
```

Before wiring the barrel, verify `action-rfq`/`action-rfqFg`/`action-rfqHover`/
`action-rfqPressed` and `min-h-control` are real Tailwind classes already used
elsewhere (they are — grep `Button.tsx` and `MobileBottomBar.tsx` for the exact
class names and correct this component to match them exactly before Step 2; do not
guess the class name, read the existing RFQ button implementation first).

- [ ] **Step 2: Add barrel export**

In `packages/datum-ui/src/index.ts`, after the `useRfqAnchorInView` export line, add:
```ts
export {
  SpecRailMobile,
  SpecRailDesktop,
  type SpecRailProps,
  type SpecRailCta,
} from './components/SpecRail'
```

- [ ] **Step 3: Write stories covering every state**

```tsx
// packages/datum-ui/src/components/SpecRail.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { SpecRailDesktop, SpecRailMobile } from './SpecRail'
import { withCompany } from '../story-helpers'
import type { SpecTableRow } from './SpecTable'

const rows: SpecTableRow[] = [
  { param: 'Vessel types', value: 'Separators, reactors, columns, drums' },
  {
    param: 'Shell diameter',
    value: '300 – 5,000',
    unit: 'mm',
    provenance: 'unverified',
    sourceNote: 'DEMO figure — engineering data pending',
  },
  { param: 'Inspection', value: 'LRS · BV · DNV · IBR', provenance: 'sourced' },
]

const primaryCta = { label: 'Request a quote', href: '/request-a-quote?equipment=pressure-vessels' }
const secondaryCta = { label: 'Download datasheet', href: '#' }

const meta: Meta<typeof SpecRailDesktop> = {
  title: 'Datum/SpecRail',
  component: SpecRailDesktop,
}
export default meta
type Story = StoryObj<typeof SpecRailDesktop>

export const Desktop: Story = {
  args: { rows, primaryCta, secondaryCta },
  decorators: [withCompany('dhruv')],
}

export const DesktopNoSecondaryCta: Story = {
  args: { rows, primaryCta },
  decorators: [withCompany('dhruv')],
}

export const DesktopPrecise: Story = {
  args: { rows, primaryCta, secondaryCta },
  decorators: [withCompany('precise')],
}

export const DesktopAllSourced: Story = {
  args: {
    rows: rows.map((r) => ({ ...r, provenance: 'sourced' as const, sourceNote: undefined })),
    primaryCta,
    secondaryCta,
  },
  decorators: [withCompany('dhruv')],
}

export const Mobile: StoryObj<typeof SpecRailMobile> = {
  render: (args) => <SpecRailMobile {...args} />,
  args: { rows },
  decorators: [withCompany('dhruv')],
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
```

Check `story-helpers.tsx` for the exact `withCompany` signature and any existing
viewport-parameter convention (`AnchorRail.stories.tsx` or `MobileBottomBar.stories.tsx`
likely already has a mobile-viewport story — match that pattern exactly rather than the
guess above if it differs).

- [ ] **Step 4: Run the datum-ui test suite (includes T5's auto a11y glob)**

Run: `pnpm --filter @vedanta/datum-ui test`
Expected: PASS — `a11y.test.tsx`'s `import.meta.glob('./components/*.stories.tsx')`
picks up `SpecRail.stories.tsx` automatically (no manual registration needed) and runs
axe against every exported story with zero violations.

- [ ] **Step 5: Typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: zero errors, zero arbitrary-value violations

- [ ] **Step 6: Commit**

```bash
git add packages/datum-ui/src/components/SpecRail.tsx packages/datum-ui/src/components/SpecRail.stories.tsx packages/datum-ui/src/index.ts
git commit -m "feat(datum-ui): add SpecRail (mobile+desktop) — inferred spec, flagged for design review"
```

---

### Task 4: Populate pressure-vessels content with provenance data

**Files:**
- Modify: `content/products/pressure-vessels.json`

**Interfaces:**
- Consumes: Task 1's widened `SpecTableRow` schema.
- Produces: the exact row data Task 5 passes into `SpecRailDesktop`/`SpecRailMobile`.

- [ ] **Step 1: Add provenance to the four DEMO rows and mark the rest sourced**

In `content/products/pressure-vessels.json`, the `specTable` array already has a
`"note": "DEMO figure — engineering data pending"` on 4 of 8 rows (Shell diameter, Max
unit weight, Design pressure, Design temperature) — these become `"provenance":
"unverified"` with `"sourceNote"` carrying that same note text (kept as `note` too, for
`SpecTable`'s existing body-table rendering — additive, not a rename). The other 4 rows
(Design codes, Vessel types, Materials, Inspection) are live/real data already published
elsewhere on the site (hero cert chips, FAQ answers) — mark them `"provenance":
"sourced"`.

Edit each of the 8 `specTable` entries to match:

```json
{
  "param": "Design codes",
  "value": "ASME Sec. VIII Div. 1 & 2 · IBR",
  "note": "U and U2 Certificates of Authorization held",
  "provenance": "sourced"
},
{
  "param": "Vessel types",
  "value": "Separators, reactors, distillation columns, accumulators, KO drums, surge vessels",
  "provenance": "sourced"
},
{
  "param": "Shell diameter",
  "value": "300 – 5,000",
  "unit": "mm",
  "note": "DEMO figure — engineering data pending",
  "provenance": "unverified",
  "sourceNote": "DEMO figure — engineering data pending"
},
{
  "param": "Max unit weight",
  "value": "400",
  "unit": "T",
  "note": "DEMO figure — engineering data pending",
  "provenance": "unverified",
  "sourceNote": "DEMO figure — engineering data pending"
},
{
  "param": "Design pressure",
  "value": "FV to 300",
  "unit": "bar(g)",
  "note": "DEMO figure — engineering data pending",
  "provenance": "unverified",
  "sourceNote": "DEMO figure — engineering data pending"
},
{
  "param": "Design temperature",
  "value": "−196 to +600",
  "unit": "°C",
  "note": "DEMO figure — engineering data pending",
  "provenance": "unverified",
  "sourceNote": "DEMO figure — engineering data pending"
},
{
  "param": "Materials",
  "value": "CS, LTCS, LAS, austenitic SS, duplex SS, high-nickel alloys, clad plate",
  "provenance": "sourced"
},
{
  "param": "Inspection",
  "value": "LRS · BV · DNV · IBR",
  "note": "Third-party and statutory",
  "provenance": "sourced"
}
```

(Keep the file's existing key order and the rest of the document — `types`, `materials`,
`codes`, `faqs`, `page`, etc. — completely unchanged. Only the 8 `specTable` entries
above are touched.)

- [ ] **Step 2: Validate the content against the schema**

Run: `pnpm --filter apps-web test -- content-loader` (or whatever the existing content-
validation test file is named — grep `content-loader.test.ts` / `cms.test.ts` for a test
that loads every file in `content/products/` through `Product.parse`; if no such
blanket test exists, run `pnpm --filter apps-web build` instead, since Next's static
generation will throw on an invalid content file)
Expected: PASS — `pressure-vessels.json` still parses as a valid `Product`.

- [ ] **Step 3: Commit**

```bash
git add content/products/pressure-vessels.json
git commit -m "content(pressure-vessels): add SpecRail provenance marks — 4 rows sourced-live, 4 flagged DEMO/unverified"
```

---

### Task 5: Wire the golden page into `product-detail-page.tsx`

**Files:**
- Modify: `apps/web/lib/product-detail-page.tsx`
- Modify: `apps/web/lib/content-loader.ts` (only if `getCertifications`/`getApprovals`
  aren't already exported — confirm first; per Task 5's research they already are, so
  this file likely needs no changes)

**Interfaces:**
- Consumes: `SpecRailMobile`, `SpecRailDesktop` (Task 3), `ApprovalsMatrix`,
  `CertificationCard` (already in the barrel), `getCertifications(companySlug)`,
  `getApprovals(companySlug)` (already in `content-loader.ts`).
- Produces: the rendered golden page at `/dhruv-epc/products/static-equipment/pressure-vessels/`.

- [ ] **Step 1: Add the early-return branch**

In `apps/web/lib/product-detail-page.tsx`, inside `Page()`, immediately after
`const page = product.page` (before the `breadcrumbs` computation), add:

```tsx
    // Golden page — Session 6. Deliberately NOT generalized: this is a one-product
    // early return so the design can be reviewed once before Session 7 replicates
    // the pattern to the other 16 products. Do not add a second slug here.
    if (companySlug === 'dhruv-epc' && product.slug === 'pressure-vessels') {
      return (
        <PressureVesselsGoldenPage
          product={product}
          entity={entity}
          category={category}
          rfqCompany={rfqCompany}
        />
      )
    }
```

- [ ] **Step 2: Build `PressureVesselsGoldenPage` in the same file**

Add this function below `productDetailPage` (or in a new co-located file
`apps/web/lib/pressure-vessels-golden-page.tsx` if the existing file is already long
enough that a split is warranted — check line count first; at ~215 lines pre-change,
adding one ~150-line function keeps it under 400, so keep it in the same file unless
that changes). It reuses `SECTIONS`-style anchors, `AnchorRailMobile`/
`AnchorRailDesktop`, `RFQBand`, `MobileBottomBar`, plus the JSON-LD block, breadcrumb
logic, and hero identical to the shared template — only the section body inside the
grid differs (spec rail added to the sidebar, inspection-record section added, and the
rail rows curated per Task 3's note).

```tsx
import { ApprovalsMatrix, CertificationCard, SpecRailDesktop, SpecRailMobile } from '@vedanta/datum-ui'
import { getApprovals, getCertifications } from './content-loader'
import type { Product, EntityRecord, ProductCategory, CompanySlug } from '@vedanta/schemas'

const GOLDEN_SECTIONS = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'types', label: 'Types & configurations' },
  { id: 'materials-codes', label: 'Materials & codes' },
  { id: 'fabrication-qa', label: 'Fabrication & QA' },
  { id: 'inspection-record', label: 'Inspection record' },
  { id: 'faq', label: 'FAQ' },
]

// Rail carries the single-value "key figures" only — the two multi-value rows
// (Design codes, Materials) stay in the main SpecTable body where a list reads
// better than a cramped rail row. See SpecRail.tsx's inferred-spec note.
const RAIL_PARAMS = new Set([
  'Vessel types',
  'Shell diameter',
  'Max unit weight',
  'Design pressure',
  'Design temperature',
  'Inspection',
])

function PressureVesselsGoldenPage({
  product,
  entity,
  category,
  rfqCompany,
}: {
  product: Product
  entity: EntityRecord
  category: ProductCategory | undefined
  rfqCompany: CompanySlug
}): ReactElement {
  const page = product.page
  const railRows = product.specTable.filter((r) => RAIL_PARAMS.has(r.param))
  const approvals = getApprovals(product.companySlug).filter(
    (a) => a.entityClass === 'TPIA' && a.category === 'Third-party inspection',
  )
  const certifications = getCertifications(product.companySlug)

  const breadcrumbs = [
    { label: companyLabel(product.companySlug), href: companyHref(product.companySlug) },
    { label: 'Products', href: productsIndexHref(product.companySlug) },
    ...(category ? [{ label: category.name, href: categoryHref(product.companySlug, category.slug) }] : []),
    { label: page?.breadcrumbLabel ?? product.name },
  ]
  const canonicalPath = productHref(product.companySlug, product.categorySlug, product.slug)
  const jsonLd = [
    buildProduct(product, entity),
    buildFAQPage(product.faqs),
    buildBreadcrumbList([
      { name: companyLabel(product.companySlug), url: `${BASE}${companyHref(product.companySlug)}` },
      { name: 'Products', url: `${BASE}${productsIndexHref(product.companySlug)}` },
      ...(category
        ? [{ name: category.name, url: `${BASE}${categoryHref(product.companySlug, category.slug)}` }]
        : []),
      { name: page?.breadcrumbLabel ?? product.name, url: `${BASE}${canonicalPath}` },
    ]),
  ]
  const qaSteps = page?.qaSteps && page.qaSteps.length > 0 ? page.qaSteps : GENERIC_QA_STEPS

  return (
    <main>
      {jsonLd.map((ld) => (
        <script key={ld['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <ProductHero
        breadcrumbs={breadcrumbs}
        title={page?.heroTitle ?? product.name}
        valueStatement={page?.valueStatement ?? product.oneLineScope}
        chips={page?.heroChips && page.heroChips.length > 0 ? page.heroChips : product.codes.slice(0, 3)}
        specHref="#specifications"
        {...(page?.certChips && page.certChips.length > 0 ? { certChips: page.certChips } : {})}
        rfq={{ label: 'Request a quote', href: rfqHref(rfqCompany, product.slug) }}
      />

      <AnchorRailMobile sections={GOLDEN_SECTIONS} />
      <SpecRailMobile rows={railRows} />

      <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-12">
        <div className="flex flex-col gap-16 lg:col-span-8">
          <section id="specifications" aria-labelledby="spec-heading">
            <h2 id="spec-heading" className="font-display text-h3 font-medium text-steel-950">Specifications</h2>
            <div className="mt-6">
              <SpecTable rows={product.specTable} caption={page?.specCaption ?? `${product.name} capability`} />
            </div>
          </section>

          <section id="types" aria-labelledby="types-heading">
            {/* identical to the shared template's "types" section — see product-detail-page.tsx */}
          </section>

          <section id="materials-codes" aria-labelledby="moc-heading">
            {/* identical to the shared template's "materials-codes" section */}
          </section>

          <section id="fabrication-qa" aria-labelledby="qa-heading">
            {/* identical to the shared template's "fabrication-qa" section */}
          </section>

          <section id="inspection-record" aria-labelledby="inspection-heading">
            <h2 id="inspection-heading" className="font-display text-h3 font-medium text-steel-950">
              Inspection record
            </h2>
            <div className="mt-6">
              <ApprovalsMatrix approvals={approvals} caption="Third-party inspection agencies" />
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {certifications.map((c) => (
                <CertificationCard
                  key={c.name}
                  name={c.name}
                  scopeStatement={c.scopeStatement}
                  issuer={c.issuer}
                  validFrom={c.validFrom}
                  {...(c.validTo ? { validTo: c.validTo } : {})}
                  {...(c.artifactUrl ? { artifactUrl: c.artifactUrl } : {})}
                />
              ))}
            </div>
          </section>

          <section id="faq" aria-labelledby="faq-heading">
            {/* identical to the shared template's "faq" section */}
          </section>
        </div>

        <div className="hidden lg:col-span-4 lg:block">
          <AnchorRailDesktop sections={GOLDEN_SECTIONS} />
          <SpecRailDesktop
            rows={railRows}
            primaryCta={{ label: 'Request a quote', href: rfqHref(rfqCompany, product.slug) }}
            secondaryCta={
              certifications[0]?.artifactUrl
                ? { label: 'Download datasheet', href: certifications[0].artifactUrl }
                : undefined
            }
          />
        </div>
      </div>

      <RFQBand company={rfqCompany} equipment={product.slug} whatsappHref={whatsappHref(entity)} />
      <MobileBottomBar phoneHref={phoneHref(entity)} whatsappHref={whatsappHref(entity)} rfqHref={rfqHref(rfqCompany)} />
    </main>
  )
}
```

The four `{/* identical to ... */}` placeholders above are **not** a real step — when
actually implementing this task, copy the exact JSX for those four sections verbatim
from the existing `productDetailPage`'s `Page()` function (types, materials-codes,
fabrication-qa, faq) with zero changes. They are omitted here only to avoid triple-
duplicating ~80 lines of already-shown JSX in this plan document; the implementer must
paste the real markup, not leave a comment in the shipped file.

Also: `AnchorRailDesktop` currently wraps itself in `<nav className="hidden lg:col-span-4 lg:block">` — since it's now nested inside this golden page's own `<div className="hidden lg:col-span-4 lg:block">` wrapper (needed so `SpecRailDesktop` shares the same grid column), that would double the `col-span-4`/`hidden lg:block` styling. Fix by NOT double-wrapping: keep `AnchorRailDesktop`'s own wrapper as the sole `lg:col-span-4` element, and put `SpecRailDesktop` as a sibling *inside* whatever `AnchorRailDesktop` renders, OR drop the outer wrapper shown above and place `AnchorRailDesktop` and `SpecRailDesktop` as two direct grid children each carrying `lg:col-span-4 hidden lg:block` (the second approach breaks the CSS-sticky-stacking behavior relied on above, since sticky-stacking requires a shared scroll ancestor at the same nesting depth — verify this empirically in the browser at Step 4 of Task 6, not by assumption). Resolve this concretely during implementation, not in this plan — call out whichever approach was used in the PR description since it's a real layout decision, not a mechanical copy.

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: zero errors

- [ ] **Step 4: Build and manually verify only pressure-vessels changed**

Run: `pnpm build`
Then: `pnpm --filter apps-web dev` and open
`http://localhost:3000/dhruv-epc/products/static-equipment/pressure-vessels/` — confirm
the rail, inspection-record section, and provenance marks render. Then spot-check at
least 3 other product routes under `/dhruv-epc/` and `/precise-engineers/` (e.g.
`heat-exchangers`, `storage-tanks`, a Precise product) and confirm they are pixel-
identical to Session 5 (no rail, no inspection-record section, unchanged section list).

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/product-detail-page.tsx
git commit -m "feat(dhruv-epc): golden-page layout for Pressure Vessels only — G2 (design/session-6-golden-page)"
```

---

### Task 6: Accessibility, responsive, and contrast verification (G4)

**Files:**
- None created — this task runs existing infra and fixes anything it finds.

- [ ] **Step 1: Route-level axe (T3)**

Run: `pnpm --filter apps-web exec playwright test e2e/a11y.spec.ts`
Expected: zero violations on the pressure-vessels route (it is not in
`KNOWN_FAILURES`, so it must pass clean — if it fails, fix the underlying markup, do
not add it to the skip list).

- [ ] **Step 2: Story-level axe (T5)**

Run: `pnpm --filter @vedanta/datum-ui test -- a11y.test.tsx`
Expected: zero violations — confirms the glob picked up `SpecRail.stories.tsx`
automatically (no manual step needed, verify by checking the test's console/output
lists `SpecRail` among the composed stories, or add a one-line `console.log` locally
during the run and remove it before committing).

- [ ] **Step 3: Token contrast (T6)**

Run: `pnpm --filter @vedanta/tokens test -- tokens.test.ts`
Expected: PASS. `signal-success on white` and `signal-warn on white` are **already**
asserted ≥4.5:1 in the existing "regression locks" describe block — SpecRail introduces
no new (text, surface) pair, since the provenance marks use these existing signal tokens
on the existing white/steel-50 rail surface. If a new pair *was* introduced during
implementation (e.g. a tinted background behind the marks), add a matching assertion
here before considering this step done — do not skip verification because "it's
probably fine."

- [ ] **Step 4: Manual viewport pass**

In a real browser (not devtools device emulation alone — use it for a first pass, verify
critical points with the real DPI/touch simulation if available), open the pressure-
vessels golden page and check:
- **360px**: `SpecRailMobile` renders above the grid (not sticky), `AnchorRailMobile`
  chip row scrolls horizontally, `MobileBottomBar` shows the RFQ button, and the rail's
  own CTA buttons are absent (mobile has no `SpecRailDesktop` CTA row — confirm no
  duplicate RFQ button is visible at any scroll position, satisfying the amber-law "one
  accent element" rule from `useRfqAnchorInView`).
- **768px**: still below `lg` (1024px) per the codebase's existing `lg:` breakpoint
  convention — rail should still show the mobile (non-sticky) treatment; confirm this
  matches `AnchorRailDesktop`'s own `hidden lg:block` threshold, since the golden page
  reuses that same breakpoint rather than inventing a new one (the spec gives no exact
  px value for the rail's own collapse point — this plan's decision to reuse `lg`,
  1024px, for consistency with `AnchorRailDesktop` should be called out in the PR as
  another inferred-and-flagged decision).
- **1440px**: `SpecRailDesktop` sticky, provenance marks visible with `✓`/`▲` icons and
  legible sourceNote footnotes, `AnchorRailDesktop` + `SpecRailDesktop` stack without
  visual overlap while scrolling past both.
- Tab through every interactive element (RFQ CTAs, secondary CTA, "View certificate"
  links, anchor-rail links) and confirm `:focus-visible` ring is present and never
  suppressed.
- Toggle OS-level `prefers-reduced-motion` and confirm the page is still fully
  functional (no motion-dependent affordance).
- Confirm exactly one accent-filled (RFQ) element is visible on screen at every scroll
  position and viewport width tested above.

- [ ] **Step 5: Full verify suite**

Run, in order, stopping at first failure:
```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
Expected: all four pass with zero errors/warnings. Do not proceed to Task 7 if any
step fails — diagnose and fix per CLAUDE.md's loop circuit breaker (3-attempt cap per
distinct failure; log to `docs/mistakes.md` and report as a named blocker if the cap is
hit).

- [ ] **Step 6: Commit any fixes found during this task**

```bash
git add -A
git commit -m "fix(golden-page): a11y/contrast/responsive fixes found during Session 6 verify pass"
```
(Only if Steps 1-4 found something to fix — if everything passed clean on the first
run, skip this commit, there is nothing to commit.)

---

### Task 7: Open the PR

- [ ] **Step 1: Push the branch**

```bash
git push -u origin design/session-6-golden-page
```

- [ ] **Step 2: Open the PR with `gh pr create`**

Title: `Session 6: Golden page — Pressure Vessels product-detail redesign (SpecRail + inspection record)`

Body must include, verbatim as sections:
- **What was built**: SpecRail (mobile+desktop), provenance marks on SpecTableRow,
  ApprovalsMatrix + CertificationCard wired into an "Inspection record" section — for
  Pressure Vessels only.
- **Spec deviations** (copy the "Deviations from the session brief" section of this
  plan verbatim — the four numbered points).
- **Inferred, not specced**: SpecRail's exact shape, the `lg`/1024px mobile-collapse
  breakpoint choice, the 6-row rail curation. State plainly these need design review
  before Session 7 replicates the pattern.
- **Content flagged as placeholder**: the 4 `specTable` rows still carrying `"DEMO
  figure — engineering data pending"` — Shell diameter, Max unit weight, Design
  pressure, Design temperature — now additionally marked `provenance: "unverified"` so
  the rail surfaces them visibly rather than silently.
- **Verify pass**: paste the pass/fail summary from Task 6 Step 5.
- Do not claim any check passed without having actually run it in this session.

---

## Self-Review Notes (for whoever executes this plan)

- Task 5's four `{/* identical to ... */}` placeholders are the one deliberate gap in
  this plan — by design, to avoid quadruplicating ~80 lines of unchanged JSX already
  shown once in the existing template. The implementer copies real markup from
  `product-detail-page.tsx`'s current `Page()` function verbatim. This is not a
  "TBD" — the source to copy from is named exactly.
- The `AnchorRailDesktop`/`SpecRailDesktop` double-wrapper question in Task 5 is flagged
  as needing an empirical browser check rather than resolved in-plan, because CSS sticky
  stacking behavior depends on exact DOM nesting that's faster to verify by looking at
  the rendered page than to reason about on paper — resolve it there, document the
  resolution in the PR.
