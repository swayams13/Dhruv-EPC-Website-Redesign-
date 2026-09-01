# Session 7 — Template Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Session 6 golden-page layout (SpecRail sidebar + Inspection
Record section) the default render for all 17 products across both
companies, replacing the `pressure-vessels`-only special case; add an
automated regression test that all 17 products render it with valid data;
build the (previously spec-gated, now unblocked) `IndustryCard` component;
confirm the sitemap/metadata-uniqueness tests still hold.

**Architecture:** `apps/web/lib/product-detail-page.tsx` currently forks on
`companySlug === 'dhruv-epc' && GOLDEN_PAGE_SLUGS.has(product.slug)` between
two near-duplicate render functions (`PressureVesselsGoldenPage` and `Page`).
This plan deletes the fork: `Page` becomes the golden layout, unconditionally,
for both companies. Rail-row selection moves from a hardcoded
`RAIL_PARAMS: Set<string>` (matched pressure-vessels' English param names
only) to a new `SpecTableRow.rail?: boolean` schema field set per-row in each
product's content JSON — this is what makes the rollout data-driven instead
of a second hardcoded list. Content curation (marking `rail` and `provenance`
on each of the 16 remaining products) is real per-product judgment work, not
mechanical rename — each product's content JSON already carries the signal
needed: any `specTable` row whose `note` reads "DEMO ... pending" was already
flagged as an unconfirmed placeholder by the original content migration, so
`provenance: 'unverified'` follows directly from the existing note text; a
row with no such note is `provenance: 'sourced'`.

**Tech Stack:** Next.js 14 App Router, Zod (`@vedanta/schemas`), Vitest,
Playwright + `@axe-core/playwright`, pnpm workspaces.

**Spec:** This session's brief (chat-provided, no separate spec file — the
brief itself is the spec; see also `docs/design-docs/Vedanta Component
Specs.html` §1b for IndustryCard and `packages/datum-ui/src/components/
SpecRail.tsx`'s header comment for SpecRail's inferred shape).

## Global Constraints

- No arbitrary Tailwind values — every class must resolve to an existing
  token (CLAUDE.md). This plan introduces no new visual treatment, only
  reuses existing SpecRail/AnchorRail/ApprovalsMatrix/CertificationCard
  markup, so no new tokens are needed.
- Never invent content. Every `rail`/`provenance` value assigned to a
  product's `specTable` row must be derivable from that product's own
  existing JSON (its `note` text, or the absence of a "DEMO...pending"-style
  note). Where a product's content genuinely doesn't support a needed field,
  leave it unmarked and list it in the PR description as Session 6 did.
