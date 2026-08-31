# VEDANTA GROUP DIGITAL PLATFORM
## Final Implementation Blueprint — v2

**Date:** 26 August 2026
**Author:** Swayam Singh
**Status:** For approval. No code written. Supersedes named sections of `docs/vedanta-group-platform-plan.md`; leaves the rest standing.
**Repository state verified:** `swayams13/Dhruv-EPC-Website-Redesign-`, HEAD as of this date — 30 static routes, 2 API routes, 3 workspace packages, 27 components, 0 dynamic segments, 0 project records.

---

## 0. HOW TO READ THIS DOCUMENT

The brief asks for thirty deliverables (§26) and simultaneously forbids duplicating documentation that already exists (§25). Both are correct instructions; they collide because `docs/vedanta-group-platform-plan.md` already is a PRD and a TRD, and its `FR-`, `P-`, `T-` identifiers are referenced from code comments and test files. A parallel document set would fork the source of truth.

This document therefore does one of three things with each of the thirty items.

| # | Blueprint item | Disposition |
|---|---|---|
| 1 | Final product vision | **REVISED HERE** — §1 |
| 2 | Business / entity architecture | **REPLACED HERE** — §2. Plan §1 is superseded: Industry, Capability and Resource are promoted to entities. |
| 3 | Final sitemap | **REPLACED HERE** — §3. Plan §3 is superseded. |
| 4 | Final navigation | **REPLACED HERE** — §4 |
| 5 | Final page inventory | **NEW HERE** — §5 |
| 6 | Final content model | **REPLACED HERE** — §6 + §7 |
| 7 | Final project model | **NEW HERE** — §8 |
| 8 | Final company model | Stands: Plan §1. Unchanged. |
| 9 | Product architecture | **EXTENDED HERE** — §9 (category tier added) |
| 10 | Industry architecture | **NEW HERE** — §10 |
| 11 | Capability architecture | **NEW HERE** — §11 |
| 12 | SEO strategy | **REPLACED HERE** — §12 (three-tier model) |
| 13 | Keyword / page strategy | **NEW HERE** — §12.3 |
| 14 | RFQ architecture | **EXTENDED HERE** — §13 (persistence layer) |
| 15 | Design direction | **REVISED HERE** — §14 |
| 16 | Design-system changes | **DELTA HERE** — §14.3. `docs/datum-design-system.md` (45 KB) stands. |
| 17 | Technical architecture | Stands: Plan T-1…T-5. Deltas in §15. |
| 18 | Repo KEEP/REFACTOR/REPLACE/REMOVE | **NEW HERE** — §16 (verified against HEAD today) |
| 19 | CMS / content strategy | **DECIDED HERE** — §7 |
| 20 | Migration strategy | **NEW HERE** — §17 |
| 21 | Analytics strategy | **NEW HERE** — §18 |
| 22 | Security strategy | Stands: Plan T-4. Three gaps listed §19. |
| 23 | Performance strategy | Stands: Plan P-4. Budget restated §19. |
| 24 | Testing strategy | **EXTENDED HERE** — §20 |
| 25 | Deployment strategy | Stands: `deployment-runbook.md` (v1.1 set, uncommitted). Commit it. |
| 26 | Content required from Vedanta | Stands: `content-requisition.md` (v1.1 set, uncommitted). P0 subset restated §22. |
| 27 | Implementation backlog | **SEPARATE FILE** — `02-development-backlog.md` |
| 28 | Priorities P0/P1/P2 | In backlog, per task |
| 29 | Dependencies | In backlog, per task |
| 30 | Definition of Done | **NEW HERE** — §23 |

**Housekeeping:** the six v1.1 documents produced last session (`prd-v1.1-launch-amendment.md`, `trd-v1.1-launch-amendment.md`, `audit-traceability-matrix.md`, `content-requisition.md`, `deployment-runbook.md`, `README-v1.1-document-set.md`) are **not in the repository**. They exist only as delivered files. Commit them to `docs/` before any further work, or this blueprint references documents the next engineer cannot open. That is task `VG-001`.

---

## 1. FINAL PRODUCT VISION

**What we are building:** the technical reference source for static process equipment and piping flexible elements manufactured in Gujarat — a site an EPC procurement manager or a TPIA inspector uses to answer a specific engineering question, and which converts that answer into an RFQ.

