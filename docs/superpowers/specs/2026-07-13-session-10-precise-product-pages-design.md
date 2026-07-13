# Session 10 — Precise Engineers: 8 remaining product pages

**Date:** 2026-07-13  
**Governing specs:** Datum §21, §16, §19, §12; plan §3.2, §6.2, Appendix A  
**Branch:** `phase-4-scaleout`  
**Template contract:** locked after Session 8 — no component or layout changes permitted

---

## Scope

Build the 8 remaining Precise Engineers product pages. Metallic Bellows is already built
(`/precise-engineers/products/metallic-bellows-expansion-joint`). All 8 follow the same
§21 template used for Dhruv's 7 equipment pages in Session 9.

### Pages to build

| # | Slug | Product name | Group |
|---|------|-------------|-------|
| 1 | `telescopic-expansion-joint` | Telescopic Expansion Joints | expansion-joints |
| 2 | `rubber-bellows` | Rubber Bellows | expansion-joints |
| 3 | `fabric-bellows` | Fabric Bellows | expansion-joints |
| 4 | `dismantling-joint` | Dismantling Joints | expansion-joints |
| 5 | `flange-adaptor` | Flange Adaptors | expansion-joints |
| 6 | `zero-velocity-valve` | Zero Velocity Valves | flow-control |
| 7 | `dual-plate-check-valve` | Dual Plate Check Valves | flow-control |
| 8 | `damper` | Dampers | flow-control |

---

## Per-page deliverables (× 8)

### 1. CMS record — `apps/web/lib/content/precise-engineers.ts`

Append one `Product.parse({…})` export per product. Rules:

- `companySlug`: `'precise-engineers'`
- `slug`: matches the URL slug above
- `oneLineScope`: must match `/\d/` (Zod enforcement) — use DN range, pressure class, or code edition
- `group`: `'expansion-joints'` or `'flow-control'`
- `specTable`: Appendix A fields per product (see below); all quantitative values DEMO-PLACEHOLDER
- `types`: 3–6 configuration entries with standard industry descriptions (not capability claims)
- `materials`: sourced from vedantagroup.net where available; otherwise industry-standard for each product family
- `codes`: relevant standards per Appendix A
- `faqs`: 4–5 Q&As per product
- `gallery: []`, `relatedProjectSlugs: []`

**Appendix A spec fields per product:**

| Product | Spec fields to seed |
|---------|-------------------|
| Telescopic EJ | DN range · traverse · pressure class · MOC · sealing system |
| Rubber Bellows | DN range · pressure/vacuum · temp · elastomer types · arch config · movements |
| Fabric Bellows | duct size range · temp · media · fabric layup options · frame MOC |
| Dismantling Joint | DN range · pressure rating · adjustment length · flange std · MOC |
| Flange Adaptor | DN range · pressure · MOC · flange standards |
| Zero Velocity Valve | DN range · pressure class · MOC · application (water hammer) · standards |
| Dual Plate Check Valve | DN range · pressure class (ASME 150–600) · MOC (body/plate/spring) · API 594 · end types |
| Damper | type (louver/butterfly/guillotine) · size range · temp · leakage class · actuation |

All DEMO-PLACEHOLDER rows carry `note: 'DEMO figure — engineering data pending'`.

### 2. Product page — `apps/web/app/precise-engineers/products/[slug]/page.tsx`

Exact §21 template. Sections in order:

1. JSON-LD scripts: `buildProduct` + `buildFAQPage` + `buildBreadcrumbList`
2. `<ProductHero>` — breadcrumbs, title, valueStatement, chips (≤3 mono), specHref, rfq to `/request-a-quote?company=precise`
3. 8+4 grid layout (lg:col-span-8 content + lg:col-span-4 sticky anchor rail)
4. `#specifications` — `<SpecTable>`
5. `#types` — type cards grid
6. `#materials-codes` — materials chips + codes chips
7. `#fabrication-qa` — 5-step `<ol>`, product-specific steps
8. `#faq` — native `<details>` FAQ (no height animation per §11)
9. `<RFQBand company="precise" />`
10. `<MobileBottomBar>` — phone/whatsapp/rfq from precise entity

Breadcrumbs: `Precise Engineers` → `Products` → `[Product Name]`  
BreadcrumbList URLs: `https://vedantagroup.net/precise-engineers` → `https://vedantagroup.net/precise-engineers#products` → `https://vedantagroup.net/precise-engineers/products/[slug]`

BASE constant: `const BASE = 'https://vedantagroup.net'` (matches sitemap host — Session 8 host-drift fix).

### 3. OG image — `apps/web/app/precise-engineers/products/[slug]/opengraph-image.tsx`

Same satori pattern as metallic-bellows OG image. Uses `flex` (not `arc`) accent rule — Precise is blue, not amber.

```ts
import { flex, steel } from '@vedanta/tokens'
// graphite background, steel-50 text, flex[500] rule bar
```

### 4. Sitemap — `apps/web/app/sitemap.ts`

Add 8 new entries under the Precise products block, same priority/changeFrequency as metallic-bellows.

---

## Constraints (from CLAUDE.md and Datum)

- No arbitrary Tailwind values — every class resolves to a named token
- Template contract locked — no changes to components, layouts, or shared files other than content + sitemap
- No sourced figures invented — vedantagroup.net is the source; unsourced quantitative = DEMO-PLACEHOLDER
- OG image uses `flex` accent (not `arc`) — Precise is flex-blue
- `oneLineScope` must contain a digit per CMS Zod schema
- Entity bleed: Dhruv content never appears in Precise routes and vice versa

---

## Deviations expected (carry-forward from Sessions 7–9)

1. All quantitative spec-table figures DEMO-PLACEHOLDER — same policy
2. Type cards lack section-view icons — no artwork exists
3. Gallery and related projects omitted — no real photography / no Phase 4 project records yet
4. Some product codes will lack edition years — pending engineering confirmation

---

## Gate (run in order, stop on first failure)

```bash
pnpm typecheck   # zero errors
pnpm lint        # zero errors, zero warnings (no arbitrary values)
pnpm test        # 133/133 (no new tests needed — schema validated at module load)
pnpm build       # zero errors, zero warnings; all 8 new routes ≤120 kB First Load JS
```