- `IndustryCard` takes no `company` prop and never renders an accent color —
  hard rule from `Vedanta Component Specs.html` §03 ("both works serve the
  same sectors... this card takes no company accent on any page").
- One task per commit, conventional commit messages, branch
  `design/session-7-template-rollout` off `main`.
- Do not touch `packages/datum-ui/src/components/AnchorRail.tsx` or any file
  outside this plan's listed files — CLAUDE.md scope discipline.

---

## File Structure

- Modify `packages/schemas/src/cms.ts` — add `SpecTableRow.rail`.
- Modify `packages/schemas/src/cms.test.ts` — test the new field.
- Modify `apps/web/lib/product-detail-page.tsx` — delete the fork; golden
  layout becomes the only `Page()`.
- Modify `content/products/pressure-vessels.json` — add `rail: true` to the
  6 rows the old `RAIL_PARAMS` set selected (preserves current render
  exactly under the new selection mechanism).
- Modify all 16 other `content/products/*.json` files — add `rail`/
  `provenance` per product.
- Create `apps/web/e2e/golden-page-rollout.spec.ts` — Playwright test
  rendering all 17 product-detail routes, asserting SpecRail + Inspection
  Record appear with non-empty data.
- Create `packages/datum-ui/src/components/IndustryCard.tsx` and
  `IndustryCard.stories.tsx`.
- Modify `packages/datum-ui/src/index.ts` — barrel-export `IndustryCard`.
- Modify `docs/mistakes.md` — log any product where a field had to stay
  unmarked (per Global Constraints).

---

### Task 1: `SpecTableRow.rail` schema field

**Files:**
- Modify: `packages/schemas/src/cms.ts:33-44` (the `SpecTableRow` object)
- Test: `packages/schemas/src/cms.test.ts` (append near the existing
  `describe('SpecTableRow provenance (Session 6, golden page)', ...)` block
  at line 72)

**Interfaces:**
- Produces: `SpecTableRow.rail?: boolean` — every later task (2, and the 16
  content tasks) reads/writes this field.

- [ ] **Step 1: Write the failing test**

Add to `packages/schemas/src/cms.test.ts`, inside (or directly after) the
existing `describe('SpecTableRow provenance (Session 6, golden page)', ...)`
block:

```ts
describe('SpecTableRow rail flag (Session 7, template rollout)', () => {
  it('accepts an optional rail boolean, independent of provenance', () => {
    const row = SpecTableRow.parse({ param: 'x', value: 'y', rail: true })
    expect(row.rail).toBe(true)
  })

  it('defaults to undefined when omitted (no rail row implied)', () => {
    const row = SpecTableRow.parse({ param: 'x', value: 'y' })
    expect(row.rail).toBeUndefined()
  })

  it('rejects a non-boolean rail value', () => {
    expect(() => SpecTableRow.parse({ param: 'x', value: 'y', rail: 'yes' })).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @vedanta/schemas test -- cms.test.ts`
Expected: FAIL — `rail` is not a recognized key (Zod strips/ignores unknown
keys by default, so the first two assertions on `.rail` being `true`/
`undefined` may actually pass already since `.parse` won't throw on an
unknown key; the third assertion is the one guaranteed to fail, since
`.rail: 'yes'` — an unknown key — won't throw yet).

- [ ] **Step 3: Add the field**

In `packages/schemas/src/cms.ts`, inside `SpecTableRow` (after the existing
`provenance` line, i.e. after line 42's `provenance: z.enum(['sourced',
'unverified']).optional(),`):

```ts
  // Rail-row selection (Session 7, template rollout). true = this row is
  // one of the "key figures" shown in SpecRail's sidebar. Independent of
  // `provenance` — a row can be rail-worthy and either sourced or
  // unverified. Omit for products without a SpecRail yet.
  rail: z.boolean().optional(),
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @vedanta/schemas test -- cms.test.ts`
Expected: PASS, all three new assertions plus every pre-existing test in the
file.

- [ ] **Step 5: Commit**

```bash
git add packages/schemas/src/cms.ts packages/schemas/src/cms.test.ts
git commit -m "feat(schemas): add SpecTableRow.rail — Session 7 golden-page rollout"
```

---

### Task 2: Generalize `product-detail-page.tsx` — delete the fork

**Files:**
- Modify: `apps/web/lib/product-detail-page.tsx` (full file, see Discover
  notes below — the two render functions `PressureVesselsGoldenPage` at
  lines 93-312 and `Page` at lines 317-494 merge into one)
- Test: no new test file for this task — Task 8's Playwright spec is the
  regression check; this task's own manual verification step covers it.

**Interfaces:**
- Consumes: `SpecTableRow.rail` (Task 1).
- Produces: `productDetailPage(companySlug)` still returns
  `{ generateStaticParams, generateMetadata, Page }` — unchanged signature,
  consumed by `apps/web/app/dhruv-epc/products/[category]/[slug]/page.tsx`
  and the `precise-engineers` equivalent (both untouched, they just
  re-export).

**Discover first:** Read the current file in full — it's reproduced in this
plan's research notes but re-read it live before editing, since this is the
highest-blast-radius file in the session.

- [ ] **Step 1: Delete the gate and rename**

Remove lines 49-53 entirely (the `GOLDEN_PAGE_SLUGS` comment + `const
GOLDEN_PAGE_SLUGS = new Set(['pressure-vessels'])`).

Remove the plain `SECTIONS` constant (lines 41-47) — no longer used, every
product now renders `GOLDEN_SECTIONS`. Rename `GOLDEN_SECTIONS` (lines
55-62) to `SECTIONS` (keep its 6-entry content, including
`inspection-record`, unchanged).

- [ ] **Step 2: Replace `RAIL_PARAMS` string-matching with the `rail` flag**

Delete lines 64-74 (the `RAIL_PARAMS` comment + `const RAIL_PARAMS = new
Set([...])`).

In the merged render function (see Step 3), the line that was:

```ts
const railRows = product.specTable.filter((r) => RAIL_PARAMS.has(r.param))
```

becomes:

```ts
const railRows = product.specTable.filter((r) => r.rail === true)
```

- [ ] **Step 3: Merge `PressureVesselsGoldenPage` into `Page`**

`PressureVesselsGoldenPage` (old lines 93-312) becomes the *only* body of
`Page` (old lines 317-494). Concretely:

1. Delete the entire old `Page` function body (old lines 317-494) except its
   signature line and the `product`/`entity`/`category`/`rfqCompany`/`page`
   local-variable setup (old lines 317-324).
2. Rename `PressureVesselsGoldenPage` to nothing separate — inline its body
   (old lines 104-311, i.e. everything from `const page = product.page`
   through the closing `</main>`) as the new body of `Page`, replacing what
   Step 1 deleted.
3. Delete the old `if (companySlug === 'dhruv-epc' &&
   GOLDEN_PAGE_SLUGS.has(product.slug)) { return <PressureVesselsGoldenPage
   .../> }` block (old lines 326-336) — there is no branch left to gate.
4. `PressureVesselsGoldenPage`'s own parameter list (`product`, `entity`,
   `category`, `rfqCompany`) all already exist as `Page`'s locals — no prop
   plumbing needed, this is a straight body-swap.

The result: `productDetailPage(companySlug)` defines one `Page({ params })`
function, unconditionally rendering the (renamed) golden layout for every
`companySlug`, every product. `product-detail-page-data.ts` (the
`generateStaticParams`/`generateMetadata` source, untouched by this task)
already iterates every product for both companies — nothing there assumed
`dhruv-epc`-only.

- [ ] **Step 4: Update the header comment block**

Replace the module comment at lines 1-12 to remove the now-stale "Session 6
golden page, pressure-vessels only" framing — state plainly that this
factory renders every product through one layout as of Session 7. Keep the
VG-012 collapse-17-files history (still true and useful context).

- [ ] **Step 5: Typecheck and lint**

Run: `pnpm --filter web typecheck && pnpm --filter web lint`
Expected: zero errors. (`RAIL_PARAMS`/`GOLDEN_PAGE_SLUGS`/`SECTIONS`-the-old-
const/`PressureVesselsGoldenPage` must all be gone — an unused-import or
unused-const lint error means a leftover reference wasn't cleaned up.)

- [ ] **Step 6: Manual smoke check**

Run: `pnpm --filter web dev`, visit
`http://localhost:3000/dhruv-epc/products/static-equipment/heat-exchangers/`
and `http://localhost:3000/precise-engineers/products/expansion-joints/rubber-bellows/`.
Confirm both render the "Inspection record" section and a sidebar (it will
be empty/near-empty until Tasks 3-19 populate `rail` — that's expected at
this point, not a bug).

- [ ] **Step 7: Commit**

```bash
git add apps/web/lib/product-detail-page.tsx
git commit -m "feat(web): make golden-page layout the default for all 17 products, both companies — Session 7 T1"
```

---

### Task 3: Preserve pressure-vessels' current rail under the new mechanism

**Files:**
- Modify: `content/products/pressure-vessels.json`

**Interfaces:**
- Consumes: `SpecTableRow.rail` (Task 1), the new `r.rail === true` filter
  (Task 2).

Task 2 changed rail selection from name-matching (`RAIL_PARAMS`) to an
explicit flag. Without this task, pressure-vessels' rail would render empty
— a regression on the one page that's already been reviewed and approved.

- [ ] **Step 1: Add `"rail": true` to the 6 rows the old `RAIL_PARAMS` set selected**

In `content/products/pressure-vessels.json`, add `"rail": true` to exactly
these `specTable` rows (matching the old `RAIL_PARAMS` set verbatim — do not
add it to `"Design codes"` or `"Materials"`, which the old code deliberately
excluded as multi-value rows):

- `"Vessel types"` → add `"rail": true`
- `"Shell diameter"` → add `"rail": true`
- `"Max unit weight"` → add `"rail": true`
- `"Design pressure"` → add `"rail": true`
- `"Design temperature"` → add `"rail": true`
- `"Inspection"` → add `"rail": true`

Each becomes e.g.:

```json
    {
      "param": "Vessel types",
      "value": "Separators, reactors, distillation columns, accumulators, KO drums, surge vessels",
      "provenance": "sourced",
      "rail": true
    },
```

- [ ] **Step 2: Validate against the schema**

Run: `pnpm --filter web exec node -e "
const { Product } = require('@vedanta/schemas');
const data = require('./content/products/pressure-vessels.json');
Product.parse(data);
console.log('OK');
"`
(Adjust the require path/working directory to match how `content-loader.ts`
resolves `content/products/*.json` if this inline check doesn't resolve —
the goal is just: confirm `Product.parse` doesn't throw on the edited file
before moving on.)
Expected: prints `OK`, no Zod error.

- [ ] **Step 3: Manual visual re-check**

Run: `pnpm --filter web dev`, revisit
`http://localhost:3000/dhruv-epc/products/static-equipment/pressure-vessels/`.
Confirm the sidebar rail shows the same 6 rows, in the same order, with the
same provenance marks (2 sourced check-marks: Vessel types, Inspection; 4
unverified triangles: Shell diameter, Max unit weight, Design pressure,
Design temperature) as before this session's changes.

- [ ] **Step 4: Commit**

```bash
git add content/products/pressure-vessels.json
git commit -m "content(pressure-vessels): flag existing rail rows with rail:true — Session 7 T1 (no visual change)"
```

---

### Tasks 4-19: Populate `rail`/`provenance` for the 16 remaining products

**One task per product file.** Each is independent and can run as its own
subagent — same procedure, different file. List:

| Task | File | Company |
|---|---|---|
| 4 | `content/products/heat-exchangers.json` | dhruv-epc |
| 5 | `content/products/heavy-fabrication.json` | dhruv-epc |
| 6 | `content/products/heavy-machining.json` | dhruv-epc |
| 7 | `content/products/pipe-spools.json` | dhruv-epc |
| 8 | `content/products/plate-flanges.json` | dhruv-epc |
| 9 | `content/products/process-skids.json` | dhruv-epc |
| 10 | `content/products/storage-tanks.json` | dhruv-epc |
| 11 | `content/products/damper.json` | precise-engineers |
| 12 | `content/products/dismantling-joint.json` | precise-engineers |
| 13 | `content/products/dual-plate-check-valve.json` | precise-engineers |
| 14 | `content/products/fabric-bellows.json` | precise-engineers |
| 15 | `content/products/flange-adaptor.json` | precise-engineers |
| 16 | `content/products/metallic-bellows-expansion-joint.json` | precise-engineers |
| 17 | `content/products/rubber-bellows.json` | precise-engineers |
| 18 | `content/products/telescopic-expansion-joint.json` | precise-engineers |
| 19 | `content/products/zero-velocity-valve.json` | precise-engineers |

**Files (per task):**
- Modify: the one product JSON listed above for that task number.

**Interfaces:**
- Consumes: `SpecTableRow.rail`/`SpecTableRow.provenance` (Task 1).
- Produces: nothing consumed by later tasks directly, but Task 20's test
  asserts every product (all 17, including these 16) has at least one
  `rail: true` row and at least one `provenance`-marked row.

**Procedure (identical for every task in this group — read the target
product's own JSON before applying it, do not guess values from another
product):**

1. Open the product's `specTable` array. For **every** row, set
   `provenance` by this rule, taken directly from the row's own existing
   `note` text — do not invent or research a value:
   - If the row's `note` already reads like "DEMO figure — engineering data
     pending" / "DEMO — ... pending" (i.e., the original content migration
     already flagged it as an unconfirmed placeholder): set
     `"provenance": "unverified"`. Leave the `note` text exactly as it is —
     do not reword it.
   - If the row has no such note (its value is stated as fact — e.g. a
     design-code list, a materials list, a types list, an inspection-agency
     list): set `"provenance": "sourced"`.
   - If a row's status is genuinely ambiguous (a note exists but doesn't
     match the DEMO-pending pattern, and it's unclear whether the value is
     confirmed), leave `provenance` unset on that one row and add it to this
     task's list of placeholders in the final PR description — do not guess.