**What we are not building:** a group brochure. The current repository is an excellent thirty-page brochure. The gap between it and a platform is entirely content-driven, not code-driven.

**The single test, applied to every decision below:**

> Does a procurement manager, five minutes in, believe this company can make what they need — and can they prove it to their own technical authority without emailing us?

That test resolves most of the arguments in this document. It is why spec tables are schema-mandatory, why unattributed testimonials cannot render, why projects outrank aesthetics, and why we do not ship a filter UI over three records.

**Explicit correction to the brief's framing.** §1 says "do not preserve the current website design." Agreed — but note the repository is *already* a ground-up redesign under the Datum system; it does not resemble `vedantagroup.net` in any respect. The thing that needs rethinking is not the visual language. It is that the site has no Industries entry point, no project evidence, no dynamic content, and no way for anyone but a developer to change a number. Redesigning the visual layer again would be motion without progress.

---

## 2. FINAL ENTITY ARCHITECTURE

Relationship graph, not hierarchy. Ten entities; four are new.

| Entity | Status | Routable | Notes |
|---|---|---|---|
| `Company` | exists (`EntityRecord` + `CompanySlug`) | yes | `dhruv-epc`, `precise-engineers`, `group`. Dhruv Exports out of scope. |
| `ProductCategory` | **NEW** | yes | Tier between company and product. Fixes the flat 17-product list. |
| `Product` | exists | yes | Add `industrySlugs[]`, `capabilitySlugs[]`, `categorySlug`. |
| `Industry` | **NEW** | yes | Group-level. Cross-company by definition. |
| `Capability` | **NEW** | yes | Group-level, cites owning company/companies. |
| `Project` | exists (schema only) | **not yet routed** | Add `productSlugs[]`, `industrySlug`, `capabilitySlugs[]`, `location`. |
| `Certification` | exists | no (rendered on `/quality`) | Needs artifact + validity dates. |
| `Approval` | exists | no | EIL, IBR, ASME — trust architecture. |
| `Client` | exists | no | **Gated on written permission.** |
| `Resource` | **NEW** | yes | Brochures, datasheets, technical notes. Lead-capture surface. |

### 2.1 Relationship rules

- A `Product` belongs to exactly one `Company` and one `ProductCategory`; serves *many* `Industry`; consumes *many* `Capability`.
- A `Project` belongs to one `Company`, references *many* `Product`, exactly one primary `Industry`, *many* `Capability`.
- An `Industry` and a `Capability` belong to the **group**, never to a company. Both list the companies that serve them.
- Junctions are slug arrays on the child, resolved at build time. No junction tables. At this data volume a relational database for content is unjustified complexity.

### 2.2 The rule that makes internal linking automatic

Every entity page renders its inverse relationships. A `Capability` page lists the products that use it and the projects that prove it, without anyone hand-authoring a link. This is the mechanism that satisfies brief §15 — internal linking is a property of the content model, not an SEO chore performed at the end.

**Consequence to accept:** an entity with zero inverse relationships renders a visibly thin page. That is a feature. It tells us the content is missing before Google does.

---

## 3. FINAL URL ARCHITECTURE AND SITEMAP

### 3.1 Two corrections to current routes

1. **`/dhruv-epc/equipment/…` vs `/precise-engineers/products/…`** — the same entity under two nouns. Normalise both to `products`. `equipment` paths enter the redirect map.
2. **`/{company}/proof/`** — an invented noun with no search demand. Split into `/projects/` (group) and `/quality/` (group).

### 3.2 Final structure

