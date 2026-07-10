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
| 4 | Component library part 1 — primitives | phase-2-components | **fable** | ✅ Done — PR pending |
| 5 | Component library part 2 — composition | phase-2-components | **fable** | Not started |
| 6 | RFQ engine end-to-end | phase-3-proving | fable | Not started |
| 7 | Dhruv home + Heat Exchangers page | phase-3-proving | fable | Not started |
| 8 | Precise home + Metallic Bellows + group home | phase-3-proving | fable | Not started |
| 9–12 | Scale-out — remaining pages | phase-4-scaleout | sonnet | Not started |
| 13 | Redirect map + robots + sitemaps | phase-5-launch | sonnet | Not started |
| 14 | Launch checklist | phase-5-launch | opus/sonnet | Not started |

### Immediate next: merge PR #3, then Session 4

1. Merge `session-3-schemas` PR #3 on GitHub
2. Session 4: `git checkout -b phase-2-components main`, switch to **fable model** (`/model fable`),
   paste Session 4 prompt from BUILD-PLAYBOOK.md §SESSION 4

### Known gaps

- `packages/datum-ui/src/` — empty, populated in Sessions 4–5
- `content/redirect-map.csv` — header row only, Session 13
