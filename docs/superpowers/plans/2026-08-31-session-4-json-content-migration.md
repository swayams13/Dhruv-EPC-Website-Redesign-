# Session 4 — Content Migration (VG-011) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all CMS content (17 Products, 3 EntityRecords, 6 Certifications,
4 Approvals) out of `apps/web/lib/content/*.ts` into `/content/**/*.json`,
validated by the existing Zod schemas via a new `apps/web/lib/content-loader.ts`,
with zero visible change to any of the 33 files that currently import from the
old TS modules.

**Architecture:** One JSON file per record (named by slug), grouped into
`/content/{companies,products,productCategories,certifications,approvals}/`.
`content-loader.ts` walks each directory at module-load time, calls the
matching Zod schema's `.parse()` (fails the build on any invalid record,
mirroring the inline `.parse()` calls it replaces), and exports typed
accessor functions. Non-CMS page-decoration data that has no Zod schema
(stats bands, exploded-frame paths, mega-menu equipment/product lists,
phone/WhatsApp href helpers) is NOT JSON-ified — brief C2/C3 scope it to the
4 schema-backed record types only — it moves into `content-loader.ts` as
plain exported constants/functions, unchanged in value, so it can still be
deleted from the old TS files in C7.

**Tech Stack:** Next.js 14 App Router (Node.js server components — `fs`
reads at module load are fine, same as any RSC data file), Zod (existing
`@vedanta/schemas`), Vitest.

**Spec:** Session brief (this conversation) implementing VG-011 from
`design docs/02-development-backlog (1).md` lines 84-91. Referenced blueprint
doc `01-final-implementation-blueprint-v2.md` does not exist in this repo —
proceed from the brief + backlog + existing schema/content as source of truth.

## Global Constraints

- No arbitrary Tailwind values — not applicable, this session touches no
  markup/styling.
- No route, component, or design changes. Pages render byte-identical to
  today, only the data source moves.
- Every `DEMO-PLACEHOLDER` comment/value carries over unchanged — this
  session does not resolve a single placeholder.
- Branch `content/session-4-json-migration` off `main`. Never commit to
  `main` directly. Open for human review, not merged by the agent.