```
/                                          Group home
/about/                                    Group story, history, leadership
/quality/                                  Certifications, approvals, QA regime
/facilities/                               Plants, bays, capacities, machine list
/contact/
/request-a-quote/
/request-a-quote/thank-you/
/privacy/                                  ← MISSING TODAY, linked from every footer
/terms/                                    ← MISSING TODAY, linked from every footer

/companies/                                Group structure explainer
/dhruv-epc/                                Company home
/dhruv-epc/company/
/dhruv-epc/capabilities/
/dhruv-epc/products/                       Category index
/dhruv-epc/products/[category]/            e.g. static-equipment
/dhruv-epc/products/[category]/[slug]/     e.g. …/static-equipment/pressure-vessels/
/precise-engineers/                        (same shape)

/industries/                               Index
/industries/[slug]/                        refining · petrochemical · fertiliser · power ·
                                           water-infrastructure · pharmaceutical  (only where evidence exists)

/capabilities/                             Index
/capabilities/[slug]/                      design-engineering · heavy-fabrication · welding ·
                                           heavy-machining · bellows-forming · heat-treatment ·
                                           surface-treatment · testing-inspection

/projects/                                 Index (+ facets, gated — see §8.3)
/projects/[slug]/

/resources/                                Index
/resources/[slug]/                         Brochures, datasheets, technical notes
```

### 3.3 Rules

- Trailing slash, always. Matches existing sitemap and redirect CSV.
- `[category]` in the product path is a deliberate cost: it creates a rankable mid-tier page and a breadcrumb rung. It also means every current product URL changes — 17 redirects, added to the CSV, shipped **before** the domain moves.
- Every route emits `BreadcrumbList` reflecting its true path depth.
- Canonical is self-referential everywhere. There are no parameterised duplicates because facets are path-based or `noindex`.

---

## 4. FINAL NAVIGATION

**Primary (desktop, 5 items):** Products · Industries · Capabilities · Projects · Company
**Persistent right:** Request a Quote (primary button) · phone number
**Utility bar:** the two company switchers — Dhruv EPC · Precise Engineers

Rationale: buyers search by *what they need* (product) or *where they work* (industry), not by which subsidiary makes it. Company selection is a disambiguation step, not the entry point. The current group home leads with companies; that is backwards for the primary persona and is the single biggest IA change in this document.

**Products mega-panel:** two columns by company, categories as headings, top products beneath, "All products →" foot.
**Mobile:** existing `MobileDrawer` + `MobileBottomBar` stand. Bottom bar keeps Call · WhatsApp · RFQ. This is correct for the Indian B2B context and should not be redesigned.

---

## 5. FINAL PAGE INVENTORY

| Template | Count at launch | Component status |
|---|---|---|
| Group home | 1 | Rebuild — see §14.2 |
| Group static (about, quality, facilities, contact, companies) | 5 | 2 exist, 3 new |
| Legal (privacy, terms) | 2 | **New, P0** |
| Company home | 2 | Exists |
| Company sub (company, capabilities) | 4 | Exists |
| Product category index | 2 | New |
| Product category | 5–6 | New |
| Product detail | 17 | Exists as static → convert to `[slug]` |
| Industry index + detail | 1 + 4–6 | **New** |
| Capability index + detail | 1 + 6–8 | **New** |
| Project index + detail | 1 + n | **New** |
| Resource index + detail | 1 + n | New |
| RFQ + thank-you | 2 | Exists |

**Launch total: ~55 routes** at n=10 projects, versus 30 today. Every one has a search or conversion purpose; none exists because a competitor has it.

---

## 6. CONTENT MODEL — SCHEMA DELTAS

Additive changes to `packages/schemas/src/cms.ts`. All existing validation gates stand.

```
Product        + categorySlug: string
               + industrySlugs: string[]        (min 1)
               + capabilitySlugs: string[]
               + standardsMatrix                (codes → design/fab/test)

Project        + productSlugs: string[]         (min 1)
               + industrySlug: string
               + capabilitySlugs: string[]
               + location: string
               + clientSlug?: string            (only if Client.permissionOnFile)
               + scope, challenge, solution, testing, inspection  (narrative, optional)
               + documents: {label, href, gated}[]

Industry       slug, name, oneLineScope, requirements, applications[],
               engineeringConsiderations, productSlugs[], capabilitySlugs[],
               companySlugs[], faqs (4–6)

Capability     slug, name, companySlugs[], equipmentList[], envelope (spec table),
               standards[], productSlugs[], faqs (4–6)

Resource       slug, title, type, fileHref, gated: boolean, relatedSlugs[]

ProductCategory slug, companySlug, name, oneLineScope, productSlugs[]
```

**New validation gates, in the spirit of the existing ones:**
- An `Industry` with fewer than two `productSlugs` **cannot ship**. Prevents the generic SEO industry page the brief forbids in §11.
- A `Project` with `clientSlug` set but `Client.permissionOnFile === false` **fails the build**. Makes the commercial risk a type error.
- A `Capability` without an `envelope` spec table **cannot ship**. Capability claims without figures are marketing.

