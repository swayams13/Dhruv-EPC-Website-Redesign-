# VEDANTA GROUP DIGITAL PLATFORM
## Development Backlog

**Companion to:** `01-final-implementation-blueprint-v2.md`
**Date:** 26 August 2026
**Repo:** `swayams13/Dhruv-EPC-Website-Redesign-`
**Format:** each task is directly executable by Claude Code or Cursor without further briefing.

**Priority key** — P0: blocks launch · P1: required for a strong launch · P2: post-launch.
**Content gate** — tasks marked ⛔ cannot start until the named content item in blueprint §22 is delivered.

---

# MILESTONE M0 — LAUNCH BLOCKERS
*Small, independent, all P0. None depends on any content decision. Start today.*

### VG-001 · Commit the v1.1 document set · P0
**Why:** six documents (`prd-v1.1-launch-amendment.md`, `trd-v1.1-launch-amendment.md`, `audit-traceability-matrix.md`, `content-requisition.md`, `deployment-runbook.md`, `README-v1.1-document-set.md`) exist as delivered files but are not in version control. This blueprint references them.
**Files:** `docs/`
**Depends on:** —
**Acceptance:** all six present in `docs/`, linked from `Readme.md`.
**Testing:** none. **SEO:** none. **Migration:** none.

---

### VG-002 · Fix the middleware redirect compilation · P0 · ACTIVE BUG · **DONE (9fa229f)**
**Verified 2026-08-27:** 57 rows compiled into `apps/web/lib/redirects.generated.ts` from `content/redirect-map.csv`, `apps/web/lib/redirects.test.ts` asserts parity. Session 0 (B5) additionally removed a second, conflicting redirect engine in `next.config.mjs` that was shadowing this one with 308s instead of 301s.
**Why:** `apps/web/middleware.ts` comments claim redirects are compiled from `content/redirect-map.csv` at build time. They are not — 3 are hardcoded, the CSV holds 67 rows. On cutover 64 legacy URLs return 404 and their link equity is lost.
**Files:** `apps/web/middleware.ts`, new `scripts/build-redirects.ts`, `content/redirect-map.csv`
**Depends on:** —
**Acceptance:** all 67 rows compiled into the redirect map at build; 301 status; trailing-slash normalised; no redirect chains.
**Testing:** unit test asserting `compiledMap.size === csvRowCount`. This assertion is the point of the task — it is the check that would have caught the original defect.
**SEO:** recovers 64 legacy URLs' link equity. **Migration:** blocks cutover.

---

### VG-003 · Build `/privacy/` and `/terms/` · P0 ⛔C-9 · **DONE (9fa229f)**
**Verified 2026-08-27:** both routes exist (`apps/web/app/(group)/privacy/page.tsx`, `.../terms/page.tsx`) via shared `LegalDocument.tsx`, footer links resolve. Clause content still carries placeholder/blocker markers pending legal sign-off.
**Why:** `Footer.tsx` renders `privacyHref` and `termsHref` on all 30 routes. Neither route exists. The moment DNS moves, every page on the site links to a 404.
**Files:** `apps/web/app/(group)/privacy/page.tsx`, `.../terms/page.tsx`
**Depends on:** C-9 copy (or approval to adapt a template)
**Acceptance:** both routes render, correct metadata, in sitemap, footer links resolve.
**Testing:** covered by VG-004. **SEO:** `noindex` acceptable; must not 404. **Migration:** blocks cutover.

---

### VG-004 · CI check: internal link integrity · P0
**Why:** the `/privacy/` defect is a *class* of bug, not an instance. Nothing currently prevents a component from linking to a route that does not exist.
**Files:** `scripts/check-links.ts`, `.github/workflows/`
**Depends on:** —
**Acceptance:** build fails if any internal `href` in rendered output does not match a known route.
**Testing:** the task is the test. **SEO:** prevents self-inflicted 404s. **Migration:** none.

---