- Conventional commits, one per logical group (C1+C2 harness+loader, C3
  migration, C4 category derivation, C5 industry derivation as its own
  commit — needs Swayam's sign-off per the brief).
- `capabilitySlugs` on `Product` has **no minimum length** in
  `packages/schemas/src/cms.ts:72` (confirmed by reading the schema) — empty
  array is valid, do not fabricate capability assignments.
- `standardsMatrix` on `Product` (`cms.ts:73`) has no `.min()` either —
  `[]` is valid and used by every existing record today.

---

## Session facts gathered during discovery (do not re-derive)

**Existing content inventory** (`apps/web/lib/content/{dhruv-epc,precise-engineers,group}.ts`):
- 3 `EntityRecord`s: `dhruvEntity`, `preciseEntity`, `groupEntity`
- 8 Dhruv `Product`s: `heatExchangers`, `pressureVessels`, `storageTanks`, `processSkids`, `pipeSpools`, `heavyFabrication`, `heavyMachining`, `plateFlanges`
- 9 Precise `Product`s: `metallicBellows`, `telescopicExpansionJoint`, `rubberBellows`, `fabricBellows`, `dismantlingJoint`, `flangeAdaptor`, `zeroVelocityValve`, `dualPlateCheckValve`, `damper`
- 4 Dhruv `Certification`s (`dhruvCertifications`), 2 Precise (`preciseCertifications`) = 6 total
- 3 Dhruv `Approval`s (`dhruvApprovals`), 1 Precise (`preciseApprovals`) = 4 total
- Non-CMS data staying in `content-loader.ts` as plain exports (no schema exists for these): `dhruvStats`/`preciseStats`/`groupStats`, `dhruvExplodedFrames`/`preciseExplodedFrames`/`groupExplodedFrames` (type `ExplodedFrame` from `apps/web/components/ExplodedSequence`), `dhruvEquipment`, `preciseProducts` (mega-menu lists), and the phone/WhatsApp href helpers (`dhruvPhoneHref`, `dhruvWhatsappHref`, `precisePhoneHref`, `preciseWhatsappHref`).

**Every product already carries the Session-3 stopgap fields** (PR #15):
`categorySlug` = its existing `group` value, `industrySlugs: ['general']`,
`capabilitySlugs: []`, `standardsMatrix: []`. This session (C5) replaces the
`industrySlugs` stopgap with real derived values where the product's own
prose supports it; C4 derives real `ProductCategory` records (the
`categorySlug` values themselves are already correct — group === category).

**33 files import from the old content modules** — full list and their exact
import symbols captured in Task 7 below.

**Path resolution precedent**: `scripts/build-redirects.mjs` resolves
`content/redirect-map.csv` relative to its own file location
(`resolve(dirname(fileURLToPath(import.meta.url)), '..')`), not `process.cwd()`,
specifically because it must work regardless of invocation directory.
`content-loader.ts` is imported only by Node-executed RSC/layout files (never
edge middleware), and Next.js's server module `process.cwd()` is reliably the
`apps/web` directory in dev/build/start. Still, follow the same
location-relative pattern for robustness and consistency with the existing
convention: resolve `/content` relative to `content-loader.ts`'s own path via
`path.resolve(__dirname, '../../../content')` (in a `.ts` file compiled by
Next's Node runtime, `__dirname` is available — this is the same mechanism
Next.js itself uses internally). Verify this resolves correctly in Task 2's
test before relying on it elsewhere.

---

## Task 1: Snapshot harness (C1)

**Files:**
- Create: `apps/web/scripts/snapshot-routes.mjs`
- Create: `apps/web/__snapshots__/routes/` (fixture output directory, gitignored build artifact checked in as fixtures)
- Modify: `apps/web/package.json` (add `"snapshot": "node scripts/snapshot-routes.mjs"` script)

**Interfaces:**
- Produces: a `pnpm --filter @vedanta/web snapshot` command that runs
  `next build` then crawls the produced static HTML in `apps/web/.next/server/app/**/*.html`
  (App Router SSG output) for the 33 routes below, writing each route's HTML
  to `apps/web/__snapshots__/routes/<slug>.html`, and a companion
  `apps/web/scripts/compare-snapshots.mjs` that diffs a fresh run against the
  checked-in baseline.

**Tolerance (document explicitly, per the brief):** Compare the HTML with
whitespace between tags collapsed (`replace(/>\s+</g, '><')`) and any
`data-nextjs-*` / hydration-id attributes stripped (`replace(/\sdata-[a-z-]*hydrat[a-z-]*="[^"]*"/gi, '')`).
Beyond that, **any** difference — text content, attribute values, element
order, class names — is a failure. This is intentionally strict: the only
acceptable noise source is Next's own hydration bookkeeping, not content or
markup drift.

**Routes to snapshot** (the 33 files found importing from `lib/content/*`,
minus layouts which don't render standalone HTML — use the 30 page routes):
```
/
/about
/contact
/privacy
/terms
/dhruv-epc
/dhruv-epc/company
/dhruv-epc/proof
/dhruv-epc/capabilities
/dhruv-epc/equipment/heat-exchangers
/dhruv-epc/equipment/pressure-vessels
/dhruv-epc/equipment/storage-tanks
/dhruv-epc/equipment/process-skids
/dhruv-epc/equipment/pipe-spools
/dhruv-epc/equipment/heavy-fabrication
/dhruv-epc/equipment/heavy-machining
/dhruv-epc/equipment/plate-flanges
/precise-engineers
/precise-engineers/company
/precise-engineers/proof
/precise-engineers/capabilities
/precise-engineers/products/metallic-bellows-expansion-joint
/precise-engineers/products/telescopic-expansion-joint
/precise-engineers/products/rubber-bellows
/precise-engineers/products/fabric-bellows
/precise-engineers/products/dismantling-joint
/precise-engineers/products/flange-adaptor
/precise-engineers/products/zero-velocity-valve
/precise-engineers/products/dual-plate-check-valve
/precise-engineers/products/damper
```
(29 routes — the brief said "30"; this is the actual count of distinct page
routes touching migrated content. Note the discrepancy in the PR description
rather than padding the list.)

- [ ] **Step 1: Write the snapshot script**

```js
#!/usr/bin/env node
// apps/web/scripts/snapshot-routes.mjs
// Crawls .next/server/app output for the routes this session's content
// migration must not change. Run BEFORE migrating (baseline) and AFTER
// (compare) — see compare-snapshots.mjs.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = resolve(root, '__snapshots__/routes')

const ROUTES = [
  '/', '/about', '/contact', '/privacy', '/terms',
  '/dhruv-epc', '/dhruv-epc/company', '/dhruv-epc/proof', '/dhruv-epc/capabilities',
  '/dhruv-epc/equipment/heat-exchangers', '/dhruv-epc/equipment/pressure-vessels',
  '/dhruv-epc/equipment/storage-tanks', '/dhruv-epc/equipment/process-skids',
  '/dhruv-epc/equipment/pipe-spools', '/dhruv-epc/equipment/heavy-fabrication',
  '/dhruv-epc/equipment/heavy-machining', '/dhruv-epc/equipment/plate-flanges',
  '/precise-engineers', '/precise-engineers/company', '/precise-engineers/proof',
  '/precise-engineers/capabilities',
  '/precise-engineers/products/metallic-bellows-expansion-joint',
  '/precise-engineers/products/telescopic-expansion-joint',
  '/precise-engineers/products/rubber-bellows',
  '/precise-engineers/products/fabric-bellows',
  '/precise-engineers/products/dismantling-joint',
  '/precise-engineers/products/flange-adaptor',
  '/precise-engineers/products/zero-velocity-valve',
  '/precise-engineers/products/dual-plate-check-valve',
  '/precise-engineers/products/damper',
]

function routeToHtmlPath(route) {
  const seg = route === '/' ? 'index' : route.slice(1)
  return resolve(root, '.next/server/app', `${seg}.html`)
}

function slugify(route) {
  return route === '/' ? 'home' : route.slice(1).replace(/\//g, '__')
}

mkdirSync(OUT_DIR, { recursive: true })
let missing = 0
for (const route of ROUTES) {
  const src = routeToHtmlPath(route)
  if (!existsSync(src)) {
    console.error(`MISSING built HTML for ${route} (expected ${src})`)
    missing++
    continue
  }
  const html = readFileSync(src, 'utf8')
  writeFileSync(resolve(OUT_DIR, `${slugify(route)}.html`), html)
}
if (missing > 0) {
  console.error(`${missing}/${ROUTES.length} routes missing — run "next build" first`)
  process.exit(1)
}
console.log(`Snapshotted ${ROUTES.length} routes to ${OUT_DIR}`)
```

- [ ] **Step 2: Write the compare script**

```js
#!/usr/bin/env node
// apps/web/scripts/compare-snapshots.mjs
// Compares the CURRENT .next build output against the checked-in baseline
// in __snapshots__/routes/. Run snapshot-routes.mjs into a temp dir, diff
// against baseline with the documented tolerance (whitespace-between-tags +
// hydration-id attrs only), fail on anything else.
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASELINE_DIR = resolve(root, '__snapshots__/routes')
const TMP_DIR = resolve(root, '__snapshots__/.compare-tmp')

function normalize(html) {
  return html
    .replace(/>\s+</g, '><')
    .replace(/\sdata-[a-z-]*hydrat[a-z-]*="[^"]*"/gi, '')
    .trim()
}

execSync(`node ${resolve(root, 'scripts/snapshot-routes.mjs')}`, { stdio: 'inherit', env: { ...process.env } })
// snapshot-routes.mjs writes to __snapshots__/routes by default; for a real
// compare run it a second time after redirecting OUT_DIR — simplest: copy
// baseline aside first, run migration, run snapshot again into the same dir,
// diff against a git-stashed copy. In CI/local use: `git stash` the JSON
// migration, snapshot (baseline), `git stash pop`, snapshot again, diff.
// This script assumes __snapshots__/routes now holds the POST-migration
// output and compares it against `git show main:apps/web/__snapshots__/routes/<file>`.

let failures = 0
for (const file of readdirSync(BASELINE_DIR)) {
  if (!file.endsWith('.html')) continue
  const post = normalize(readFileSync(resolve(BASELINE_DIR, file), 'utf8'))
  let pre
  try {
    pre = normalize(execSync(`git show main:apps/web/__snapshots__/routes/${file}`, { encoding: 'utf8' }))
  } catch {
    console.error(`No baseline on main for ${file} — commit the baseline snapshot first`)
    failures++
    continue
  }
  if (pre !== post) {
    console.error(`DIFF: ${file}`)
    failures++
  }
}
if (failures > 0) {
  console.error(`${failures} route(s) changed beyond tolerance`)
  process.exit(1)
}
console.log('All routes byte-identical (within documented tolerance)')
```

- [ ] **Step 3: Add package.json scripts**

In `apps/web/package.json` `"scripts"`, add:
```json
"snapshot": "node scripts/snapshot-routes.mjs",
"snapshot:compare": "node scripts/compare-snapshots.mjs"
```

- [ ] **Step 4: Run baseline BEFORE any migration**

Run: `pnpm --filter @vedanta/web build && pnpm --filter @vedanta/web snapshot`
Expected: 29 files written to `apps/web/__snapshots__/routes/`, "Snapshotted 29 routes" printed.

- [ ] **Step 5: Commit the baseline**

```bash
git checkout -b content/session-4-json-migration
git add apps/web/scripts/snapshot-routes.mjs apps/web/scripts/compare-snapshots.mjs apps/web/package.json apps/web/__snapshots__/routes/
git commit -m "test(web): add pre-migration HTML snapshot harness for VG-011 (C1)"
```

---

## Task 2: Content directory structure + loader (C2)

**Files:**
- Create: `content/companies/dhruv-epc.json`, `content/companies/precise-engineers.json`, `content/companies/group.json`
- Create: `content/products/*.json` (17 files, one per slug — populated in Task 3)
- Create: `content/productCategories/*.json` (5 files — populated in Task 4)
- Create: `content/certifications/*.json` (6 files — populated in Task 3)
- Create: `content/approvals/*.json` (4 files — populated in Task 3)
- Create: `apps/web/lib/content-loader.ts`
- Create: `apps/web/lib/content-loader.test.ts`
- Create: `apps/web/lib/content-loader.test-fixtures/` (invalid fixture for the negative test)

**Interfaces:**
- Produces (consumed by Task 7's page swaps):
  ```ts
  export function getEntity(companySlug: CompanySlug): EntityRecord
  export function getProduct(companySlug: CompanySlug, slug: string): Product
  export function getProductsByCompany(companySlug: CompanySlug): Product[]
  export function getCertifications(companySlug: CompanySlug): Certification[]
  export function getApprovals(companySlug: CompanySlug): Approval[]
  export function getProductCategory(slug: string): ProductCategory
  export function getProductCategoriesByCompany(companySlug: CompanySlug): ProductCategory[]
  export function phoneHref(entity: EntityRecord): string
  export function whatsappHref(entity: EntityRecord): string
  // Non-CMS plain data, relocated unchanged from the old TS files:
  export const dhruvStats: { value: string; label: string; source?: string }[]
  export const preciseStats: typeof dhruvStats
  export const groupStats: typeof dhruvStats
  export const dhruvExplodedFrames: ExplodedFrame[]
  export const preciseExplodedFrames: ExplodedFrame[]
  export const groupExplodedFrames: ExplodedFrame[]
  export const dhruvEquipment: Record<string, { name: string; scope: string; href: string }[]>
  export const preciseProducts: typeof dhruvEquipment
  ```

Build against test fixtures first (this directory won't have real content
until Task 3 — write the loader against a controlled fixture dir so the test
suite doesn't depend on migration order).

- [ ] **Step 1: Write the failing loader test**

```ts
// apps/web/lib/content-loader.test.ts
import { describe, expect, it } from 'vitest'
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  getEntity, getProduct, getProductsByCompany, getCertifications,
  getApprovals, getProductCategory, phoneHref, whatsappHref,
} from './content-loader'

describe('content-loader', () => {
  it('parses every EntityRecord in content/companies and exposes it via getEntity', () => {
    const dhruv = getEntity('dhruv-epc')
    expect(dhruv.companySlug).toBe('dhruv-epc')
    expect(dhruv.legalName).toBe('Dhruv EPC Solutions Pvt. Ltd.')
  })

  it('parses every Product and exposes it via getProduct', () => {
    const product = getProduct('dhruv-epc', 'heat-exchangers')
    expect(product.slug).toBe('heat-exchangers')
    expect(product.oneLineScope).toMatch(/\d/)
  })

  it('getProductsByCompany returns only that company\'s products', () => {
    const products = getProductsByCompany('precise-engineers')
    expect(products.length).toBe(9)
    expect(products.every((p) => p.companySlug === 'precise-engineers')).toBe(true)
  })

  it('getCertifications / getApprovals filter by company and total the known counts', () => {
    expect(getCertifications('dhruv-epc').length).toBe(4)
    expect(getCertifications('precise-engineers').length).toBe(2)
    expect(getApprovals('dhruv-epc').length).toBe(3)
    expect(getApprovals('precise-engineers').length).toBe(1)
  })

  it('getProductCategory resolves a category by slug', () => {
    const cat = getProductCategory('static-equipment')
    expect(cat.companySlug).toBe('dhruv-epc')
  })

  it('phoneHref/whatsappHref derive tel:/wa.me hrefs from an EntityRecord', () => {
    const dhruv = getEntity('dhruv-epc')
    expect(phoneHref(dhruv)).toBe(`tel:${dhruv.phones[0]}`)
    expect(whatsappHref(dhruv)).toMatch(/^https:\/\/wa\.me\/\d+$/)
  })

  it('throws (fails the build) on an invalid record in content/', () => {
    // Write a deliberately invalid Product fixture (oneLineScope has no digit),
    // re-import the loader module fresh, and assert it throws.
    const badPath = resolve(__dirname, '../../../content/products/__invalid-test-fixture.json')
    writeFileSync(badPath, JSON.stringify({
      companySlug: 'dhruv-epc', slug: 'invalid-test-fixture', name: 'Bad',
      oneLineScope: 'no digits here', group: 'static-equipment',
      specTable: [{ param: 'x', value: 'y' }], types: [], materials: [], codes: [],
      faqs: [], gallery: [], relatedProjectSlugs: [], categorySlug: 'static-equipment',
      industrySlugs: ['general'], capabilitySlugs: [], standardsMatrix: [],
    }))
    try {
      expect(() => {
        // Vitest resetModules + dynamic re-require to force the loader to
        // re-read the directory including the new bad fixture.
        delete require.cache[require.resolve('./content-loader')]
        require('./content-loader')
      }).toThrow()
    } finally {
      rmSync(badPath)
      delete require.cache[require.resolve('./content-loader')]
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @vedanta/web test content-loader -- --run`
Expected: FAIL — `content-loader` module not found.

- [ ] **Step 3: Write the loader**

```ts
// apps/web/lib/content-loader.ts
// Reads /content/**/*.json, validates every record against its Zod schema
// at module load, and fails the build on any invalid record — the same
// validation-as-law contract the old inline .parse() calls enforced
// (TRD §T-3). See packages/schemas/src/cms.ts for the schemas themselves.
import { readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import {
  EntityRecord, Product, Certification, Approval, ProductCategory,
  type CompanySlug,
} from '@vedanta/schemas'
import type { ExplodedFrame } from '../components/ExplodedSequence'

// apps/web/lib -> apps/web -> repo root -> content
const CONTENT_ROOT = resolve(__dirname, '..', '..', 'content')

function loadDir<T>(dirName: string, schema: { parse: (v: unknown) => T }): T[] {
  const dir = resolve(CONTENT_ROOT, dirName)
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const raw = JSON.parse(readFileSync(resolve(dir, f), 'utf8'))
      try {
        return schema.parse(raw)
      } catch (err) {
        throw new Error(`content/${dirName}/${f} failed schema validation: ${err instanceof Error ? err.message : String(err)}`)
      }
    })
}

const entities = loadDir('companies', EntityRecord)
const products = loadDir('products', Product)
const productCategories = loadDir('productCategories', ProductCategory)
const certifications = loadDir('certifications', Certification)
const approvals = loadDir('approvals', Approval)

export function getEntity(companySlug: CompanySlug): EntityRecord {
  const found = entities.find((e) => e.companySlug === companySlug)
  if (!found) throw new Error(`No EntityRecord for companySlug "${companySlug}"`)
  return found
}

export function getProduct(companySlug: CompanySlug, slug: string): Product {
  const found = products.find((p) => p.companySlug === companySlug && p.slug === slug)
  if (!found) throw new Error(`No Product for ${companySlug}/${slug}`)
  return found
}

export function getProductsByCompany(companySlug: CompanySlug): Product[] {
  return products.filter((p) => p.companySlug === companySlug)
}

export function getCertifications(companySlug: CompanySlug): Certification[] {
  return certifications.filter((c) => c.companySlug === companySlug)
}

export function getApprovals(companySlug: CompanySlug): Approval[] {
  return approvals.filter((a) => a.companySlug === companySlug)
}

export function getProductCategory(slug: string): ProductCategory {
  const found = productCategories.find((c) => c.slug === slug)
  if (!found) throw new Error(`No ProductCategory "${slug}"`)
  return found
}

export function getProductCategoriesByCompany(companySlug: CompanySlug): ProductCategory[] {
  return productCategories.filter((c) => c.companySlug === companySlug)
}

// Zod guarantees phones.min(1) — same derivation as the old per-company
// dhruvPhoneHref/precisePhoneHref helpers, now company-agnostic.
export function phoneHref(entity: EntityRecord): string {
  return `tel:${entity.phones[0] ?? ''}`
}

export function whatsappHref(entity: EntityRecord): string {
  const number = entity.whatsapp ?? entity.phones[0] ?? ''
  return `https://wa.me/${number.replace('+', '')}`
}

// ─── Non-CMS page-decoration data ───────────────────────────────────────
// No Zod schema exists for these (stats bands, exploded-hero frame paths,
// mega-menu lists) — VG-011 scopes the JSON migration to the four
// schema-backed record types above. These are relocated unchanged from the
// old lib/content/{dhruv-epc,precise-engineers,group}.ts files verbatim.

export const dhruvStats = [
  { value: '30+ yrs', label: 'Group experience', source: 'Est. 1994, Anand' },
  { value: 'U · U2 · IBR', label: 'Stamps held' },
  { value: '100 T', label: 'Max unit weight', source: 'DEMO figure — engineering data pending' },
  { value: '5 sectors', label: 'Oil & gas to steel' },
]

export const preciseStats = [
  { value: '30+ yrs', label: 'In expansion joints', source: 'Est. 1994, V.U.Nagar, Anand' },
  { value: '80 – 8,000 mm', label: 'Bellows size range', source: 'Circular NB; rectangular to 9,000 × 5,000 mm' },
  { value: 'EJMA · ASME', label: 'Design codes' },
  { value: '12 sectors', label: 'Oil & gas to atomic energy' },
]

export const groupStats = [
  { value: '30+ yrs', label: 'Group experience', source: 'Est. 1994, Anand' },
  { value: '2 works', label: 'Vadodara · Anand', source: 'Manjusar GIDC · V.U.Nagar GIDC' },
  { value: 'U · U2 · IBR', label: 'Stamps held' },
  { value: '12 sectors', label: 'Oil & gas to atomic energy' },
]

export const dhruvExplodedFrames: ExplodedFrame[] = [
  { avif: '/exploded/pressure-vessel/frame-01.avif', webp: '/exploded/pressure-vessel/frame-01.webp' },
  { avif: '/exploded/pressure-vessel/frame-02.avif', webp: '/exploded/pressure-vessel/frame-02.webp' },
  { avif: '/exploded/pressure-vessel/frame-03.avif', webp: '/exploded/pressure-vessel/frame-03.webp' },
]

export const preciseExplodedFrames: ExplodedFrame[] = [
  { avif: '/exploded/expansion-joint/frame-01.avif', webp: '/exploded/expansion-joint/frame-01.webp' },
  { avif: '/exploded/expansion-joint/frame-02.avif', webp: '/exploded/expansion-joint/frame-02.webp' },
]

export const groupExplodedFrames: ExplodedFrame[] = [
  { avif: '/exploded/heat-exchanger/frame-01.avif', webp: '/exploded/heat-exchanger/frame-01.webp' },
  { avif: '/exploded/heat-exchanger/frame-02.avif', webp: '/exploded/heat-exchanger/frame-02.webp' },
  { avif: '/exploded/heat-exchanger/frame-03.avif', webp: '/exploded/heat-exchanger/frame-03.webp' },
  { avif: '/exploded/heat-exchanger/frame-04.avif', webp: '/exploded/heat-exchanger/frame-04.webp' },
]

export const dhruvEquipment = {
  'static-equipment': [
    { name: 'Pressure Vessels', scope: 'Reactors, columns, drums to ASME Sec. VIII Div. 1 & 2', href: '/dhruv-epc/equipment/pressure-vessels' },
    { name: 'Heat Exchangers', scope: 'Shell & tube to ASME Sec. VIII Div. 1 & 2, TEMA', href: '/dhruv-epc/equipment/heat-exchangers' },
    { name: 'Storage Tanks & Air Receivers', scope: 'CS/SS storage to API 650 class duty', href: '/dhruv-epc/equipment/storage-tanks' },
  ],
  'skids-packages': [
    { name: 'Process Skids', scope: 'Skid-mounted process packages, FAT-tested', href: '/dhruv-epc/equipment/process-skids' },
    { name: 'Pipe Spools', scope: 'Shop-fabricated spools, CS/AS/SS, NDT-covered', href: '/dhruv-epc/equipment/pipe-spools' },
  ],
  'fabrication-machining': [
    { name: 'Heavy Fabrication', scope: 'Structural and equipment fabrication', href: '/dhruv-epc/equipment/heavy-fabrication' },
    { name: 'Heavy Machining', scope: 'Large-component machining services', href: '/dhruv-epc/equipment/heavy-machining' },
    { name: 'Plate Flanges & Base Frames', scope: 'Machined flanges and equipment base frames', href: '/dhruv-epc/equipment/plate-flanges' },
  ],
}

export const preciseProducts = {
  'expansion-joints': [
    { name: 'Metallic Bellows Expansion Joints', scope: 'EJMA/ASME B31.3, 80 – 8,000 mm NB circular', href: '/precise-engineers/products/metallic-bellows-expansion-joint' },
    { name: 'Telescopic Expansion Joints', scope: 'Slip-type joints for axial traverse', href: '/precise-engineers/products/telescopic-expansion-joint' },
    { name: 'Rubber Bellows', scope: 'Elastomeric joints for vibration and movement', href: '/precise-engineers/products/rubber-bellows' },
    { name: 'Fabric Bellows', scope: 'Fabric layup joints for hot flue-gas ducting', href: '/precise-engineers/products/fabric-bellows' },
    { name: 'Dismantling Joints', scope: 'Flanged joints with adjustment length for valve removal', href: '/precise-engineers/products/dismantling-joint' },
    { name: 'Flange Adaptors', scope: 'Pipe-to-flange transition couplings', href: '/precise-engineers/products/flange-adaptor' },
  ],
  'flow-control': [
    { name: 'Zero Velocity Valves', scope: 'Water-hammer protection for pumping mains', href: '/precise-engineers/products/zero-velocity-valve' },
    { name: 'Dual Plate Check Valves', scope: 'Compact non-return valves', href: '/precise-engineers/products/dual-plate-check-valve' },
    { name: 'Dampers', scope: 'Louver, butterfly and guillotine duct dampers', href: '/precise-engineers/products/damper' },
  ],
}
```

- [ ] **Step 4: Create empty content directories so the loader has something to read**

```bash
mkdir -p content/companies content/products content/productCategories content/certifications content/approvals
```
(Task 3/4 populate these with real JSON; the loader test in Step 1 needs at
least the real `dhruv-epc.json` company + `heat-exchangers.json` product to
pass — do Task 3's company + one product file now if the test suite must be
green before Task 3 finishes, otherwise mark this test pending and complete
it once Task 3 lands. Given the "never leave a skipped check" rule, the
simpler path is: do Task 2 and Task 3 in the same commit — write the loader
AND all the JSON together, run the test once, both land clean.)

- [ ] **Step 5: Run test to verify it passes (after Task 3's JSON exists)**

Run: `pnpm --filter @vedanta/web test content-loader -- --run`
Expected: PASS, 7/7.

- [ ] **Step 6: Commit** (combined with Task 3 — see Task 3 Step 6)

---

## Task 3: Migrate existing content to JSON exactly as-is (C3)

**Files:**
- Create: `content/companies/{dhruv-epc,precise-engineers,group}.json`
- Create: `content/products/{heat-exchangers,pressure-vessels,storage-tanks,process-skids,pipe-spools,heavy-fabrication,heavy-machining,plate-flanges}.json` (Dhruv, 8 files)
- Create: `content/products/{metallic-bellows-expansion-joint,telescopic-expansion-joint,rubber-bellows,fabric-bellows,dismantling-joint,flange-adaptor,zero-velocity-valve,dual-plate-check-valve,damper}.json` (Precise, 9 files)
- Create: `content/certifications/*.json` (6 files, one per certification — slug from a kebab-case of `name` + `companySlug` prefix, e.g. `dhruv-epc-asme-u.json`)
- Create: `content/approvals/*.json` (4 files, slug from `approvingOrg` + `companySlug`, e.g. `dhruv-epc-lrs.json`)

**Transform rule (mechanical — apply identically to every record):**
Take the object literal passed to `EntityRecord.parse({...})` / `Product.parse({...})` /
`Certification.parse({...})` / `Approval.parse({...})` in the source `.ts`
file (line ranges below) and write it as a standalone `.json` file —
unquoted object keys become quoted JSON keys, trailing commas removed,
single quotes become double quotes, inline `//` comments are DROPPED from
the JSON (JSON has no comments) but any comment carrying a `DEMO-PLACEHOLDER`
or `[source: ...]` marker that lives on the SAME LINE as a field must be
folded into that field's `note` sub-property if the schema has one
(`SpecTableRow.note` already carries most of these), or appended to the
nearest string field in parentheses if there is no `note` slot — do not
silently drop a sourcing/placeholder marker, that violates the brief's "no
single placeholder resolved or removed" rule. Every `specTable` row in the
source already puts its `DEMO-PLACEHOLDER`/`[source: ...]` marker in `note`
or inline in `value` — carry those through unchanged; no folding is actually
needed for the specTable rows themselves. For the top-of-file sourcing
comments (e.g. `// DEMO-PLACEHOLDER: WhatsApp number unconfirmed — using
primary phone` above `whatsapp: '+918905917700'`), there is no field to fold
into on `EntityRecord` — these become impossible to preserve in JSON's
comment-free format; document this exact list of dropped top-level comments
in the PR description as "sourcing commentary that lived outside any Zod
field and has no JSON home" (this is the one honest gap in "carry over every
field" — comments aren't fields).

Source line ranges (already read in full during discovery, reproduced here
for traceability):
- `dhruvEntity`: `apps/web/lib/content/dhruv-epc.ts:16-31`
- `heatExchangers`: `dhruv-epc.ts:38-116`
- `dhruvCertifications` (4 records): `dhruv-epc.ts:118-149`
- `dhruvApprovals` (3 records): `dhruv-epc.ts:151-157`
- `pressureVessels`: `dhruv-epc.ts:204-276`
- `storageTanks`: `dhruv-epc.ts:278-338`
- `processSkids`: `dhruv-epc.ts:340-401`
- `pipeSpools`: `dhruv-epc.ts:403-470`
- `heavyFabrication`: `dhruv-epc.ts:472-538`
- `heavyMachining`: `dhruv-epc.ts:540-599`
- `plateFlanges`: `dhruv-epc.ts:601-667`
- `preciseEntity`: `apps/web/lib/content/precise-engineers.ts:18-34`
- `metallicBellows`: `precise-engineers.ts:40-123`
- `preciseCertifications` (2 records): `precise-engineers.ts:125-142`
- `preciseApprovals` (1 record): `precise-engineers.ts:144-146`
- `telescopicExpansionJoint`: `precise-engineers.ts:168-219`
- `rubberBellows`: `precise-engineers.ts:221-273`
- `fabricBellows`: `precise-engineers.ts:275-327`
- `dismantlingJoint`: `precise-engineers.ts:329-379`
- `flangeAdaptor`: `precise-engineers.ts:381-431`
- `zeroVelocityValve`: `precise-engineers.ts:433-484`
- `dualPlateCheckValve`: `precise-engineers.ts:486-540`
- `damper`: `precise-engineers.ts:542-594`
- `groupEntity`: `apps/web/lib/content/group.ts:12-27`

Do NOT touch `categorySlug`/`industrySlugs`/`capabilitySlugs`/`standardsMatrix`
in this task — carry the Session-3 stopgap values (`industrySlugs: ['general']`,
etc.) through exactly as they are in the source. Task 5 replaces
`industrySlugs` afterward, as its own reviewable commit.

- [ ] **Step 1: Write each JSON file**

For each source object above, write the corresponding `content/<dir>/<slug>.json`.
Example for `content/companies/dhruv-epc.json` (from `dhruv-epc.ts:16-31`):
```json
{
  "companySlug": "dhruv-epc",
  "legalName": "Dhruv EPC Solutions Pvt. Ltd.",
  "worksAddresses": [
    { "label": "Works", "address": "Manjusar GIDC, Savli, Vadodara, Gujarat" }
  ],
  "registeredOffice": "705/18, Phase IV, GIDC Estate, Vitthal Udyognagar, Anand 388121, Gujarat, India",
  "phones": ["+918905917700", "+917436033300"],
  "emails": ["vedant@vedantagroup.net", "sales3@vedantagroup.net"],
  "stampsHeld": ["U", "U2", "IBR", "ISO-9001", "ISO-14001", "ISO-45001"],
  "whatsapp": "+918905917700",
  "contentRevisedDate": "2026-07-10"
}
```
Repeat this exact mechanical transform for all 3 companies, 17 products, 6
certifications, 4 approvals — 30 JSON files total. (This step is pure data
transcription from already-read source; no new decisions.)

- [ ] **Step 2: Run the loader test from Task 2 now that real content exists**

Run: `pnpm --filter @vedanta/web test content-loader -- --run`
Expected: PASS, 7/7 — including the count assertions (17 products split 8/9,
6 certifications split 4/2, 4 approvals split 3/1).

- [ ] **Step 3: Run schemas package tests to confirm no regression**

Run: `pnpm --filter @vedanta/schemas test`
Expected: PASS, unchanged from before this session (this task doesn't touch schemas).

- [ ] **Step 4: Commit (combines Task 2 + Task 3 — harness+loader+migration)**

```bash
git add content/ apps/web/lib/content-loader.ts apps/web/lib/content-loader.test.ts
git commit -m "feat(content): add content-loader + migrate 17 products/3 entities/6 certs/4 approvals to /content JSON (C2/C3, VG-011)"
```

---

## Task 4: categorySlug + ProductCategory records (C4)

**Files:**
- Create: `content/productCategories/{static-equipment,skids-packages,fabrication-machining}.json` (Dhruv, 3)
- Create: `content/productCategories/{expansion-joints,flow-control}.json` (Precise, 2)

**Mechanical mapping** (the `group` enum value IS the category slug — already
true in every migrated Product from Task 3, no product-side change needed
here):

| categorySlug | companySlug | productSlugs |
|---|---|---|
| `static-equipment` | `dhruv-epc` | `heat-exchangers`, `pressure-vessels`, `storage-tanks` |
| `skids-packages` | `dhruv-epc` | `process-skids`, `pipe-spools` |
| `fabrication-machining` | `dhruv-epc` | `heavy-fabrication`, `heavy-machining`, `plate-flanges` |
| `expansion-joints` | `precise-engineers` | `metallic-bellows-expansion-joint`, `telescopic-expansion-joint`, `rubber-bellows`, `fabric-bellows`, `dismantling-joint`, `flange-adaptor` |
| `flow-control` | `precise-engineers` | `zero-velocity-valve`, `dual-plate-check-valve`, `damper` |

`oneLineScope` must contain a digit (schema rule) — each one below reuses a
figure ALREADY present in that category's own product records (Task 3 JSON),
not a new invented number:

- [ ] **Step 1: Write the 5 ProductCategory JSON files**

`content/productCategories/static-equipment.json`:
```json
{
  "slug": "static-equipment",
  "companySlug": "dhruv-epc",
  "name": "Static Equipment",
  "oneLineScope": "Pressure vessels, heat exchangers and storage tanks to ASME Sec. VIII Div. 1 & 2, up to 400 T",
  "productSlugs": ["heat-exchangers", "pressure-vessels", "storage-tanks"]
}
```
(400 T sourced from `pressureVessels.specTable` "Max unit weight" row, `dhruv-epc.ts:222`.)

`content/productCategories/skids-packages.json`:
```json
{
  "slug": "skids-packages",
  "companySlug": "dhruv-epc",
  "name": "Skids & Packages",
  "oneLineScope": "Skid-mounted process packages and pipe spools to ASME B31.3, NPS ½ to NPS 48",
  "productSlugs": ["process-skids", "pipe-spools"]
}
```
(NPS ½ to NPS 48 sourced from `pipeSpools.specTable` "Size range" row, `precise... ` — actually `dhruv-epc.ts:418`.)

`content/productCategories/fabrication-machining.json`:
```json
{
  "slug": "fabrication-machining",
  "companySlug": "dhruv-epc",
  "name": "Fabrication & Machining",
  "oneLineScope": "Heavy fabrication, machining and plate flanges up to 200 T per unit",
  "productSlugs": ["heavy-fabrication", "heavy-machining", "plate-flanges"]
}
```
(200 T sourced from `heavyFabrication.specTable` "Max unit weight" row, `dhruv-epc.ts:489`.)

`content/productCategories/expansion-joints.json`:
```json
{
  "slug": "expansion-joints",
  "companySlug": "precise-engineers",
  "name": "Expansion Joints",
  "oneLineScope": "Metallic, rubber and fabric expansion joints, 25 – 9,000 mm NB",
  "productSlugs": ["metallic-bellows-expansion-joint", "telescopic-expansion-joint", "rubber-bellows", "fabric-bellows", "dismantling-joint", "flange-adaptor"]
}
```
(25 mm sourced from `rubberBellows.specTable` "Size range" min, `precise-engineers.ts:233`; 9,000 mm sourced from `metallicBellows.specTable` "Size range — rectangular" max, `precise-engineers.ts:57`.)

`content/productCategories/flow-control.json`:
```json
{
  "slug": "flow-control",
  "companySlug": "precise-engineers",
  "name": "Flow Control",
  "oneLineScope": "Zero velocity valves, check valves and dampers, 50 – 1,200 mm NB",
  "productSlugs": ["zero-velocity-valve", "dual-plate-check-valve", "damper"]
}
```
(50–1,200 mm sourced from `zeroVelocityValve.specTable` "Size range", `precise-engineers.ts:445`.)

- [ ] **Step 2: Add a loader test for category resolution**

Extend `content-loader.test.ts` (already has one `getProductCategory` test
from Task 2) with:
```ts
it('every product\'s categorySlug resolves to a real ProductCategory', () => {
  const allProducts = [...getProductsByCompany('dhruv-epc'), ...getProductsByCompany('precise-engineers')]
  for (const p of allProducts) {
    expect(() => getProductCategory(p.categorySlug)).not.toThrow()
  }
})
```

- [ ] **Step 3: Run test**

Run: `pnpm --filter @vedanta/web test content-loader -- --run`
Expected: PASS, 8/8.

- [ ] **Step 4: Commit**

```bash
git add content/productCategories/ apps/web/lib/content-loader.test.ts
git commit -m "feat(content): derive 5 ProductCategory records from existing Product.group taxonomy (C4, VG-011)"
```

---

## Task 5: industrySlugs derivation from sourced prose (C5)

**Files:**
- Modify: 11 of the 17 `content/products/*.json` files (the ones with a
  sourced sector sentence — listed below). The other 6 keep the Session-3
  stopgap `["general"]` unchanged, flagged as follow-up.

**This is the task requiring Swayam's sign-off** — every mapping below
quotes the exact source sentence from that product's own existing FAQ
prose (already migrated verbatim in Task 3) and maps only sectors literally
named in it to the six candidate slugs (`oil-gas`, `refining-petrochemical`,
`fertilizer-chemicals`, `power`, `water-infrastructure`, `pharmaceutical`).
Sectors named in the prose that don't match a candidate (steel, cement,
ship building, sugar, dairy, paper, atomic energy) are NOT force-mapped to
the nearest candidate and are NOT given a new invented slug — they're left
out, flagged below.

| Product | Source sentence (verbatim, already in repo) | Derived `industrySlugs` | Unmapped sectors named (flagged, not assigned) |
|---|---|---|---|
| `heat-exchangers` | "Oil & gas, refineries & petrochemicals, fertilizers, power & energy, and steel — from the Manjusar GIDC works..." | `["oil-gas", "refining-petrochemical", "fertilizer-chemicals", "power"]` | steel |
| `pressure-vessels` | "Oil & gas, refineries & petrochemicals, fertilizers, power & energy, and the steel industry..." | `["oil-gas", "refining-petrochemical", "fertilizer-chemicals", "power"]` | steel |
| `storage-tanks` | "Refineries & petrochemicals, fertilizers, water treatment, and the chemicals industry..." | `["refining-petrochemical", "fertilizer-chemicals", "water-infrastructure"]` | — |
| `process-skids` | "Oil & gas (upstream, midstream and downstream), refineries & petrochemicals, fertilizers, power and the chemicals industry..." | `["oil-gas", "refining-petrochemical", "fertilizer-chemicals", "power"]` | — |
| `pipe-spools` | *(no sector-list sentence exists anywhere in this product's content — FAQs cover codes, materials, NDT, size range, and offshore/cryogenic capability only)* | **unchanged `["general"]`** | n/a — flagged as a content gap, not a mapping decision |
| `heavy-fabrication` | *(no sector-list sentence — FAQs cover fabrication types, welding, coating, materials, integration)* | **unchanged `["general"]`** | n/a |
| `heavy-machining` | *(no sector-list sentence — FAQs cover machining capability, tolerances, alloys, flange finishes, integration)* | **unchanged `["general"]`** | n/a |
| `plate-flanges` | *(no sector-list sentence — FAQs cover standards, flange types, materials, spectacle blinds, base frames)* | **unchanged `["general"]`** | n/a |
| `metallic-bellows-expansion-joint` | "Oil & gas, refineries & petrochemicals, fertilizers, power & energy, steel, cement, ship building, cross-country pipelines, sugar, dairy, paper and the Department of Atomic Energy." | `["oil-gas", "refining-petrochemical", "fertilizer-chemicals", "power"]` | steel, cement, ship building, pipelines, sugar, dairy, paper, atomic energy |
| `telescopic-expansion-joint` | "...process plants in refining and petrochemical service are the primary applications." | `["refining-petrochemical"]` | steam distribution, district heating, hot-oil piping (applications, not named sectors) |
| `rubber-bellows` | "...pump stations, water treatment, power generation and process plant service." | `["water-infrastructure", "power"]` | — |
| `fabric-bellows` | "...power stations, cement plants, steel plants and refineries." | `["power", "refining-petrochemical"]` | cement, steel |
| `dismantling-joint` | "...water utilities, irrigation projects and pumping stations across India." *(note: this exact sentence is on zero-velocity-valve; dismantling-joint's own Q5 says "water utilities, pumping stations and process plant across India.")* | `["water-infrastructure"]` | — |
| `flange-adaptor` | *(no sector-list sentence — FAQs cover pipe materials, pressure, standards, seal grades)* | **unchanged `["general"]`** | n/a |
| `zero-velocity-valve` | "...water utilities, irrigation projects and pumping stations across India." | `["water-infrastructure"]` | — |
| `dual-plate-check-valve` | *(no sector-list sentence — FAQs cover advantages, pressure classes, standard, materials)* | **unchanged `["general"]`** | n/a |
| `damper` | "...gas and air ducting in power, cement, steel and process plant service." | `["power"]` | cement, steel |

- [ ] **Step 1: Edit the 11 JSON files' `industrySlugs` field**

For each row above with a derived array (not "unchanged"), open
`content/products/<slug>.json` and replace `"industrySlugs": ["general"]`
with the derived array from the table.

- [ ] **Step 2: Add a loader test asserting the schema-required minimum still holds**

```ts
it('every product keeps at least one industrySlug (schema min 1)', () => {
  const allProducts = [...getProductsByCompany('dhruv-epc'), ...getProductsByCompany('precise-engineers')]
  expect(allProducts.every((p) => p.industrySlugs.length >= 1)).toBe(true)
})
```

- [ ] **Step 3: Run test**

Run: `pnpm --filter @vedanta/web test content-loader -- --run`
Expected: PASS, 9/9.

- [ ] **Step 4: Commit as its own reviewable commit (per the brief — needs sign-off)**

```bash
git add content/products/
git commit -m "content(products): derive industrySlugs from each product's own sourced FAQ prose (C5, VG-011) — needs Swayam's sign-off, see PR description"
```

In the PR description, paste the full table from this task verbatim — it IS
the review artifact.

---

## Task 6: Confirm capabilitySlugs/standardsMatrix stay minimal (C6)

**Files:** none — this task is a verification, not a change (both fields are
already `[]` in every Task 3 JSON file and were never touched by Task 4/5).

- [ ] **Step 1: Re-read `packages/schemas/src/cms.ts:72-73` and confirm no `.min()`**

Already confirmed during discovery: `capabilitySlugs: z.array(z.string())` and
`standardsMatrix: z.array(StandardsMatrixEntry)` — neither has a length
constraint. No STOP condition triggered.

- [ ] **Step 2: Add one loader test locking this in (regression guard)**

```ts
it('capabilitySlugs/standardsMatrix stay empty — no capability content exists yet', () => {
  const allProducts = [...getProductsByCompany('dhruv-epc'), ...getProductsByCompany('precise-engineers')]
  expect(allProducts.every((p) => p.capabilitySlugs.length === 0)).toBe(true)
  expect(allProducts.every((p) => p.standardsMatrix.length === 0)).toBe(true)
})
```

- [ ] **Step 3: Run test, commit with Task 4's commit** (small enough to fold in — or standalone):

```bash
git add apps/web/lib/content-loader.test.ts
git commit -m "test(content): lock capabilitySlugs/standardsMatrix empty until capability content exists (C6, VG-011)"
```

Note in the PR: this is follow-up work gated on real capability envelope
figures, per the brief.

---

## Task 7: Swap page imports to the loader, delete old TS files (C7)

**Files:** all 33 files listed below, plus delete
`apps/web/lib/content/{dhruv-epc,precise-engineers,group}.ts` at the end.

**Transform pattern per file** — replace the old named-constant import with
loader calls, keeping every downstream usage identical (same variable names
in the JSX below the import, so the diff is import-only). General pattern:

```ts
// BEFORE
import { dhruvEntity, dhruvPhoneHref, dhruvWhatsappHref, heatExchangers } from '../../../../lib/content/dhruv-epc'

// AFTER
import { getEntity, getProduct, phoneHref, whatsappHref } from '../../../../lib/content-loader'
const dhruvEntity = getEntity('dhruv-epc')
const dhruvPhoneHref = phoneHref(dhruvEntity)
const dhruvWhatsappHref = whatsappHref(dhruvEntity)
const heatExchangers = getProduct('dhruv-epc', 'heat-exchangers')
```

This preserves every downstream identifier name used in the file's JSX —
zero markup changes, per the brief. Apply this pattern file-by-file:

**Dhruv product pages** (8 files, `apps/web/app/dhruv-epc/equipment/<slug>/page.tsx`) — each imports `dhruvEntity, dhruvPhoneHref, dhruvWhatsappHref, <productConst>`:
- [ ] `heat-exchangers/page.tsx` → `getProduct('dhruv-epc', 'heat-exchangers')` as `heatExchangers`
- [ ] `pressure-vessels/page.tsx` → `getProduct('dhruv-epc', 'pressure-vessels')` as `pressureVessels`
- [ ] `storage-tanks/page.tsx` → `getProduct('dhruv-epc', 'storage-tanks')` as `storageTanks`
- [ ] `process-skids/page.tsx` → `getProduct('dhruv-epc', 'process-skids')` as `processSkids`
- [ ] `pipe-spools/page.tsx` → `getProduct('dhruv-epc', 'pipe-spools')` as `pipeSpools`
- [ ] `heavy-fabrication/page.tsx` → `getProduct('dhruv-epc', 'heavy-fabrication')` as `heavyFabrication`
- [ ] `heavy-machining/page.tsx` → `getProduct('dhruv-epc', 'heavy-machining')` as `heavyMachining`
- [ ] `plate-flanges/page.tsx` → `getProduct('dhruv-epc', 'plate-flanges')` as `plateFlanges`

**Precise product pages** (9 files, `apps/web/app/precise-engineers/products/<slug>/page.tsx`) — each imports `preciseEntity, precisePhoneHref, preciseWhatsappHref, <productConst>`:
- [ ] `metallic-bellows-expansion-joint/page.tsx` → `getProduct('precise-engineers', 'metallic-bellows-expansion-joint')` as `metallicBellows`
- [ ] `telescopic-expansion-joint/page.tsx` → as `telescopicExpansionJoint`
- [ ] `rubber-bellows/page.tsx` → as `rubberBellows`
- [ ] `fabric-bellows/page.tsx` → as `fabricBellows`
- [ ] `dismantling-joint/page.tsx` → as `dismantlingJoint`
- [ ] `flange-adaptor/page.tsx` → as `flangeAdaptor`
- [ ] `zero-velocity-valve/page.tsx` → as `zeroVelocityValve`
- [ ] `dual-plate-check-valve/page.tsx` → as `dualPlateCheckValve`
- [ ] `damper/page.tsx` → as `damper`

**Dhruv other pages:**
- [ ] `apps/web/app/dhruv-epc/layout.tsx` — `dhruvEntity, dhruvWhatsappHref` → `getEntity('dhruv-epc')`, `whatsappHref(...)`
- [ ] `apps/web/app/dhruv-epc/page.tsx` — `dhruvCertifications, dhruvEntity, dhruvEquipment, dhruvStats, dhruvWhatsappHref` → `getCertifications('dhruv-epc')`, `getEntity('dhruv-epc')`, `dhruvEquipment` (import straight from content-loader, unchanged), `dhruvStats` (same), `whatsappHref(...)`
- [ ] `apps/web/app/dhruv-epc/proof/page.tsx` — `dhruvApprovals, dhruvCertifications, dhruvPhoneHref, dhruvWhatsappHref` → `getApprovals('dhruv-epc')`, `getCertifications('dhruv-epc')`, `phoneHref(entity)`, `whatsappHref(entity)` (fetch `entity = getEntity('dhruv-epc')` once)
- [ ] `apps/web/app/dhruv-epc/company/page.tsx` — `dhruvEntity, dhruvPhoneHref, dhruvStats, dhruvWhatsappHref` → as above pattern
- [ ] `apps/web/app/dhruv-epc/capabilities/page.tsx` — `dhruvPhoneHref, dhruvWhatsappHref, dhruvEquipment` → `entity = getEntity('dhruv-epc')`, `phoneHref/whatsappHref(entity)`, `dhruvEquipment` unchanged import
- [ ] `apps/web/components/dhruv/DhruvChrome.tsx` — `dhruvEquipment, dhruvPhoneHref, dhruvWhatsappHref` → same pattern

**Precise other pages:**
- [ ] `apps/web/app/precise-engineers/layout.tsx` — `preciseEntity, preciseWhatsappHref` → same pattern
- [ ] `apps/web/app/precise-engineers/page.tsx` — `preciseCertifications, preciseEntity, preciseProducts, preciseStats, preciseWhatsappHref` → same pattern
- [ ] `apps/web/app/precise-engineers/proof/page.tsx` — `preciseApprovals, preciseCertifications, precisePhoneHref, preciseWhatsappHref` → same pattern
- [ ] `apps/web/app/precise-engineers/company/page.tsx` — `preciseEntity, precisePhoneHref, preciseStats, preciseWhatsappHref` → same pattern
- [ ] `apps/web/app/precise-engineers/capabilities/page.tsx` — `preciseEntity, precisePhoneHref, preciseWhatsappHref, preciseProducts` → same pattern
- [ ] `apps/web/components/precise/PreciseChrome.tsx` — `precisePhoneHref, preciseProducts, preciseWhatsappHref` → same pattern

**Group pages:**
- [ ] `apps/web/app/(group)/layout.tsx` — `groupEntity` → `getEntity('group')`
- [ ] `apps/web/app/(group)/page.tsx` — `dhruvCertifications` (from dhruv-epc.ts), `groupEntity, groupStats` (from group.ts), `preciseCertifications` (from precise-engineers.ts) → `getCertifications('dhruv-epc')`, `getEntity('group')`, `groupStats` (unchanged import), `getCertifications('precise-engineers')` — all from `content-loader`
- [ ] `apps/web/app/(group)/contact/page.tsx` — `dhruvEntity, groupEntity, preciseEntity` → `getEntity('dhruv-epc')`, `getEntity('group')`, `getEntity('precise-engineers')`
- [ ] `apps/web/app/(group)/privacy/page.tsx` — `groupEntity` → `getEntity('group')`
- [ ] `apps/web/app/(group)/terms/page.tsx` — `groupEntity` → `getEntity('group')`
- [ ] `apps/web/app/(group)/about/page.tsx` — `groupStats` → import unchanged from `content-loader`
- [ ] `apps/web/components/group/GroupChrome.tsx` — `dhruvEquipment` (from dhruv-epc.ts), `preciseProducts` (from precise-engineers.ts) → both import unchanged from `content-loader`

- [ ] **Step 1: Apply the transform to all 33 files above**

For each file, change the import path from `../.../lib/content/{dhruv-epc,precise-engineers,group}` to `../.../lib/content-loader`, replace the named-constant imports with the loader-call pattern shown, and keep every other line untouched.

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: 4/4 packages, zero errors. Fix any import path or unused-variable errors before proceeding — do not move to Step 3 with red typecheck.

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: zero errors/warnings, same route count as before this session (29 relevant SSG routes + non-content routes unaffected).

- [ ] **Step 4: Delete the old content TS files**

```bash
git rm apps/web/lib/content/dhruv-epc.ts apps/web/lib/content/precise-engineers.ts apps/web/lib/content/group.ts
```

- [ ] **Step 5: Re-run typecheck + build to confirm nothing still references the deleted files**

Run: `pnpm typecheck && pnpm build`
Expected: zero errors — confirms zero content literals remain in `apps/web` outside `/content`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(web): swap all 33 pages/layouts/chrome components to content-loader, delete old lib/content/*.ts (C7, VG-011)"
```

---

## Task 8: Verify against the snapshot (C8)

**Files:** none new — runs Task 1's harness against the now-migrated build.

- [ ] **Step 1: Full verify sequence per CLAUDE.md**

Run in order, stop on first failure:
```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
Expected: all four green, matching or exceeding the pre-session baseline
(254+ tests per `docs/progress.md`'s last recorded count, plus this
session's new `content-loader.test.ts` cases).

- [ ] **Step 2: Snapshot compare**

```bash
pnpm --filter @vedanta/web snapshot
pnpm --filter @vedanta/web snapshot:compare
```
Expected: "All routes byte-identical (within documented tolerance)". Any
reported diff is a bug in Task 7's transform — go fix the specific page, not
the tolerance in `compare-snapshots.mjs`.

- [ ] **Step 3: Manual spot-check in a browser**

Start `pnpm --filter @vedanta/web dev`, open 3–4 routes that changed the most
surface area (`/dhruv-epc`, `/precise-engineers/products/metallic-bellows-expansion-joint`,
`/dhruv-epc/proof`, `/(group)` home) and visually confirm no change from
`docs/progress.md`'s documented rendering (spec tables, FAQs, stats bands,
certifications all present, same content).

- [ ] **Step 4: Log the session in `docs/progress.md`**

Append a "Session 21 — Content migration (VG-011)" entry following the
existing format (What was done / Gate result / What's NOT done), noting the
6 flagged `industrySlugs: ["general"]` products from Task 5 and the 29 vs
30 route-count discrepancy from Task 1.

- [ ] **Step 5: Push branch, open PR (human merge required — never merge to main directly)**

```bash
git push -u origin content/session-4-json-migration
gh pr create --title "content: migrate CMS content to /content JSON (VG-011, session 4)" --body "$(cat <<'EOF'
## Summary
- C1-C8 per session brief, VG-011 from design docs/02-development-backlog.
- Zero route/component/markup changes — content source only.
- **Needs your read, not just green CI:** Task 5's industrySlugs derivation
  (11 of 17 products got real values from their own sourced FAQ prose; 6
  kept the Session-3 `["general"]` stopgap because they have no sourced
  sector sentence at all — full table in the commit message / plan doc).

## Test plan
- [x] pnpm typecheck / lint / test / build all green
- [x] Snapshot harness: 29 pre-migration routes vs post-migration, byte-identical
- [x] Manual spot-check: 4 routes in a browser

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review notes (writing-plans skill step)

- **Spec coverage:** C1→Task1, C2→Task2, C3→Task3, C4→Task4, C5→Task5, C6→Task6, C7→Task7, C8→Task8. All 8 items covered.
- **Placeholder scan:** no "TBD"/"similar to Task N" — Task 3's JSON transform is described mechanically with exact source line ranges rather than pasting all 30 files' content (would 4x this document's length for zero added clarity — the transform rule is unambiguous and the source is already fully read into this session's context).
- **Type consistency:** `getEntity`/`getProduct`/`getProductsByCompany`/`getCertifications`/`getApprovals`/`getProductCategory`/`phoneHref`/`whatsappHref` signatures match between Task 2 (definition) and Task 7 (usage).
- **Known gap flagged, not hidden:** Task 1's route count is 29, not the brief's stated "30" — the actual page-route count found during discovery. Documented in the PR rather than padded.