---

## 7. CMS DECISION

**Decision: file-based structured content in the repository now. No CMS at launch. Sanity later, if and only if a named content owner exists.**

Three steps, in this order:

1. **Move content out of code.** `apps/web/lib/content/*.ts` (77 KB of hardcoded TypeScript) becomes `/content/{entity}/{slug}.json`, parsed and validated against the existing Zod schemas at build. This is the single largest architectural gap in the repo and it is fixed without adding a dependency.
2. **Dynamic routing.** `[slug]` + `generateStaticParams` over that content directory. Adding a project becomes adding a file, not writing a `.tsx`.
3. **CMS, conditionally.** Because Zod is the boundary, swapping the file loader for a Sanity client is one module. Nothing above it changes.

**Why not Sanity/Payload/Strapi now.** A CMS is not a content system; it is a content *workflow* system, and it only pays for itself when a non-developer edits regularly. Open question Q18 — who at Vedanta owns content post-launch, by name — is unanswered. If the answer is nobody, a CMS is a monthly bill for an empty dashboard, and hardcoded content is the honest architecture. Deferring costs nothing because step 1 does the real work; adopting early costs money, a security surface, and a migration we would perform twice.

**Trigger to revisit:** a named owner exists, **or** project records exceed ~40.

---

## 8. PROJECT SYSTEM

The highest-value and highest-risk part of the platform. Schema exists; routes, index and records do not.

### 8.1 Design for scale, populate with truth

Build the system to hold thousands. Ship it with the ten real records engineering can actually supply. Do not invent a single one — a fabricated project is the one defect that ends the client relationship, and an EPC buyer verifies.

### 8.2 Project detail template

Hero (title · company · industry · year) → metrics band (mono figures) → scope → engineering challenge → solution → manufacturing scope → testing & inspection (the TPIA section — schema-mandatory) → photography → documents → related product / industry / capability → RFQ.

### 8.3 Index and faceting — gated

| Records | Index behaviour |
|---|---|
| 1–9 | Do not ship `/projects/`. Render project evidence inline on product and industry pages only. |
| 10–19 | Ship `/projects/` as a chronological grid. **No filters.** |
| 20+ | Enable facets: industry, company, product category. Path-based (`/projects/industry/refining/`), indexable. |
| 100+ | Add client-side search; revisit pagination and `generateSitemaps()`. |

A filter UI over three cards signals a small company more effectively than having no filter at all. This gate is not caution; it is the brief's own §6 instruction.

### 8.4 Anonymisation path

The existing `anonymized` + `anonymizationLabel` fields are the mechanism that unblocks everything. Most PSU and EPC contracts forbid naming the client. "Refinery, Western India — 2024" is publishable, credible, and requires no permission. **This is why the ten-project target is achievable without a legal review cycle.** It should be the default posture, with named clients as the exception where written permission exists.

---

## 9. PRODUCT ARCHITECTURE

Category tier inserted. Existing `Product.group` enum becomes the category slug source:
`static-equipment` · `skids-packages` · `fabrication-machining` (Dhruv EPC) · `expansion-joints` · `flow-control` (Precise Engineers).

Product page order (extends the current template, does not replace it):
hero → overview → **applications → industries served** → spec table → types → materials → codes & standards matrix → **manufacturing capability** → **project evidence** → gallery → FAQ (4–6) → related products → RFQ.

Bold items are new. Everything else exists and works.

---

## 10. INDUSTRY ARCHITECTURE

Six candidates. Ship only those clearing the two-product gate and possessing genuine evidence:
refining · petrochemical · fertiliser & chemicals · power · water infrastructure · pharmaceutical.

Template: what the industry demands of equipment → applications → engineering considerations (corrosion regime, cyclic duty, code obligations) → Vedanta products serving it → capabilities → project evidence → FAQ → CTA.

**Water infrastructure deserves particular attention.** Surge protection — zero velocity valves, air cushion valves, bladder vessels — is the strongest technical content the group possesses, and it currently sits on a `noindex` staging domain owned by a third party. Migrating it is both an SEO and an asset-recovery action.

