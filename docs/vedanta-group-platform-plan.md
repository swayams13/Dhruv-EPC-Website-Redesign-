# VEDANTA GROUP DIGITAL PLATFORM
## Architecture · PRD · TRD · Implementation Plan
**v1.0 · 9 July 2026 · Supersedes nothing — extends Datum v1.0 from a Dhruv design system to the group platform**
**Status:** Draft for approval
**Depends on:** Datum Design System v1.0 (approved pending), Phase 1 Audit + PRD/TRD Validation Addendum

---

# PART 0 — THE THESIS

Apple and Nike do not build "websites." They build **one system that expresses one entity model through one design language**, then let every page be a rendering of that system. The current Vedanta web estate is the opposite: three templates, three navigation schemes, contradictory entity data, demo copy in production, and a 409 wall between the flagship company and every AI crawler on earth.

**Industry 5.0 framing, applied honestly:** Industry 5.0 = human-centric, resilient, sustainable manufacturing. For a web platform that means: (1) the site serves the *human verifier* (proposal engineer, TPIA reviewer, procurement) before it serves the algorithm; (2) it is *resilient* — fast on a plant-office connection in Vadodara or Dammam, functional without JS, recoverable when a form fails; (3) it is *machine-legible* — structured data so deep that AI answer engines can reconstruct the company's capability record without guessing. Not chatbots and particle effects. Evidence, speed, and structure.

**The one-sentence strategy:** competitors' sites talk; this platform shows its numbers — because our buyers are verifiers, not browsers.

---

# PART I — BRAND & INFORMATION ARCHITECTURE

## 1. Entity Model (the decision everything else hangs on)

```
Vedanta Group (holding identity, not a trading entity)
├── Precise Engineers            → expansion joints, bellows, valves, dampers
├── Dhruv EPC Solutions Pvt Ltd  → static equipment, skids, heavy fabrication
└── Dhruv Exports (if real)      → one-page entity record OR removed entirely
```

**Rules:**
- One canonical record per entity: legal name, CIN/GST, works address (labeled by role), registered office, phone, email, stamps held. This record is the *single source* for the footer title block, the contact page, and the Organization/LocalBusiness JSON-LD. It lives in the CMS as a singleton — edited once, rendered everywhere.
- Group homepage is a **lean holding page** (5 sections, see §6.1) — it routes, it does not compete with the daughter sites.
- Entity bleed is banned by construction: Precise testimonials/certs never render on Dhruv routes and vice versa (component-level enforcement per Datum §20).
- The current "Dhruv Exports → Precise Engineers" broken link is fixed by decision, not CSS: either the entity exists and gets a record, or it is removed.

## 2. Domain & URL Architecture

**One domain. Path-based companies. No duplicate domains, ever again.**

```
vedantagroup.net/                          → Group holding page
vedantagroup.net/precise-engineers/        → Precise home
vedantagroup.net/precise-engineers/products/metallic-bellows-expansion-joint/
vedantagroup.net/dhruv-epc/                → Dhruv home
vedantagroup.net/dhruv-epc/equipment/heat-exchangers/
vedantagroup.net/dhruv-epc/projects/[slug]/
vedantagroup.net/request-a-quote/          → shared RFQ engine (?company= prefill)
```

- 301 every legacy `.php` URL to its new path (redirect map is a Phase 1 deliverable — losing existing link equity is unacceptable).
- The stray duplicate Dhruv domain (per Phase 1 audit) 301s wholesale to `/dhruv-epc/`.
- Clean, lowercase, hyphenated slugs; no query-string navigation; trailing-slash canonical.

## 3. Sitemap

### 3.1 Group level
```
/                     Group home (holding page)
/about/               Group history, leadership, values — one page
/request-a-quote/     Shared RFQ engine
/contact/             Group + both works, map, entity records
/privacy/  /terms/
```

### 3.2 Precise Engineers (accent: flex blue — see §5)
```
/precise-engineers/
├── /products/                     (index, grouped)
│   ├── Expansion Joints:  metallic-bellows-expansion-joint · telescopic-expansion-joint
│   │                      rubber-bellows · fabric-bellows · dismantling-joint · flange-adaptor
│   └── Flow Control:      zero-velocity-valve · dual-plate-check-valve · damper
├── /capabilities/                 sizes, materials, codes, testing — the capability matrix
├── /proof/                        certifications · approvals (PSU/EPC/TPIA matrix) · clients · testimonials
├── /projects/                     case studies
└── /company/                      about, works, careers
```