### VG-005 · Write `Readme.md` · P0
**Why:** 1 byte, on a public repository carrying the client's brand.
**Files:** `Readme.md`
**Acceptance:** project overview, stack, local setup, workspace layout, links to `docs/`.

---

### VG-006 · Remove `X-Robots-Tag` ambiguity, add CSP · P1
**Why:** middleware sets `X-Robots-Tag: index, follow` globally, which will fight per-route `noindex` on staging and legal pages. No CSP is set.
**Files:** `apps/web/middleware.ts`, `apps/web/next.config.ts`
**Acceptance:** global header removed or made route-aware; CSP set with report-only period first.
**Testing:** header assertions. **SEO:** prevents indexing staging.

---

# MILESTONE M1 — CONTENT ARCHITECTURE
*The largest architectural change. Everything downstream depends on it. No content decisions required — this is pure engineering.*

### VG-010 · Extend Zod schemas for new entities · P0
**Why:** blueprint §6. `Industry`, `Capability`, `Resource`, `ProductCategory` do not exist; `Product` and `Project` lack the junction fields that make relationship-driven internal linking possible.
**Files:** `packages/schemas/src/cms.ts`, `packages/schemas/src/index.ts`
**Depends on:** —
**Acceptance:** all four new schemas exported; `Product` gains `categorySlug`, `industrySlugs` (min 1), `capabilitySlugs`, `standardsMatrix`; `Project` gains `productSlugs` (min 1), `industrySlug`, `capabilitySlugs`, `location`, optional `clientSlug`, narrative fields, `documents`. New ship gates implemented: Industry requires ≥2 products; Capability requires an envelope spec table; a Project with `clientSlug` whose `Client.permissionOnFile` is false fails validation.
**Testing:** extend `cms.test.ts` — one passing and one failing case per new gate.
**SEO:** enables entity-driven internal linking. **Migration:** none.

---

### VG-011 · Move content from TypeScript modules to `/content/**.json` · P0
**Why:** `apps/web/lib/content/*.ts` holds 77 KB of hardcoded content. Changing one spec value currently requires a developer, a commit and a deploy. This is the single largest architectural gap in the repository.
**Files:** `apps/web/lib/content/*` (delete), `/content/{companies,products,projects,industries,capabilities,resources}/*.json` (new), `apps/web/lib/content-loader.ts` (new)
**Depends on:** VG-010
**Acceptance:** loader reads the directory, validates every record against its schema at build, **fails the build on any validation error**; zero content literals remain in `apps/web`; rendered output byte-identical to before for existing pages.
**Testing:** loader unit tests; snapshot comparison of the 30 existing routes pre- and post-migration.
**SEO:** none directly — enables VG-013. **Migration:** none.

---

### VG-012 · Dynamic routing for products · P0
**Why:** 30 hand-written `page.tsx` files, zero dynamic segments. Adding a product means writing a file. Blocks all content scale.
**Files:** `apps/web/app/[company]/products/[category]/[slug]/page.tsx`, `.../[category]/page.tsx`, `.../products/page.tsx`; delete 17 static product routes
**Depends on:** VG-011
**Acceptance:** `generateStaticParams` produces all products from `/content`; all 17 render identically to their static predecessors; category index pages exist; `notFound()` on unknown slugs.
**Testing:** route test asserting every content record produces a route and every route has a record.
**SEO:** URL change for all 17 products — **VG-014 must ship in the same release.**
**Migration:** adds 17 redirect rows.

---

### VG-013 · Generate sitemap from the content source · P0
**Why:** `sitemap.ts` hardcodes 29 URLs. It breaks the moment routing is dynamic.
**Files:** `apps/web/app/sitemap.ts`
**Depends on:** VG-011, VG-012
**Acceptance:** every route derived from content + static route manifest; `lastModified` from record `contentRevisedDate`; legal pages excluded.
**Testing:** assert sitemap URL count equals discovered route count.
**SEO:** critical. **Migration:** resubmit at cutover.

---