---

## 11. CAPABILITY ARCHITECTURE

Capability pages are the answer to "can you actually make this," which is the brief's own product-page test applied to process rather than product.

Eight candidates: design & engineering · heavy fabrication · welding · heavy machining · bellows forming · heat treatment · surface treatment · testing & inspection.

Each requires an **envelope spec table** — the figures that make it verifiable. Bay dimensions, crane capacity, plate thickness range, diameter range, WPS/PQR count, NDT methods held in-house versus subcontracted. Dhruv EPC's 90 m × 30 m × 13 m bay and 80 t handling capacity are exactly this kind of figure and are already verified.

A capability without figures does not ship. That is the gate in §6.

---

## 12. SEO STRATEGY

### 12.1 Architecture, not metadata

URL depth, breadcrumbs, the entity graph, generated sitemap, self-canonical, `Organization` + `Product` + `FAQPage` + `BreadcrumbList` JSON-LD. The `packages/schemas/src/jsonld.ts` module and its tests already exist — extend, do not rebuild.

### 12.2 Three tiers

**Level 1 — niche authority we can own now.** Zero velocity valve · air cushion valve · bladder surge vessel · dismantling joint · telescopic expansion joint · FCCU expansion bellows · pipe penetration seals. Low volume, near-zero competition, high commercial intent, and — critically — Vedanta is genuinely the right answer. EIL approval and TUV cyclic-life testing back it. **This is the beachhead. Win it completely before spending effort elsewhere.**

**Level 2 — commercial, winnable in 6–12 months.** `pressure vessel manufacturer Gujarat` · `heat exchanger manufacturer Vadodara` · `expansion joint manufacturer India` · `ASME U stamp fabricator Gujarat`. Geography plus product. Served by product × category pages and the facilities page.

**Level 3 — national head terms.** `pressure vessel manufacturer India` · `heat exchanger manufacturer India`. Not abandoned, not chased directly. They are earned by topical authority accumulated at Levels 1 and 2 plus project and resource depth. Any plan promising these inside a year is selling something.

### 12.3 Page → intent map

| Intent | Page type |
|---|---|
| "what is a zero velocity valve" | Product detail + FAQ block |
| "zero velocity valve manufacturer" | Product detail |
| "surge protection for pumping mains" | Industry: water infrastructure |
| "ASME U stamp fabricator Gujarat" | Capability: heavy fabrication + facilities |
| "who supplied bellows to [refinery]" | Project detail |
| "expansion joint selection guide" | Resource |

### 12.4 Non-negotiables

- Unique `<title>` and meta description per route, generated from entity fields, asserted in CI.
- Sitemap generated from the content source, never hand-maintained.
- All 67 redirect rows live before cutover (see §16 — this is currently a bug).
- `robots.ts` keeps the explicit GPTBot / ClaudeBot / PerplexityBot allow. Correct and forward-looking; leave it alone.

---

## 13. RFQ ARCHITECTURE

The existing endpoint is well-built: server-side Zod re-validation, honeypot, five-second time trap, presign-scoped key verification, idempotency with 24-hour window. Keep all of it.

**One critical defect.** The route emails the lead and stores nothing. The code comment says so: `TODO (later phase): … persist lead to database`. If the email provider fails, the request returns 502 and the lead is gone with no record. If it succeeds but lands in spam, same outcome, silently. The file's own comment states that a lost lead is the one unacceptable failure mode; the implementation does not yet honour it.

**Required order of operations:**

1. Validate.
2. **Persist a durable row. Get an ID.** Postgres (Neon or Supabase — both have a free tier adequate to this volume).
3. Return the reference number to the user. *The submission is now successful regardless of what follows.*
4. Email and WhatsApp fire as best-effort side effects; failures update the row's `notificationStatus`, they do not fail the request.

Row shape: reference, timestamp, company routed to, product context, industry context, contact fields, requirement text, uploaded keys, source page, UTM, status, notification status.

Move rate limiting and idempotency from the in-memory `Map` to the same store or to Vercel KV. The current implementation resets on every deploy and is incorrect above one instance — already flagged in your own code comment.

**Routing:** product context determines company; group-level enquiries route by product selection in the form, not by asking the user which subsidiary to contact. A buyer should never need to know the group structure to send an enquiry.

