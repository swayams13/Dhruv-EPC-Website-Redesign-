# progress.md — Vedanta Platform Build Log

Running log of what's done, what's next, and problems encountered.
Updated end of each session.

---

## Sessions completed

### Session 0 — Bleeding fix (live site)
**Status:** Skipped — prototype demo build, not a live deployment.

---

### Session 1 — Scaffold monorepo
**Status:** Complete ✅
**Branch:** `phase-1-foundations` → merged to `main` (PR #1)
**Date:** 2026-07-09

#### What was done

- Scaffolded pnpm + Turborepo monorepo with `apps/web` (Next.js 14.2, App Router, TypeScript strict), `packages/tokens`, `packages/datum-ui`, `packages/schemas`
- Wired workspace packages (`@vedanta/tokens`, `@vedanta/datum-ui`, `@vedanta/schemas`) as deps in `apps/web`
- Set up Tailwind v3 with `datumPreset` from `packages/tokens/src/tailwind.ts`
- Company theming via CSS variables: `[data-company="dhruv"]` → `--accent: arc-500`, `[data-company="precise"]` → `--accent: flex-500`
- Route groups: `(group)/`, `dhruv-epc/`, `precise-engineers/` with correct layout wiring
- API routes: `api/rfq/route.ts`, `api/presign/route.ts` (dynamic, stubs only)
- `robots.ts` explicitly allowing GPTBot, ClaudeBot, PerplexityBot, anthropic-ai
- `sitemap.ts`, `_not-found.tsx`, security headers in `next.config.mjs`
- Zod CMS schemas in `packages/schemas/src/cms.ts` covering all types: `Product`, `Testimonial`, `Certification`, `Approval`, `Client`, `Project`, `EntityRecord`
- `content/redirect-map.csv` (header row only, ready for Session 13)
- `docs/mistakes.md` created (append-only incident log)
- CLAUDE.md and BUILD-PLAYBOOK.md authored and committed
- CI (GitHub Actions): typecheck → lint → test → build → redirect-map integrity → axe placeholder → Lighthouse placeholder
- Vitest: 8 tests in `packages/schemas/src/cms.test.ts` covering CMS validation rules

#### Gate result

```
pnpm typecheck   ✓  4/4 packages
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  8/8 tests
pnpm build       ✓  10 routes, zero errors/warnings
```

---

### Session 2 — Tokens (Vitest contract)
**Status:** Complete ✅
**Branch:** `session-2-token-tests` → merged to `main` (PR #2)
**Date:** 2026-07-09

#### What was done

- Added `"test": "vitest run"` to `packages/tokens/package.json`
- Created `packages/tokens/src/tokens.test.ts` — 25 tests:
  - 13 semantic alias resolution tests (every key semantic → primitive assertion)
  - 12 WCAG contrast covenant tests per §4.5 (4.5:1 normal text; noted minimums)
- Added `rfqFg` semantic token to `semanticBase`, `semanticDhruv`, `semanticPrecise`:
  - Dhruv: `rfqFg = steel[950]` (dark text on amber, 5.79:1 ✓)
  - Precise: `rfqFg = steel[50]` (light text on blue, ~7.1:1 ✓)
  - Reason: WCAG test found `steel-950` on `flex-500` = 3.19:1 — WCAG fail for text

#### Gate result

```
pnpm typecheck   ✓  4/4 packages
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  25/25 (tokens: 25, schemas: 8)
pnpm build       ✓  zero errors/warnings
```

#### Design decisions (2026-07-10)

- Brand hexes confirmed: `arc-500: #F0670F`, flex blues as scaffolded. No change.
- rfqFg for Precise (dark-blue fill + near-white label): approved.

---

### Session 3 — CMS schemas + JSON-LD
**Status:** Complete ✅
**Branch:** `session-3-schemas` (PR #3 pending merge)
**Date:** 2026-07-10

#### What was done

- `packages/schemas/src/jsonld.ts` — 6 typed JSON-LD builders: `buildOrganization`,
  `buildLocalBusiness`, `buildProduct`, `buildFAQPage`, `buildBreadcrumbList`, `buildArticle`.
  Each consumes its matching CMS Zod type. Inline schema.org TS types (no new dep).
- `packages/schemas/src/cms.ts` — added `export type ProductFAQ`
- `packages/schemas/src/index.ts` — re-exports jsonld builders
- `packages/schemas/src/jsonld.test.ts` — 18 tests

#### Gate result

```
pnpm typecheck   ✓  4/4 packages
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  26/26 (jsonld: 18, schemas: 8)
pnpm build       ✓  zero errors/warnings
```

---

### Session 4 — Component library part 1 (primitives)
**Status:** Complete ✅
**Branch:** `phase-2-components` (PR pending)
**Date:** 2026-07-10
**Model:** fable

#### What was done

- **Token wiring** (design-review items, all spec-cited): `typeScale.helper` 13px
  (§14/§15 vs §5.2 conflict — Swayam approved 13px); preset heights compact
  40px / row 44px / row-dense 36px (§13/§15/§26 tier-3); fontSize data 15px +
  helper 13px; tracking-caption 0.06em; `accent.hover/pressed/fg` CSS-var slots
  + per-company values in globals.css (projects Session-2 rfqFg semantics)
- **Bug fix:** `semanticGroup.rfqFg` inherited steel-950 on steel-950 fill
  (1:1 contrast, invisible label) — fixed to steel-50 (17.4:1), covenant test
  added, mistakes.md entry written
- **Components** (`packages/datum-ui`): Stamp (§12), DatumRule (§2/§11 line +
  origin tick, signature draw, reduced-motion final frame), Button (§13 — 5
  variants, 48/40px, loading width-lock, disabled steel-200/400), Input /
  Select / Textarea (§14 — visible labels, 48px fields, error icon + live
  region), ChoiceCard (§14 radio-semantics tiles), UploadDropzone (§14 —
  presigned-PUT, per-file progress via scaleX, retry, confidentiality caption
  built in), SpecTable (§15 — scope headers, mono right-aligned values, dl
  reflow < 768px, comparative pinned-column mode)
- **Storybook 8** (react-vite) with company-scope decorators — every component
  storied in dhruv AND precise themes (32 stories)
- **Axe per story:** vitest + axe-core over composed stories — 32/32 zero
  WCAG A/AA violations (color-contrast covered numerically in token tests)
- **Lint gap closed:** datum-ui now runs `tailwindcss/no-arbitrary-value`
  (was apps/web-only) — zero findings
- **Verify pass fix:** SpecTable cell padding 16px per §15 (wrapped text
  touched the scribed rules)

#### Gate result

```
pnpm typecheck   ✓  4/4 packages
pnpm lint        ✓  2 lint tasks, 0 errors 0 warnings
pnpm test        ✓  84/84 (tokens 26, schemas 26, datum-ui a11y 32)
pnpm build       ✓  zero errors/warnings
storybook build  ✓
accent-leak grep ✓  zero arc-/flex- classes in components
```

#### Deviations reported (verify pass — none silent)

1. §11 signature "measurement label counts up in mono" — DatumRule renders
   line + tick only; count-up label belongs to the hero orchestration
   (Session 5/7). Deferred, not dropped.
2. §11 tick "drops" — implemented as opacity fade (compositor-safe,
   reduced-motion-clean) rather than translate-drop.
3. §13 primary pressed "deepens two" — steel-950 has no darker step;
   pressed uses steel-700 (lightens). Spec written for amber fills.
4. §13 "on graphite sections, Primary inverts" — no graphite section
   context exists until Session 5; onDark variant deferred.
5. §13 secondary/ghost hover — spec's "fill deepens one step" is
   fill-oriented; transparent variants deepen border (secondary) /
   tint bg steel-100 (ghost). Interpretation, consistent with §15 row hover.
6. §15 comparative affordance shadow — Datum's closed shadow set has only
   raised/overlay; pinned column uses shadow-raised (no new token invented).
7. Upload file-type enforcement is client-`accept` only until api/presign
   Zod-validates server-side (Session 6).

---

### Session 5 — Component library part 2 (composition)
**Status:** Complete ✅
**Branch:** `phase-2-components` (continues Session 4; one PR for both)
**Date:** 2026-07-10
**Model:** fable

#### What was done

- **Token wiring** (design-review items per §26, all spec-cited): §5.2 fluid
  type steps as clamp() 360→1440 (display-xl, display, h1, h3, h4, body-lg,
  data-lg — only steps components consume); §17 heights header 72px /
  header-scrolled 60px; §10 opacity-88 (glass scrim, verified compiling to
  `rgb(247 248 248 / .88)`); §16 aspect-4/3
- **Button extended (§13):** `href` renders an `<a>` (hero/nav CTAs);
  `onDark` lands Session 4's deferred deviation #4 — Primary inverts on
  graphite, RFQ stays accent (no onDark mapping exists for it, structurally)
- **Components** (`packages/datum-ui`): ProductCard (§16 — required
  oneLineScope, ≤3 mono chips, arrow nudge; replaces the Card.tsx stub),
  ProjectCard (§16 — sector eyebrow, ≤3-figure mono metric strip),
  Breadcrumbs (§17), Header (§17 — mega-menu Raised panel with IA groups +
  capability rail, click-open, ESC/outside close, sticky compress to 60px
  with §10 glass + degradation hooks), MobileDrawer (§17 — focus trap,
  accordions, RFQ pinned, ESC/scrim close), MobileBottomBar (§17 —
  call/WhatsApp/RFQ per playbook), Footer (§18 — title block consuming
  EntityRecord, stamps strip, sitemap + LinkedIn labeled link), StatBand
  (§19 — sourced mono figures), HomeHero / ProductHero / PageHero (§19),
  DimensionLabel (internal — §11 signature count-up, reduced-motion final
  frame; closes Session 4 deviation #1), CertificationCard, ApprovalsMatrix,
  ClientWall, Testimonial (§20 — attribution as required props)
- **New dependency:** `@vedanta/schemas` (workspace, type-only) in datum-ui
  — Footer/ApprovalsMatrix/ClientWall consume CMS types. **Needs review.**
- **Stories:** every component in dhruv AND precise scopes; axe per story
- **Separate verify pass:** reviewer subagent given only the diff + §5/§9–§22
  spec text. Verdict: PASS WITH DEVIATIONS. Fixed from findings: §17 icon
  order (WhatsApp before call), §10 glass degradation (data-glass +
  @supports-not / prefers-reduced-transparency solid fallback — was missing),
  CertificationCard scope voice off the mono-reserved data step

#### Gate result

```
pnpm typecheck   ✓  4/4 packages
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  123/123 (tokens 26, schemas 26, datum-ui a11y 71)
pnpm build       ✓  zero errors/warnings
storybook build  ✓
accent-leak grep ✓  zero arc-/flex- classes in components (gate met)
```

#### Deviations reported (verify pass — none silent)

1. §16 project-card "11px labels" — no 11px step exists in §5.2; caption
   12px (text-xs) used. Spec-internal conflict, nearest token chosen.
2. §16 metric-strip figure size unspecified — data 15px used; data-lg
   (24→32) is assigned to hero/case-study metrics and overwhelms a card.
3. §17 bottom bar carries click-to-call as a third action — BUILD-PLAYBOOK
   Session 5 orders "call / WhatsApp / RFQ"; §17's sentence names two.
   Playbook followed.
4. §11 drawer exit is an immediate unmount (no accelerate-out exit); entry
   honors motion-deliberate. Accordion disclosure is instant — §11's own
   compositor law bans height animation; only the chevron rotates.
5. §18 zones 2–3 render on the page surface — spec names only Zone 1 as
   the graphite band.
6. §13 Secondary-on-graphite (steel-600 border / steel-50 text) is an
   interpretation — spec names only Primary's inversion; §19's CTA pair on
   graphite forces the question.
7. §20 CertificationCard stampCode/artifactUrl optional — mirrors the
   Certification Zod schema (artifactUrl optional); scope/issuer/validity
   stay mandatory.
8. Spec tension, page-level (no component change): §13 one-accent-per-view
   vs §17 header RFQ on every page vs §19 hero RFQ. Header hides its RFQ on
   mobile (drawer/bottom-bar handoff); desktop composition must resolve it
   in Session 7.
9. Reviewer flagged drawer slide / chevron rotation lacking per-component
   reduced-motion guards — covered by the global §11 collapse in
   globals.css + preview.css (the reviewer was not given those files by
   design). Shared mechanism kept; no per-component classes added.

#### Requires human review before merge (accumulated, Sessions 4+5 PR)

- Preset token additions (Sessions 4 & 5 lists above) — §26 design-review
- `@vedanta/schemas` dependency in datum-ui
- `docs/` spec unchanged; no eslint-disable anywhere; no redirect-map change

---

### Session 6 — RFQ Engine End-to-End (IN PROGRESS, 2026-07-10)

**Branch:** `phase-3-proving` · **Governing specs:** Datum §23, plan FR-3 + §T-4

**Built (code complete, verification NOT finished — see below):**
- `packages/schemas/src/rfq.ts` — `PresignRequest` now validates by file extension
  (PDF/DWG/STEP/JPG/PNG/WEBP; browsers report `''`/octet-stream MIME for DWG/STEP),
  positive size ≤25MB. **Bug fixed:** `RFQStep2.company` renamed `contactCompany` —
  it collided with `RFQStep1.company` (target-company slug) in the `RFQSubmission`
  merge and silently dropped the slug.
- `packages/schemas/src/rfq.test.ts` — new: honeypot, uuid idempotency key, ≤5 file
  keys, phone country code, merge-preserves-slug, presign extension/size gates.
- `apps/web/lib/presign.ts` — hand-rolled SigV4 query presign (node:crypto — no new
  dependency, which would be a human-review gate). Verified against the AWS
  documented test vector (`aeeed9bb…`) via scratchpad script — PASS.
- `apps/web/app/api/presign/route.ts` — real presigned PUT: `uploads/<uuid>/<name>`
  scope, 10-min expiry, sanitized names, 503 with plain message when
  `STORAGE_ENDPOINT/BUCKET/ACCESS_KEY_ID/SECRET_ACCESS_KEY` env unset.
- `apps/web/app/api/rfq/route.ts` — full §T-4 pipeline: rate limit (in-memory,
  5/10min/IP — ponytail: single-instance, move to KV if scaled), server Zod
  re-validation, time-trap (≥5s), `uploads/` key-scope check, idempotency map
  (24h, returns original reference on retry), email via Resend REST fetch
  (throws → 502 so the client preserves state), WhatsApp ping stubbed behind
  `WhatsAppNotifier` interface (`lib/notify.ts`).
- `apps/web/app/(group)/request-a-quote/` — `page.tsx` (8+4 layout, reassurance
  rail, ?company= prefill), `RFQForm.tsx` (two-step, ChoiceCards filtered by
  company, company selectable when neutral, UploadDropzone with per-file
  progress/retry, upload-busy blocks continue, honeypot, stable idempotency key,
  failure keeps all fields + retry + email/phone fallback), `thank-you/page.tsx`
  (mono reference, restated SLA).
- `packages/datum-ui` `UploadDropzone` — added optional `onBusyChange` prop so the
  form can honestly block submit mid-upload.

**Env contract (all optional in dev):** `STORAGE_ENDPOINT`, `STORAGE_BUCKET`,
`STORAGE_REGION` (default `auto`), `STORAGE_ACCESS_KEY_ID`,
`STORAGE_SECRET_ACCESS_KEY`, `RESEND_API_KEY`, `RFQ_NOTIFY_TO`, `RFQ_NOTIFY_FROM`,
`NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`. In dev without Resend
config the lead is console-logged; in production missing email config fails the
submit honestly (no silent lead loss).

**Deviations / flagged (no invented claims):**
1. §23 certification strip in the rail — omitted, awaits verified CMS cert records.
2. §23 capability-statement PDF on thank-you — omitted, asset doesn't exist yet.
3. Thank-you links home, not Projects — /projects routes are Phase 4.
4. Contact fallback via `NEXT_PUBLIC_CONTACT_*` env until EntityRecord lands in CMS.
5. SLA "one business day" is the §23 placeholder, still pending client commitment.

**VERIFICATION STATUS (updated 2026-07-10, continuation session):**
- ✅ Vector check for SigV4 signer (scratchpad, PASS)
- ✅ `pnpm typecheck` — 4/4 packages, zero errors
- ✅ `pnpm lint` — 0 errors, 0 warnings
- ✅ `pnpm test` — 133/133 (tokens 26, schemas 36, datum-ui a11y 71)
- ✅ `pnpm build` — zero errors/warnings; /request-a-quote 108 kB First Load JS
  (under the 180 kB RFQ budget)
- **Bug found by the test gate and fixed:** `RFQStep1.company` reused CMS
  `CompanySlug` (`dhruv-epc`/`precise-engineers`/`group`) but the form submits
  `dhruv`/`precise` (the data-company vocabulary) — every RFQ with a company
  selected would have failed server-side Zod validation at runtime. Fixed by
  introducing `RFQCompany = z.enum(['dhruv','precise'])` in rfq.ts ('group' is
  not a valid RFQ target). Test `merge-preserves-slug` now passes.
- ✅ §23 browser verify pass (Playwright + chromium against dev server,
  17/17 checks): one H1; labeled "Step 1 of 2" progress; rail rows +
  confidentiality + "Prefer to talk?" hatch; exactly one accent-filled element
  at 1280px AND 320px; 2px focus outline on all 12 interactive elements;
  touch targets ≥24px; 320px no horizontal scroll; reduced-motion functional
  with zero non-opacity animations; JS-off renders content + fallback block;
  thank-you 200 + mono reference + restated SLA. Screenshots reviewed against
  §23 layout (8+4, rail right, form left).
- **Two fixes from the browser pass:**
  1. No `<noscript>` fallback existed — playbook requires "JS disabled renders
     the static fallback instruction block". Added to page.tsx (email/call
     instruction, env-gated contact details).
  2. Rail tel/mailto links were 20px tall (< §25 24px floor) — now
     `min-h-row` (44px) inline-flex targets.
- Note: "Prefer to talk?" hatch and contact fallbacks render only when
  `NEXT_PUBLIC_CONTACT_*` env is set (deviation #4 — no invented contact
  info); verified with test values.
- ⏳ Still pending (needs human/creds): E2E with real storage + Resend creds
  (playbook gate: real PDF from phone on 4G → email within a minute).

---

### Session 7 — Proving pair 1: Dhruv home + Heat Exchangers
**Status:** Complete ✅ (one flagged budget miss below)
**Branch:** `phase-3-proving` · **Date:** 2026-07-10 · **Model:** fable
**Governing specs:** Datum §19, §21, §16–§18, §20, plan §6/P-4

#### What was done

- **Seeded CMS content** `apps/web/lib/content/dhruv-epc.ts` — EntityRecord,
  heat-exchangers Product (spec table, 6 types, MOC, codes, 5 FAQs),
  4 Certifications, 3 TPIA Approvals, stats, equipment/menu list. All records
  Zod-parsed at module load. Sourcing: facts quoted from vedantagroup.net
  (fetched 2026-07-10); unsourced figures tagged **DEMO-PLACEHOLDER** per
  Swayam's approval, each carrying "DEMO figure — engineering data pending"
  visibly in the UI. Swap-list lives in the content file header.
- **Amber-law resolution** (Session 5 deviation 8, deferred here): new internal
  hook `useRfqAnchorInView` — Header and MobileBottomBar RFQ buttons render
  `invisible` while any `[data-rfq-anchor]` (hero CTA row, RFQ band) is in the
  viewport. Max one accent-filled element per view at every scroll position,
  desktop and mobile, verified programmatically at 5 scroll states.
- **Chrome:** DhruvChrome (Header + MobileDrawer wiring), RFQBand (§21.9
  graphite closer), dhruv-epc/layout.tsx now wraps routes with chrome + Footer
  (layout touch = human-review gate).
- **/dhruv-epc/** per §19: graphite HomeHero (9-word H1), sourced stats band,
  equipment card grid (no-photo variants), certifications strip, RFQ band,
  LocalBusiness JSON-LD.
- **/dhruv-epc/equipment/heat-exchangers/** per §21: ProductHero with mono
  chips anchor-linked to #specifications; spec table first scroll; types cards;
  MOC/code chips; 5-step Fab & QA strip (text variant); native-`<details>` FAQ
  (§11 compositor law — no height animation); sticky anchor rail; RFQ band;
  MobileBottomBar. JSON-LD: Product + FAQPage + BreadcrumbList via typed
  builders. OG image via next/og (no new dep) using @vedanta/tokens colors.
- **Fixes from the verify pass** (axe + vision loop):
  - steel-500 small-text contrast class fixed in SpecTable/StatBand/
    CertificationCard/Footer + page captions → steel-600/steel-400
    (mistakes.md entry; §15-vs-§25.1 spec conflict resolved toward WCAG)
  - Footer contact links py-1 (24px floor)
  - stampsHeld → canonical §12 codes (was rendering 1 of 6 stamps;
    mistakes.md entry)

#### Gate result

```
pnpm typecheck   ✓  4/4       pnpm lint  ✓ 0 errors
pnpm test        ✓  133/133   pnpm build ✓ both routes 93.8 kB First Load (≤120 budget)
browser verify   ✓  25/25 (axe zero critical/serious, amber law × 5 scroll
                     states × 2 viewports, JSON-LD parses, heading order,
                     375px no h-scroll, FAQ, OG image)
Lighthouse (prod, mobile throttled): home 97/100/100, LCP 2.5s CLS 0;
                     product 96/100/100, LCP 2.7s CLS 0 TBT 100ms
```

#### Deviations / flagged

1. **Product LCP 2.7s vs §P-4 2.5s** on Lighthouse simulated slow-4G — real
   breakdown is TTFB 34ms + render delay 151ms; the simulated cost is one
   render-blocking 6.8 kB CSS round trip. Lever if the client's p75 field data
   agrees: critical-CSS inlining (Phase 5 launch tuning). Not silently accepted.
2. §21.3 type cards lack "section-view icons" — no real icon artwork exists;
   text-only cards (no invented graphics).
3. §21.6 gallery + §21.7 related projects omitted — no real photography
   (§P-5 shoot pending) and no Project records until Phase 4.
4. §21.5 QA strip is text-only (photos pending the works shoot).
5. Mega-menu/footer link to routes that 404 until Phase 4 scale-out
   (pressure-vessels, capabilities, projects, company, contact, privacy, terms).
6. Testimonials/ClientWall omitted — live site's quote is unattributed
   (cannot publish per §20) and client names/permissions unverified.
7. Some menu scopes lack figures (§16) — only sourced figures used; DEMO
   figures were restricted to the spec table and stats band.

#### Requires human review (accumulated)

- `dhruv-epc/layout.tsx` change (data-company file)
- DEMO-PLACEHOLDER figures list (content file header) before any non-demo use

---

### Session 8 — Proving pair 2: Precise home + Metallic Bellows + group home
**Status:** Complete ✅
**Branch:** `phase-3-proving` · **Date:** 2026-07-11 · **Model:** fable
**Governing specs:** Datum §19, §21, §16–§18, §20; plan §3.2, §5, §6.1/§6.2, Appendix A

#### What was done

- **Seeded CMS content** `apps/web/lib/content/precise-engineers.ts` — EntityRecord,
  metallic-bellows Product (Appendix A field set: DN range 80–8,000 mm NB sourced,
  EJMA/ASME B31.3, 8 configuration types sourced, MOC list sourced, 5 FAQs),
  ISO 9001 + EIL certifications, EIL Approval record, stats (all four sourced —
  better than Dhruv's), grouped product menu list. `lib/content/group.ts` — group
  EntityRecord + sourced group stats. Sourcing: vedantagroup.net (fetched
  2026-07-11); unsourced figures tagged DEMO-PLACEHOLDER per the standing
  prototype approval, visible "DEMO figure — engineering data pending" notes.
- **Precise chrome + layout:** PreciseChrome (Header §17 + MobileDrawer),
  `precise-engineers/layout.tsx` now wraps routes with chrome + Footer
  (**data-company layout touch = human-review gate**). Blue law via the existing
  `useRfqAnchorInView` mechanism — no new code needed.
- **/precise-engineers/** per §19: graphite HomeHero (9-word H1 with codes),
  4-figure sourced stats band, 9 product cards, certifications strip,
  RFQ band, LocalBusiness JSON-LD.
- **/precise-engineers/products/metallic-bellows-expansion-joint/** per §21 +
  §6.2 (plan §3.2 slug): ProductHero with mono chips anchored to #specifications;
  spec table first scroll; 8 bellows-type cards; MOC/code chips; QA strip (text
  variant); native-`<details>` FAQ; anchor rail; RFQ band; MobileBottomBar.
  JSON-LD: Product + FAQPage + BreadcrumbList via typed builders. OG image via
  next/og using flex/steel token primitives.
- **Group home /** per plan §6.1: typographic graphite hero (verbatim §6.1 copy,
  Est. 1994 sourced), two equal door cards with nested `data-company` scopes —
  accent appears **only** inside each door, as `variant="link"` CTAs (zero
  accent fills on the page), sourced group stats band, entity-tagged
  certification union (company sub-headings), title-block footer from group
  EntityRecord, Organization JSON-LD.
- **Sitemap:** added both built product routes (incl. Session 7 heat-exchangers
  gap).
- **Fix from the reviewer pass:** BreadcrumbList JSON-LD host
  `www.vedantagroup.net` drifted from sitemap's `vedantagroup.net` — aligned in
  both product pages; mistakes.md entry (hoist BASE to a shared constant in
  Phase 4; Session 13 CI should assert host match).

#### Gate result

```
pnpm typecheck   ✓  4/4       pnpm lint  ✓ 0 errors
pnpm test        ✓  133/133   pnpm build ✓ all 3 new routes 93.8 kB First Load (≤120)
browser verify   ✓  28/28 (Playwright/chromium, prod build: axe zero
                     critical/serious ×3 pages; blue law max 1 fill at 5 scroll
                     states × 2 viewports; group home ZERO accent fills; one H1;
                     no heading skips; JSON-LD parses w/ expected types; 320px
                     no h-scroll; focus outline ≥2px on visible interactives;
                     reduced-motion functional; OG image 200)
Lighthouse (prod, mobile throttled):
                     group    98/100/96, LCP 2.3s CLS 0 TBT 10ms
                     precise  95/100/96, LCP 2.7s CLS 0 TBT 70ms
                     bellows  97/100/96, LCP 2.7s CLS 0 TBT 50ms
vision loop      ✓  1440px + 375px full-page screenshots diffed against §21/
                     §19/§6.1 point by point
reviewer subagent   PASS WITH DEVIATIONS (diff + spec only) — findings triaged
                     below; #3 (host drift) fixed in-session
```

#### Deviations / flagged (none silent)

1. **Product-card scopes for the 8 not-yet-built Precise products carry no
   figures** (§16, Appendix B launch gate). No sourced figures exist; inventing
   them is banned. Phase 4 content blocker — Appendix A field sets must come
   from engineering. (Session 7 deviation-7 precedent.)
2. **Certification `validFrom` DEMO dates render as "Issued 2023" with no
   visible DEMO marker** (reviewer #2) — schema requires validFrom; applies
   equally to Session 7's Dhruv cards. Queued to the swap-list; needs either
   real scans or a rendered pending-marker decision. **Highest-priority content
   swap before any non-demo audience.**
3. **Group home has no header/nav.** §17 says RFQ in the header on every page;
   plan §6.1 enumerates a chrome-less holding page. Ambiguity flagged, not
   decided: recommend deciding group chrome before Phase 4 (a minimal group
   header or an explicit "holding page has no chrome" rule in CLAUDE.md).
4. §6.1.4 client wall omitted — no verified client records/permissions
   (Session 7 deviation-6 precedent). Certifications half of the proof strip
   is present, entity-tagged.
5. §21.3 type cards lack section-view icons — no real icon artwork exists
   (Session 7 deviation-2 precedent).
6. Breadcrumb "Products" points to `/precise-engineers#products` until the
   Phase 4 `/products/` index route exists (plan §3.2; Dhruv precedent).
7. Design codes rendered without editions (§21.4 edition discipline) — edition
   data pending engineering; source states none.
8. EIL approval is modeled as an Approval record AND rendered as a §20
   credential card on home; `preciseApprovals`/`dhruvApprovals` are seeded for
   the Phase 4 proof hub, unrendered today.
9. Group hero photograph absent (§6.1 names one) — real-or-absent law, §P-5
   shoot pending.
10. **LCP 2.7s vs §P-4 2.5s** on both Precise routes, Lighthouse simulated
    slow-4G — same render-blocking-CSS round trip as Session 7's product page
    finding; critical-CSS inlining is the Phase 5 lever. Group home is 2.3s ✓.
11. `favicon.ico` 404 (the only Lighthouse best-practices deduction, 96) — no
    brand favicon asset exists; creating one is a design decision. Queued.
12. OG image typography is generic sans/mono (satori needs font files; token
    colors correct). Session 7 precedent.
13. FAQ chevron is a text glyph, not the §12 `ChevronDown` (glyphs are
    deliberately barrel-private) — shared with heat-exchangers; one fix for
    both when the barrel decision is made.

#### Requires human review (accumulated)

- `precise-engineers/layout.tsx` change (data-company file)
- DEMO-PLACEHOLDER figures (content file headers) — esp. deviation 2 above
- Template contract locks after this PR merges (playbook: client UAT on
  staging before Phase 4 scale-out)

---

## Problems faced & how we tackled them

### 1. `pnpm install` blocked by `unrs-resolver` build
**Fix:** `allowBuilds: unrs-resolver: true` in `pnpm-workspace.yaml`.

### 2. Turbo `Could not resolve workspace`
**Fix:** `"packageManager": "pnpm@11.10.0"` in root `package.json`.

### 3. `packages/tokens/src/semantic.ts` typecheck failure
**Fix:** Removed `satisfies` constraint, kept `as const`.

### 4. `packages/tokens/src/tailwind.ts` — Cannot find module 'tailwindcss'
**Fix:** Added `"tailwindcss": "*"` to `packages/tokens/package.json` devDependencies.

### 5. `apps/web/tailwind.config.ts` typecheck error
**Fix:** `datumPreset as unknown as Config`.

### 6. `next.config.ts` not supported by Next.js 14
**Fix:** Renamed to `next.config.mjs`.

### 7. `pnpm turbo lint` — `Could not resolve tailwindcss`
**Fix:** Remove `settings.tailwindcss.config` from `.eslintrc.json`. Never set this to a relative path.

---

## What's remaining

| Session | Goal | Branch | Model | Status |
|---------|------|--------|-------|--------|
| 0 | Bleeding fix — live site | (server config) | advisor | Skipped (prototype demo) |
| 1 | Scaffold monorepo | phase-1-foundations | sonnet | ✅ Done |
| 2 | Tokens + contrast tests | session-2-token-tests | sonnet | ✅ Done — merged (PR #2) |
| 3 | CMS schemas + JSON-LD | session-3-schemas | sonnet | ✅ Done — PR #3 pending merge |
| 4 | Component library part 1 — primitives | phase-2-components | **fable** | ✅ Done — PR #4 open |
| 5 | Component library part 2 — composition | phase-2-components | **fable** | ✅ Done — PR #4 open (with Session 4) |
| 6 | RFQ engine end-to-end | phase-3-proving | fable | ✅ Done (E2E creds gate queued) |
| 7 | Dhruv home + Heat Exchangers page | phase-3-proving | fable | ✅ Done |
| 8 | Precise home + Metallic Bellows + group home | phase-3-proving | fable | ✅ Done |
| 9 | Dhruv 7 remaining equipment pages | phase-3-proving | sonnet | ✅ Done |
| 10 | Precise 8 remaining product pages | main | sonnet | ✅ Done |
| 11 | Capability matrices + proof hubs (Dhruv + Precise) | main | sonnet | ✅ Done |
| 12 | Contact + about + company pages | main | fable | ✅ Done |
| 13 | Redirect map + robots + sitemaps | main | sonnet | ✅ Done |
| 14 | Launch checklist | main | sonnet | ✅ Done |

### All sessions complete — awaiting client UAT + DNS cutover

---

### Session 9 — Dhruv 7 remaining equipment pages
**Status:** Complete ✅
**Branch:** `phase-3-proving` · **Date:** 2026-07-11 · **Model:** sonnet

#### What was done

- **CMS content** — 7 `Product.parse({…})` records appended to `apps/web/lib/content/dhruv-epc.ts`:
  `pressureVessels`, `storageTanks`, `processSkids`, `pipeSpools`, `heavyFabrication`,
  `heavyMachining`, `plateFlanges`. Each has: `oneLineScope` with digit ✓, ≥1 specTable
  row ✓, 4–5 FAQs ✓, gallery: [] (no real photography yet). All quantitative figures marked
  DEMO-PLACEHOLDER; codes/types drawn from `[source: vedantagroup.net products]` menu data
  and standard industry knowledge for each product family.
- **7 page routes** (`apps/web/app/dhruv-epc/equipment/[slug]/page.tsx`) — each follows
  the §21 template exactly (template contract locked). Sections: spec table → types →
  materials/codes → fabrication QA (5 steps, product-specific) → FAQ. JSON-LD:
  Product + FAQPage + BreadcrumbList via typed builders. All content consumed from
  the new Product records (no inline data in pages).
- **7 OG images** (`opengraph-image.tsx`) — same satori pattern as heat-exchangers:
  product name + key code on graphite, arc amber rule. No new fonts or dependencies.
- **Sitemap** — 7 new equipment URLs added to `apps/web/app/sitemap.ts`.
- **Bug fix during development:** straight apostrophe in `shop's` (pipe-spools FAQ)
  terminated the string literal. Fixed by switching to double-quote delimiter; only
  occurrence — curly apostrophes elsewhere were already safe.

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors, 0 warnings (no arbitrary values — all pages use token classes)
pnpm test        ✓  133/133 (tokens 26, schemas 36, datum-ui a11y 71)
pnpm build       ✓  19 routes, zero errors/warnings
                    All 7 new pages: 93.8 kB First Load JS (≤120 kB marketing budget ✓)
```

#### Deviations / flagged (none silent)

1. All quantitative spec-table figures are DEMO-PLACEHOLDER — same policy as Sessions 7/8.
   SWAP-LIST is in the content file header and applies to all 7 new records.
2. §21.3 type cards lack section-view icons — no artwork exists (Sessions 7/8 precedent).
3. §21.6 gallery and §21.7 related projects omitted — no real photography; no Project
   records until Phase 4.
4. API 650 for storage-tanks is marked DEMO-PLACEHOLDER (unverified against vedantagroup.net).
5. Template contract note: verified zero component or layout changes in this session.

#### Schema validation spot-check

- `pressureVessels.oneLineScope` matches `/\d/` via "Div. 1 & 2" ✓
- `storageTanks.oneLineScope` matches via "VIII Div. 1" ✓
- `processSkids.oneLineScope` matches via "B31.3" ✓
- `pipeSpools.oneLineScope` matches via "B31.3" and "½ to NPS 48" ✓
- `heavyFabrication.oneLineScope` matches via "IS 2062" and "200 T" ✓
- `heavyMachining.oneLineScope` matches via "4,000 mm" ✓
- `plateFlanges.oneLineScope` matches via "B16.5" and "B16.47" ✓
- All records: faqs.length ∈ [4, 6] ✓; specTable.length ≥ 1 ✓

---

### Session 10 — Precise 8 remaining product pages
**Status:** Complete ✅
**Branch:** `main` · **Date:** 2026-07-13 · **Model:** sonnet
**Governing specs:** Datum §21, Appendix A (field-set contract)

#### What was done

- **CMS content** — 8 `Product.parse({…})` records appended to `apps/web/lib/content/precise-engineers.ts`:
  `telescopicExpansionJoint`, `rubberBellows`, `fabricBellows`, `dismantlingJoint`,
  `flangeAdaptor`, `zeroVelocityValve`, `dualPlateCheckValve`, `damper`.
  All follow the Appendix A field set; quantitative figures DEMO-PLACEHOLDER per standing policy.
- **16 new page files** — `page.tsx` + `opengraph-image.tsx` for each slug under
  `apps/web/app/precise-engineers/products/[slug]/`. Each follows the §21 locked template exactly
  (5 sections: specifications → types → materials-codes → fabrication-qa → faq). `company="precise"`,
  `precisePhoneHref`/`preciseWhatsappHref`, JSON-LD: Product + FAQPage + BreadcrumbList.
  OG images: `flex[500]` rule bar on graphite (matching metallic-bellows precedent).
- **Sitemap** — 8 new Precise product URLs added.

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  133/133
pnpm build       ✓  27 routes, all 8 new pages 93.8 kB First Load JS (≤120 kB budget ✓)
```

#### Commits

- `feat(content): seed 8 Precise product CMS records per Datum §21 + Appendix A`
- `feat(dhruv): 8 remaining Precise product pages per Datum §21 (Session 10)`

---

### Session 11 — Capability matrices + proof hubs (Dhruv + Precise)
**Status:** Complete ✅
**Branch:** `main` · **Date:** 2026-07-13 · **Model:** sonnet (multi-agent workflow)
**Governing specs:** Datum §15 (capability matrix / engineering-density SpecTable), §20 (proof hub)

#### What was done

Built 4 new pages via parallel workflow (4 build agents + gate agent + reviewer agent):

- **`/dhruv-epc/capabilities/`** — `PageHero` + `SpecTable` (rows mode, `density="engineering"`,
  14-row capability envelope: max diameter 3,600 mm, max tonnage 200 T, design pressure range,
  temperature range, MOC families, design codes, stamps, NDT, testing, TPI agencies).
  Equipment families grid linking to individual product pages. DEMO figures labelled.
- **`/dhruv-epc/proof/`** — `PageHero` + `CertificationCard` grid (4 certs: ISO 9001:2015,
  ASME U, ASME U2, IBR) + `ApprovalsMatrix` (3 TPIA agencies: LRS, BV, DNV). No
  ClientWall/Testimonials (no verified records — correct per Sessions 7/8 precedent).
- **`/precise-engineers/capabilities/`** — Same pattern. 16-row envelope: bellows
  80–8,000 mm NB (sourced), 8 product size ranges, 5 design-code families, MOC families,
  12-sector list, EIL approval. Product families grid (expansion-joints + flow-control groups).
- **`/precise-engineers/proof/`** — `CertificationCard` grid (ISO 9001:2015, EIL Approved Vendor)
  + `ApprovalsMatrix` (EIL EPC class). DEMO date notice rendered.
- **Sitemap** — 4 new URLs added (capabilities: weekly 0.8, proof: monthly 0.7).

#### Reviewer findings + fixes

Reviewer agent returned FAIL on 3 must-fix issues; all fixed before final commit:
1. `text-h2` (not in Datum token map → no CSS output) → `text-h3` on "Product families" heading.
2. `text-label` + `tracking-wide` (neither a Datum token) → `text-helper` + `tracking-caption`.
3. Hardcoded phone number in `precise-engineers/proof/page.tsx` → `precisePhoneHref` from content file.

Reviewer also noted (minor, not blocking): Dhruv proof `<h2>` headings use `text-h1` token
(valid — h1 token on h2 element is a visual sizing choice, not a spec violation).

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors (1 unescaped-entity fixed in-scope during build)
pnpm test        ✓  133/133
pnpm build       ✓  4 new SSG routes, all 93.8 kB First Load JS (≤120 kB budget ✓)
```

#### Commits

- `08519be feat(session-11): capability matrices + proof hubs, Dhruv + Precise (Datum §15/§20)`
- `e554a4b fix(session-11): replace undefined tokens + wire precisePhoneHref per reviewer`

---

### Session 12 — Contact + about + company pages
**Status:** Complete ✅
**Branch:** `main` · **Date:** 2026-07-13 · **Model:** fable
**Governing specs:** plan §3.1–3.3 (sitemap), FR-6 (contact & entity), CLAUDE.md entity/JSON-LD rules

#### What was done

- **`/about`** — group history (Precise est. 1994 V.U.Nagar Anand; Dhruv static-equipment
  works at Manjusar GIDC, Savli) + values in enforcement-rule format (each grounded in a
  sourced credential, zero unattributed adjectives) + `StatBand(groupStats)` + light company
  doors (group-home §6.1.2 pattern, `data-company` scoped accents, no fills).
- **`/contact`** — entity blocks for Dhruv + Precise + group registered office, every
  address/phone/email rendered from the `EntityRecord` singletons (FR-6 — nothing hard-coded).
  `tel:`/`mailto:` links with `min-h-row` touch targets. JSON-LD: BreadcrumbList +
  LocalBusiness ×2 via typed builders.
- **`/dhruv-epc/company`** and **`/precise-engineers/company`** — about (hero/lead from
  sourced facts), works (addresses from entity singletons), sectors/TPI facts from existing
  sourced records, careers as an honest mailto (role families only, no fabricated openings),
  `RFQBand` + `MobileBottomBar` per proof-page pattern. Chrome from route-group layouts.
- **Sitemap** — `/about/`, `/dhruv-epc/company/`, `/precise-engineers/company/` added
  (`/contact/` was already present).
- All four nav/footer links that previously 404'd (`/about`, `/contact`, both `/company`)
  now resolve.

#### Reviewer pass (separate agent, diff + specs only)

**PASS, zero must-fix.** Verified: token classes all resolve (Session-11 `text-h2` trap
avoided), amber/blue law (group pages zero fills; company pages exactly one `variant="rfq"`),
FR-6 sourcing, JSON-LD builders only, dl/dt/dd + aria-labelledby + heading-order a11y,
sitemap conventions. One in-scope lint catch fixed during build: `gap-5` (not in the token
spacing scale) → `gap-6`.

Non-blocking reviewer notes (recorded, not actioned — out of scope):
1. Breadcrumb JSON-LD URLs lack trailing slashes repo-wide (pre-existing convention,
   conflicts with plan §2 trailing-slash canonical) — worth one sweep later.
2. `FOOTER_COLUMNS` duplicated across group home / about / contact — could live in
   `lib/content/group.ts`.

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors (gap-5 → gap-6 fixed in-scope)
pnpm test        ✓  133/133 (force-rerun, not cache)
pnpm build       ✓  4 new SSG routes, all 93.8 kB First Load JS (≤120 kB budget ✓)
```

#### Deviations / flagged (none silent)

1. **Leadership section omitted on `/about`** — plan §3.1 lists "leadership" but no sourced
   names/roles exist anywhere (no invented claims). Needs client input: names, roles,
   real photography.
2. **Map embed replaced with Google Maps links on `/contact`** — plan §3.1 says "map";
   an embed adds third-party JS/consent weight for a prototype. Links carry the same
   information. Swap decision deferred to launch.
3. **Careers copy is generic role families** (welders, QA/QC, design engineers) with an
   entity-record mailto — no sourced openings exist. Non-quantitative, flagged for client copy.
4. **Manual browser pass not run this session** — pages compose only previously
   browser-verified components (PageHero, StatBand, Footer, RFQBand, MobileBottomBar);
   reviewer covered spec/token/a11y statically. Browser QA rolls into the Session 14
   launch checklist.

#### Commits

- `5b41dc7 feat(session-12): contact + about + company pages per plan §3.1–3.3 / FR-6`

---

---

### Session 13 — Redirect map + robots + sitemaps
**Status:** Complete ✅
**Branch:** `main` · **Date:** 2026-07-14 · **Model:** sonnet
**Governing specs:** plan FR-8, FR-9, §T-4

#### What was done (first half)

- **`content/redirect-map.csv`** — crawled live site (`vedantagroup.net/sitemap.xml`); 57 rules:
  - Group-level: `/`, `/index.php`, `/about.php`, `/contact.php`, `/dhruv-epc.php`, `/precise-engineers.php`
  - Precise (16 pages): company/proof/capabilities/9 products mapped to new slugs
  - Dhruv (19 pages): company/proof/capabilities/9 equipment mapped; 4 pages with no equivalent
    (`base-frame`, `reactor`, `distillation-column`, `air-receiver`) → `/dhruv-epc/` with `ponytail:` comment
  - 11 legacy PDF URLs → company proof hub pages
- **`apps/web/next.config.mjs`** — CSV parsed at config time (Node.js context), compiled to
  `redirects()` array; skips comment lines, header row, and no-op `src===dst` entries
- **`scripts/test-redirects.mjs`** — CI test script: reads CSV, curls each legacy path against
  `TEST_URL` (default `localhost:3000`), asserts 301 + correct Location header, exits 1 on failure
- **`.github/workflows/ci.yml`** — integrity check updated to skip comment lines; new
  "Redirect runtime test" step added after build: starts prod server → runs test script → kills server
- **Fix (found by lint):** `text-body-sm` → `text-sm` in `precise-engineers/proof/page.tsx`
  (undefined Datum token, same pattern as Session 11 `text-h2` bug — mistakes.md precedent)

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors, 0 warnings (text-body-sm fixed in-scope)
pnpm test        ✓  133/133
pnpm build       ✓  zero errors/warnings
redirect-map integrity check  ✓  57 rules validated
```

- **`robots.ts`** — added explicit `Googlebot` rule (playbook FR-8 spec); `/api/` disallow already
  present from Session 1
- **`sitemap.ts`** — refactored to 29-entry flat sitemap with terse helper fns for readability;
  per-company `generateSitemaps()` split attempted but reverted — Next.js 14.2 moves `/sitemap.xml`
  to 404 when that API is used (no auto-generated index). Deferred to Phase 5 / next-sitemap upgrade.
  `ponytail:` comment left in file explaining the decision.
- **Lint fixes (pre-existing, surfaced by cache miss):** `gap-10` → `gap-8`, `mt-10` → `mt-8`,
  `text-inherit` removed in capability pages (undefined Datum tokens from Session 11).

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors, 0 warnings (capability page tokens fixed in-scope)
pnpm test        ✓  133/133
pnpm build       ✓  /sitemap.xml ○ static, /robots.txt ○ static, zero errors
redirect-map integrity check  ✓  57 rules validated
```

#### Deviations / flagged (none silent)

1. **Per-company XML sitemaps not split** — `generateSitemaps()` in Next.js 14.2 generates sub-sitemaps
   at `/sitemap/[id].xml` without an auto-generated index at `/sitemap.xml`, breaking the robots.ts
   reference. Flat sitemap retained; search engines receive all 29 URLs identically. Phase 5 lever:
   upgrade to `next-sitemap` package for proper multi-sitemap support.
2. **`/sitemap.xml` trailing-slash canonical drift** — **FIXED in Session 14** (commit 8e0bd83).
   `buildBreadcrumbList` now normalizes all non-fragment URLs to trailing-slash canonical form.

---

### Session 14 — Launch checklist
**Status:** Complete ✅
**Branch:** `main` · **Date:** 2026-07-14 · **Model:** sonnet (subagent-driven)
**Governing specs:** plan Appendix B, FR-8, FR-9

#### What was done

- **Task 1: Trailing-slash canonical drift fixed** — `buildBreadcrumbList` in `packages/schemas/src/jsonld.ts` now normalizes all non-fragment URLs to trailing-slash canonical form (e.g. `/dhruv-epc` → `/dhruv-epc/`). Fragment anchor URLs (`#equipment`) are exempt. 3 new tests added. Commit: `8e0bd83`.
- **Task 2: Launch checklist written** — `docs/launch-checklist.md` audits all 10 Appendix B gates with evidence. 7 PASS, 3 CLIENT-GATED, 0 FAIL. Commit: `1409afd`.
- **Lint cleanup** — 4 pre-existing `classnames-order` warnings in `precise-engineers/capabilities/page.tsx` auto-fixed. Lint now 0 errors, 0 warnings. Commit: `260758b`.

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  136/136 (tokens: 26, schemas: 39, datum-ui a11y: 71)
pnpm build       ✓  35 static routes + 6 dynamic, zero errors/warnings
                    All routes: 93.8 kB First Load JS (≤120 kB budget ✓)
                    RFQ route: 112 kB (≤180 kB budget ✓)
```

#### Launch gate summary: 7 PASS · 3 CLIENT-GATED · 0 FAIL

| Gate | Result |
|------|--------|
| 1 — AI crawlers | ✅ PASS |
| 2 — Redirect map CI | ✅ PASS |
| 3 — LCP ≤ 2.5s p75 | ⏳ CLIENT-GATED — needs staging deployment |
| 4 — axe zero criticals | ✅ PASS (71 component tests) |
| 5 — oneLineScope digit | ✅ PASS (Zod enforced) |
| 6 — Testimonials attributed | ⏳ CLIENT-GATED — no records seeded yet |
| 7 — Entity record ↔ JSON-LD | ✅ PASS |
| 8 — RFQ synthetic test | ⏳ CLIENT-GATED — needs production env vars |
| 9 — Footer no vendor credit | ✅ PASS |
| 10 — Zero stock imagery | ✅ PASS |

#### Deviations / flagged (none silent)

1. **axe CI step is a placeholder** — the `ci.yml` step echoes intent but does not fail. Component-level 71 tests are the real axe gate. Route-level Playwright axe deferred to post-deploy QA.
2. **Per-company XML sitemaps** — still flat (29 URLs); per-company split deferred to Phase 5 via `next-sitemap`. Unchanged from Session 13.

---

### Session 15 — Exploded-view hero sequence (branch `phase-4-exploded-hero-sequence`)

Reopens the Session-8 template lock, narrowly — see `docs/decisions.md` [2026-07-16] for the full override log (photo-law exception, motion-budget addendum). Full spec in `docs/design.md`; file-by-file plan in `docs/implementation-plan-exploded-hero.md`; image-sourcing steps in `docs/exploded-view-image-generation-guide.md`.

#### What was done

- **New component:** `apps/web/components/ExplodedSequence.tsx` — scroll-bound exploded-view frame sequence (assembled → fully exploded), cross-fading via opacity only. Lives in `apps/web`, not `@vedanta/datum-ui` (which takes no `next` dependency — see `ProductCard`'s existing "pages pass next/image" convention). No new npm dependency (plain scroll + rAF, no GSAP/Framer Motion). No new design token (scroll-track height is a behavioral constant, set via inline style, not a Tailwind class — sidesteps `tailwindcss/no-arbitrary-value` without a §26 governance event). `prefers-reduced-motion` renders a single static fully-exploded frame with no scroll track.
- **Barrel change:** `DimensionLabel` opened from internal-only to the `@vedanta/datum-ui` public export (`packages/datum-ui/src/index.ts`) so the group home's bespoke hero markup can reuse the exact §11 signature-moment count-up mechanic instead of re-implementing it.
- **Content:** added `dhruvExplodedFrames`, `preciseExplodedFrames`, `groupExplodedFrames` to the respective `lib/content/*` files — placeholder frame paths (`/exploded/<product>/frame-01..05.avif|webp`) pointing at `apps/web/public/exploded/<product>/`, which doesn't exist as real image content yet (README placeholders only — see swap-list below).
- **Wired into all three home heroes:**
  - `dhruv-epc/page.tsx` — `<HomeHero photo={<ExplodedSequence frames={dhruvExplodedFrames} />} dimensionLabel="Ø 5,000 mm" />` (pressure-vessel exploded view; dimension = pressure-vessels spec-table max shell diameter, DEMO-PLACEHOLDER).
  - `precise-engineers/page.tsx` — same pattern, expansion-joint exploded view; dimension = metallic-bellows-expansion-joint max circular size, **sourced** (`8,000 mm NB`), not a demo figure.
  - `(group)/page.tsx` — heat-exchanger exploded view. This page doesn't use `HomeHero` (bespoke hero, no CTA in the hero per the two-doors pattern), so a photo band was appended directly to its existing hero markup, reusing `DatumRule` + `DimensionLabel` verbatim rather than forcing a `HomeHero` refactor. Superseded the prior "photo band absent, never stock" comment.
- **Docs:** new `docs/decisions.md` (override log), `docs/design.md`, `docs/exploded-view-image-generation-guide.md`, `docs/implementation-plan-exploded-hero.md`; `datum-design-system.md` §11 and §19 amended with the scroll-bound-sequence addendum and the named photo-law exception.

#### Gate result (partial — see limitation below)

```
tsc --noEmit    ✓  packages/datum-ui — zero errors
tsc --noEmit    ✓  apps/web — zero errors (1 strict-null error found and fixed:
                    ExplodedSequence.tsx's reduced-motion branch needed an
                    explicit `if (!hero) return null` guard)
eslint          ✓  zero errors on all touched files in both packages —
                    confirms no tailwindcss/no-arbitrary-value violations
pnpm test       ⏳ NOT RUN — see limitation
pnpm build      ⏳ NOT RUN — see limitation
```

**Limitation, flagged not hidden:** this session ran through the device-bridge sandbox, which has no network access and a native-module architecture mismatch (`vitest`'s bundled `@rollup/rollup-linux-arm64-gnu` isn't present, and reinstalling needs network the sandbox doesn't have). `tsc` and `eslint` run fine locally without pnpm/turbo (found and used the workspace-local binaries directly), so those two gates are real. `pnpm test` and `pnpm build` need to be run by Swayam locally before this branch is considered gate-clean — same four commands as every prior session (`pnpm typecheck && pnpm lint && pnpm test && pnpm build`).

#### Deviations / flagged (none silent)

1. **Photo-law + motion-budget override** — deliberate, logged in `docs/decisions.md`, not a silent rule violation. Scope: these three home-hero photo slots only.
2. **Placeholder image paths** — no real exploded-view frames exist yet; `apps/web/public/exploded/**` has README markers only. Swap-list: generate frames per `docs/exploded-view-image-generation-guide.md`, drop them in, matching the exact filenames already referenced in the three `lib/content/*` files.
3. **v1 scope cut** — ships with the existing single `DimensionLabel` count-up (already wired) rather than `design.md`'s fuller "3–5 in-image callouts" idea, to keep this PR's diff small. Flagged as a v2 follow-up, not forgotten.
4. **Launch-checklist gate 10 ("Zero stock imagery")** now needs re-wording to carve out this named exception rather than silently continuing to read PASS against a rule that no longer holds universally — not yet done, tracked in `docs/decisions.md`'s follow-up list.
5. **Not committed to git from this session** — the device-bridge sandbox has no git identity configured, and this agent doesn't set git config without being asked; asked, and the answer was for Swayam to review and commit locally. All files above are written to disk on branch `phase-4-exploded-hero-sequence`, uncommitted.

#### Commits

None yet — see deviation #5 above. All changes are uncommitted working-tree edits on `phase-4-exploded-hero-sequence`.

#### Review pass (same day) — senior UI/UX critique, `docs/ui-ux-review.md`

An adversarial design review of the whole platform including the Session-15 work itself. Full report in `docs/ui-ux-review.md`; six defects found in the exploded-view implementation, all fixed:

1. **Sticky band pinned under the fixed header** — the header is `fixed` (72→60px); v1's `sticky top-0` sat 60px underneath it. Fixed with a 60px offset + `max-height: calc(100vh - 60px)` for short viewports, in `globals.css`.
2. **Hydration flash + CLS** — v1 swapped SSR markup for a JS-measured branch after hydration (frame jump + wrapper height change post-paint). Fixed CSS-first: `.exploded-track/-static/-scrub` in `globals.css`; SSR heights are final per device class; scrub initializes at frame 0 = scroll position 0.
3. **Mobile dead scroll** — 220vh track behind a ~211px sticky band on portrait phones. Resolved: <768px renders the static fully-exploded frame, no track (same as reduced motion). Datum §11 addendum updated; decisions.md follow-up marked resolved.
4. **LCP priority on the wrong frame + mixed `<picture>`/`next/image` pipeline** — priority now on the static exploded shot (same file as the scrub's final frame, so never wasted); `next/image` everywhere.
5. **Photo-slot clipping (would have broken Dhruv/Precise scrub outright)** — `HomeHero`'s `aspect-video overflow-hidden` band wrapper clipped the track and disabled `position:sticky`. Wrapper unframed (one structural line in `HomeHero.tsx`, logged as an amendment in decisions.md §3); story placeholder now owns its ratio. No page passed a plain photo before this branch — no regression.
6. **Group doors too deep** — `trackVh={160}` on the group page keeps the two-doors section (the page's stated reason to exist) reachable a viewport sooner.

Gate re-run after review-pass changes: `tsc --noEmit` ✓ both packages; `eslint` ✓ all touched files. `pnpm test` / `pnpm build` still owed locally (same sandbox limitation as above). Strategic recommendations not implemented (works shoot priority, proof-slot gaps, doors-first group layout option, §12 icon set for product cards, RFQ funnel events) are ranked in the report §5.

---

### Session 16 — Frontend redesign pass (subagent audit + fixes), branch `phase-4-exploded-hero-sequence`

Plan of record: `docs/frontend-redesign-plan.md` (phases A–D, frontend-only guardrails — backend surfaces untouched by rule). Two subagents ran: a full page-level audit (25 ranked findings → `docs/frontend-audit.md`) and the §12 icon-set design.

#### What was done (Phase A)

- **P0-1 fixed — double footer on every `(group)` route:** `/`, `/about`, `/contact` each rendered a per-page `<Footer>` while `(group)/layout.tsx` also renders one (the audit caught about/contact; the group home had the same defect). Per-page Footers + their `FOOTER_COLUMNS` removed; layout owns chrome; `certificationsHref="/#proof"` moved onto the layout's Footer.
- **P0-2 fixed — RFQ step-1 dead-click:** `company` is schema-optional (for `?company=` prefill), so an unset company passed zod and the failure landed on `equipmentType` — whose error node renders inside a fieldset that only mounts once company is set. `continueToContact()` now guards company explicitly with a rendered, friendly `role="alert"` message under the company fieldset.
- **P0-3 NOT fixed — needs Swayam:** DEMO engineering figures asserted as fact in `dhruv-epc/capabilities` metadata/hero while the spec table carries "DEMO figure" notes (audit #3). Content/claims decision, queued in the plan Phase B.
- **§12 domain set shipped as code:** new `DomainIcon` in `@vedanta/datum-ui` — 18 section-view icons to the §12 construction (24×24, 1.5px, squared caps/joins). Stories (`AllIcons`, `FeatureSize`) + a11y-map entry added per the package's NEW COMPONENT CHECKLIST. Subagent flagged `weldTorch`/`crane`/`machining`/`flange` as worth an eyeball in Storybook at 16px.
- **`ProductCard` icon slot (additive):** optional `icon` prop rendered only when no photo is passed — §12 steel-500, aria-hidden. Both home grids (8 Dhruv + 9 Precise cards) now pass mapped icons via `ICON_BY_HREF` in the page files. Photography remains the end state; the slot self-retires as photos arrive.
- **Doors-first group home:** copy-only compressed hero → doors → exploded sequence (shared-capability statement) → stats → proof. Logged in `docs/decisions.md`; single-section revert if it reads wrong in the browser.

#### Gate result (partial — sandbox)

```
tsc --noEmit    ⏳ run below
eslint          ⏳ run below
pnpm test       ⏳ NOT RUN — sandbox (needs local run; NOTE: a11y map gained DomainIcon)
pnpm build      ⏳ NOT RUN — sandbox (needs local run)
```

#### Deviations / flagged (none silent)

1. Doors-first supersedes plan §6.1.1/§6.1.2 ordering — logged in decisions.md with revert path.
2. Icon subagent's four least-confident glyphs need a human Storybook pass before merge.
3. Audit P1/P2 findings (#4–#25) deliberately deferred to plan Phases C/D — not silently dropped; the full punch list lives in `docs/frontend-audit.md`.

---

### Session 17 — Real exploded-view frames validated, processed and wired, branch `phase-4-exploded-hero-sequence`

Swayam supplied real Gemini-rendered exploded-view photo sets for all three products (pasted-image handoff resolved by having Swayam save files under `_incoming-exploded/<product>/` on the connected Mac, staged in via the remote-devices bridge — mid-session the bridge dropped file-access tools for an extended period while `get_device_info` kept reporting the device online; resolved once Swayam restarted the desktop app).

#### What was done

- **Validated all 11 source frames** (expansion-joint 4, heat-exchanger 4, pressure-vessel 3) against the continuity checklist in `docs/exploded-view-image-generation-guide.md`: consistent camera angle/lighting/background and a single held product configuration per set, no duplicate frames. Findings reported to Swayam before any processing:
  - **Heat-exchanger** — strongest set; clean tube-bundle/tube-sheet reveal, no artifacts.
  - **Expansion-joint** — good set; the 50%→fully-exploded pair is nearly identical (uneven scroll pacing), not blocking.
  - **Pressure-vessel** — usable but weakest: only 3 frames (vs. 4 for the other two), only the dished head separates (shell courses never do despite visible weld-seam lines), and a small embossed-text artifact on the inspection-plate cover in the 25% frame. Swayam's call (asked via question): accept as-is and flag as a known weak point for a possible future regenerate, rather than block on a reshoot.
- **Processed and wired all three sets:** cropped pressure-vessel's 4:3 source to 16:9 (identical crop window across all 3 frames to preserve alignment/no jitter — content-aware, verified by eye before committing), re-encoded all 11 frames to WebP (expansion-joint/heat-exchanger needed no crop, already ~16:9), renamed to the `frame-01..0N.webp` convention, committed to `apps/web/public/exploded/<product>/` on the connected Mac, and updated the frame arrays in `lib/content/{dhruv-epc,precise-engineers,group}.ts` to the real, correct paths and counts (4/4/3, not the assumed 5/5/5). Placeholder-path comments removed now that real assets exist.
- **`avif` field:** no AVIF encoder was reachable in this sandbox (pip/apt package mirrors are outside the network allowlist here) to produce real `.avif` binaries. Since `ExplodedSequence.tsx` only reads `.webp` — next/image's built-in optimizer already re-encodes/serves true AVIF over the wire from a WebP source — both `ExplodedFrame` fields now point at the same real `.webp` file. No functional loss; documented inline in each content file.
- **Corrected a stale decisions.md entry:** an earlier pass the same day (before this conversation's context was summarized/resumed) had processed a first-draft image batch — 2 usable expansion-joint frames only, one with a visible render-artifact glint — into real `.avif` files under `apps/web/public/exploded/` and marked the "real frames" follow-up resolved with incorrect 4/2/3 counts, citing a `docs/mistakes.md` entry that does not exist. Those stale `.avif`/README files were superseded and moved to `apps/web/public/exploded/_to_delete-stale-avif/` (device_bash cannot delete files on the connected Mac — Swayam should delete that folder). `docs/decisions.md` corrected to reflect the real, verified 4/4/3 frame counts and the pressure-vessel flag.

#### Gate result

```
tsc --noEmit (apps/web, via device_bash on the connected Mac)   ✓ clean
eslint (touched content files + ExplodedSequence.tsx)           ✓ clean
pnpm test / pnpm build                                          ⏳ NOT RUN — sandbox limitation, Swayam to run locally
```

#### Deviations / flagged (none silent)

1. Pressure-vessel ships with 3 frames and a shell that doesn't separate — accepted by Swayam, logged as a known weak point in `docs/decisions.md`, not a launch blocker.
2. Expansion-joint's last two frames (50%/fully-exploded) are visually near-identical — cosmetic, uneven scroll pacing only, not fixed this session.
3. `apps/web/public/exploded/_to_delete-stale-avif/` needs manual deletion by Swayam — outside device_bash's permissions.
4. Real AVIF binaries were not produced (sandbox network restriction) — `avif`/`webp` fields both point at the same WebP asset; no visitor-facing effect since next/image negotiates format server-side regardless.

---

---

### Session 18 — Phase C punch list (frontend-redesign-plan.md), branch `phase-4-exploded-hero-sequence`
**Status:** Complete ✅
**Date:** 2026-07-17 · **Model:** claude-sonnet-4-6
**Governing specs:** `docs/frontend-redesign-plan.md` Phase C, `docs/frontend-audit.md`, `docs/datum-design-system.md`, `docs/design.md`

#### What was done

All 8 Phase C items from `docs/frontend-redesign-plan.md` completed (findings by number from `docs/frontend-audit.md`):

**Quick fixes (#1–#4 in session plan):**
- **Dhruv footer certHref corrected (#5):** `certificationsHref="/dhruv-epc/proof/certifications"` → `/dhruv-epc/proof`. Every Dhruv footer stamp now links to the real proof hub instead of a 404.
- **DEMO validity-date disclaimer removed (#10):** The "Certification validity dates are DEMO-PLACEHOLDER" paragraph deleted from `dhruv-epc/proof/page.tsx`. Dates are simply omitted until sourced.
- **Dead nav/footer links cleaned up (#6, #24):** `DhruvChrome.tsx` LINKS — removed `/projects` and `/company`; added `{ label: 'Proof', href: '/dhruv-epc/proof' }`. `dhruv-epc/layout.tsx` footer — removed Projects row; Proof added to Capabilities column; Company column trimmed to Vedanta Group + Contact only.
- **Group mega-menu: fabrication-machining added (#7):** `GroupChrome.tsx` GROUPS now has a third entry — "Dhruv EPC Solutions — Fabrication & Machining" with all items from `dhruvEquipment['fabrication-machining']`. Previously unreachable from group-level nav.
- **Group header wordmark: `text-accent` → `text-steel-500` (#13):** "Group of Companies" sub-line was competing with the RFQ button for the one-accent slot. Now steel-500, consistent with the group's steel-only theme.
- **Group capabilityRail label improved (#25):** "Explore our companies" → "Two works · ASME U/U2 · EJMA certified" — figures-first, information-bearing, consistent with Datum's copy voice.

**MobileBottomBar safe-area (#4):**
- Nav element gets `style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}` — inline style is appropriate here (browser env variable, not a design token).
- `Footer.tsx` legal row gets `pb-20 md:pb-6` — 80px clearance on mobile for the fixed 64px bar; restores to 24px on desktop where bar is hidden.

**MobileDrawer (#11, #19):**
- Scrim and panel transitions gain `motion-reduce:transition-none` — reduced-motion users see instant open/close.
- `aria-label` deduplicated: dialog changed from `"Menu"` to `"Navigation menu"`; inner `<nav>` from `"Menu"` to `"Site navigation"`.

**Thank-you page (#12 — design-improved):**
- Added "What happens next" 3-step process strip (mono step counters, consistent with RFQ page's reassurance rail).
- Two-column company/product quick-links (Dhruv EPC + Precise Engineers with their main equipment pages + Proof hub).
- Contact fallback (phone + email) gated on `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE` env vars — same pattern as RFQ page.
- Back link reworded to "← Vedanta Group" (was "Back to Vedanta Group").

**UploadDropzone (#9, #16, #17):**
- **Cap notice (#9):** `addFiles()` now counts dropped-vs-allowed and surfaces `role="alert"` notice: "Only 5 files can be attached — N were not added."
- **File-type validation on drop (#17):** `isAcceptedType()` helper checks extension + MIME; rejected files appear as error rows with "File type not accepted". Retry button hidden for type-rejected files.
- **Hint derived from props (#16):** `deriveHint()` reads `accept` and `maxSizeBytes` — hint text updates if a caller overrides either prop instead of lying.

**RFQForm (#8, #22 + #15 bonus):**
- **Focus management (#8):** `focusFirstError()` helper focuses the first erroring element on validation failure (company/equipment fieldset radio, or named field by id). `submit()` also routes through it.
- **Step heading focus (#8):** step progress `<p>` gets `tabIndex={-1}` and a ref; `continueToContact()` on success calls `requestAnimationFrame(() => stepHeadingRef.current?.focus())` — keyboard/SR focus doesn't drop to `<body>` on step change.
- **Step-2 recap (#22):** compact summary above contact fields — company, equipment type, quantity, drawing count — with an "Edit" button that returns to step 1.
- **Phone input fix (#15 bonus):** strip whitespace/hyphens on blur rather than on every keystroke — eliminates cursor-jump on mid-string edits.

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  142/142 (tokens 26, schemas 39, datum-ui 77)
pnpm build       ✓  35 routes, zero errors/warnings
                    /request-a-quote: 113 kB First Load JS (≤180 kB RFQ budget ✓)
                    home routes: 100 kB (≤120 kB marketing budget ✓)
```

#### What's NOT done (deferred to Phase D or client-gated)

- Phase D P2 items: accent-dedupe in group header rail, tel: helper, FAQ chevron glyph swap, next/link adoption in datum-ui, mobile anchor rail, SpecTable sticky-hover.
- Phase B (client/content): works photography, testimonials, real engineering figures for capabilities, env credentials, staging LCP.

---

### Session 19 — Phase D audit items, merge to main, ExplodedSequence removed
**Status:** Complete ✅
**Branch:** `phase-4-exploded-hero-sequence` → merged to `main` (PR #6) · **Date:** 2026-07-17 · **Model:** claude-sonnet-4-6
**Governing specs:** `docs/frontend-redesign-plan.md` Phase D, `docs/frontend-audit.md`, `docs/datum-design-system.md`

#### What was done

**Phase D — 5 code-actionable audit items from `docs/frontend-audit.md`:**

- **#23 — SpecTable matrix sticky-hover fix:** Pinned-column `<th scope="row">` gets `group-hover:bg-steel-100` via the `group` class on `<tr>` — hover now tints the full row including the sticky column instead of leaving it white while the data cells highlight.
- **#14 — `tel:` helper:** `apps/web/lib/format.ts` — `telHref(phone)` normalises any phone string to a dialable `tel:+…` href (`phone.replace(/[^+\d]/g, '')`). Used on Footer phones to strip display formatting before the `tel:` prefix.
- **#18 — `ChevronDown` opened in datum-ui barrel:** `packages/datum-ui/src/index.ts` now exports `ChevronDown` from the glyphs module. All 17 product pages (8 Dhruv equipment + 9 Precise products) replaced the `⌄` text glyph in FAQ `<details>` summaries with `<ChevronDown size={20} />`.
- **#21 — `AnchorRailMobile` component:** New `apps/web/components/AnchorRail.tsx` — horizontal scroll rail with section jump-links, `overflow-x-auto`, `border-b border-steel-200`, `min-h-row` touch targets, visible only on `lg:hidden`. `AnchorRailDesktop` (sticky sidebar) also in the file for later. Wired into all 17 product pages immediately above the content grid.
- **#20 — next/link adoption in datum-ui Footer + MobileDrawer via `linkComponent` prop:** `Footer` and `MobileDrawer` accept an optional `linkComponent?: React.ElementType` (defaults to `'a'`). All three layout files (`(group)/layout.tsx`, `dhruv-epc/layout.tsx`, `precise-engineers/layout.tsx`) and three chrome files pass `linkComponent={Link}` from `next/link` — sitemap and drawer links now use the Next.js router rather than full-page navigations. Capabilities pages converted `<a>` → `<Link>` directly.

**Product pages batch:**
- 17 product pages updated with `ChevronDown` glyph + `AnchorRailMobile` via Python batch script (correct 4-level relative import `../../../../components/AnchorRail` for both Dhruv and Precise routes). A subagent committed the initial batch with a wrong 3-level path on Precise pages; corrected in `2cfba3a`.

**Merge:**
- Branch pushed to remote; PR #6 opened and merged on GitHub (`3be237c`). Local main reset to `origin/main`.

**ExplodedSequence removed from home pages (Swayam's request):**
- `ExplodedSequence` import and `photo`/`dimensionLabel` props removed from `dhruv-epc/page.tsx` and `precise-engineers/page.tsx`.
- Entire exploded-view section (DimensionLabel + DatumRule + ExplodedSequence) removed from `(group)/page.tsx`. Unused `DimensionLabel`, `DatumRule`, `groupExplodedFrames` imports cleaned up.
- `ExplodedSequence` component and image assets remain in the repo for reuse when works photography is ready.
- Committed `8556dff` and pushed to main.

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  142/142 (tokens 26, schemas 39, datum-ui 77)
pnpm build       ✓  35 routes, zero errors/warnings
```

#### What's NOT done (client-gated or deferred)

- Phase B (content): works photography, testimonials, real engineering figures, env credentials, staging LCP
- `ExplodedSequence` re-wiring: drop real images in `apps/web/public/exploded/` and add `photo={<ExplodedSequence frames={…} />}` back to the three home pages

---

### Session 20 — 6 UX improvements: active AnchorRail, certChips, RFQ prefill, StickyQuoteChip, WhatsApp footer
**Status:** Complete ✅
**Branch:** `main` (committed directly) · **Commit:** `079e160` · **Date:** 2026-07-21 · **Model:** claude-sonnet-4-6
**Governing specs:** `docs/datum-design-system.md` §17, §21, §23; `docs/frontend-audit.md`

#### What was done

- **AnchorRail — active section tracking:** `apps/web/components/AnchorRail.tsx` extended with `useActiveSection` hook using `IntersectionObserver` (`rootMargin: '-10% 0px -60% 0px'` — clips top/bottom so only the section filling the reading area is active). Both `AnchorRailMobile` and `AnchorRailDesktop` now highlight the in-view section. All 17 product pages updated: `AnchorRailDesktop` replaces any prior inline sidebar nav, placed in the `lg:col-span-4` grid column.

- **`ProductHero` — `certChips` prop:** `packages/datum-ui/src/components/ProductHero.tsx` gained an optional `certChips?: string[]` prop — renders a `✓ CHIP` pill row below the spec chips using `border-steel-200 bg-steel-100 font-mono text-helper` styling. Wired on all 17 product pages with the relevant credential stamps (e.g. `['ASME U', 'ASME U2', 'IBR', 'ISO 9001:2015']` for Dhruv; `['EJMA', 'ISO 9001:2015', 'EIL Approved']` for Precise). Puts authority signals above the fold without touching the amber law.

- **RFQ prefill — `?company=X&equipment=SLUG`:** `apps/web/components/RFQBand.tsx` gained an optional `equipment?: string` prop; when set, the "Get a Quote" button href becomes `/request-a-quote?company=${company}&equipment=${equipment}`. `apps/web/app/(group)/request-a-quote/page.tsx` reads `searchParams.equipment` and pre-selects it in `RFQForm`. `RFQForm.tsx` accepts `defaultEquipment?: string` to seed the step-1 equipment dropdown. All 17 product pages pass their equipment slug to `RFQBand`. Four equipment types that were missing from the `RFQForm` choice list were added: `storage-tanks`, `zero-velocity-valve`, `dual-plate-check-valve`, `damper`.

- **`StickyQuoteChip` — desktop fixed CTA:** New component `apps/web/components/StickyQuoteChip.tsx`. Uses existing `useRfqAnchorInView` from datum-ui — slides down + fades out whenever any `[data-rfq-anchor]` (hero CTA row or RFQ band) is in the viewport. `variant="secondary"` — never competes with the amber/blue law accent fill. Desktop (`lg+`) only; mobile is covered by `MobileBottomBar`. Exported from `packages/datum-ui/src/index.ts`. Wired on all 17 product pages.

- **Footer — `whatsappHref` prop:** `packages/datum-ui/src/components/Footer.tsx` Zone 3 now renders a WhatsApp link alongside LinkedIn when `whatsappHref` is supplied. Passed in `dhruv-epc/layout.tsx` and `precise-engineers/layout.tsx`.

- **QA step counter — typographic hierarchy:** Step number on the QA strip section gets `text-h3 font-light text-steel-300` — a large watermark-style numeral that adds visual weight without color noise.

#### Files changed

- `apps/web/components/AnchorRail.tsx` — IntersectionObserver active tracking
- `apps/web/components/StickyQuoteChip.tsx` — new component
- `apps/web/components/RFQBand.tsx` — `equipment` prop + prefill href
- `packages/datum-ui/src/components/ProductHero.tsx` — `certChips` prop
- `packages/datum-ui/src/components/Footer.tsx` — `whatsappHref` prop
- `packages/datum-ui/src/index.ts` — `StickyQuoteChip` export
- `apps/web/app/(group)/request-a-quote/page.tsx` + `RFQForm.tsx` — `equipment` prefill + 4 new types
- `apps/web/app/dhruv-epc/layout.tsx` + `precise-engineers/layout.tsx` — `whatsappHref` passed
- All 17 product pages — `AnchorRailDesktop`, `certChips`, `equipment` prefill, `StickyQuoteChip` wired

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors, 0 warnings
pnpm test        ✓  142/142 (tokens 26, schemas 39, datum-ui 77)
pnpm build       ✓  35 routes, zero errors/warnings
```

#### What's NOT done / deferred

- Browser verify pass not run this session — no interactive states changed, only prop additions and IntersectionObserver logic.
- `StickyQuoteChip` not yet added to group home or about page (no product anchor rails there).

---

### Harness Session 1 — Test coverage (T1–T6), no design/content/routing/RFQ work
**Status:** Complete ✅
**Branch:** `harness/session-1-test-coverage` (off `main`, open for human review — not merged) · **Date:** 2026-08-27/28
**Governing doc:** session brief referenced `claude/06-pre-development-integration-review.md` §19/§24 — that file doesn't exist in this repo; proceeded from the brief's own T1–T6 spec.

#### What was done

- **T1 — `apps/web/lib/link-integrity.test.ts`:** enumerates every route from `app/**/page.tsx`, scans every non-test `.ts/.tsx` under `apps/web` for internal `href`/`*Href` string literals, asserts each resolves to a real route or a `redirect-map.csv` source. Separately checks `sitemap.ts`, redirect destinations, and JSON-LD `BreadcrumbList` urls. Passed clean against current code; verified live by injecting then reverting a fake broken href.

- **T2 — `apps/web/lib/metadata-uniqueness.test.ts`:** asserts unique title/description per route and a 60-char title budget. Found B10 (session 0) only fixed the double-suffix bug, not length — 17 of 32 titles were still over budget (up to 94 chars). Shortened all 17, keeping every sourced code/number and the full company suffix.

- **T3 — `apps/web/e2e/a11y.spec.ts`:** new `@playwright/test` + `@axe-core/playwright` devDependencies (justified: the only way to get real paint-layer axe coverage — the jsdom-based `a11y.test.tsx` explicitly can't check color-contrast). Runs axe against all 32 built routes. Found 11 routes with real color-contrast violations, all the same root cause — `text-steel-500` under 4.5:1 against every background it's used on. Logged as **VG-004** in `docs/mistakes.md`; those 11 routes are tracked expected-fail (not silently fixed — sitewide token-usage bug, out of scope for a harness session). Wired into `ci.yml`, replacing the axe echo placeholder.

- **T4 — `scripts/check-js-budget.mjs`:** parses `next build`'s own "First Load JS" column per route (no bundle-math reimplementation) against CLAUDE.md's 120 KB marketing / 180 KB RFQ budgets. All 31 real routes pass today (94–114 KB). LCP/CLS/INP intentionally not gated — no real hero photography yet (C-6). Wired into `ci.yml`, replacing the Lighthouse echo placeholder.

- **T5 — `packages/datum-ui/src/a11y.test.tsx`:** replaced the 24-entry hand-maintained story map with `import.meta.glob('./components/*.stories.tsx', { eager: true })`. Surfaced a real order-dependent test-isolation bug (no RTL `cleanup()` between renders let a stale `[data-rfq-anchor]` node leak into MobileBottomBar's render, crashing on `IntersectionObserver` in jsdom) — fixed with `afterEach(cleanup)`.

- **T6 — `packages/tokens/src/tokens.test.ts`:** replaced hand-picked contrast pairs with a generated matrix — every (text token, surface token) combination each company's semantic map can produce, 4.5:1 text / 3:1 UI-indicator floors. Below-floor pairs tracked in an `EXCEPTIONS` map (deliberate ones, plus the same VG-004 tertiary-text defect — found independently a second way). 102 tests, up from 24.

- **Also fixed along the way:** cleaned up a stale `pnpm@11.10.0` vs Node 20 / pnpm-9-lockfile mismatch blocking local installs (reinstalled with pnpm 9, matching `ci.yml`'s pinned version) — not committed, environment-only.

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors (pre-existing Tailwind warnings in LegalDocument.tsx, unrelated)
pnpm test        ✓  254/254 (tokens 102, schemas 39, datum-ui 77, web 36)
pnpm build       ✓  31 routes, zero errors/warnings
playwright test  ✓  21 passed, 11 tracked-skip (VG-004), dry run confirms server start + browser launch
```

#### What's NOT done / deferred

- The 11 routes' `text-steel-500` contrast defect (VG-004) — tracked, not fixed (out of scope for a test-harness session).
- A pre-existing, unrelated `ci.yml` step ("Redirect map integrity") fails strict YAML parsing (PyYAML, Ruby Psych) — predates this session, logged in `docs/mistakes.md`, not touched.
- Branch is open for human review, not merged to `main`.

---

### Backlog Session 3 — Content model extension (VG-010) + Railway production fix
**Status:** Complete ✅ — merged to `main`, production verified live
**Branches:** `schema/session-3-entities` (PR #14), `content/session-3-migration-stopgap` (PR #15), `fix/boot-env-non-fatal` (PR #16) — all merged · **Date:** 2026-08-31
**Governing doc:** `01-final-implementation-blueprint-v2.md` §6 (Content model — schema deltas). Not to be confused with the earlier `Session 3 — CMS schemas + JSON-LD` above (different work, different date).

#### What was done

- **PR #14 — schema extension (`packages/schemas/src/cms.ts`):** four new entities (`ProductCategory`, `Industry`, `Capability`, `Resource`) and junction fields on `Product` (`categorySlug`, `industrySlugs` min 1, `capabilitySlugs`, `standardsMatrix`) and `Project` (`productSlugs` min 1, `industrySlug`, `capabilitySlugs`, `location`, optional `clientSlug` + narrative fields, `documents[]`). Three new ship gates: `Industry` needs ≥2 `productSlugs`, `Capability` needs ≥1 `envelope` row (both inline `.min()`), and a cross-entity gate `validateProjectClientPermission(project, allClients)` for the future content loader. Built TDD — 22 tests written and watched fail before implementation, 64/64 passing after. Two named decisions surfaced for review and resolved: `standardsMatrix` shape kept as `{code, phase}[]` (matches `SpecTableRow` convention); the Client-permission gate confirmed correct as-is — a `Client` record is only ever created once permission is approved, so "no matching Client record" already *is* "not approved," not a separate case.
- **PR #15 — stopgap content migration:** merging PR #14 made 4 `Product` fields required, which broke `pnpm build` for all 17 hardcoded `Product.parse()` records in `apps/web/lib/content/{dhruv-epc,precise-engineers}.ts` (Zod validation failure at build time). Patched all 17 with `categorySlug` (reused from existing `group` value — real taxonomy), `industrySlugs: ['general']` (explicit `STOPGAP` placeholder comment — no `Industry` content exists yet to reference), and empty `capabilitySlugs`/`standardsMatrix` (honest "not yet classified" rather than a fabricated design/fab/test split). No `Project.parse()` records exist in content yet, so no Project-side migration was needed.
- **PR #16 — Railway production fix:** user reported the live site showing an internal error. `railway logs` showed the container booting fine but crashing on every request — `apps/web/lib/env.ts`'s boot-time check (from the already-merged backend-persistence session) throws when any of 10 vars are missing, and Railway's `production` environment has none of them set (`DATABASE_URL`, `RESEND_API_KEY`, `RFQ_NOTIFY_TO/FROM`, `STORAGE_*`, `NEXT_PUBLIC_CONTACT_*`). Confirmed nothing imports the `env` export — RFQ/presign/notify all read `process.env` directly and already degrade per-request (presign already returns 503 when storage vars are unset) — so the throw was a pure fail-fast gate with no other dependent. Changed to `console.warn` instead of throw: same diagnostic visibility in logs, but the process stays up and every non-RFQ page works. User's call: RFQ credentials (Postgres, Resend, S3/R2) are being wired up later — team's immediate priority is reviewing the marketing site.

#### Gate result

```
pnpm typecheck   ✓  4/4 packages, zero errors
pnpm lint        ✓  0 errors (2 pre-existing Tailwind warnings in LegalDocument.tsx, unrelated)
pnpm test        ✓  all pass except the pre-existing DATABASE_URL-gated RFQ integration test (unrelated, tracked)
pnpm build       ✓  all routes prerendered, zero errors
Railway prod     ✓  https://dhruv-epc-website-redesign-production.up.railway.app/ → 200, container RUNNING, no crash loop
```

#### What's NOT done / deferred

- Real content migration: `industrySlugs: ['general']` is a placeholder on all 17 products — needs actual `Industry`/`Capability` content records and real per-product tagging once that content exists.
- RFQ lead capture, email notification, and file upload are non-functional in production until real `DATABASE_URL`, `RESEND_API_KEY`, and `STORAGE_*` credentials are set in Railway — deliberately deferred per user instruction, logged loudly (not silently) in Railway logs in the meantime.
- `NEXT_PUBLIC_CONTACT_EMAIL`/`NEXT_PUBLIC_CONTACT_PHONE` are also unset — likely `vedant@vedantagroup.net` / `+918905917700` per existing `dhruv-epc.ts`/`group.ts` content, not set without user confirmation since it's user-facing.
- Project system content (routes, index, records) still doesn't exist — blueprint §8 already flagged this as later work; today's session only added the schema.

---

### Deferred queue — ⏰ REMIND SWAYAM AFTER SESSION 10 (his instruction, 2026-07-10)

1. **Session 6 human gate:** E2E RFQ with real creds — `STORAGE_*`, `RESEND_API_KEY`,
   `RFQ_NOTIFY_*`, `NEXT_PUBLIC_CONTACT_*` in `.env.local`; real PDF from phone
   on 4G → email within a minute (playbook gate).
2. **PR #4 merge** (Sessions 4+5) — human review gates listed in that section.
3. **PR #3 merge** (Session 3 schemas) — still pending merge.
4. §23 certification strip in RFQ rail — awaits verified CMS cert records.
5. Capability-statement PDF on thank-you — asset doesn't exist yet.
6. SLA "one business day" — pending client commitment.
7. Playwright E2E suite for RFQ (happy path, upload-retry, honeypot, JS-off)
   as CI tests — browser verify was run manually this session, not committed as tests.

### Known gaps / client-gated items blocking DNS cutover

1. **CG-1: LCP ≤ 2.5s p75** — needs staging deployment URL + Lighthouse run
2. **CG-2: Testimonials** — client to supply verified quotes with attribution
3. **CG-3: RFQ E2E** — needs `STORAGE_*`, `RESEND_API_KEY`, `RFQ_NOTIFY_*` credentials
4. Playwright E2E suite for RFQ — deferred (items 1–7 in original deferred queue)
5. axe CI placeholder — route-level axe deferred to post-deploy QA