### 3.3 Dhruv EPC (accent: arc amber, per Datum)
```
/dhruv-epc/
├── /equipment/                    (index, grouped per Phase-1 IA)
│   ├── Static Equipment:          pressure-vessels · heat-exchangers · pipe-spools · plate-flanges
│   ├── Skids & Packages:          process-skids · packages · base-frames
│   └── Fabrication & Machining:   heavy-fabrication · heavy-machining
├── /capabilities/                 max tonnage, Ø, MOC families, codes, NDT/testing
├── /proof/                        certifications (U/U2/IBR/ISO) · approvals · clients · testimonials
├── /projects/                     case studies (Datum §24 template)
└── /company/
```

**Why grouped, not flat:** both companies currently present a flat 9-noun list. Grouping mirrors how a buyer's requisition is written ("static equipment package," "expansion joint for FGD duct") — the mega-menu (Datum §17) renders these groups directly.

## 4. Persona → Surface Map (carried from Phase 1, extended to group)

| Persona | Entry | Primary surface | Success event |
|---|---|---|---|
| A — Proposal/design engineer | Google/AI answer → product page | Spec table, capability matrix | RFQ with drawing upload |
| B — Procurement / vendor registration | Direct / referral → proof hub | Approvals matrix, cert artifacts, entity record | Shortlist; document download |
| C — AI answer engines (GPTBot, ClaudeBot, PerplexityBot) | Crawl | FAQ blocks, JSON-LD, spec tables in semantic HTML | Citation in a buyer's answer |
| D — TPIA / PMC reviewer | Link from proposal | QA process strip, case-study QA paragraphs | Confidence; no disqualifying gap |
| E — Group-level (JV, investors, recruits) | Group home | /about, leadership, both company doors | Contact |

Persona C is a first-class user. Every design decision is tested against "can a crawler reconstruct this claim?"

## 5. Design Language: Datum, Promoted to Group Level

Datum v1.0 stands as written — this document changes **scope, not content**. The three-tier token architecture (§26) was explicitly built for this:

| Layer | Group | Dhruv EPC | Precise Engineers |
|---|---|---|---|
| Primitives | shared (steel scale, spacing, motion, type) | shared | shared |
| Accent remap | steel-only, no accent (holding page is neutral ground) | `accent → arc` (amber, heat — welding) | `accent → flex` (cool blue `#0E6BA8` family — flexure, flow, pressure) |
| Semantic aliases | shared names, per-company values | `color.action.rfq → arc-500` | `color.action.rfq → flex-500` |
| Components | identical library, zero forks | — | — |

- Precise's **flex scale** gets the same discipline as arc: 4 steps (300/500/600/700), contrast-covenant pairs enumerated, ≤5% screen area, "blue is pressure" usage law mirroring "amber is heat."
- Typography, spacing, motion, tables, cards, nav, footer title-block: **identical across all three surfaces.** A buyer moving from Precise to Dhruv should feel one manufacturer group, two specializations.
- Group homepage uses the neutral steel system with both accents appearing only inside each company's door card — the group doesn't pick a favorite child.

## 6. Page Patterns (deltas from Datum only)

### 6.1 Group home (new pattern)
1. **Hero** — typographic, graphite. "Vedanta Group — precision fabrication and flow-control engineering since [year]." Eyebrow carries the stamps summary. No photo carousel (banned), one wide graded group photograph.
2. **Two doors** — the page's reason to exist. Two large cards, one per company: name, one-line scope with numbers, 3 mono spec chips, product-group list, accent-colored "Enter" CTA. Equal visual weight.
3. **Group stats band** — combined mono figures (years, works, stamps held, sectors served), each sourced.
4. **Shared proof strip** — group-level certifications and the labeled client wall (union of both, entity-tagged).
5. **Title-block footer** — group entity record.

### 6.2 Precise product page
Datum §21 applies verbatim with domain substitutions: spec table fields per product family (see PRD §P-3), "Types & configurations" becomes bellows types (single/universal/hinged/gimbal/pressure-balanced), materials chips (SS304/316/321, Inconel, rubber compounds, fabric layups), and the capability figures a piping engineer verifies: **DN range, pressure rating, temperature range, axial/lateral/angular movement, cycle life, applicable codes (EJMA, ASME B31.3)**.

### 6.3 Everything else
Trust pages (Datum §22), RFQ flow (§23), case studies (§24), nav/footer (§17–18) apply unchanged, per company.

---

# PART II — PRD (Product Requirements)