---

## 14. DESIGN DIRECTION

### 14.1 What stands

Datum stands. Three-tier tokens with per-company remaps, the photo law, the mono-figure rule, the stamp and datum-rule motifs, the motion budget. It is coherent, industrial, non-generic, and already group-ready. Redesigning it would be work without progress and would invalidate 27 built components and their Storybook stories.

### 14.2 What changes — the group home

The current home leads with company doors. That is the group's org chart, not the buyer's question. New order:

1. **Hero** — what the group manufactures, stated with a figure, not an adjective.
2. **Products by category** — the primary entry, both companies visible.
3. **Industries served** — the secondary entry.
4. **Proof band** — approvals (EIL, IBR, ASME U/U2), facility figures, project count. Mono figures only, no invented statistics.
5. **Selected projects** — three, real, linking to `/projects/`.
6. **The two companies** — demoted to here. Explains the structure once, clearly.
7. **RFQ.**

### 14.3 New components required

`CategoryCard` · `IndustryCard` · `CapabilityEnvelopeTable` · `ProjectFilterBar` (gated to 20+ records) · `ResourceCard` · `RelatedEntityStrip` (drives the automatic internal linking of §2.2) · `MegaPanel` (products navigation).

`ProjectCard` already exists, is axe-tested, and is used on zero pages. It gets used.

### 14.4 What we avoid

No glassmorphism, no gradient meshes, no hero-height empty space, no stock imagery, no statistics without a source. Photography is real shop floor or it is a technical drawing — never a stock photograph of a generic factory. If real photography does not exist, that is a content blocker to raise, not a problem to solve with a stock library.

---

## 15. TECHNICAL ARCHITECTURE — DELTAS ONLY

Stack stands: Next 14.2 App Router, React 18, TS 5.5, Tailwind 3.4, Zod 3.23, pnpm + Turborepo. Nine production dependencies. Genuinely lean; no justification to change.

Additions, each justified:
- **Postgres** (Neon/Supabase) — RFQ persistence. Non-negotiable per §13.
- **Vercel KV or Upstash** — rate limit + idempotency correctness.
- **Analytics** — see §18.
- **Playwright** — E2E on the RFQ path only.

Rejected: any CSS-in-JS runtime, any state library, any UI kit, any headless CMS at this stage.

---

## 16. REPOSITORY DISPOSITION

Verified against HEAD, today.

| Area | Verdict | Note |
|---|---|---|
| Monorepo + stack | **KEEP** | Correct separation. Tokens and schemas as independent packages is exactly right for a multi-company platform. |
| `packages/schemas` | **KEEP — best asset in the repo** | The validation gates are the design system made executable. Extend per §6. |
| `packages/tokens` | **KEEP** | Three-tier with per-company remaps. Group-ready. |
| `packages/datum-ui` (27 components, Storybook, `a11y.test.tsx`) | **KEEP + EXTEND** | Add §14.3 components. |
| `apps/web/lib/content/*.ts` (77 KB hardcoded) | **REPLACE** | → `/content/**.json` + build-time validation. Largest architectural gap. |
| Routing (30 static, 0 dynamic) | **REFACTOR** | `[slug]` + `generateStaticParams`. Blocks all content scale. |
| `middleware.ts` | **FIX — ACTIVE BUG** | Comment claims redirects are compiled from `redirect-map.csv`. They are not: **3 hardcoded, CSV holds 67 rows.** On cutover, 64 legacy URLs 404 and their link equity is lost. Confirmed at HEAD today. |
| `/privacy/`, `/terms/` | **BUILD NEW — P0** | `Footer.tsx` renders `privacyHref` and `termsHref` on every one of 30 routes. **Neither route exists.** A 404 reachable from every page the moment DNS moves. |
| `/api/rfq` | **KEEP core, REFACTOR persistence** | See §13. |
| Rate limit / idempotency (in-memory `Map`) | **REFACTOR** | Resets on deploy; wrong above one instance. |
| `sitemap.ts` (29 hardcoded URLs) | **REFACTOR** | Generate from content source. |
| `robots.ts` | **KEEP** | Explicit AI-crawler allow. Correct. |
| `/{company}/proof/` | **REPLACE** | → `/projects/` + `/quality/`. |
| `/dhruv-epc/equipment/*` | **REFACTOR** | → `/products/[category]/[slug]/` + 17 redirects. |
| Analytics | **BUILD NEW** | No package, no events. Currently unmeasurable. |
| `Readme.md` (1 byte) | **FIX** | Public repo carrying the client's brand. |
| `docs/` v1.1 set | **COMMIT** | Six documents exist outside version control. |
| Test coverage | **EXTEND** | Schema tests exist (`cms`, `rfq`, `jsonld`). No route, component, or E2E coverage. |
| `docs/progress.md` (72 KB) | **KEEP, do not extend** | Session log. Decisions belong in `decisions.md`. |