### VG-014 · Add product-path redirects · P0
**Why:** VG-012 changes 17 live URLs and normalises `/dhruv-epc/equipment/*` → `/products/*`.
**Files:** `content/redirect-map.csv`
**Depends on:** VG-002, VG-012
**Acceptance:** 17 new rows; no chains; old paths 301 to new in one hop.
**Testing:** covered by VG-002's parity test. **SEO:** prevents losing existing rankings. **Migration:** yes.

---

### VG-015 · `RelatedEntityStrip` component · P0
**Why:** blueprint §2.2 — inverse relationships rendered automatically are the mechanism that produces internal linking without hand-authoring.
**Files:** `packages/datum-ui/src/components/RelatedEntityStrip.tsx` + story + test
**Depends on:** VG-010, VG-011
**Acceptance:** given an entity, resolves and renders its inverse relations (products→projects, capability→products, industry→projects); renders nothing rather than an empty shell when there are none.
**Testing:** render + axe. **SEO:** primary internal-linking mechanism.

---

# MILESTONE M2 — ENTITY EXPANSION
*Industries and capabilities. Content-gated but partially specifiable now.*

### VG-020 · Industry index and detail routes · P0 ⛔C-1 (partial), C-8
**Files:** `apps/web/app/industries/page.tsx`, `apps/web/app/industries/[slug]/page.tsx`, `/content/industries/*.json`
**Depends on:** VG-010, VG-011, VG-015
**Acceptance:** template per blueprint §10; the ≥2-product gate enforced at build; FAQ block 4–6; `FAQPage` JSON-LD; only industries with genuine evidence ship.
**Testing:** route metadata uniqueness, JSON-LD validity, axe.
**SEO:** Level 2 entry points. **Migration:** new URLs, no redirects needed.

---

### VG-021 · Capability index and detail routes · P0 ⛔C-8
**Why:** answers "can you actually make this" — the procurement test applied to process.
**Files:** `apps/web/app/capabilities/page.tsx`, `.../[slug]/page.tsx`, `/content/capabilities/*.json`, `CapabilityEnvelopeTable.tsx`
**Depends on:** VG-010, VG-011
**Acceptance:** every capability carries an envelope spec table (build gate); companies served listed; related products and projects rendered via `RelatedEntityStrip`.
**Testing:** schema gate test, axe, spec table `<th scope>` correctness.
**SEO:** Level 2. Supports `ASME U stamp fabricator Gujarat` class terms.

---

### VG-022 · `/quality/` and `/facilities/` group routes · P1 ⛔C-3, C-8
**Why:** replaces the invented `/{company}/proof/` noun, which has no search demand.
**Files:** new group routes; delete `apps/web/app/*/proof/page.tsx`; redirect rows
**Depends on:** VG-011
**Acceptance:** certifications with issue/expiry dates and artifact links; facility figures with source; approvals matrix reused.
**Migration:** 2 redirect rows.

---

### VG-023 · Extend product page template · P1
**Why:** blueprint §9 — applications, industries served, manufacturing capability and project evidence sections do not exist.
**Files:** product detail route, `RelatedEntityStrip`
**Depends on:** VG-012, VG-015, VG-020, VG-021
**Acceptance:** full section order rendered; sections with no data omitted entirely rather than rendered empty.

---

# MILESTONE M3 — PROJECT SYSTEM
*⛔ Entirely gated on C-1. This is the critical path of the whole programme.*

### VG-030 · Project detail route · P0 ⛔C-1
**Files:** `apps/web/app/projects/[slug]/page.tsx`, `/content/projects/*.json`
**Depends on:** VG-010, VG-011, VG-015
**Acceptance:** template per blueprint §8.2; the `qaSection` (TPIA) block is schema-mandatory and renders; anonymisation label displayed when `anonymized` is true; named clients render only when permission is on file.
**Testing:** schema gates, axe, JSON-LD.
**SEO:** long-tail project queries; strongest trust signal on the site.

---