2. Select 4-6 rows to flag `"rail": true`, mirroring pressure-vessels'
   pattern (Task 3): prefer rows that carry a `unit` field (quantitative
   "key figures" — size/pressure/temperature/weight ranges), plus, if
   present, one categorical row naming the product's types/variants (the
   `"Types"`/`"Vessel types"`/similar row) and one row naming inspection
   agencies (a `"Inspection"` row, if the product has one). Do **not** flag
   a row whose value is a long multi-item list better read in the main spec
   table body (e.g. a `"Materials"` or `"Design codes"` row with 5+
   comma-separated items) — same exclusion pressure-vessels applied.
   If the product has fewer than 4 quantitative/categorical rows total,
   flag whatever qualifies (do not pad the rail with a multi-item list row
   just to hit a count).
3. Save the file. Confirm it's still valid JSON (no trailing commas) and
   still parses against `Product` (same inline check as Task 3 Step 2,
   pointed at this task's file).

- [ ] **Step 1: Read the product's current `specTable`** (already partially
  known for `heat-exchangers.json` and `rubber-bellows.json` from this
  plan's research — re-read live for the other 14, and re-confirm these two,
  before editing).

- [ ] **Step 2: Apply the procedure above** — edit the file's `specTable`
  array in place, adding `provenance` to every row and `rail` to the
  selected 4-6.