**Nothing in the REMOVE column except `proof/` routes and the hardcoded content modules.** The repository is disciplined work; the correct posture is evolution, not rewrite.

---

## 17. MIGRATION STRATEGY

1. Freeze the legacy URL inventory. The 67-row CSV is the artefact; verify it against Search Console and server logs before trusting it.
2. Compile **all** rows into middleware. CI asserts row count parity between CSV and compiled map. This is the check that would have caught the current bug.
3. Add the 17 product-path redirects from the `[category]` change.
4. Ship to a staging domain with `noindex`, crawl with Screaming Frog, assert zero internal 404s and zero redirect chains.
5. Cutover: DNS, remove `noindex`, submit sitemap, request indexing on the top 20 URLs.
6. Watch Search Console coverage and 404s daily for 14 days, weekly for 90.

**Do not migrate before `/privacy/` and `/terms/` exist.**

---

## 18. ANALYTICS STRATEGY

Events defined before the tool is chosen. Recommended: Vercel Analytics + GA4, or Plausible if a cookie banner is undesirable in EU-facing contexts.

Minimum event set: `rfq_start` · `rfq_submit` · `rfq_success` · `rfq_error` · `file_upload` · `phone_click` · `whatsapp_click` · `resource_download` · `spec_table_view` · `product_view` (with company, category, industry dimensions).

Every RFQ row carries source page and UTM, so attribution lives in the database and does not depend on the analytics vendor. That decision matters more than which vendor.

---

## 19. SECURITY, PERFORMANCE, ACCESSIBILITY