### VG-031 · Project index with progressive disclosure · P0 ⛔C-1
**Why:** blueprint §8.3. A filter UI over three cards advertises emptiness.
**Files:** `apps/web/app/projects/page.tsx`
**Depends on:** VG-030
**Acceptance:** route does not ship below 10 records; chronological grid at 10–19; `ProjectFilterBar` mounted only at 20+; record count read from content at build, not hardcoded.
**Testing:** assert filter bar absent below threshold.

---

### VG-032 · Path-based project facets · P1 ⛔ 20+ records
**Files:** `apps/web/app/projects/industry/[slug]/page.tsx`, `.../company/[slug]/page.tsx`
**Depends on:** VG-031
**Acceptance:** path-based and indexable; self-canonical; in sitemap; no query-parameter duplicates.
**SEO:** these are rankable pages, which is why they are paths and not query strings.

---

### VG-033 · Use `ProjectCard` · P0 ⛔C-1
**Why:** built, exported, axe-tested, used on zero pages.
**Depends on:** VG-030

---

# MILESTONE M4 — CONVERSION
*P0. Independent of all content decisions. Can run in parallel with M1.*

### VG-040 · RFQ durable persistence · P0 · CRITICAL
**Why:** `/api/rfq` emails the lead and stores nothing — its own comment says `TODO … persist lead to database`. If the provider fails, the request 502s and the lead is gone. If it succeeds into a spam folder, the lead is gone silently. The file states a lost lead is the one unacceptable failure mode; the implementation does not honour it.
**Files:** `apps/web/app/api/rfq/route.ts`, `apps/web/lib/db.ts`, migration
**Depends on:** Railway Postgres provisioned
**Acceptance:** order of operations is validate → **persist, get ID** → return reference → email and WhatsApp as best-effort side effects that update `notificationStatus` and **never fail the request**. Row carries reference, timestamp, routed company, product and industry context, contact fields, requirement, uploaded keys, source page, UTM, status.
**Testing:** integration test proving a lead persists when the email provider throws. That specific test is the point of the task.
**SEO:** none. **Migration:** none.

---

### VG-041 · Move rate limiting and idempotency to durable store · P0
**Why:** in-memory `Map` resets on every deploy and is incorrect above one instance — flagged in your own code comment.
**Files:** `apps/web/app/api/rfq/route.ts`, `apps/web/lib/kv.ts`
**Depends on:** VG-040
**Acceptance:** limits survive redeploy and hold across instances; idempotency window preserved at 24 h.
**Testing:** concurrent-request test.

---

### VG-042 · Analytics event layer · P0
**Why:** no package installed, no events defined. The platform is currently unmeasurable.
**Files:** `apps/web/lib/analytics.ts`, layout
**Depends on:** —
**Acceptance:** event set per blueprint §18; product context dimensions attached; consent-aware; UTM captured into the RFQ row independently of the vendor.
**Testing:** event emission unit tests.

---

### VG-043 · AV scan hook on uploads · P1
**Why:** the route's own TODO. Accepting DWG/STEP from the public internet without scanning is a real exposure.
**Files:** `apps/web/app/api/presign/route.ts`, scan worker
**Depends on:** VG-040
**Acceptance:** files quarantined until scanned; RFQ row records scan status; lead is never blocked on scan completion.

---

# MILESTONE M5 — GROUP BRAND EXPERIENCE

### VG-050 · Rebuild the group home · P1
**Why:** blueprint §14.2. The current home leads with company doors — the group's org chart, not the buyer's question.
**Files:** `apps/web/app/(group)/page.tsx`, `HomeHero`, new `CategoryCard`, `IndustryCard`
**Depends on:** VG-020, VG-021, VG-030
**Acceptance:** section order per §14.2; companies demoted below products, industries and proof; every figure traces to a signed-off source; no invented statistics.
**Testing:** axe, LCP < 2.0 s on throttled 4G.

---

### VG-051 · Navigation restructure + products mega-panel · P1
**Why:** blueprint §4 — primary nav becomes Products · Industries · Capabilities · Projects · Company; company switching moves to the utility bar.
**Files:** `Header.tsx`, `MobileDrawer.tsx`, new `MegaPanel.tsx`
**Depends on:** VG-020, VG-021, VG-031
**Acceptance:** keyboard navigable, focus-trapped, ESC closes, no hover-only paths; `MobileBottomBar` unchanged.
**Testing:** keyboard + axe.