- [ ] **Step 3: Validate**

Run the same inline `Product.parse(...)` check as Task 3 Step 2, pointed at
this task's file. Expected: prints `OK`.

- [ ] **Step 4: Commit**

```bash
git add content/products/<this-task's-file>.json
git commit -m "content(<slug>): add SpecRail provenance/rail marks — Session 7 T1"
```

(Replace `<this-task's-file>`/`<slug>` with the actual file/slug for that
task.)

**After all 16 of Tasks 4-19 are done:** collect, in one place (the PR
description — Task 22 will assemble it), every row across every product
where Step 1's "genuinely ambiguous" case applied and `provenance` was left
unset, and every product where fewer than 4 rows qualified for `rail`. This
mirrors Session 6's own PR practice of listing every DEMO/placeholder mark
explicitly rather than burying it.

---

### Task 20: All-17-products rollout regression test (T2)

**Files:**
- Create: `apps/web/e2e/golden-page-rollout.spec.ts`

**Interfaces:**
- Consumes: `getProductsByCompany(companySlug)` from
  `apps/web/lib/content-loader.ts` (existing, signature confirmed:
  `(companySlug: CompanySlug) => Product[]`), `productHref(companySlug,
  categorySlug, slug)` from `apps/web/lib/product-urls.ts` (existing), the
  now-generalized golden layout from Task 2.

- [ ] **Step 1: Write the test**