**Security gaps:** rate limiting is not durable (§13); uploaded files have no AV scan hook (the code's own TODO); no CSP is set. Existing extension-over-MIME validation for DWG/STEP is sound — keep it.

**Performance budget:** LCP < 2.0 s on 4G mobile, CLS < 0.1, INP < 200 ms, JS < 120 KB gzipped per route. Static generation everywhere; no client-side data fetching on content routes.

**Accessibility:** WCAG 2.1 AA. `a11y.test.tsx` exists at component level — extend axe assertions to route level in CI. Spec tables need proper `<th scope>`; gallery captions are not alt-text substitutes.

---

## 20. TESTING STRATEGY

| Layer | Today | Target |
|---|---|---|
| Schema | `cms.test.ts`, `rfq.test.ts`, `jsonld.test.ts` | Extend to new entities |
| Component | `a11y.test.tsx` | Add render tests for §14.3 components |
| Route | none | Metadata uniqueness, JSON-LD validity, breadcrumb correctness — all routes |
| Link integrity | none | **CI check: zero internal links to non-existent routes.** This is the defect class that produced the `/privacy/` bug. |
| Redirects | none | CSV row count == compiled map count |
| E2E | none | Playwright: RFQ happy path, upload path, failure path |

---

## 21. WHAT I CHANGED AFTER CRITIQUING THIS (brief §27)

I ran the blueprint against your own thirteen questions. Six things failed and are already corrected above.

1. **"Can it support thousands of projects?"** — The first draft shipped `/projects/` with filters on day one. With ten records that is a UI that advertises emptiness. Corrected: the record-count gate in §8.3. The *system* scales; the *interface* reveals itself progressively.
2. **"Can non-developers update content?"** — First draft recommended Sanity outright. But Q18 is unanswered, and a CMS without a named owner is a bill for an empty dashboard. Corrected: file-based content now, Zod as the swap boundary, CMS gated on a named owner or 40+ records.
3. **"Is anything unnecessarily complex?"** — Yes, twice. A junction-table content database (removed; slug arrays suffice at this volume) and global search (deferred past ~150 entities, as the original plan correctly had it).
4. **"Does it establish technical authority?"** — Capability pages in the first draft were prose. Prose is marketing. Corrected: the envelope spec table is now a schema-level ship gate (§11).
5. **"Can it rank?"** — The first draft chased Level 2 terms at launch. It cannot; domain authority is near zero and the competitors are established. Corrected: Level 1 is a beachhead to be won completely first (§12.2). Surge protection is genuinely ownable and Vedanta is genuinely the right answer for it.
6. **"Is it actually better than the existing site?"** — Only if it carries evidence. A beautifully designed site that cannot name a project it delivered loses to a plain HTML page that can. This is why §22 exists and why the project content is the critical path, not the code.

**The uncomfortable conclusion, stated plainly:** the blueprint was never the missing piece. Architecture is not what is blocking this project. Content is — specifically, whether ten real, publishable project records can be assembled. Everything in the backlog beyond milestone M1 is gated on that answer.

---

## 22. P0 CONTENT REQUIRED FROM VEDANTA

Full list in `content-requisition.md`. This is the launch-blocking subset.

| # | Item | Blocks |
|---|---|---|
| C-1 | **Ten real project records** — title, year, company, industry, location, scope, challenge, solution, testing/inspection, ≥1 photo. Anonymised is acceptable and preferred. | `/projects/`, all evidence sections, industry pages |
| C-2 | **Authoritative facts document, signed off** — legal names, CIN/GST, addresses, incorporation year, leadership names and titles, contact routing | `EntityRecord`, about, contact, `Organization` schema |
| C-3 | **Certification artifacts with issue/expiry dates** | `/quality/`, trust architecture, every product page |
| C-4 | **Client name permissions, in writing** — of the 31 logos currently published, which are contractually permitted? | Client wall, named projects. Publishing an unlicensed logo is a commercial risk, not a design detail. |
| C-5 | **Testimonial attribution** — company, role, source document, for all seven | Testimonials. The schema refuses to render unattributed quotes, and that is the right call. |
| C-6 | **Real shop-floor and equipment photography** | Datum's photo law assumes it. Stock imagery breaks the premise. |
| C-7 | **Engineering sign-off on the surge protection specifications** currently on the ifox staging domain | The entire Level 1 SEO strategy |
| C-8 | **Capability envelope figures** — bay dimensions, crane capacities, thickness/diameter ranges, WPS/PQR counts, in-house vs subcontracted NDT | All capability pages |
| C-9 | **Privacy policy and terms copy** — or approval to adapt a standard template | Cutover |

---

## 23. DEFINITION OF DONE

A route is done when all of the following hold:

1. Content validates against its Zod schema; no `CONTENT REQUIRED` placeholder remains.
2. Unique title and meta description, asserted in CI.
3. Correct JSON-LD, validated by test.
4. Breadcrumb matches path depth.
5. Zero axe violations at route level.
6. Every internal link resolves to an existing route.
7. Present in the generated sitemap.
8. Meets the performance budget on throttled 4G.
9. Renders correctly at 360 px.
10. Every factual claim traces to a signed-off source. **No exceptions, and this one outranks the other nine.**

The platform is done when all of the above hold for every route, all 67 redirects are live, an RFQ persists to a database row before any email fires, and analytics records its first `rfq_success`.

---

## 24. P0 DECISIONS I NEED FROM YOU

These six change the backlog materially. Everything past M1 is estimated on assumed answers.

1. **Do project records exist in any structured form** — ERP, Excel, job cards, PO files, QA dossiers? Yes makes the project system two sessions. No makes it a content programme, and the roadmap changes completely.
2. **Anonymised projects — approved as the default posture?** If yes, C-1 stops being blocked on legal review and becomes an afternoon with an engineer.
3. **Who owns content after launch, by name?** Determines whether a CMS is ever built.
4. **Postgres provider** — Neon or Supabase? Either works; I need one to write the RFQ persistence task against.
5. **Domain strategy** — everything stays on `vedantagroup.net/{company}/`, or companies move to their own domains? Rewrites the entire redirect map.
6. **Is the ifox parallel build stopped?** If two teams are shipping to the same domain, the redirect map and cutover plan are both fiction.