## P-1 Goals & Success Metrics

| # | Goal | Metric | Target (6 mo post-launch) |
|---|---|---|---|
| G1 | The platform generates qualified leads | RFQ submissions with drawing attached | ≥ 8/month combined |
| G2 | AI-engine visibility | Both companies cited in ChatGPT/Claude/Perplexity answers for 10 tracked buyer queries | ≥ 6/10 queries |
| G3 | Search visibility | Top-10 organic for "[product] manufacturer India/Gujarat" per product | ≥ 12 of 18 products |
| G4 | Zero crawl blockage | HTTP 200 to GPTBot/ClaudeBot/PerplexityBot/Googlebot on all indexable routes | 100% |
| G5 | Trust reconstruction | A vendor-registration reviewer can assemble the full approvals + entity record from ≤ 2 clicks | qualitative gate at UAT |
| G6 | Performance as brand | LCP ≤ 2.5s (p75, 4G), CLS < 0.1, INP < 200ms | CrUX green |

## P-2 In Scope / Out of Scope

**In:** group home, two full company sites, 18 product pages, 2 capability matrices, proof hubs, projects/case studies, shared RFQ engine with drawing upload, contact, CMS for all content, JSON-LD everywhere, redirect map, photography direction, analytics.
**Out (v1):** e-commerce/pricing, customer portal, Hindi/Gujarati (token-ready, content later), blog/news engine (news becomes dated "Updates" entries only if client commits to maintaining), Dhruv Exports site (record page at most), rebranding of logos.

## P-3 Functional Requirements

**FR-1 · Product pages (×18).** Datum §21 template. Spec table is the first scroll. Every card and hero carries a one-line scope *with numbers* — a bare product noun cannot render (CMS validation). FAQ block (4–6 self-contained Q&As) mandatory per product; it is the FAQPage schema and GEO surface.

**FR-2 · Capability matrix (×2).** Engineering-density table: parameter × capability (max Ø, max weight/tonnage, DN range, pressure, MOC families, codes, NDT methods, testing). First-column pinned horizontal scroll on mobile with affordance shadow. Deep-linked from the mega-menu rail.

**FR-3 · RFQ engine (shared).** Two-step form (Requirement → Contact) per Datum §23. Equipment choice-cards filtered by `?company=` prefill; company selectable if arriving neutral. Drawing dropzone: PDF/DWG/STEP/images, ≤25MB/file, ≤5 files, **presigned direct-to-storage upload** (validation addendum §3.1 — Vercel 4.5MB body limit makes this non-negotiable). Upload-before-submit states handled honestly; per-file retry. Confidentiality caption ships with the component. Server: Zod validation, honeypot + time-trap spam gate, rate limiting. On success: reference number (mono), SLA restated, capability-statement PDF offered. On failure: all field data preserved, plain error, retry + email/WhatsApp fallback — a lost lead is the one unacceptable failure.

**FR-4 · Proof hub (×2).** Certifications (scope statement + issuer + validity + artifact link), approvals matrix grouped PSU/EPC/TPIA, labeled client wall (name + sector, text-tile fallback), testimonials **only with mandatory attribution** — the component has no layout without it. Current 7 anonymous Precise testimonials: get attribution or don't migrate.

**FR-5 · Case studies.** Datum §24. Anonymization pattern built in ("Confidential — fertilizer sector PSU"). Minimum 3 per company at launch.

**FR-6 · Contact & entity.** All entity data rendered from the CMS singleton. Click-to-call and WhatsApp first-class on every page (header icons + mobile bottom bar on product pages).

**FR-7 · CMS.** Non-technical editor can: edit any product spec value, add a project, add a testimonial (attribution fields required), update the entity record, upload a certificate artifact. Cannot: change tokens, break the design system, publish an unattributed quote or numberless product card (schema validation).

**FR-8 · Search & GEO.** Per-route metadata, OG images (auto-generated from template: product name + one spec figure on graphite), XML sitemaps per company, `robots.ts` explicitly allowing AI crawlers, JSON-LD: Organization + LocalBusiness (per entity), Product, FAQPage, BreadcrumbList, Article (case studies). Breadcrumbs are the BreadcrumbList source (one artifact, two audiences).

**FR-9 · Redirects.** Complete legacy-URL map (`.php` paths, duplicate domain) → 301s at the edge. Zero 404s from any URL currently indexed.