```ts
import { expect, test } from '@playwright/test'
import { getProductsByCompany } from '../lib/content-loader'
import { productHref } from '../lib/product-urls'
import type { CompanySlug } from '@vedanta/schemas'

// Session 7 (T2): the golden-page layout (SpecRail sidebar + Inspection
// Record section) is now the default render for every product, both
// companies — this is the regression gate for that generalization. A
// product missing its rail/provenance content (Tasks 3-19) fails here
// instead of silently rendering an empty sidebar.
const COMPANIES: CompanySlug[] = ['dhruv-epc', 'precise-engineers']

const PRODUCTS = COMPANIES.flatMap((companySlug) =>
  getProductsByCompany(companySlug).map((product) => ({
    company: companySlug,
    slug: product.slug,
    href: productHref(companySlug, product.categorySlug, product.slug),
  })),
)

test('found all 17 products across both companies', () => {
  expect(PRODUCTS.length).toBe(17)
})

for (const { company, slug, href } of PRODUCTS) {
  test(`${company}/${slug}: golden-page rail and inspection record render with data`, async ({ page }) => {
    await page.goto(href)
    await page.waitForLoadState('networkidle')

    // SpecRail — desktop sidebar heading, present once per row group.
    await expect(page.getByText('Key figures').first()).toBeVisible()

    // At least one rail row actually has a value — not an empty <dl>.
    const railValues = page.locator('dd.font-mono')
    await expect(railValues.first()).toBeVisible()
    const firstValueText = await railValues.first().textContent()
    expect(firstValueText?.trim().length).toBeGreaterThan(0)

    // Inspection Record section is present (golden layout, every product).
    await expect(page.getByRole('heading', { name: 'Inspection record' })).toBeVisible()
  })
}
```

- [ ] **Step 2: Run it before Tasks 3-19 land** (optional sanity check if
  running this task early) — expect failures on products with no `rail`
  rows yet (empty `dd.font-mount` locator). If running this task after
  Tasks 3-19, skip straight to Step 3.

- [ ] **Step 3: Run the full suite**

Run: `pnpm --filter web build && pnpm --filter web exec playwright test golden-page-rollout`
Expected: PASS — 1 (count) + 17 (per-product) = 18 passing tests, zero
failures. A failure here means some product from Tasks 3-19 has zero `rail`
rows or an empty rail value — go back to that product's task and fix it, do
not weaken this test to pass around missing content.

- [ ] **Step 4: Commit**

```bash
git add apps/web/e2e/golden-page-rollout.spec.ts
git commit -m "test(e2e): assert golden-page rail + inspection record render on all 17 products — Session 7 T2"
```

---

### Task 21: Build `IndustryCard` (T3)

**Files:**
- Create: `packages/datum-ui/src/components/IndustryCard.tsx`
- Create: `packages/datum-ui/src/components/IndustryCard.stories.tsx`
- Modify: `packages/datum-ui/src/index.ts` (barrel export, alongside line 31's
  `CategoryCard` export)

**Interfaces:**
- Produces: `IndustryCard` component + `IndustryCardProps` type, exported
  from `@vedanta/datum-ui`. No other task in this plan consumes it — T3 is
  explicitly scoped to the component only, no Industry index/detail routes
  (per this session's brief and the user's approved scope decision).

**Spec (from `docs/design-docs/Vedanta Component Specs.html` §1b, already
extracted):**

```ts
export interface IndustryCardProps {
  name: string
  index: string          // "02" — editorial order, not a rank
  href: string
  servedBy: Array<'dhruv' | 'precise'>
  projectCount: number   // 0 renders the thin state; "0" is never printed
  onDark?: boolean
  compact?: boolean       // denser index+name-only, for footer sector list
  headingLevel?: 2 | 3 | 4
  className?: never
}
```

Hard rule (§03): **no `company` prop, no accent color, on any variant.**
Both works serve the same industries, so this card never takes the
`--accent` treatment CategoryCard/ProductCard use. Focus-visible ring is
`steel-950` explicitly (not `var(--accent-focus)`) — the one place this
component sets its own focus color, called out in the spec as deliberate.

States: default / hover / focus-visible / thin (×`onDark`), plus `compact`.

- [ ] **Step 1: Write the component**

