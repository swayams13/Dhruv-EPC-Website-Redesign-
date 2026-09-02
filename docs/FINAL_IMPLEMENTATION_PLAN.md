# FINAL_IMPLEMENTATION_PLAN.md

**Status:** Planning artifact only. No production code has been modified as of this revision.
**Revision note:** this is a full reconciliation around Hero C, which supersedes the prior `align`/`statsOverlay` HomeHero contract. The Claude Design project was independently verified as updated between sessions (re-fetched directly this session; file grew from 98,075 to 99,981 bytes) — this is not a speculative or self-declared change.
**Sources of truth, in citation order:**
- **A** — `docs/VEDANTA_DESIGN_DECISIONS.md` (six locked decisions; Decisions 2 and 6 rewritten this revision for Hero C)
- **B** — `VEDANTA_DESIGN_LANGUAGE.md` (forensics of the client's live site)
- **C** — `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` (token/component spec) — cited by real section numbers only
- **CANVAS** — the live Claude Design project file, cited directly where a detail was verified against it and is more current than the prose notes (Hero C's exact values live here, not in the prose notes, which were not regenerated after the canvas update)
- **D** — the Implementation Readiness Audit (session-start, pre-Decision-Resolution — sections A–J)
- **E** — Required regression fix (mechanical necessity of a change already classified A–D/CANVAS)
- **F** — Verification only
- **DEFERRED** — no source authorizes this
- **SUPERSEDED** — was authorized by an earlier revision, no longer authoritative; kept visible only as history, never implemented

---

## What changed in this revision

**Hero C is now the authoritative `HomeHero` model, replacing `align`/`statsOverlay` entirely.** Verified directly against the live canvas (not assumed from the request): `1f` ("Hero C — split") is labeled in the project itself as *"chosen, applied to 1a and 1b"*. Both `1a` (group) and `1b` (Dhruv) now render a `grid-template-columns: 47fr 53fr` split hero — a dark charcoal type panel beside a plain, unscrimmed photo grid-cell — replacing the full-bleed lower-left hero this plan previously specified. `1c` (product) and `1d` (interior) were re-verified byte-for-byte unchanged.

Consequences, all applied below:
1. `statsOverlay` is retired. It does not appear as a prop, a phase, or a compatibility shim anywhere in this plan. Every prior reference is marked `SUPERSEDED BY HERO C — DO NOT IMPLEMENT`.
2. `HomeHero`'s contract becomes `variant="split"` — a categorically different shape from `align`/photo-as-ground, not a renamed version of it.
3. `align` is retained, but only where it always genuinely applied: `PageHero` (`center`) and `ProductHero` (`lower-left`), both unchanged by Hero C.
4. The `ExplodedSequence` architectural guard moves off `HomeHero` (which no longer has a photo-as-ground slot for it to conflict with) onto `PageHero`/`ProductHero`, whose full-bleed hero pattern is the structurally relevant one, if the feature is ever revived (still deferred).
5. `ProductHero` keeps its own dedicated phase (12) — it is not, and has never been, covered by `PageHero`.
6. Two real, newly-discovered token-contrast findings from the Phase 1 ramp swap are fixed at the value/context level this revision, producing **zero new tracked exceptions** — not documented as acceptable gaps.
7. Typography and `tracking-caption` remain their own phases (2, 3), with the audit's scope corrected to exclude `HomeHero.tsx`/`PageHero.tsx`'s eyebrow sites, which their own hero-rebuild phases convert instead — avoiding an audit commit that a later phase would immediately overwrite.
8. A canvas map and a product-detail coverage matrix are added as their own sections, so no part of `1c` can be silently miscategorized as canvas-only again.

---

## Canvas map (corrected)

| ID | What it is | Status |
|---|---|---|
| `1a` | Group homepage | **Split hero (Hero C) applied** — verified live |
| `1b` | Dhruv EPC homepage | **Split hero (Hero C) applied** — verified live |
| *(no separate canvas instance)* | Precise Engineers homepage | Split hero applied **by symmetry with `1b`** — the canvas never mocks a separate Precise homepage; this is inferred, not directly observed, and flagged as such in Phase 15 |
| `1c` | Product detail hero + page | **Unchanged** — full-bleed, scrim, breadcrumb-on-photo. Re-verified byte-identical to the pre-Hero-C fetch. |
| `1d` | Interior/utility hero | **Unchanged** — full-bleed, scrim (0.35→0.82), breadcrumb-on-photo. Confirmed by `1f`'s own commentary: *"keeping 1d everywhere else."* |
| `1e` | Hero B — lower-left, stats pulled onto the photo | **DEFERRED / not applied.** This is the option `statsOverlay` was built to express. It remains in the canvas as design history but is not the implementation target — superseded by `1f`. |
| `1f` | Hero C — split, charcoal type panel + hard-edged photo | **Chosen — labeled as such in the live canvas.** Governs `HomeHero` for all three homepages. |
| `1g`–`1l` | Header, cards, Seal, footer | Unchanged by this revision — not re-verified this pass beyond confirming the file's total byte growth is fully accounted for by the `1a`/`1b`/`1f` edits alone. |

---

## Decision 2 (Hero) — exact verified values, for direct phase reference

Read from the live canvas, not estimated:

| Property | Group (`1a`) | Dhruv (`1b`) | Precise (inferred) |
|---|---|---|---|
| Grid | `47fr 53fr` | `47fr 53fr` | `47fr 53fr` (by symmetry) |
| Fixed height (≥md) | `600px` | `560px` | `560px` (by symmetry with Dhruv, not group) |
| Type panel background | `steel-900 (#23282D)` | same | same |
| Breadcrumb in type panel | absent (top-level page) | present (`Home → Dhruv EPC Solutions`) | present (by symmetry) |
| Accent rule | 64×2px, `bg-accent`, above eyebrow | same | same |
| Eyebrow color | **accent-dark (brand-300, `#DC8D89`)** — not white | same pattern, company-scoped accent-dark | flex-300 (by symmetry, company-scoped) |
| H1 token | **`text-display` (56px), NOT `text-display-xl` (64px)** | same | same |
| H1 weight/tracking | 700, `-0.02em` | same | same |
| Body copy | `text-body-lg` (19px), `white/72` (was `white/82` on the old hero) | same | same |
| CTA pair | accent-fill + white-outline, unchanged pattern | same | same |
| Photo panel | plain grid cell, **no scrim, no overlay, no type over it** | same | same |
| Photo crop | 4:5 portrait | 4:5 portrait | 4:5 portrait (by symmetry) |
| Datum rule + dimension label | pinned to bottom of the **photo panel** (not type panel, not page) | same | same |
| Stat band | standalone, light, below the hero — unchanged in kind | same | same |

**Flagged, not silently assumed:** the `white/72` body copy is opacity-blended text over `steel-900`, not a solid token. Per this project's own standing rule (`docs/mistakes.md`, 2026-09-01 opacity-contrast incident), its real contrast must be computed against the actual blended RGB in Phase 9, not assumed safe from a naive white-on-dark ratio.

---

## Classification index (every planned production-code change)

### Token foundations

| Change | Class | Citation |
|---|---|---|
| `steel` ramp warm→cool remap | C | IMPLEMENTATION_NOTES §1.1, §0 D-1 |
| `radius.sm` 2px→3px, add `pill`/`full` | C | IMPLEMENTATION_NOTES §1.1 |
| `shadow` recipe (2→3 values, new `hover` step) | C | IMPLEMENTATION_NOTES §1.1 |
| New `overlay` primitive (hero scrim gradients — used by `PageHero`/`ProductHero` only now, not `HomeHero`) | C | IMPLEMENTATION_NOTES §1.1 |
| New `logoRed` primitive, scoped to `Logo.tsx` | A | VEDANTA_DESIGN_DECISIONS.md Decision 1 |
| **`steel[400]` value correction: `#8A8D99` → `#A5A8B2`** | E | Computed this session (WCAG relative-luminance, verified twice independently): `#A5A8B2` on `steel-900` = 6.26:1, on `steel-950` = 7.06:1 — both clear 4.5:1 with margin. Hue-checked against the ramp: 226° (new) vs. 228° (old) vs. 230° (steel-600) — same blue-violet family, lightened, not re-hued, consistent with `primitives.ts`'s own stated derivation method for other steps. **This is a value fix, not a new tracked exception** — see "Contrast findings" below. |
| `globals.css` fallback colors (`#F2F0EA`→`#F5F6F8`) | C | IMPLEMENTATION_NOTES §1.2 |
| `globals.css` new `--overlay-hero*` vars | C | IMPLEMENTATION_NOTES §1.2 |
| `.exploded-scrub{top:60px}` → `76px` | E | Mechanical consequence of the Header height change; independent of `ExplodedSequence`'s live-usage status |
| `tokens.test.ts` — corrected contrast matrix | E | See "Contrast findings" below — expected result: fewer exceptions than before, zero new ones |
| `css-parity.test.ts` — verify only | E | `--accent-*` unchanged; `brand`/`flex` primitives unchanged |
| `__snapshots__/routes-baseline/*` regeneration | E | Per-phase, committed alongside each visual phase — see Snapshot policy |

### Contrast findings — resolved this revision, zero new exceptions

Two real findings surfaced from adopting the spec's exact `steel` values (recomputed independently, not estimated):

1. **`steel-400` (`text.onDarkSecondary`) on the new dark surfaces:** was 4.05–4.49:1 (below the 4.5:1 floor) with the originally-specified `#8A8D99`. **Fixed at the value level**, not by exception: `steel-400` becomes `#A5A8B2` (see token table above), landing at 6.26:1 / 7.06:1. `steel-400` has exactly one semantic consumer (`text.onDarkSecondary`); every direct `text-steel-400` class in components today (`Header.tsx`, `Footer.tsx` `zone1Label`, `HomeHero.tsx`'s old eyebrow, `MegaPanel.tsx`, `StatBand.tsx`'s dark caption) is already an on-dark context, so this fix improves every existing usage — none regress.
2. **`flex-500` focus ring on the new `steel-900` (`precise/focus.ring/dark`):** was 3.05:1 (passing) with the old ramp, now 2.61:1 (failing) with the new one. **Fixed via the existing `data-chrome="dark"` rebinding mechanism**, not a new exception: `globals.css` already rebinds `--accent-focus` to `--accent-dark` (`flex-300`, verified at 5.66:1 on `#23282D`) wherever an element carries `data-chrome="dark"` — exactly the mechanism `[data-chrome='dark']` was built for. The actual fix is ensuring every real dark-chrome surface (Footer Zone 3, the split hero's type panel, the header utility strip) carries that attribute — see "Data-chrome coverage" below. **Test correction:** `tokens.test.ts`'s auto-generated matrix currently asserts the *bare* `focus.ring` (not `focus.ringOnDark`) must clear 3:1 on `DARK_SURFACES` for all three companies — a check against a code path that should never actually render once `data-chrome="dark"` is applied everywhere it belongs. Rather than add a fifth exception alongside the four already covering this exact "by design, dark chrome uses `ringOnDark` instead" pattern (`dhruv`/`group` × `dark`/`darkElevated`), Phase 1 removes the bare-`focus.ring`-on-`DARK_SURFACES` check from the auto-generated matrix for all three companies and keeps the dedicated `focus.ringOnDark` assertions (already passing at 5.1–6.5:1) as the real gate. **Net effect: four existing exceptions removed, zero new ones added.**

**Expected exception count after Phase 1: strictly fewer than before.** The pre-existing VG-004 `text.tertiary`/`alt` exceptions (steel-500 on steel-100, 4.30:1, still below floor) are untouched — they predate this redesign and are not new findings.

### Data-chrome coverage (explicit requirement)

Every real dark-chrome surface must carry `data-chrome="dark"` so the existing CSS rebinding mechanism (`[data-chrome='dark'] { --accent-focus: var(--accent-dark); }`) actually fires:

| Surface | Phase | Status |
|---|---|---|
| Header utility strip | 5 | Already correct today — unchanged |
| `MobileDrawer` panel | (unaffected) | Already correct today — unchanged |
| Footer Zone 3 (now dark, Decision 4) | 7 | **New requirement this revision** — must gain `data-chrome="dark"`; without it, focus rings on Privacy/Terms/LinkedIn links fall below 3:1 |
| Split hero type panel (breadcrumb + 2 CTAs, `HomeHero`) | 9 | **New requirement this revision** — must gain `data-chrome="dark"`; without it, the breadcrumb link and CTA focus rings on the `#23282D` panel fall below 3:1 for both `brand`- and `flex`-scoped homepages |

This is not treated as an exception anywhere — it is a build requirement, verified in each phase's own visual-validation pass (keyboard-tab through every focusable element on the dark surface, confirm the ring is visible).

### Typography / type scale (own phase)

| Change | Class | Citation |
|---|---|---|
| `fontFamily` → Plus Jakarta Sans, Plex Mono unchanged | C | IMPLEMENTATION_NOTES §1.1, §0 D-2 |
| `typeScale` full remap | C | IMPLEMENTATION_NOTES §1.1 |
| `letterSpacing`: `-0.02em` at `h1`+, normal elsewhere | C | IMPLEMENTATION_NOTES §1.1 |
| `tailwind.ts` `fontSize` clamp regeneration | E | Mechanical — `tailwind.ts` hand-duplicates these as literal strings |
| `tailwind.ts` `letterSpacing.caption` → 0.09em, new `tight: -0.02em` | C | IMPLEMENTATION_NOTES §1.1 |
| Font loaders in `app/layout.tsx` | C | IMPLEMENTATION_NOTES §1.3 |

### `tracking-caption` audit (own phase, scope corrected this revision)

46 total occurrences, 23 files. **Phase 3 converts 15 of the 17 CONVERT sites** — the `HomeHero.tsx` and `PageHero.tsx` eyebrow sites (1 each) are excluded from Phase 3 and instead convert naturally as part of Phases 9 and 11, since both files are structurally rewritten there anyway. Converting them in Phase 3 first would mean Phase 9/11 immediately overwrites that work, making the audit commit non-reproducible against the final state.

**Grep progression (verified, not estimated):**
- Before Phase 3: `grep -ro "tracking-caption" apps/web packages/datum-ui --include="*.tsx" | wc -l` → **46**
- After Phase 3 (15 converted, 2 held back): → **31** (29 KEEP + 2 held-back eyebrows)
- After Phase 9 (`HomeHero` rebuilt, its eyebrow converts as part of the rebuild): → **30**
- After Phase 11 (`PageHero` rebuilt, its eyebrow converts as part of the rebuild): → **29** — final state, matching the KEEP table exactly

### KEEP (29 sites — unchanged across every phase)

| File | Sites |
|---|---|
| `dhruv-epc/company/page.tsx` | 3 |
| `precise-engineers/company/page.tsx` | 3 |
| `(group)/contact/page.tsx` | 4 |
| `(group)/legal/LegalDocument.tsx` | 5 |
| `(group)/request-a-quote/RFQForm.tsx` | 1 |
| `MegaPanel.tsx` | 1 |
| `Header.tsx` | 1 |
| `StatBand.tsx` | 1 |
| `SpecTable.tsx` | 2 |
| `SpecRail.tsx` | 2 |
| `CertificationCard.tsx` | 2 |
| `Footer.tsx` (`zone1Label`) | 1 |
| `ApprovalsMatrix.tsx` | 1 |
| `Testimonial.tsx` | 1 |
| `ProjectCard.tsx` (metric `dt`) | 1 |

### CONVERT — Phase 3 (15 sites, 9 files)

| File | Sites |
|---|---|
| `precise-engineers/capabilities/page.tsx` | 2 |
| `(group)/page.tsx` | 4 |
| `(group)/legal/LegalDocument.tsx` ("Contents") | 1 |
| `dhruv-epc/capabilities/page.tsx` | 1 |
| `components/AnchorRail.tsx` | 1 |
| `lib/product-detail-page.tsx` | 2 |
| `Footer.tsx` (2 sites) | 2 |
| `ClientWall.tsx` | 1 |
| `ProjectCard.tsx` (sector eyebrow) | 1 |

### CONVERT — held back for Phases 9/11 (2 sites)

| File | Site | Converts in |
|---|---|---|
| `HomeHero.tsx` | Hero eyebrow | Phase 9 |
| `PageHero.tsx` | Page eyebrow | Phase 11 |

### Brand primitives / Logo, Header, MegaPanel, Footer, Shared components

(Unchanged from the prior revision — Hero C does not touch these. Full detail retained below in the phase list.)

### HomeHero (Hero C)

| Change | Class | Citation |
|---|---|---|
| `variant="split"` contract — 47/53 grid, no scrim, breadcrumb in type panel, standalone stat band | A + CANVAS | VEDANTA_DESIGN_DECISIONS.md Decision 2 (rewritten); exact values verified against the live canvas, not the (unrevised) prose notes |
| `align`/`statsOverlay` props | **SUPERSEDED BY HERO C — DO NOT IMPLEMENT** | Decision 2 |
| `data-chrome="dark"` on the type panel | A (new requirement) | See "Data-chrome coverage" above |
| Type-panel breadcrumb (company homepages only) | CANVAS | `1b`'s live markup |
| Photo-panel datum rule + dimension label | CANVAS | `1a`/`1b`'s live markup |

### HomeHero responsive implementation (own sub-phase, per explicit instruction)

The 47/53 split cannot survive below `md` — at ~375px, 47% produces an unusably narrow text column. **No source (canvas, notes, or prior plan) specifies the exact stacked-mobile treatment** — the canvas only ever renders the split hero at 1440px. This sub-phase's exact crop/spacing values are therefore **IMPLEMENTATION INFERENCE — REQUIRES VISUAL VALIDATION**, not sourced facts:

| Concern | Inferred approach | Validation required |
|---|---|---|
| Breakpoint | Stack vertically below `md` (768px), matching the system's existing breakpoint scale | Confirm no awkward in-between state at 768–900px |
| Stack order | Type panel first (content before image, matches reading order and LCP priority), photo panel second | Visual + screen-reader order check |
| Mobile photo crop | **4:3, not the desktop 4:5 portrait crop** — blindly retaining the desktop crop at mobile width over-crops the subject | Requires an actual mobile-cropped asset per photo, not a CSS-only `object-fit` reflow of the same image |
| Type panel spacing | Standard mobile section padding, TBD exact value | Visual check against existing mobile section rhythm |
| Datum rule position | Moves with the photo panel to below it (mobile-stacked), not fixed to a "bottom of panel" that no longer exists in a stacked layout | Visual check |
| Breadcrumb wrapping | Must not force horizontal scroll; wrap allowed | 320px check |
| Long eyebrow/title wrapping | Real longest strings from actual homepage copy, not lorem ipsum | 320/375/390px check |
| CTA stacking | Wrap or stack vertically if both don't fit one row at 320px | 320px check |
| 320px overflow | Zero horizontal scroll | Explicit check, not assumed |

This entire table is implementation work belonging to this sub-phase, not a one-line media-query note.

### ExplodedSequence contract — owned by PageHero and ProductHero, not HomeHero

| Change | Class | Citation |
|---|---|---|
| Formal separation ruling moves to `PageHero`/`ProductHero` | A | VEDANTA_DESIGN_DECISIONS.md Decision 6 (revised) |
| `HomeHero`'s `photo` prop and its guard | **REMOVED — moot** | Hero C has no photo-ground slot on `HomeHero` at all; there is nothing left to guard there |
| `PageHero`/`ProductHero` `photo` props gain the JSDoc guard instead | A | Decision 6 (revised) |
| Reviving/wiring `ExplodedSequence` anywhere | DEFERRED | Zero current consumers; not depicted in canvas or notes at any hero |
| `ExplodedSequence.tsx`, its CSS, `site-data.ts` frame exports | **NOT TOUCHED** | Unchanged |

### PageHero

| Change | Class | Citation |
|---|---|---|
| Full structural rebuild: light/no-photo-ground → photo-as-ground + scrim + centered content + breadcrumb-on-photo | A | VEDANTA_DESIGN_DECISIONS.md Decision 2 (`align="center"` tier — unchanged by Hero C) |
| `ExplodedSequence` JSDoc guard on `photo` prop | A | Decision 6 (revised) |
| No-photo fallback for 16 existing consumers | E | Mechanical necessity |

### ProductHero (own dedicated phase — confirmed, not folded into PageHero)

| Change | Class | Citation |
|---|---|---|
| Hero band becomes photo-as-ground: `align="lower-left"`, `text-display` (56px), full breadcrumb trail on the photo | C | IMPLEMENTATION_NOTES §2.2 |
| Retained light `bg-steel-50` band below: value statement, spec chips, cert chips, RFQ button — retheme only | C | IMPLEMENTATION_NOTES §2.2 |
| `DatumRule`/`DimensionLabel` moves from the hero to the spec rail | C | IMPLEMENTATION_NOTES §2.2, §2.7 |
| `ExplodedSequence` JSDoc guard on `photo` prop | A | Decision 6 (revised) |
| `product-detail-page.tsx`'s `<ProductHero>` call — verify, don't edit | E | Prop names unchanged |

**Explicit non-merge statement, unchanged from the prior revision:** `HomeHero`, `PageHero`, and `ProductHero` remain three separate components. Hero C does not change this — it makes `HomeHero` even more distinct from the other two (split-grid vs. full-bleed), not less.

### Group / Dhruv / Precise homepages (substantially smaller under Hero C)

| Change | Class | Citation |
|---|---|---|
| `(group)/page.tsx` — retire bespoke inline hero, adopt `<HomeHero variant="split" .../>`, retain the existing standalone stat section unchanged | A | Decision 2 |
| `dhruv-epc/page.tsx` — adopt `<HomeHero variant="split" .../>` in place of the current call; stats continue to flow to the same standalone band | A | Decision 2 |
| `precise-engineers/page.tsx` — same as Dhruv | A | Decision 2 |

**No `statsOverlay` anywhere in any of the three.** These phases no longer involve "confirm a section is/isn't removed" logic at all — under Hero C, all three pages use the identical standalone-stat-band model; the only real work is swapping which hero component/variant renders above it.

### Product detail sections (un-deferred, unchanged from prior revision)

Types & Configurations, Fabrication & QA, FAQ retheme, accent-rule inventory (4→5) — all as established in the prior reconciliation. See the phase list below.

---

## Product-detail coverage matrix (proves `1c` is actually covered)

| `1c` element | Production component/section | Phase |
|---|---|---|
| Hero (title, eyebrow, breadcrumb, photo) | `ProductHero.tsx` | 12 |
| Value statement + chips | `ProductHero.tsx` (retained light band) | 12 |
| Specifications table | `SpecTable.tsx` | 8 |
| Sticky spec rail | `SpecRail.tsx` (`SpecRailDesktop`/`SpecRailMobile`) | 8 |
| Types & configurations | `product-detail-page.tsx`, `id="types"` | 18 |
| Materials & codes | `product-detail-page.tsx`, `id="materials-codes"` | 3 (tracking-caption), token cascade elsewhere |
| Fabrication & QA | `product-detail-page.tsx`, `id="fabrication-qa"` | 19 |
| Inspection record | `ApprovalsMatrix.tsx` + `CertificationCard.tsx` | 8 |
| FAQ | `product-detail-page.tsx`, `id="faq"` (native `<details>`) | 20 |
| On-this-page nav | `AnchorRail.tsx` (`AnchorRailDesktop`/`Mobile`) | 8 (token cascade), 3 (heading CONVERT) |
| RFQ / contact CTA | `RFQBand.tsx`, `MobileBottomBar` | 8 |
| Responsive (table→dl, rail reflow) | Existing definition-list reflow, unchanged | 22 (validation) |

No `1c` element remains unassigned or "canvas-only."

---

## Implementation Order

### PHASE 0 — Governance / lock verification
Re-read `docs/VEDANTA_DESIGN_DECISIONS.md` (all six decisions, Decision 2/6 as rewritten) and this file in full before Phase 1 begins. No files touched.

### PHASE 1 — Token foundations
**Files:** `primitives.ts` (steel/radius/shadow/overlay, **including the `steel-400` value fix**), `semantic.ts` (verify-only), `tailwind.ts` (colors/radius/shadow), `globals.css` (fallbacks, overlay vars), `tokens.test.ts` (contrast-matrix correction per "Contrast findings" above).
**Dependencies:** none. **Tests:** `pnpm --filter @vedanta/tokens test` — expect fewer exceptions than the pre-Phase-1 baseline, zero new ones.
**Visual smoke check (not full QA):** Header, a Hero, Button, Card, form field, Footer, spec surface — desktop + one mobile viewport.
**Snapshot:** regenerate and commit.
**Rollback risk:** HIGH in blast radius, LOW in isolation. **Commit:** own.

### PHASE 2 — Typography / type scale
**Files:** `primitives.ts` (`fontFamily`, `typeScale`), `tailwind.ts` (`fontSize`, `letterSpacing`), `app/layout.tsx` (font loader).
**Dependencies:** Phase 1. **Tests:** tokens test, build (font payload re-measure).
**Snapshot:** regenerate and commit. **Rollback risk:** HIGH blast radius, LOW isolated. **Commit:** own, separate from Phase 1.

### PHASE 3 — `tracking-caption` audit & migration
**Files:** the 15 Phase-3-scoped CONVERT sites across 9 files (list above). **Excludes** `HomeHero.tsx`/`PageHero.tsx` (converted in Phases 9/11 instead).
**Dependencies:** Phase 2. **Grep before:** 46. **Grep after:** 31 (29 KEEP + 2 held-back).
**Tests:** datum-ui + web test suites (axe auto-glob).
**Snapshot:** regenerate and commit. **Rollback risk:** MEDIUM (11→9 files, narrow mechanical changes). **Commit:** own.

### PHASE 4 — Logo / brand primitives
**Files:** `primitives.ts` (`logoRed`), `Logo.tsx` (new), `apps/web/public/brand/vedanta-emblem.png` (new asset).
**Dependencies:** Phase 1. **Tests:** consumer-boundary enforcement test.
**Blocker:** verify the full-resolution emblem image supplied in chat is the same file as the Claude Design project's asset before use; re-extract from source if inconclusive.
**Commit:** own.

### PHASE 5 — Header + utility strip
**Files:** `Header.tsx`, `globals.css` (`.exploded-scrub` → 76px, same commit), the three `*Chrome.tsx` files (wire in `<Logo/>`).
**Dependencies:** Phases 1, 2, 4. **Data-chrome:** utility strip already correct, unchanged.
**Snapshot:** regenerate and commit. **Rollback risk:** HIGH (every route). **Commit:** own.

### PHASE 6 — MegaPanel retheme
**Files:** `MegaPanel.tsx`, `Header.tsx` legacy grid.
**Dependencies:** Phases 1, 5. **Tests:** `MegaPanel.test.tsx` unchanged, or the interaction was touched — revert.
**Snapshot:** regenerate and commit. **Rollback risk:** MEDIUM. **Commit:** own.

### PHASE 7 — Footer
**Files:** `Footer.tsx` — Zone 3 dark, back-to-top, bracket linework, **`data-chrome="dark"` added to Zone 3's container (new requirement this revision)**.
**Dependencies:** Phases 1, 3 (Footer's two CONVERT sites land first).
**Visual validation:** includes a keyboard-tab focus-ring check on Privacy/Terms/LinkedIn specifically, confirming the ring is visible post-`data-chrome` fix.
**Snapshot:** regenerate and commit. **Rollback risk:** MEDIUM. **Commit:** own.

### PHASE 8 — Shared cards / buttons / forms / certification components
**Files:** `ProductCard.tsx`, `CategoryCard.tsx`, `Button.tsx`, `Input.tsx`, `Select.tsx`, `Textarea.tsx`, `FieldShell.tsx`, `Seal.tsx` (new), `CertificationCard.tsx`, `SpecTable.tsx`, `SpecRail.tsx`, `StatBand.tsx`, `AnchorRail.tsx` (token cascade only — its heading CONVERT already landed in Phase 3), `ApprovalsMatrix.tsx`.
**Dependencies:** Phases 1, 2, 3. **Snapshot:** regenerate and commit. **Rollback risk:** MEDIUM–HIGH. **Commit:** may split per component.

### PHASE 9 — HomeHero split architecture (Hero C)
**Purpose:** build the `variant="split"` contract per the verified canvas values.
**Files:** `HomeHero.tsx` — full rewrite of its render (47/53 grid, type panel with `data-chrome="dark"`, breadcrumb slot, eyebrow converts to title-case as part of this rewrite — closing out its held-back `tracking-caption` site — plain photo grid-cell, datum rule + dimension label pinned to its bottom).
**Dependencies:** Phases 1, 2, 3, 8. **Tests:** `HomeHero.stories.tsx` covering both breadcrumb-present/absent states, axe auto-glob.
**Visual validation:** Storybook only at this phase (not wired into a real page until 13–15); confirm the `white/72` body-copy contrast against the actual blended RGB, not the naive ratio; confirm keyboard-tab through the type panel's breadcrumb + 2 CTAs shows a visible focus ring (data-chrome check).
**Snapshot:** regenerate and commit. **Rollback risk:** LOW isolated, HIGH once wired in. **Commit:** own.

### PHASE 10 — HomeHero responsive implementation
**Purpose:** its own sub-phase per explicit instruction — the split grid cannot simply be retained below `md`. Full detail in the classification section above (stack order, mobile 4:3 crop, spacing, datum-rule repositioning, wrapping, 320px overflow).
**Files:** `HomeHero.tsx` (responsive classes/breakpoint logic), potentially new mobile-cropped photo assets (flagged, not sourced — see Phase 4-adjacent asset needs).
**Dependencies:** Phase 9. **Visual validation:** 320/375/390/768/1024/1440px, explicit per-property checklist from the classification table above.
**Snapshot:** regenerate and commit. **Rollback risk:** MEDIUM. **Commit:** own, separate from Phase 9 so the desktop architecture and the mobile stack are independently reviewable.

### PHASE 11 — PageHero (build in isolation + fixture validation)
**Files:** `PageHero.tsx` (full rebuild — photo-as-ground, scrim, centered content, breadcrumb-on-photo, eyebrow converts to title-case as part of this rewrite, `ExplodedSequence` JSDoc guard added), `PageHero.stories.tsx` (new fixtures). **No production route touched.**
**Dependencies:** Phases 1, 2, 3, 8. **Fixture set:** group `/about`, `/contact`, `/capabilities` index, `/projects`, `/privacy`, `/terms`, `dhruv-epc/company`, `precise-engineers/company`, one product-category page.
**Fixture coverage:** photo hero, no-photo fallback, short/long breadcrumb, long eyebrow/title, mobile wrapping.
**Snapshot:** regenerate and commit. **Rollback risk:** LOW (component-only). **Commit:** own.

### PHASE 12 — ProductHero
**Files:** `ProductHero.tsx` only — photo-as-ground restructure, `DatumRule`/`DimensionLabel` relocation to the spec rail (sequenced after Phase 8's `SpecRail` work), `ExplodedSequence` JSDoc guard.
**Dependencies:** Phases 1, 2, 3, 8. **Tests:** `ProductHero.stories.tsx`, real breadcrumb-trail fixtures (up to 4 levels).
**Snapshot:** regenerate and commit. **Rollback risk:** MEDIUM (17+ routes, isolated component). **Commit:** own.

### PHASE 13 — Group homepage
**Files:** `(group)/page.tsx` — adopt `<HomeHero variant="split"/>`, retire bespoke inline hero. Verify the string `statsOverlay` does not appear anywhere in this diff.
**Dependencies:** Phases 9, 10. **Snapshot:** regenerate and commit. **Rollback risk:** HIGH. **Commit:** own.

### PHASE 14 — Dhruv homepage
**Files:** `dhruv-epc/page.tsx` — adopt `<HomeHero variant="split"/>`.
**Dependencies:** Phases 9, 10. **Snapshot:** regenerate and commit. **Rollback risk:** MEDIUM-HIGH. **Commit:** own.

### PHASE 15 — Precise homepage
**Files:** `precise-engineers/page.tsx` — adopt `<HomeHero variant="split"/>`, flex-blue accent.
**Note:** the exact panel height (560px, by symmetry with Dhruv) and photo crop are inferred, not directly observed in the canvas — flag in this phase's visual validation.
**Dependencies:** Phases 9, 10. **Snapshot:** regenerate and commit. **Rollback risk:** MEDIUM-HIGH. **Commit:** own.

### PHASE 16 — Remaining PageHero consumers
**Files:** the 7 consumers outside Phase 11's fixture set (`precise-engineers/proof`, `precise-engineers/capabilities`, `(group)/capabilities/[slug]`, `(group)/industries`, `(group)/industries/[slug]`, `dhruv-epc/proof`, `dhruv-epc/capabilities`).
**Dependencies:** Phase 11 signed off. **Snapshot:** regenerate and commit. **Rollback risk:** LOW per route. **Commit:** per logical group.

### PHASE 17 — Product-detail shared-surface integration check
**Purpose:** confirm the 2-col grid, sticky-rail stacking, and `ProductHero`'s new photo-as-ground band compose correctly on a real product page before the remaining product-detail phases layer on top.
**Files:** none expected — verification only; `product-detail-page.tsx` itself isn't edited here.
**Dependencies:** Phases 8, 12. **Visual validation:** one full product page (`pressure-vessels`), confirming `AnchorRailDesktop`+`SpecRailDesktop`'s shared sticky-stacking still works beneath the rebuilt `ProductHero`.

### PHASE 18 — Product detail: Types & Configurations
**Files:** `product-detail-page.tsx`, `id="types"` section only. Preserve `product.types` data, anchor, ordering.
**Dependencies:** Phases 1, 2, 3, 8, 17. **Snapshot:** regenerate and commit. **Commit:** own.

### PHASE 19 — Product detail: Fabrication & QA
**Files:** `product-detail-page.tsx`, `id="fabrication-qa"` section only. Preserve `qaSteps`/`GENERIC_QA_STEPS`, anchor, ordering. Add the 5th accent-rule instance (3px `border-top-accent` per canvas `1c`).
**Dependencies:** Phases 1, 2, 3, 8, 17. **Snapshot:** regenerate and commit. **Commit:** own.

### PHASE 20 — FAQ retheme
**Files:** `product-detail-page.tsx`, `id="faq"` section only. Token retheme only — schema/JSON-LD/accordion mechanism untouched.
**Dependencies:** Phases 1, 2, 3. **Snapshot:** regenerate and commit. **Commit:** own or combined with 18/19 if the reviewer prefers a single `product-detail-page.tsx` pass.

### PHASE 21 — Product / category routes (remaining cascade)
**Files:** `product-category-pages.tsx` — remaining token cascade beyond Phase 11's representative fixture.
**Dependencies:** Phases 1, 2, 3, 11. **Tests:** `link-integrity.test.ts`, `metadata-uniqueness.test.ts`.
**Snapshot:** regenerate and commit. **Commit:** own.

### PHASE 22 — Responsive validation
**Purpose:** cross-cutting pass over everything built in Phases 1–21. No files touched — findings route back to their originating phase.
**Visual validation, minimum:** 320/375/390/768/1024/1440px on header ladder, mega-panel at `md`, **HomeHero split-to-stack transition specifically** (Phase 10's checklist re-verified in the actual wired pages), breadcrumb position on interior/product heroes, footer clearance, zero horizontal overflow except the capability matrix.
**Governance note:** IMPLEMENTATION_NOTES §3's responsive table values (header 123/91/76px; the *old* hero heights 620/520/440, now superseded for `HomeHero` by Hero C's 600/560px but still relevant for `PageHero`/`ProductHero`) remain labeled **IMPLEMENTATION INFERENCE — REQUIRES VISUAL VALIDATION** where not directly canvas-verified.

### PHASE 23 — Accessibility + SEO + performance validation
**Files:** none, except `apps/web/e2e/a11y.spec.ts`'s `KNOWN_FAILURES`, VG-004 status only.
**Tests:** full CLAUDE.md sequence, route axe, JS budget, redirect integrity.
**Visual validation:** `:focus-visible` sweep — **including the two new `data-chrome="dark"` surfaces (Footer Zone 3, HomeHero type panel) specifically** — `prefers-reduced-motion`, single-accent-element check.

### PHASE 24 — Snapshot finalization
**Purpose:** confirmation pass — every prior phase already committed its own baseline update.
**Tests:** `snapshot:baseline` + `snapshot:compare` — expected clean. Any diff here signals an earlier phase's snapshot commit was incomplete.

### PHASE 25 — Final visual QA
**Purpose:** human sign-off against the live canvas, section by section, **including a direct side-by-side of the built split hero against the live `1a`/`1b` markup** (not the pre-Hero-C screenshots any earlier reviewer may still have cached).
**Exit criterion:** explicit human sign-off before merge.

---

## CHANGE BUDGET / BLAST RADIUS

| File | Blast radius | Why |
|---|---|---|
| `primitives.ts` / `tailwind.ts` / `globals.css` / `layout.tsx` | **CRITICAL** | Every route |
| `Header.tsx` | **CRITICAL** | Every route |
| `Footer.tsx` | **HIGH** | Every route; now also carries the `data-chrome` requirement |
| `HomeHero.tsx` | **MEDIUM (routes) / HIGH (architecture)** | Only 3 routes, but the component's shape changes categorically (grid vs. photo-ground), touched across 2 phases (9, 10) |
| `PageHero.tsx` | **MEDIUM-HIGH** | 16 routes |
| `ProductHero.tsx` | **MEDIUM-HIGH** | 17+ routes |
| `MegaPanel.tsx` | **HIGH** | Group nav |
| `ProductCard.tsx`/`CategoryCard.tsx` | **HIGH** | ~20+ routes |
| `product-detail-page.tsx` | **HIGH** | Shared factory, touched across Phases 17–20 |
| `(group)/page.tsx`, `dhruv-epc/page.tsx`, `precise-engineers/page.tsx` | **HIGH / MEDIUM-HIGH** | Primary entry points |
| 16 `PageHero` consumers | **LOW each, MEDIUM aggregate** | |
| 9 `tracking-caption`-CONVERT files (Phase 3) | **LOW-MEDIUM each** | |
| `tokens.test.ts` | **N/A (test)**, but note this revision **removes** 4 exceptions and adds 0 | Moves with Phase 1 |
| `__snapshots__/routes-baseline/*` | **N/A** | Updated incrementally |

**Changes that must be committed separately:** Phase 1, Phase 2, Phase 3, Phase 5's `.exploded-scrub` offset (same commit as Header), Phase 9 and Phase 10 (architecture vs. responsive, independently reviewable), Phase 13 (group home — verify no `statsOverlay` string appears), every phase's snapshot update.

---

## Remaining Ambiguities / Blockers

1. **Emblem asset provenance** — unchanged from the prior revision, still open.
2. **Precise Engineers' exact split-hero height/crop is inferred by symmetry with Dhruv**, not directly observed in the canvas (which never mocks a separate Precise homepage instance). Flag in Phase 15.
3. **Mobile stacked-hero crop/spacing has no source at all** (canvas never renders below 1440px) — Phase 10's entire table is implementation inference requiring visual validation, more so than any other part of this plan.
4. **The `white/72` body-copy contrast on the split hero's type panel** is opacity-blended and must be computed for real in Phase 9, not assumed from the nominal ratio.
5. **VG-004's status after the Header rewrite** remains unknown until Phase 23.
6. Any surviving mention of `statsOverlay` anywhere outside this plan's own historical/superseded markers (e.g., in an earlier session's chat, a stale comment) should be treated as dead language, not a live option, per Decision 2.

---

PRODUCTION CODE MODIFIED: NO

HERO C: FULLY INCORPORATED

STATSOVERLAY: REMOVED FROM IMPLEMENTATION CONTRACT

HOMEHERO CONTRACT: variant="split"

PRODUCTHERO: EXPLICITLY PHASED

PAGEHERO: EXPLICITLY PHASED

EXPLODEDSEQUENCE CONTRACT: OWNED BY CORRECT HERO COMPONENTS

FABRICATION & QA: INCLUDED

TYPES & CONFIGURATIONS: INCLUDED

TYPE SCALE: INDEPENDENT PHASE

TRACKING-CAPTION: INDEPENDENT PHASE

CONTRAST EXCEPTIONS FROM THESE FINDINGS: 0

DATA-CHROME COVERAGE: EXPLICIT

CANVAS 1F HOMEPAGE HERO: MAPPED

CANVAS 1E: DEFERRED/REJECTED

UNPHASED PLANNED CHANGES: 0

ARCHITECTURAL CONTRADICTIONS: 0

FINAL PLAN STATUS: READY FOR IMPLEMENTATION