## P-4 Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Budgets per route: HTML ≤ 40KB, JS ≤ 120KB gz (marketing routes), images AVIF/WebP responsive, fonts self-hosted subset WOFF2, LCP element preloaded. Budgets enforced in CI. |
| Accessibility | WCAG 2.2 AA by construction (Datum §25 in full): contrast covenant, universal focus ring, `prefers-reduced-motion`, 44px targets, real table semantics, keyboard contracts. `user-scalable=no` (current group site) is banned. axe CI gate: zero criticals. |
| Resilience | All marketing content SSG — the site works with JS disabled except the RFQ form, which degrades to a mailto/WhatsApp instruction block. Form data persisted to localStorage-equivalent (in-memory + sessionRestore) against network drops. |
| Security | No secrets client-side; presigned uploads scoped + expiring; uploaded files virus-scanned before internal notification links; rate-limited API routes; security headers (CSP, HSTS). |
| SEO hygiene | Canonicals, no mixed http/https (current Precise site has both), no vendor credit in footer, no orphan pages. |
| Privacy | Minimal analytics (privacy-respecting, e.g. Plausible/GA4 with consent), drawings stored encrypted at rest, retention policy stated. |

## P-5 Content Requirements (the real critical path)

- **Photography:** one-day shoot per works (Anand + Manjusar), shot list derived from Datum §2.1 + §21: person-beside-equipment scale shots, process shots (welding, NDT, hydrotest, bellows forming), 4:3 product shots per category. **No stock, no renders, no AI images — ever.**
- **Spec data:** engineering to supply per-product spec ranges (the table *is* the page). Template spreadsheets issued in Phase 1.
- **Proof artifacts:** scans of U/U2/IBR/ISO certificates, approval letters (or approving-entity names where letters are confidential), client logo permissions (text-tile fallback where refused).
- **Commitments needed from client:** RFQ response SLA figure; CIN/GST display approval; testimonial attributions.

---

# PART III — TRD (Technical Requirements)