```tsx
// IndustryCard — Vedanta Component Specs.html §1b. Unlike CategoryCard/
// ProductCard, this card takes no company accent on any page: both works
// serve the same industries, and an enquiry routes to whichever fabricates
// the item, so there is no accent to give either of them (§03). Focus ring
// is steel-950 explicitly rather than var(--accent-focus) — the one place
// this component overrides the shared focus color, per spec.

export interface IndustryCardProps {
  /** Sector name, verbatim from the published list */
  name: string
  /** Two-digit editorial index, e.g. "02" — order, not a rank */
  index: string
  href: string
  /** Which works serve the sector. Both names render identically. */
  servedBy: Array<'dhruv' | 'precise'>
  /** Projects linked to the sector. 0 renders the thin state; "0" is never printed. */
  projectCount: number
  /** Dark-ground variant */
  onDark?: boolean
  /** Denser index+name only, for the footer sector list */
  compact?: boolean
  headingLevel?: 2 | 3 | 4
  className?: never
}

const WORKS_LABEL: Record<'dhruv' | 'precise', string> = {
  dhruv: 'Dhruv EPC',
  precise: 'Precise Engineers',
}

function Heading({
  level = 3,
  className,
  children,
}: {
  level: 2 | 3 | 4
  className: string
  children: React.ReactNode
}): React.ReactElement {
  const Tag = (`h${level}` as const)
  return <Tag className={className}>{children}</Tag>
}

export function IndustryCard({
  name,
  index,
  href,
  servedBy,
  projectCount,
  onDark = false,
  compact = false,
  headingLevel = 3,
}: IndustryCardProps): React.ReactElement {
  const thin = projectCount === 0
  const servedByLabel = servedBy.map((w) => WORKS_LABEL[w]).join(' · ')
  const projectLabel = thin ? 'Coming soon' : `${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`
  // steel-950 focus ring on every ground — never var(--accent-focus) here (§03).
  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel-950'

  if (compact) {
    const surfaceText = onDark ? 'text-steel-50' : 'text-steel-950'
    const indexText = onDark ? 'text-steel-500' : 'text-steel-400'
    if (thin) {
      return (
        <div className={`flex items-baseline gap-3 opacity-60 ${onDark ? 'text-steel-500' : 'text-steel-400'}`}>
          <span aria-hidden className={`font-mono text-helper ${indexText}`}>{index}</span>
          <span className="text-sm">{name}</span>
        </div>
      )
    }
    return (
      <a
        href={href}
        className={`group flex items-baseline gap-3 rounded-sm ${focusRing} ${surfaceText}`}
      >
        <span aria-hidden className={`font-mono text-helper ${indexText}`}>{index}</span>
        <span className="text-sm underline-offset-4 group-hover:underline">{name}</span>
      </a>
    )
  }

  if (onDark) {
    if (thin) {
      return (
        <div className="block h-full rounded-sm border border-steel-800 bg-steel-900 p-6 opacity-60">
          <span aria-hidden className="font-mono text-helper text-steel-600">{index}</span>
          <Heading level={headingLevel} className="mt-2 font-display text-h3 font-semibold text-steel-400">
            {name}
          </Heading>
          <p className="mt-2 text-sm text-steel-600">{servedByLabel}</p>
          <p className="mt-4 font-mono text-helper text-steel-600">{projectLabel}</p>
        </div>
      )
    }
    return (
      <a
        href={href}
        className={`group block h-full rounded-sm border border-steel-800 bg-steel-900 p-6 transition-colors duration-fast ease-standard hover:border-steel-500 ${focusRing}`}
      >
        <span aria-hidden className="font-mono text-helper text-steel-500">{index}</span>
        <Heading level={headingLevel} className="mt-2 font-display text-h3 font-semibold text-steel-50">
          {name}
        </Heading>
        <p className="mt-2 text-sm text-steel-500">{servedByLabel}</p>
        <p className="mt-4 font-mono text-helper text-steel-400">{projectLabel}</p>
      </a>
    )
  }

  if (thin) {
    return (
      <div className="block h-full rounded-sm border border-steel-200 bg-steel-50 p-6 opacity-70">
        <span aria-hidden className="font-mono text-helper text-steel-400">{index}</span>
        <Heading level={headingLevel} className="mt-2 font-display text-h3 font-semibold text-steel-500">
          {name}
        </Heading>
        <p className="mt-2 text-sm text-steel-500">{servedByLabel}</p>
        <p className="mt-4 font-mono text-helper text-steel-500">{projectLabel}</p>
      </div>
    )
  }

  return (
    <a
      href={href}
      className={`group block h-full rounded-sm border border-steel-200 bg-white p-6 transition-colors duration-instant ease-standard hover:border-steel-950 ${focusRing}`}
    >
      <span aria-hidden className="font-mono text-helper text-steel-500">{index}</span>
      <Heading level={headingLevel} className="mt-2 font-display text-h3 font-semibold text-steel-950">
        {name}
      </Heading>
      <p className="mt-2 text-sm text-steel-600">{servedByLabel}</p>
      <p className="mt-4 font-mono text-helper text-steel-700">{projectLabel}</p>
    </a>
  )
}
```

- [ ] **Step 2: Write the stories**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { IndustryCard } from './IndustryCard'

const meta: Meta<typeof IndustryCard> = {
  title: 'Datum/IndustryCard',
  component: IndustryCard,
}
export default meta
type Story = StoryObj<typeof IndustryCard>

// No company decorator anywhere in this file — IndustryCard takes no
// company accent, so `withCompany(...)` (used by CategoryCard/ProductCard
// stories) does not apply here (§03).

export const Default: Story = {
  args: {
    name: 'Oil & Gas',
    index: '01',
    href: '/industries/oil-gas',
    servedBy: ['dhruv', 'precise'],
    projectCount: 12,
  },
}

export const SingleWorks: Story = {
  args: {
    name: 'Water Infrastructure',
    index: '05',
    href: '/industries/water-infrastructure',
    servedBy: ['precise'],
    projectCount: 4,
  },
}

export const OnDark: Story = {
  args: {
    name: 'Refining & Petrochemical',
    index: '02',
    href: '/industries/refining-petrochemical',
    servedBy: ['dhruv'],
    projectCount: 7,
    onDark: true,
  },
}

// Thin state — an industry with zero linked projects yet: muted,
// non-interactive, never a dead link to an empty index (same law as
// CategoryCard's thin state).
export const Thin: Story = {
  args: {
    name: 'Fertilizer & Chemicals',
    index: '03',
    href: '/industries/fertilizer-chemicals',
    servedBy: ['dhruv', 'precise'],
    projectCount: 0,
  },
}

export const ThinOnDark: Story = {
  args: {
    name: 'Fertilizer & Chemicals',
    index: '03',
    href: '/industries/fertilizer-chemicals',
    servedBy: ['dhruv', 'precise'],
    projectCount: 0,
    onDark: true,
  },
}

// Compact — denser index+name only, for the footer sector list.
export const Compact: Story = {
  args: {
    name: 'Power',
    index: '04',
    href: '/industries/power',
    servedBy: ['dhruv', 'precise'],
    projectCount: 9,
    compact: true,
  },
}

export const CompactOnDark: Story = {
  args: {
    name: 'Power',
    index: '04',
    href: '/industries/power',
    servedBy: ['dhruv', 'precise'],
    projectCount: 9,
    compact: true,
    onDark: true,
  },
}

export const CompactThin: Story = {
  args: {
    name: 'Marine',
    index: '06',
    href: '/industries/marine',
    servedBy: ['dhruv'],
    projectCount: 0,
    compact: true,
  },
}

// §16-equivalent grid: 3-up desktop / 2-up tablet / 1-up mobile.
export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <IndustryCard name="Oil & Gas" index="01" href="#oil-gas" servedBy={['dhruv', 'precise']} projectCount={12} />
      <IndustryCard
        name="Refining & Petrochemical"
        index="02"
        href="#refining-petrochemical"
        servedBy={['dhruv']}
        projectCount={7}
      />
      <IndustryCard
        name="Fertilizer & Chemicals"
        index="03"
        href="#fertilizer-chemicals"
        servedBy={['dhruv', 'precise']}
        projectCount={5}
      />
    </div>
  ),
}
```

- [ ] **Step 3: Barrel export**

In `packages/datum-ui/src/index.ts`, add a line adjacent to line 31's
`CategoryCard` export:

```ts
export { IndustryCard, type IndustryCardProps } from './components/IndustryCard'
```

- [ ] **Step 4: Confirm a11y auto-coverage**

`packages/datum-ui/src/a11y.test.tsx` globs every `./components/*.stories.tsx`
automatically (no explicit registration needed — confirmed in Discover).
Run: `pnpm --filter @vedanta/datum-ui test -- a11y.test.tsx`
Expected: PASS, including every new `IndustryCard.stories.tsx` export
(`Default`, `SingleWorks`, `OnDark`, `Thin`, `ThinOnDark`, `Compact`,
`CompactOnDark`, `CompactThin`, `Grid`) — 8 new story cases + `Grid`
composed of instances, zero axe violations.

- [ ] **Step 5: Typecheck and lint**

Run: `pnpm --filter @vedanta/datum-ui typecheck && pnpm --filter @vedanta/datum-ui lint`
Expected: zero errors — in particular, zero
`tailwindcss/no-arbitrary-value` violations (every class used above already
exists elsewhere in `CategoryCard.tsx`/`SpecRail.tsx`, no new tokens
introduced).

- [ ] **Step 6: Commit**

```bash
git add packages/datum-ui/src/components/IndustryCard.tsx packages/datum-ui/src/components/IndustryCard.stories.tsx packages/datum-ui/src/index.ts
git commit -m "feat(datum-ui): add IndustryCard — Session 7 T3, no Industry content records yet"
```

---

### Task 22: Sitemap/metadata regression check (T4) + PR write-up

**Files:**
- No new source files. Verifies `apps/web/app/sitemap.ts` and
  `apps/web/lib/metadata-uniqueness.test.ts` (both untouched by this plan)
  still pass after Tasks 2-19's content and template changes.

- [ ] **Step 1: Run the existing metadata-uniqueness test**

Run: `pnpm --filter web test -- metadata-uniqueness.test.ts`
Expected: PASS — all 5 assertions (`found every page route`, `every route
defines a title`, `no two routes share an identical title`, `no two routes
share an identical description`, `no title exceeds 60 characters`). This
test already iterates all 17 products via `productDetailPageData(company)
.generateStaticParams()`/`.generateMetadata()` (confirmed in Discover) —
Task 2 didn't touch `product-detail-page-data.ts`, so titles/descriptions
are unaffected by the render-layer generalization. A failure here would mean
Task 2 accidentally changed metadata generation, not just rendering — if
that happens, stop and diagnose before continuing (don't patch the test to
match a metadata regression).

- [ ] **Step 2: Confirm the sitemap still lists all 17 with no golden-page distinction**

Run: `pnpm --filter web test -- sitemap` (or the equivalent existing test
command for `apps/web/app/sitemap.ts`, if one exists as a `.test.ts` file —
confirm the exact filename during execution; if none exists, do a manual
check instead: `pnpm --filter web build && node -e "console.log(require('./​.next/server/app/sitemap.xml.body'))"`
or equivalent, and count 17 product `<url>` entries plus company/category
entries).
Expected: 17 product URLs present, none flagged or treated differently for
having/not having golden-page content — `sitemap.ts` was confirmed in
Discover to build from `getProductsByCompany` uniformly, with no
`GOLDEN_PAGE_SLUGS`-style filter, so this should already hold; this step is
a confirmation, not a code change.

- [ ] **Step 3: Full verify suite**

Run in order, per CLAUDE.md's Verify section, stopping on first failure:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

- [ ] **Step 4: Manual spot-check (per session brief)**

Using `pnpm --filter web dev`, at both 360px and 1440px viewport widths,
check 4-5 products across both companies (e.g.
`dhruv-epc/.../pressure-vessels`, `dhruv-epc/.../storage-tanks`,
`precise-engineers/.../rubber-bellows`,
`precise-engineers/.../zero-velocity-valve`): confirm the rail/provenance
pattern reads correctly with each company's accent, `:focus-visible` is
visible tabbing through the rail's CTA buttons, and no product is silently
missing a hero image or showing a broken/empty rail state.

- [ ] **Step 5: Assemble the PR description**

List every product where Tasks 4-19 left a row's `provenance` unset (the
"genuinely ambiguous" case from that task group's procedure) or where fewer
than 4 rows qualified for `rail` — pull this from each task's own commit
notes/PR-description contribution. Include the IndustryCard scope note from
this session's approved decision: *"IndustryCard is ready to use the moment
real Industry content records exist; building those records (copy, imagery,
which products map to which industry) is content work for the human, not a
follow-up code session."* State explicitly: SpecRail remains a design-review
item (per its own header comment) — this session replicated the pattern
sitewide with human sign-off on that specific tradeoff (recorded in this
plan's brainstorming/AskUserQuestion step), but the component itself has
still never had a formal spec sheet.

- [ ] **Step 6: Open the PR**

```bash
git push -u origin design/session-7-template-rollout
gh pr create --title "Session 7: template rollout — golden page for all 17 products, IndustryCard" --body "$(cat <<'EOF'
## Summary
- T1: generalized the Session 6 golden-page layout (SpecRail + Inspection
  Record) from pressure-vessels-only to the default render for all 17
  products, both companies. Rail-row selection moved from a hardcoded
  English-name list to a per-row `rail: boolean` schema field, set per
  product from that product's own existing content (no invented figures).
- T2: added `apps/web/e2e/golden-page-rollout.spec.ts` — renders all 17
  product routes and asserts SpecRail + Inspection Record appear with
  non-empty data; fails loudly on a missing rail instead of rendering empty.
- T3: built `IndustryCard` (packages/datum-ui) — the G-1/G-2 spec gate is
  resolved (brand-red token ramp landed at v1.2, 2026-08-27), so this
  builds against existing tokens. No company accent, per spec §03. No
  Industry index/detail routes — no real Industry content records exist yet
  (see note below).
- T4: confirmed sitemap.ts and metadata-uniqueness.test.ts still pass
  unchanged — both already iterate all 17 products uniformly.

## Known placeholders / follow-ups
[Task 22 Step 5's list goes here]

## Deferred by design (not a gap)
IndustryCard is ready to use the moment real Industry content records
exist. Building those records — copy, imagery, which products map to which
industry — is content work for Swayam, not a follow-up code session.

SpecRail (packages/datum-ui/src/components/SpecRail.tsx) is still flagged
in its own header as inferred/not formally specced. This session replicated
it to all 17 products with explicit human sign-off on that tradeoff, not
because the design-review gap closed.

## Test plan
- [x] pnpm typecheck
- [x] pnpm lint
- [x] pnpm test
- [x] pnpm build
- [x] apps/web/e2e/golden-page-rollout.spec.ts (18 cases)
- [x] Manual: 360px/1440px, 4-5 products both companies, focus-visible,
      accent-per-company, no broken rail
EOF
)"
```

---

## Task Order Note

Tasks 1-2 must run before Task 3, and Task 3 (or any of Tasks 4-19) must run
before Task 20 (the regression test needs real `rail` data to pass). Tasks
4-19 are mutually independent — safe to fan out across parallel subagents.
Task 21 (IndustryCard) is independent of everything else in this plan and
can run in parallel with Tasks 1-20. Task 22 must run last.