---

### VG-052 · `/companies/` group structure page · P1 ⛔C-2
**Acceptance:** explains the two in-scope companies once, clearly. Dhruv Exports is out of scope and must not appear anywhere on the site.

---

### VG-053 · `/about/` rebuild · P1 ⛔C-2
**Acceptance:** founding year, leadership names and titles, history. **No placeholder text ships** — a route with `CONTENT REQUIRED` remaining fails the build.

---

# MILESTONE M6 — RESOURCES AND SEO DEPTH

### VG-060 · Resource entity, routes, gated downloads · P1
**Files:** `apps/web/app/resources/page.tsx`, `.../[slug]/page.tsx`, `ResourceCard.tsx`
**Depends on:** VG-010, VG-011, VG-040
**Acceptance:** ungated and gated variants; gated downloads write a lead row using the same persistence path as RFQ.

---

### VG-061 · Migrate surge protection content · P1 ⛔C-7
**Why:** the strongest technical content the group possesses currently sits on a third party's `noindex` staging domain. This is asset recovery as much as SEO.
**Depends on:** VG-012, engineering sign-off on the specifications
**Acceptance:** ZVV, air cushion valve and bladder vessel content live as product pages with full spec tables and FAQ blocks.
**SEO:** this is the entire Level 1 beachhead.

---

### VG-062 · Metadata uniqueness CI assertion · P0
**Files:** route test suite
**Acceptance:** build fails on any duplicate `<title>` or meta description across routes.

---

### VG-063 · Extend JSON-LD coverage · P1
**Files:** `packages/schemas/src/jsonld.ts` (extend — do not rebuild; it has tests)
**Acceptance:** `Organization`, `Product`, `FAQPage`, `BreadcrumbList` across all routes; validated in `jsonld.test.ts`.

---

# MILESTONE M7 — HARDENING AND LAUNCH

### VG-070 · Route-level accessibility assertions · P0
**Acceptance:** zero axe violations on every route; spec tables use `<th scope>`; captions are not treated as alt-text substitutes.

### VG-071 · Playwright E2E on the RFQ path · P0
**Acceptance:** happy path, file upload, provider-failure path, idempotent resubmit.

### VG-072 · Performance budget enforcement in CI · P1
**Acceptance:** LCP < 2.0 s (4G), CLS < 0.1, INP < 200 ms, JS < 120 KB gz per route. Build fails on regression.

### VG-073 · Staging crawl and 404 sweep · P0
**Depends on:** everything
**Acceptance:** full crawl of the `noindex` staging domain; zero internal 404s, zero redirect chains, zero orphan routes.

### VG-074 · Cutover · P0
**Depends on:** VG-073, C-1…C-9 resolved or explicitly waived
**Acceptance:** per `deployment-runbook.md`. DNS, remove `noindex`, submit sitemap, request indexing on the top 20 URLs, Search Console and 404 monitoring daily for 14 days then weekly for 90.

---

# EXECUTION ORDER

**Now, unblocked, no decisions needed:** M0 (VG-001…006) → M1 (VG-010…015) → M4 (VG-040…042).
That sequence fixes every launch blocker, makes content editable, makes the site scalable, and makes leads durable — without a single answer from Vedanta.

**In parallel, starting immediately:** the C-1 project content chase. It is the critical path. M3 cannot begin without it, and M2 and M5 are materially weakened.

**Then:** M2 → M3 → M5 → M6 → M7.

---

# THE DEPENDENCY THAT MATTERS

Everything past M1 is gated on one question: **do ten real, publishable project records exist?**

If yes — anonymised is fine, and preferred — this is roughly a six-to-eight session engineering programme.

If no, the code will be finished and waiting, and the site will launch without the one thing that makes an EPC procurement manager believe it. That is not an engineering problem and no amount of design solves it.