## T-1 Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14+ App Router, TypeScript strict** | SSG/ISR for crawlability (validated in earlier Dhruv pass); RSC keeps JS budgets honest; one framework, three surfaces |
| Styling | **Tailwind, config generated from Datum tokens** | Tokens → `tailwind.config.ts` mechanically; arbitrary values lint-banned (`everything from the datum`) |
| Content | **Sanity (or Payload) headless CMS** | Structured schemas enforce PRD validation rules (numberless cards can't publish); singleton entity records; editor-friendly |
| Rendering | SSG + ISR (60s revalidate on content routes); RFQ + API routes dynamic | Fast by default, fresh when edited |
| Hosting | **Vercel** | Edge redirects/middleware, image optimization, preview deploys per PR |
| Uploads | **S3-compatible storage (R2/S3) + presigned PUT** | Bypasses 4.5MB body limit; direct-to-storage per addendum §3.1 |
| Forms/API | Next.js route handlers + Zod; notifications via transactional email (Resend/SES) + optional WhatsApp Business API ping to sales | Lead reaches a human in < 1 minute |
| Search/GEO | `next-sitemap`, JSON-LD via typed builders (schema-dts), OG image generation via `@vercel/og` | Typed schema = no malformed JSON-LD |
| Analytics | Plausible or GA4 + Search Console + weekly AI-citation spot checks | Measures G1–G3 |
| Monorepo | pnpm + Turborepo | `packages/datum-ui`, `packages/tokens`, `packages/schemas`, `apps/web` |

## T-2 Repository Architecture

```
vedanta-platform/
├── apps/web/                      # single Next.js app, route groups per company
│   ├── app/
│   │   ├── (group)/               # /, /about, /contact, /request-a-quote
│   │   ├── precise-engineers/
│   │   ├── dhruv-epc/
│   │   └── api/ (rfq, presign, revalidate)
│   └── middleware.ts              # redirects, security headers
├── packages/
│   ├── tokens/                    # Datum primitives + per-company semantic maps → CSS vars + Tailwind preset
│   ├── datum-ui/                  # Button, SpecTable, Card, Stamp, DatumRule, Nav, Footer, RFQ components…
│   └── schemas/                   # CMS schemas + Zod (shared client/server validation)
├── content/redirect-map.csv       # legacy URL → new URL, tested in CI
└── CLAUDE.md                      # conventions (loop-engineering pattern applies)
```

**Why one app, not three:** shared RFQ, shared components, one deploy, one preview URL per PR; company theming is a CSS-variable scope on the route-group layout (`data-company="precise"` remaps `--accent-*`), not a build fork.

## T-3 Data Model (CMS schemas, abridged)

```
Company        { slug, legalName, cin, gst, works[], registeredOffice, phones[], emails[], stampsHeld[], accent }
Product        { company→, slug, name, oneLineScope*, group, specTable[{param, value, unit, note}],
                 types[], materials[], codes[], faqs[{q, a}]*, gallery[], relatedProjects[] }
CapabilityRow  { company→, parameter, value, unit, note }
Certification  { company→, name, scopeStatement*, issuer*, validFrom, validTo, artifact }
Approval       { company→, approvingOrg*, entityClass(PSU|EPC|TPIA)*, category, year }
Client         { company[]→, name*, sector*, logo?, permission }
Testimonial    { company→, quote(≤40w), attnCompany*, attnRole*, provenance* }   # * = required to publish
Project        { company→, slug, sector, title, metrics[{label, value(mono)}], body, qaSection, photos[], anonymized }
EntityRecord   singleton per Company — feeds footer + JSON-LD
```

Validation is the design system's law made executable: `oneLineScope` must contain a digit; `Testimonial` publish blocked without all attribution fields.

## T-4 Key Technical Behaviors

- **RFQ pipeline:** client Zod → presign request → direct PUT to storage (progress per file, retry) → submit metadata + file keys → server Zod re-validate → AV scan hook → persist lead → email + WhatsApp notify → thank-you with mono reference number. Idempotency key per submission; failure path preserves state.
- **Redirect middleware:** CSV-driven map compiled to edge config; CI test asserts every legacy URL → 301 → 200.
- **robots.ts:** allow all major + AI crawlers explicitly; disallow `/api/`; sitemap index referenced. **The 409 dies here.**
- **JSON-LD builders:** typed functions per schema type consuming CMS records — one source, no drift between visible footer and machine record (addendum §2.2 rendered as code).
- **Image pipeline:** all photography through Next/Image, AVIF first, sized per Datum grid slots; alt text is a required CMS field carrying technical facts (a11y + SEO + GEO in one field).
- **Testing:** Vitest (unit: schema validation, token maps), Playwright (RFQ happy/failure paths, nav, mobile bottom bar), axe-core CI (zero criticals), Lighthouse CI budgets, redirect-map test. **The agent doing the work never grades its own output** — verification is a separate CI stage plus human UAT script.

## T-5 Environments & Ops

- `preview` per PR → `staging` (client UAT) → `production`. Content editing on production CMS with draft/publish.
- Rollback = Vercel instant redeploy of previous build.
- Uptime + form-failure alerting (a silent broken RFQ form is the worst failure — synthetic form test daily).
- Post-launch: Search Console monitored weekly for coverage regressions during the redirect settling period (~6 weeks).

---

# PART IV — IMPLEMENTATION PLAN (PHASED)

## Phase 0 — Stop the Bleeding (Week 1, runs on the *current* site)
Cheap fixes that don't wait for the rebuild:
- [ ] Remove 409 bot-blocking on Dhruv subsite (server config)
- [ ] 301 the duplicate Dhruv domain to the canonical path
- [ ] Delete Envato demo copy, "Play Intro" audio gate, `user-scalable=no` on group home
- [ ] Fix the Dhruv Exports → Precise Engineers wrong link
- [ ] Add minimal meta descriptions + Organization JSON-LD to all three homes
- [ ] Remove vendor credit from Precise footer; force https everywhere
**Exit:** all three sites return 200 to AI crawlers; no demo content in production.

## Phase 1 — Foundations & Content Mobilization (Weeks 1–3, parallel)
- [ ] Brand-architecture sign-off (entity model §1, Dhruv Exports decision)
- [ ] Token package: Datum primitives + arc map + **flex scale defined with contrast covenant**
- [ ] Monorepo scaffold, CI (lint, type, axe, Lighthouse budgets, redirect tests), CLAUDE.md
- [ ] CMS schemas with validation rules; entity records entered and client-verified
- [ ] Content mobilization: spec spreadsheets to engineering (18 products), certificate scans, client-logo permissions, testimonial attribution chase, SLA + CIN/GST commitments
- [ ] Photography shot list issued; shoots scheduled at both works
- [ ] Legacy URL inventory → redirect-map.csv
**Exit:** tokens compiled, CMS live with entity records, content collection in flight, CI green on empty app.

## Phase 2 — Component Library (Weeks 3–6)
Build order per Datum §27: **stamp → datum-rule → button → form fields → upload dropzone → spec table → cards → nav (header/mega-menu/drawer/bottom bar) → footer title-block → hero variants → trust components**.
- Each component: Storybook story, keyboard contract, reduced-motion variant, axe pass — reviewed against Datum spec, not vibes.
**Exit:** `datum-ui` complete in both accent themes; visual review approved.

## Phase 3 — Proving Pairs (Weeks 6–9)
Four pages that prove the whole system before scale-out:
- [ ] Dhruv home + **Heat Exchangers** product page (Datum's proving pair)
- [ ] Precise home + **Metallic Bellows Expansion Joint** product page
- [ ] Shared RFQ engine end-to-end (presigned uploads, notifications, thank-you, failure paths)
- [ ] Group home (two-doors pattern)
- Performance budget verified on throttled 4G; client UAT on staging.
**Exit:** proving pages approved = template contract locked; RFQ delivers a real lead to a real inbox.

## Phase 4 — Scale-Out (Weeks 9–13)
- [ ] Remaining 16 product pages (CMS-driven — this phase is content entry + QA, not new build)
- [ ] 2 capability matrices, 2 proof hubs, ≥3 case studies per company, company pages, contact, legal
- [ ] All JSON-LD types live; OG image generation; sitemaps
- [ ] Full Playwright suite green; content proofread against the voice register (no superlatives without proof)
**Exit:** full sitemap rendered, every page passes the "could this pixel help a proposal engineer shortlist us?" review.

## Phase 5 — Launch (Week 14)
- [ ] Redirect map deployed and CI-verified; DNS cutover
- [ ] Search Console: new sitemaps submitted, old URLs monitored
- [ ] Synthetic RFQ test scheduled daily; alerting live
- [ ] Launch checklist: crawl as GPTBot/ClaudeBot (200s everywhere), CrUX/Lighthouse pass, UAT sign-off
**Exit:** production live, legacy fully redirected, zero indexed 404s.

## Phase 6 — Measure & Tune (Weeks 15–26)
- Weekly: Search Console coverage + query tracking against G3; monthly AI-citation checks against G2
- RFQ funnel analysis (step-1→step-2 drop-off, upload failures)
- Case-study cadence: +1/company/quarter (the compounding GEO asset)
- Backlog: Hindi/Gujarati token remap, Updates section (only with maintenance commitment), video walkthroughs of the works

## Dependencies & Risks

| Risk | Mitigation |
|---|---|
| Spec data from engineering is slow (the critical path) | Spreadsheets issued Phase 1 week 1; pages can launch with "typical ranges" flagged for revision, but a product page without a spec table does not ship |
| Testimonial attributions refused | They don't migrate — component has no unattributed layout; case-study metrics replace them as proof |
| Photography delayed | Proving pair can launch on best existing photos re-graded; shoot remains a launch gate for Phase 4 |
| SEO dip during migration | Complete redirect map + CI test + 6-week Search Console watch; historical rankings are weak anyway — downside is small, upside is the whole strategy |
| Scope creep toward "flashy" | Datum principles are the review gate: one accent, no carousels, restraint is confidence |

---

## Appendix A — Precise Engineers spec-table field sets (issue to engineering)

| Product | Core spec fields |
|---|---|
| Metallic Bellows EJ | DN range · design pressure · temp range · movements (axial/lateral/angular) · bellows MOC · cycle life · codes (EJMA/ASME B31.3) · end connections |
| Telescopic EJ | DN range · traverse · pressure class · MOC · sealing system |
| Dismantling Joint | DN range · pressure rating · adjustment length · flange std · MOC |
| Rubber Bellows | DN range · pressure/vacuum · temp · elastomer types · arch config · movements |
| Fabric Bellows | duct size range · temp · media · fabric layup options · frame MOC |
| Flange Adaptor | DN range · pressure · MOC · flange standards |
| Damper | type (louver/butterfly/guillotine) · size range · temp · leakage class · actuation |
| Zero Velocity Valve | DN range · pressure class · MOC · application (water hammer) · standards |
| Dual Plate Check Valve | DN range · pressure class (ASME 150–600) · MOC (body/plate/spring) · API 594 · end types |

## Appendix B — Launch gate checklist (abridged)
200s to all AI crawlers · redirect map green · LCP ≤2.5s p75 · axe zero criticals · every product card has a number · every testimonial attributed · entity record matches JSON-LD byte-for-byte · RFQ synthetic test passing · footer has no vendor credit · zero stock imagery.

---
*End v1.0 — awaiting approval. On approval, Phase 0 begins immediately (it requires no design decisions).*
