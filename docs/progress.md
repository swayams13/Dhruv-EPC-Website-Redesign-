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
| 8 | Precise home + Metallic Bellows + group home | phase-3-proving | fable | Not started |
| 9–12 | Scale-out — remaining pages | phase-4-scaleout | sonnet | Not started |
| 13 | Redirect map + robots + sitemaps | phase-5-launch | sonnet | Not started |
| 14 | Launch checklist | phase-5-launch | opus/sonnet | Not started |

### Immediate next: merge PR #4, then Session 6

PR #4 is open: https://github.com/swayams13/Dhruv-EPC-Website-Redesign-/pull/4

Human review gates before merge:
- Preset token additions (Sessions 4 & 5) — §26 design-review
- `@vedanta/schemas` workspace dep in datum-ui
- Manual browser pass: focus rings, reduced-motion, 320px viewport, one accent element per view
- Deviations lists in both session entries above

After merge: Session 6 (RFQ engine) on `phase-3-proving`

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

### Known gaps

- `content/redirect-map.csv` — header row only, Session 13
- Amber-law page-level resolution (deviation 8, Session 5) — Session 7
