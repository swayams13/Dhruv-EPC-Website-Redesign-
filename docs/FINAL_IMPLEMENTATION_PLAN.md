# FINAL_IMPLEMENTATION_PLAN.md

**Status:** Planning artifact only. No production code has been modified as of this document's creation.
**Supersedes:** the file-level plan presented in chat during the prior turn (contained no factual errors on Decisions 2/3, but lacked source classification, phase ordering, and blast-radius analysis — all added here per the correction gate).
**Sources of truth, in citation order:**
- **A** — `docs/VEDANTA_DESIGN_DECISIONS.md` (the five locked decisions from this session's Decision Resolution phase)
- **B** — `VEDANTA_DESIGN_LANGUAGE.md` (forensics of the client's live site)
- **C** — `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` (the full token/component spec derived from the approved Claude Design artifact)
- **D** — the Implementation Readiness Audit (this session, prior to Decision Resolution — sections A–J)
- **E** — Required regression fix (mechanical necessity of a change already classified A–D; not a new decision)
- **F** — Verification only (no visual or structural change)
- **DEFERRED** — no source authorizes this; not to be implemented without a new, explicit approval

Every file-level change below carries exactly one classification and one citation. Anything that could not be traced to a source is listed under **Deferred / Rejected Items**, not folded into a phase.

**Verified against, this pass:** `docs/VEDANTA_DESIGN_DECISIONS.md` (all five locked decisions re-read in full immediately before this revision; Hero and MegaPanel wording in this plan matches the corrected decision document verbatim — group home is `HomeHero`/`align="lower-left"`/`statsOverlay={false}` with the separate stat band retained, Dhruv and Precise are both `statsOverlay={true}`, MegaPanel is retheme-only with zero interaction/state/event/hierarchy change), `VEDANTA_DESIGN_LANGUAGE.md` (footer/typography forensics citations spot-checked against source line numbers), `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` (every C-classified row above cites a real section of that document, not a paraphrase), the current repository architecture and component structure (every file path named in this plan was confirmed to exist, or explicitly marked "new," by direct inspection during the Implementation Readiness Audit and Decision Mapping phases of this session). No malformed or truncated text found in this document on this revision.

---

## Classification index (every planned production-code change)

### Design tokens

| Change | Class | Citation |
|---|---|---|
| `steel` ramp warm→cool remap | C | IMPLEMENTATION_NOTES §1.1, §0 D-1 |
| `radius.sm` 2px→3px | C | IMPLEMENTATION_NOTES §1.1 |
| `shadow` recipe (2→3 values, new `hover` step) | C | IMPLEMENTATION_NOTES §1.1 |
| `fontFamily` → Plus Jakarta Sans (display+body), Plex Mono unchanged | C | IMPLEMENTATION_NOTES §1.1, §0 D-2 |
| New `overlay` primitive (hero scrim gradients) | C | IMPLEMENTATION_NOTES §1.1 |
| New `logoRed` primitive, scoped to `Logo.tsx` | A | VEDANTA_DESIGN_DECISIONS.md Decision 1 |
| `globals.css` fallback colors (`#F2F0EA`→`#F5F6F8`) | C | IMPLEMENTATION_NOTES §1.2 |
| `globals.css` new `--overlay-hero*` vars | C | IMPLEMENTATION_NOTES §1.2 |
| `.exploded-scrub{top:60px}` → `76px` | E | Mechanical consequence of the Header height change (C, §2.1); explicitly flagged as a coupled risk in IMPLEMENTATION_NOTES §7 warning #1 |
| Font loaders in `app/layout.tsx` → single Plus Jakarta Sans loader | C | IMPLEMENTATION_NOTES §1.3 |
| `tokens.test.ts` expected-value updates | E | Mechanical necessity of the ramp change; IMPLEMENTATION_NOTES §1.4 explicitly requires this ("update the expected values, do not relax the assertions") |
| `css-parity.test.ts` expected-value updates | E | Same — IMPLEMENTATION_NOTES §1.4 |
| `__snapshots__/routes-baseline/*` regeneration | E | IMPLEMENTATION_NOTES §7 warning #2 ("regenerate... in the same commit and read the diff") |

### Brand primitives / Logo

| Change | Class | Citation |
|---|---|---|
| `Logo.tsx` (new component) | C | IMPLEMENTATION_NOTES §2.0 |
| Emblem asset extraction into `apps/web/public/brand/` | A + operational blocker | VEDANTA_DESIGN_DECISIONS.md Decision 1 (asset must come from the approved artifact only — see Blockers) |
| `GroupChrome.tsx`/`DhruvChrome.tsx`/`PreciseChrome.tsx` swap inline `next/image` logo calls for `<Logo/>` | C | IMPLEMENTATION_NOTES §2.0 |

### Header + utility strip

| Change | Class | Citation |
|---|---|---|
| `Header.tsx` main bar dark→white, 72/60px→91/76px | C | IMPLEMENTATION_NOTES §0 D-3, §2.1 |
| `Header.tsx` utility strip restyle | C | IMPLEMENTATION_NOTES §2.1 |
| `data-chrome="dark"` moves to utility strip only | C | IMPLEMENTATION_NOTES §2.1 |
| Nav color/weight retheme | C | IMPLEMENTATION_NOTES §2.1 |

### MegaPanel

| Change | Class | Citation |
|---|---|---|
| `MegaPanel.tsx` background→white, shadow, top border | A | VEDANTA_DESIGN_DECISIONS.md Decision 3 |
| `MegaPanel.tsx` color/font token remap (no hierarchy change) | A | VEDANTA_DESIGN_DECISIONS.md Decision 3 |
| `Header.tsx` legacy mega-menu grid — same retheme boundary | A | VEDANTA_DESIGN_DECISIONS.md Decision 3 |
| Any `useEffect`/focus-trap/keyboard change | **REJECTED — explicitly forbidden** | VEDANTA_DESIGN_DECISIONS.md Decision 3 |
| New typography hierarchy under group labels (e.g. `text-h4` + rule) | **REJECTED — explicitly forbidden** | VEDANTA_DESIGN_DECISIONS.md Decision 3 (correction pass) |

### Footer

| Change | Class | Citation |
|---|---|---|
| Zone 3 background/text/link color → dark (reuse Zone 1 palette) | A | VEDANTA_DESIGN_DECISIONS.md Decision 4 |
| Inline 44px circular back-to-top control | A | VEDANTA_DESIGN_DECISIONS.md Decision 4 |
| Red bracket linework (2 left, 1 right, `aria-hidden`) | C | IMPLEMENTATION_NOTES §2.6 |
| 88×3px accent rule under Zone 1 column headings | C | IMPLEMENTATION_NOTES §2.6, §2.9 |
| Zone 2 (stamps strip) — no structural change, stays inside `Footer.tsx` | C | IMPLEMENTATION_NOTES §2.6 ("Zone 2... unchanged") — **this resolves the DOM-placement ambiguity flagged in the prior mapping pass; no longer a blocker** |
| `pb-20 md:pb-6` preserved exactly | A | VEDANTA_DESIGN_DECISIONS.md Decision 4 |

### Shared cards / buttons / forms / certification

| Change | Class | Citation |
|---|---|---|
| `ProductCard.tsx` photo becomes default variant | C | IMPLEMENTATION_NOTES §2.4 |
| `ProductCard.tsx` arrow → "Learn More ↗" | C | IMPLEMENTATION_NOTES §2.4 |
| `ProductCard.tsx` hover → `border-accent` + `shadow-hover` | C | IMPLEMENTATION_NOTES §2.4 |
| `ProductCard.tsx` new `layout="spec"` variant | C | IMPLEMENTATION_NOTES §2.4 |
| `CategoryCard.tsx` same affordance/hover swap | C | IMPLEMENTATION_NOTES §2.4 |
| `CategoryCard.tsx` `thin`-state opacity/contrast bug | **excluded from this plan — see Blockers, not a design-doc item** | Pre-existing tracked debt (`docs/mistakes.md`, 2026-09-01); CLAUDE.md scope discipline requires logging, not bundling, an unrelated fix |
| `Button.tsx` radius/font cascade (no logic change) | C | IMPLEMENTATION_NOTES §2.3 |
| `Input.tsx`/`Select.tsx`/`Textarea.tsx`/`FieldShell.tsx` token cascade | C | IMPLEMENTATION_NOTES §1.1 (cascade only, no component-specific section changes these) |
| `Stamp.tsx` unchanged, survives as <32px fallback | C | IMPLEMENTATION_NOTES §2.5 |
| `Seal.tsx` (new component) | C | IMPLEMENTATION_NOTES §2.5 |
| `CertificationCard.tsx` swaps `Stamp`→`<Seal size={72}/>`, adds `↗` | C | IMPLEMENTATION_NOTES §2.5, §2.7 |
| `SpecTable.tsx`/`SpecRail.tsx` header/token retheme, `DatumRule` tick device | C | IMPLEMENTATION_NOTES §2.7 |
| `StatBand.tsx` new `overlay` variant | C | IMPLEMENTATION_NOTES §2.7, §6 (variant matrix: "`StatBand` `onDark`; × `overlay`") |

### HomeHero

| Change | Class | Citation |
|---|---|---|
| Photo-as-ground restructure | C | IMPLEMENTATION_NOTES §2.2 |
| New `statsOverlay` prop | A | VEDANTA_DESIGN_DECISIONS.md Decision 2 |
| `align` prop (`'lower-left' \| 'center'`) shared with `PageHero` | A | VEDANTA_DESIGN_DECISIONS.md Decision 2 |

### PageHero

| Change | Class | Citation |
|---|---|---|
| Full structural rebuild: light/no-photo-ground → photo-as-ground + scrim + centered content + breadcrumb-on-photo | A | VEDANTA_DESIGN_DECISIONS.md Decision 2 (`align="center"` tier) |
| No-photo fallback must render cleanly (14–16 existing consumers, not all supply a photo) | E | Mechanical necessity of the structural rebuild above |

### Group / Dhruv / Precise homepages

| Change | Class | Citation |
|---|---|---|
| `(group)/page.tsx` — retire bespoke inline hero JSX, adopt `<HomeHero align="lower-left" statsOverlay={false} .../>` | A | VEDANTA_DESIGN_DECISIONS.md Decision 2 (explicit: "GROUP HOME — HomeHero") |
| `dhruv-epc/page.tsx` — add `statsOverlay={true}` to existing `<HomeHero/>` call | A | VEDANTA_DESIGN_DECISIONS.md Decision 2 |
| `precise-engineers/page.tsx` — add `statsOverlay={true}` to existing `<HomeHero/>` call | A | VEDANTA_DESIGN_DECISIONS.md Decision 2 |

### PageHero consumers / product pages

| Change | Class | Citation |
|---|---|---|
| 16 `PageHero`-consuming route files — verify against rebuilt component | E | Mechanical necessity of the C-classified `PageHero` rebuild |
| `product-detail-page.tsx` FAQ block — token retheme only | A | VEDANTA_DESIGN_DECISIONS.md Decision 5 |
| `product-detail-page.tsx` "Fabrication & QA" 5-step section | **DEFERRED** | No source authorizes this. Present only in the raw canvas `1c`, absent from IMPLEMENTATION_NOTES §2.7's explicit component scope ("SpecTable, SpecRail, StatBand, CertificationCard... structurally unchanged" — no new step-process component named) |
| `product-detail-page.tsx` "Types & configurations" grid | **DEFERRED** | Same reasoning — canvas-only, not in IMPLEMENTATION_NOTES |
| `PhotoSlot.tsx` (new component) | C | IMPLEMENTATION_NOTES §4.2 (explicit: "gate it behind... a `PhotoSlot` component that renders `null` in production and fails the build if a slot is still empty") |

### Verification-only (no visual/structural change)

| Change | Class | Citation |
|---|---|---|
| `pnpm typecheck` / `lint` / `test` / `build` full sequence | F | CLAUDE.md "Verify" section |
| VG-004 (dark-header contrast) re-test post-Header-rewrite | F | Readiness Audit §I; `apps/web/e2e/a11y.spec.ts` `KNOWN_FAILURES` update depends on the result, not assumed |
| `:focus-visible` manual check on every interactive element | F | CLAUDE.md "Verify" section |
| `prefers-reduced-motion` manual check | F | CLAUDE.md "Verify" section |
| 320px no-horizontal-scroll check | F | CLAUDE.md "Verify" section |
| Single-accent-element-per-view check | F | CLAUDE.md "the amber law" + IMPLEMENTATION_NOTES §7 warning #6 |
| Route-level axe sweep | F | CLAUDE.md "Verify" section |

---

## Deferred / Rejected Items (explicit — not implemented in any phase below)

| Item | Status | Reason |
|---|---|---|
| "Fabrication & QA" 5-step process section | DEFERRED | No authorizing source; canvas-only |
| "Types & configurations" 2-col grid | DEFERRED | No authorizing source; canvas-only |
| Unifying `#AA3833`→`#CD0101` sitewide | REJECTED | VEDANTA_DESIGN_DECISIONS.md Decision 1 explicitly keeps them split |
| `statsOverlay` on the group homepage | REJECTED | VEDANTA_DESIGN_DECISIONS.md Decision 2 — explicit, absolute |
| MegaPanel interaction/state/hierarchy changes of any kind | REJECTED | VEDANTA_DESIGN_DECISIONS.md Decision 3 |
| `CategoryCard.tsx` `thin`-state contrast bug fix | EXCLUDED from this plan | Pre-existing, unrelated debt — belongs in its own commit per CLAUDE.md scope discipline, not bundled into the retheme pass. Remains tracked in `docs/mistakes.md`. |
| A separate, out-of-`Footer.tsx` DOM placement for the credentials strip | RESOLVED, not deferred | IMPLEMENTATION_NOTES §2.6 states Zone 2 is unchanged — settles what the earlier mapping pass had flagged as open |

---

## Implementation Order

### PHASE 0 — Governance / lock verification
**Purpose:** confirm the locked state before any code changes, so later phases can build without re-litigating.
**Files touched:** none (read-only verification).
**Dependencies:** none.
**Tests:** none.
**Visual validation:** none.
**Rollback risk:** none — no code changes.
**Action:** re-read `docs/VEDANTA_DESIGN_DECISIONS.md` and this file immediately before Phase 1 begins in a fresh session, to guard against context drift. Confirm `git status` is clean before the first commit of Phase 1.

### PHASE 1 — Design tokens
**Purpose:** land the single highest-blast-radius change first, in isolation, so every later phase inherits stable values instead of chasing a moving target.
**Files touched:** `packages/tokens/src/primitives.ts`, `packages/tokens/src/semantic.ts` (verify-only — no new value should be added here), `packages/tokens/src/tailwind.ts`, `apps/web/tailwind.config.ts` (verify no `theme.extend` needed), `apps/web/app/globals.css`, `apps/web/app/layout.tsx`, `packages/tokens/src/tokens.test.ts`, `apps/web/lib/css-parity.test.ts`.
**Dependencies:** none — this is the root of the dependency tree.
**Tests:** `pnpm --filter @vedanta/tokens test`, `pnpm --filter @vedanta/web test` (css-parity).
**Visual validation — lightweight smoke check only, not full-site QA (that is Phase 17):** after the token change compiles, render/check one representative instance each of Header, a Hero, Button, a Card (Product or Category), a form field (Input or Select), Footer, and a spec/product surface (SpecTable or SpecRail) — at desktop and one mobile viewport. Look only for the obvious failure modes a token swap can cause: broken colors, incorrect typography, broken radius, broken shadows, unreadable text, or a token that failed to map (silently falling back to a Tailwind default). This confirms the ramp/font/radius/shadow swap didn't silently break rendering — it is not a design-fidelity review.
**Rollback risk:** HIGH if merged with later phases (every route's rendered output changes at once); LOW in isolation since it's a single, revertible commit with its own test coverage.
**Commit boundary:** own commit, separate from every other phase.

### PHASE 2 — Logo / brand primitives
**Purpose:** build `Logo.tsx` and source the real emblem asset before any chrome component needs to render it.
**Files touched:** `packages/tokens/src/primitives.ts` (add `logoRed`, if not already in Phase 1), `packages/datum-ui/src/components/Logo.tsx` (new), `apps/web/public/brand/vedanta-emblem.png` (new asset).
**Dependencies:** Phase 1 (token infra).
**Tests:** a new `Logo.test.tsx` (or repo-wide grep-based lint test) enforcing the *consumer* boundary, not a literal string search for `#CD0101`. `logoRed` is correctly **defined** in `packages/tokens/src/primitives.ts` — it necessarily appears there. The test must instead fail if: any file other than `packages/datum-ui/src/components/Logo.tsx` imports or references the `logoRed` export; `logoRed` or `#CD0101` appears anywhere in `packages/tokens/src/semantic.ts`; `logoRed`/`#CD0101` is consumed by any other component in `packages/datum-ui`; or `logoRed`/`#CD0101` appears directly in any page file, any Tailwind class, or any CSS file. Passing state: `primitives.ts` defines it, `Logo.tsx` is its sole importer, everywhere else is clean.
**Visual validation:** Storybook render of `Logo.tsx` at all documented sizes (header/scrolled/secondary/floor) — isolated, not yet wired into any page.
**Rollback risk:** LOW — net-new component and asset, nothing else depends on it yet.
**Blocker:** see "Remaining Ambiguities / Blockers" — real emblem asset extraction from the Claude Design project was only partially completed during investigation (256 KiB read cap truncated the file; PNG header and 1161×995 dimensions confirmed, full pixel data not verified). Must be resolved with a genuine full-fidelity extraction before this phase can close — per your explicit instruction, do not approximate or regenerate the mark if extraction fails; report the blocker instead.

### PHASE 3 — Global Header + utility strip
**Purpose:** land the header before MegaPanel (Phase 4) and Footer (Phase 5), since both are visually and functionally downstream of it (the mega panel hangs off it; the header height feeds `.exploded-scrub`).
**Files touched:** `packages/datum-ui/src/components/Header.tsx`, `apps/web/app/globals.css` (`.exploded-scrub` offset, same commit), `apps/web/components/group/GroupChrome.tsx`, `apps/web/components/dhruv/DhruvChrome.tsx`, `apps/web/components/precise/PreciseChrome.tsx` (wire in `<Logo/>` from Phase 2).
**Dependencies:** Phase 1, Phase 2.
**Tests:** `packages/datum-ui` Header stories + axe auto-glob; `apps/web` build (JS budget unaffected by a CSS-only header, but re-check regardless).
**Visual validation:** all three chrome variants (group/Dhruv/Precise) at 1440px, keyboard-tab through every header control, confirm `.exploded-scrub` no longer pins under the header on a Dhruv/Precise product route.
**Rollback risk:** HIGH — every route on the site renders this component; a regression here is sitewide, not page-scoped.
**Commit boundary:** own commit.

### PHASE 4 — MegaPanel retheme
**Purpose:** retheme both mega-menu surfaces immediately after the header they hang off, while the visual context is fresh.
**Files touched:** `packages/datum-ui/src/components/MegaPanel.tsx`, `packages/datum-ui/src/components/Header.tsx` (legacy grid section only — no `useEffect`/logic touched).
**Dependencies:** Phase 1, Phase 3.
**Tests:** `MegaPanel.test.tsx` must pass **unchanged** — if this test file requires any edit to keep passing, that is itself a signal the interaction was touched and must be reverted. Axe auto-glob via `.stories.tsx`.
**Visual validation:** open both menus (group mega-panel, Dhruv/Precise legacy grid) at 1440px and at the `md` breakpoint; Tab-cycle through to confirm the focus trap is unchanged; ESC and outside-click still close.
**Rollback risk:** MEDIUM — scoped to two components, but both are high-traffic navigation surfaces.
**Commit boundary:** own commit, separate from Phase 3.

### PHASE 5 — Footer
**Purpose:** land the second largest structural change (Zone 3 going dark) as its own reviewable unit.
**Files touched:** `packages/datum-ui/src/components/Footer.tsx`.
**Dependencies:** Phase 1.
**Tests:** `Footer.stories.tsx` + axe auto-glob.
**Visual validation:** all three `FOOTER_COLUMNS` configurations (group/Dhruv/Precise), mobile clearance against `MobileBottomBar` at 375px, back-to-top control keyboard-reachable and functional.
**Rollback risk:** MEDIUM — one component, but rendered on every route via every layout.
**Commit boundary:** own commit.

### PHASE 6 — Shared cards / buttons / forms / certification components
**Purpose:** land every remaining shared-component retheme before any page composes them, so page-level phases (7+) build on finished primitives.
**Files touched:** `ProductCard.tsx`, `CategoryCard.tsx`, `Button.tsx`, `Input.tsx`, `Select.tsx`, `Textarea.tsx`, `FieldShell.tsx`, `Seal.tsx` (new), `Stamp.tsx` (verify-only), `CertificationCard.tsx`, `SpecTable.tsx`, `SpecRail.tsx`, `StatBand.tsx`.
**Dependencies:** Phase 1.
**Tests:** each component's own `.stories.tsx` + axe auto-glob; `packages/datum-ui` full test suite.
**Visual validation:** Storybook pass over all new/changed variants (`ProductCard` photo default + `layout="spec"`, `CategoryCard` hover, `Seal` at 120/72/44px + tile fallback, `StatBand` `overlay` variant in isolation).
**Rollback risk:** MEDIUM–HIGH — these are the most widely-reused components in the library; a defect here surfaces on nearly every route.
**Commit boundary:** can be split into smaller commits per component if the diff grows large, but must land before Phase 7.

### PHASE 7 — HomeHero
**Purpose:** build the photo-as-ground restructure and `statsOverlay`/`align` contract in isolation before any homepage adopts it.
**Files touched:** `packages/datum-ui/src/components/HomeHero.tsx`, `packages/datum-ui/src/components/StatBand.tsx` (if the `overlay` variant wasn't already finished in Phase 6).
**Dependencies:** Phase 1, Phase 6.
**Tests:** `HomeHero.stories.tsx` covering both `statsOverlay` states, axe auto-glob.
**Visual validation:** Storybook only at this phase — not yet wired into a real page (that's Phases 9–11).
**Rollback risk:** LOW at this phase (isolated), HIGH once wired in — flagging for awareness ahead of Phase 9.
**Commit boundary:** own commit.

### PHASE 8 — PageHero (Phase A: build in isolation, Phase B: fixture-based representative validation)
**Purpose:** per your explicit risk-control instruction — build and validate on a representative subset before propagating to all 16 consumers, without touching or visiting any production route in the process.
**Files touched:** `packages/datum-ui/src/components/PageHero.tsx`, `packages/datum-ui/src/components/PageHero.stories.tsx` (new fixture stories, see Sub-phase B). **No production route file is touched, opened as a route, or rendered live in this phase.**
**Dependencies:** Phase 1, Phase 6.
**Tests:** axe auto-glob via the fixture stories described below.
**Sub-phase B — representative validation via isolated Storybook fixtures (not live routes):** nine new `PageHero.stories.tsx` story variants, each constructed by copying the *real* production copy/props already in the content model for: group `/about`, group `/contact`, group `/capabilities` (index), group `/projects`, group `/privacy`, group `/terms`, `dhruv-epc/company`, `precise-engineers/company`, and one representative product-category page (real data pulled from `product-category-pages.tsx`'s existing content, not invented copy). Each fixture is a story-file `<PageHero/>` call using that route's actual `eyebrow`/`title`/`lead`/`breadcrumbs` values — the production page component itself is never opened or modified to build these.
**Fixture coverage requirement (must be satisfied across the nine, not necessarily one property per fixture):** photo hero, no-photo fallback, a short breadcrumb, the longest/deepest real breadcrumb trail this content model produces, a long eyebrow string, a long title string, and mobile text wrapping.
**Visual validation:** each fixture at 320/375/390/768/1024/1440px — breadcrumb-on-photo legibility at both short and long trail lengths, no-photo fallback rendering cleanly, eyebrow/title wrapping at the longest real strings found, compact 340–560px hero heights.
**Rollback risk:** LOW — component and stories only; zero production-route risk in this phase by construction. The propagation risk is deferred entirely to Phase 12.
**Commit boundary:** own commit — `PageHero.tsx` plus its fixture stories only. Phase 12 remains the sole phase that touches any of the 16 actual production route files, and only after this phase is visually signed off.

### PHASE 9 — Group homepage
**Purpose:** retire the bespoke inline hero and adopt `HomeHero` per Decision 2.
**Files touched:** `apps/web/app/(group)/page.tsx`.
**Dependencies:** Phase 7.
**Tests:** existing group-home route test coverage (JSON-LD, redirect/link-integrity tests unaffected — verify).
**Visual validation:** 320/375/390/768/1024/1440px, confirm `statsOverlay` is **not** present (grep the diff for the literal string `statsOverlay` in this file before commit — it must not appear), confirm the existing post-hero stat-band section is untouched.
**Rollback risk:** HIGH — this is the site's primary landing page.
**Commit boundary:** own commit.

### PHASE 10 — Dhruv homepage
**Purpose:** add `statsOverlay={true}` to the existing `HomeHero` call.
**Files touched:** `apps/web/app/dhruv-epc/page.tsx`.
**Dependencies:** Phase 7.
**Tests:** existing route test coverage.
**Visual validation:** 320–1440px, confirm the separate post-hero stat section is removed (no duplicate stats rendering).
**Rollback risk:** MEDIUM-HIGH — primary company landing page.
**Commit boundary:** own commit, separate from Phase 9 and 11.

### PHASE 11 — Precise homepage
**Purpose:** identical to Phase 10, Precise scope.
**Files touched:** `apps/web/app/precise-engineers/page.tsx`.
**Dependencies:** Phase 7.
**Tests:** existing route test coverage.
**Visual validation:** same as Phase 10, plus confirm the flex-blue accent (unchanged, D-7) still reads correctly against the new photo-ground hero.
**Rollback risk:** MEDIUM-HIGH.
**Commit boundary:** own commit.

### PHASE 12 — PageHero consumer migration (Phase C of the risk-control split)
**Purpose:** propagate the Phase 8 component to the remaining 7 consumers not covered by the representative validation set.
**Files touched:** `precise-engineers/proof/page.tsx`, `precise-engineers/capabilities/page.tsx`, `(group)/capabilities/[slug]/page.tsx`, `(group)/industries/page.tsx`, `(group)/industries/[slug]/page.tsx`, `dhruv-epc/proof/page.tsx`, `dhruv-epc/capabilities/page.tsx`.
**Dependencies:** Phase 8 (both sub-phases complete and visually signed off).
**Tests:** each route's existing metadata/JSON-LD tests.
**Visual validation:** same 6-breakpoint sweep as Phase 8B, but can be done as a single batch pass since the component itself is already validated — this phase is about confirming each route's specific content (breadcrumb depth, eyebrow length) doesn't break the now-proven component, not re-validating the component itself.
**Rollback risk:** LOW-MEDIUM per route (interior pages, lower traffic than homepages), but 7 files in one phase — commit per logical group (Precise pair, group capabilities pair, group industries pair, Dhruv pair) rather than one giant commit.

### PHASE 13 — Product / category pages
**Purpose:** land the FAQ retheme and any remaining product-page token cascade.
**Files touched:** `apps/web/lib/product-detail-page.tsx` (FAQ section token retheme only — **no structural change**, per Decision 5), `apps/web/lib/product-category-pages.tsx` (remaining category-page token cascade beyond its Phase 8 representative check).
**Dependencies:** Phase 1, Phase 6, Phase 8.
**Tests:** `apps/web` full test suite, `link-integrity.test.ts`, `metadata-uniqueness.test.ts`.
**Visual validation:** spot-check 2–3 product pages per company (one with a full 4:3 photo path, one no-photo/spec-layout path once `ProductCard layout="spec"` is available) — FAQ accordion open/close, chevron rotation, JSON-LD unchanged (diff the emitted JSON-LD against pre-change output).
**Rollback risk:** MEDIUM — 17+ product routes share this factory function; a defect here is broad but not sitewide.
**Commit boundary:** own commit. **Explicitly excludes** the DEFERRED "Fabrication & QA" and "Types & configurations" sections — do not add them here.

### PHASE 14 — Responsive validation
**Purpose:** dedicated cross-cutting pass, not folded into any single component phase, because responsive behavior spans everything built in Phases 1–13.
**Files touched:** none expected — this phase should surface bugs to fix in a follow-up commit against the specific component/route found broken, not modify files directly.
**Dependencies:** Phases 1–13 complete.
**Tests:** none automated beyond what already exists (Playwright viewport tests if any — verify).
**Visual validation (mandatory, at minimum):** 320px, 375px, 390px, 768px, 1024px, 1440px, on: header height ladder, mega-panel positioning at `md` breakpoint, hero crop + text wrapping + `statsOverlay` layout on both company homepages, breadcrumb position on interior/product heroes, footer clearance against `MobileBottomBar`, zero horizontal overflow anywhere except the capability matrix's sanctioned affordance-shadow scroll.
**Governance note (per your instruction 5):** every mobile-specific pixel value used in Phases 3, 7, 8, 10, 11 — including the ones cited to IMPLEMENTATION_NOTES §3's responsive table (header 123/91/76px ladder; hero 620/520/440px) — is labeled **IMPLEMENTATION INFERENCE — REQUIRES VISUAL VALIDATION** for the purposes of this phase, because the Claude Design canvas itself never renders a single breakpoint below 1440/760/520/352px fixed-width cards. §3's table is a documented, sourced value (C-classified), but it was never visually produced by the design tool — this phase is where it gets its first real visual check.
**Rollback risk:** N/A — this phase produces findings, not changes; findings get routed back to the relevant component's own commit.

### PHASE 15 — Accessibility + SEO + performance validation
**Purpose:** full CLAUDE.md verify sequence plus the specific regression checks flagged throughout this plan. **This phase is verification-only for production code — it produces findings, not features.**
**Files touched:** none, with exactly one conditional exception: `apps/web/e2e/a11y.spec.ts`, and only its `KNOWN_FAILURES` list, and only to update VG-004's entries to match its actual post-Header-rewrite status (re-add if still failing, remove if genuinely fixed by the white-header rewrite). **No other line of that file, and no other test file anywhere in the repo, may be modified in this phase.** If any other test appears to need a change to keep passing, that indicates a regression introduced in an earlier phase — it gets fixed there, in that phase's own commit, not patched here.
**Dependencies:** Phases 1–14.
**Tests:** `pnpm typecheck && pnpm lint && pnpm test && pnpm build`, route-level axe (Playwright), `scripts/check-js-budget.mjs`, `scripts/check-redirect-map-integrity.mjs` (no redirect changes expected — should be a no-op pass).
**Visual validation:** `:focus-visible` keyboard sweep across Header/MegaPanel/Footer/forms, `prefers-reduced-motion` OS-level toggle re-check, single-accent-element-per-view check at the header+hero RFQ overlap point specifically (`useRfqAnchorInView`).
**Rollback risk:** N/A — verification phase.

### PHASE 16 — Snapshot / parity review
**Purpose:** regenerate and **manually review** the route-baseline snapshot diff — explicitly not a bulk-accept step.
**Files touched:** `apps/web/__snapshots__/routes-baseline/*`.
**Dependencies:** Phases 1–15 (must be the last content-affecting phase before this runs, or the diff is meaningless).
**Tests:** `pnpm --filter @vedanta/web snapshot:baseline`, `pnpm --filter @vedanta/web snapshot:compare`.
**Visual validation:** every route's diff read individually — per IMPLEMENTATION_NOTES §7 warning #2, this is explicitly "expected... review the diff, don't skip the check."
**Rollback risk:** N/A — this phase either confirms intended changes or surfaces an unintended one; any surprise here means a prior phase regresses.

### PHASE 17 — Final visual QA
**Purpose:** human sign-off pass against the approved Claude Design artifact, section by section.
**Files touched:** none expected.
**Dependencies:** all prior phases.
**Visual validation:** side-by-side comparison of each rebuilt page against its corresponding canvas section (`1a`↔group home, `1b`↔Dhruv home, `1c`↔product detail, `1d`↔interior hero sample, `1g`↔header, `1i`/`1j`↔cards, `1k`↔Seal, `1l`↔footer) at 1440px, then a final full-site click-through at 375px.
**Rollback risk:** N/A.
**Exit criterion:** explicit human sign-off before this branch is proposed for merge — not an automated gate.

---

## CHANGE BUDGET / BLAST RADIUS

| File | Blast radius | Why |
|---|---|---|
| `packages/tokens/src/primitives.ts` | **CRITICAL** | Every route, every company theme, ~30 components inherit from this file |
| `packages/tokens/src/semantic.ts` | **CRITICAL** (verify-only, but critical if touched incorrectly) | Same reach as primitives; must NOT gain a `logoRed` reference |
| `packages/tokens/src/tailwind.ts` | **CRITICAL** | Generates the Tailwind preset consumed sitewide |
| `apps/web/app/globals.css` | **CRITICAL** | Sitewide fallback colors, focus-ring rebinding, `.exploded-scrub` coupling |
| `packages/datum-ui/src/components/Header.tsx` | **CRITICAL** | Rendered on every single route via every layout |
| `packages/datum-ui/src/components/Footer.tsx` | **HIGH** | Rendered on every route via every layout |
| `packages/datum-ui/src/components/MegaPanel.tsx` | **HIGH** | Group nav, every group route |
| `packages/datum-ui/src/components/Button.tsx` | **HIGH** | Used across nearly every page (RFQ CTA, forms) |
| `packages/datum-ui/src/components/ProductCard.tsx` / `CategoryCard.tsx` | **HIGH** | Rendered in grids across ~20+ routes |
| `packages/datum-ui/src/components/HomeHero.tsx` | **MEDIUM** | 3 routes only (group, Dhruv, Precise homes), but they are the 3 highest-traffic routes on the site |
| `packages/datum-ui/src/components/PageHero.tsx` | **MEDIUM-HIGH** | 16 routes, spread across both companies and the group scope |
| `packages/datum-ui/src/components/StatBand.tsx` | **MEDIUM** | 4 known call sites today, expands with `overlay` variant |
| `packages/datum-ui/src/components/SpecTable.tsx` / `SpecRail.tsx` / `CertificationCard.tsx` | **MEDIUM** | Product detail routes (17+), not sitewide |
| `packages/datum-ui/src/components/Logo.tsx` (new) | **MEDIUM** | Net-new but immediately wired into all 3 chrome components in Phase 3 |
| `packages/datum-ui/src/components/Seal.tsx` (new) | **LOW-MEDIUM** | Net-new, scoped to `CertificationCard` |
| `packages/datum-ui/src/components/PhotoSlot.tsx` (new) | **LOW-MEDIUM** | Net-new, scoped to hero/card photo slots as they're built |
| `apps/web/app/(group)/page.tsx` | **HIGH** | Primary site entry point, structural rewrite (bespoke→`HomeHero`) |
| `apps/web/app/dhruv-epc/page.tsx` / `precise-engineers/page.tsx` | **MEDIUM-HIGH** | Primary company entry points, prop-only change |
| 16 `PageHero` consumer route files | **LOW each, MEDIUM in aggregate** | Individually low-traffic interior pages; aggregate risk is regression volume, not severity per-route |
| `apps/web/lib/product-detail-page.tsx` | **MEDIUM** | Shared factory for 17+ product routes, but this phase's change is retheme-only |
| `packages/tokens/src/tokens.test.ts` / `apps/web/lib/css-parity.test.ts` | **N/A (test files)** | Must move in lockstep with Phase 1, in the same commit |
| `apps/web/__snapshots__/routes-baseline/*` | **N/A (generated)** | Regenerated in Phase 16 only, never hand-edited |

**Shared components with the highest blast radius:** `Header.tsx`, `primitives.ts`/`tailwind.ts`/`globals.css` (the token layer as a unit), `Footer.tsx`. Any defect in these four surfaces on every route simultaneously — they warrant the most conservative review and the earliest placement in the phase order (already reflected: Phase 1 and Phase 3 are first).

**Routes affected, by count:** all ~35+ static routes are affected at minimum by Phase 1 (token cascade). Additionally structurally affected: 3 homepages (Phases 9–11), 16 `PageHero` consumers (Phases 8+12), 17+ product detail routes (Phase 13).

**Token changes affecting the entire application:** `steel` ramp, `radius.sm`, `shadow`, `fontFamily` — all four are consumed by every component in `packages/datum-ui` through the Tailwind preset; none can be scoped to a subset of routes.

**Changes that must be committed separately (hard requirement, not a preference):**
1. Phase 1 (tokens) — alone, before anything else.
2. Phase 3's `.exploded-scrub` offset — same commit as the Header height change, never split (explicit coupling risk).
3. Phase 9 (group home) — separate from Phase 10/11 (Dhruv/Precise homes), since `statsOverlay` must NOT appear in the group-home diff; keeping it in its own commit makes that reviewable at a glance.
4. Phase 16 (snapshot regeneration) — never bundled with a content-affecting phase, or the diff can't be trusted.

---

## Remaining Ambiguities / Blockers

1. **Emblem asset extraction incomplete.** During investigation, `assets/vedanta-emblem.png` was pulled from the Claude Design project via `DesignSync.get_file` but hit the tool's 256 KiB read cap (`truncated: true`). The PNG header parsed successfully (1161×995px, confirming the 1.167:1 ratio the spec claims), but full pixel data was not verified end-to-end. **Per your instruction 6, this must be resolved with a genuine full extraction at the start of Phase 2 — if it cannot be reliably extracted in full, Phase 2 must stop and report the blocker rather than approximate, trace, or regenerate the mark.**
2. **`CategoryCard.tsx` `thin`-state contrast bug** sits in a file Phase 6 touches anyway (for the affordance/hover retheme). It is excluded from this plan by design (see Deferred/Rejected table) — flagging here so it isn't silently picked up as "since we're in the file anyway" scope creep during Phase 6 implementation.
3. **VG-004's status after the Header rewrite is genuinely unknown until Phase 15 runs.** The white-header change plausibly resolves the underlying dark-text-on-dark-chrome contrast defect by construction, but this plan does not assume that — Phase 15 re-tests and updates `KNOWN_FAILURES` based on the actual result either way.
4. **Font-payload reduction is asserted, not measured.** IMPLEMENTATION_NOTES' own language hedges this ("should reduce... this should leave headroom"). Phase 15's JS-budget check is where this gets a real number, not before.
5. **Mobile hero/header pixel values (IMPLEMENTATION_NOTES §3) are cited but visually unverified**, per the governance note in Phase 14 — flagged there, restated here since it affects Phases 3, 7, 8, 10, 11 collectively, not one isolated phase.

---

No implementation begins until you send **"IMPLEMENT PHASE 1."**
