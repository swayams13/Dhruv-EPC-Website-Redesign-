# VEDANTA_DESIGN_DECISIONS.md — Locked implementation constraints

**Status:** LOCKED — approved by Swayam, 2 September 2026.
**Source artifact:** Claude Design project `9b313f0a-5936-49dd-a324-dcfe9a5d4c7f`, file `Vedanta Brand Evolution.dc.html` (sections `1a`–`1l`, `2a`–`2b`).
**Companion docs:** `VEDANTA_DESIGN_LANGUAGE.md` (forensics), `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` (full token/component spec).
**Relationship to `docs/decisions.md`:** that file is this repo's append-only governance log for standing-rule overrides; this file is a scoped, single-purpose record of the five decisions that were genuinely ambiguous in the approved artifact and had to be resolved before implementation could start. Once implemented, a summary entry should be appended to `docs/decisions.md` per that file's own convention — not done automatically here, out of scope for this document.

**Governing rule:** these five decisions are FINAL for the duration of this implementation effort. If a technical obstacle appears during implementation, solve the technical problem — do not revisit the visual decision. Reopening any of these requires a new, explicit decision-resolution pass, not a silent judgment call mid-implementation.

---

## Decision 1 — D-11: Two-red system

**UI accent — unchanged, `#AA3833`**
Remains the sole value for buttons, links, focus rings, interactive states, borders, rules, and RFQ actions — i.e. every existing `accent.*` semantic token and everything downstream of it.

**Logo red — new, scoped, `#CD0101`**
```ts
// primitives.ts — logo-only. NOT part of the semantic accent system.
export const logoRed = '#CD0101' as const
```

**Rules (hard constraints):**
- `logoRed` is consumed by `Logo.tsx` and nowhere else.
- Never exposed through `semantic.ts`.
- Never exposed through any `accent.*` token.
- Never used for buttons, links, focus rings, or generic decorative UI.
- No other component file may reference `#CD0101` or `logoRed`.

**Evidence:**
- `#AA3833`: three-region live-site sample (masthead, active sidebar, section eyebrow), signed off in `docs/decisions.md` (27 Aug 2026), full contrast-covenant coverage in `tokens.test.ts`. Contrast verified independently: 6.32:1 on white.
- `#CD0101`: single logo-artwork sample (2,156 px), used only for the wordmark in the artifact. Contrast verified independently: 5.83:1 on white.
- The approved artifact itself ships both values in their current, distinct roles and does not mandate unification — its own text presents unification as an opinion, not a decision.

**Confidence: HIGH**

---

## Decision 2 — Hero system (SUPERSEDED 2 September 2026 by Hero C — see revision below)

### Current, authoritative version: Hero C

The Claude Design project was updated after this decision was first locked. `1f` ("Hero C — split: charcoal type panel beside a hard-edged photo") is now labeled in the live canvas itself as **"chosen, applied to 1a and 1b"** — confirmed by re-fetching the actual project file this session, not inferred. This supersedes the original lower-left/`statsOverlay` contract below for all three homepages. `statsOverlay` is retired — see "What this removes."

**`HomeHero` uses a single new variant, not the old `align`/`statsOverlay` props:**

```
<HomeHero variant="split" ... />
```

**Split hero anatomy (verified against the live canvas, exact values):**
- `display:grid; grid-template-columns: 47fr 53fr` — a 47/53 split, not 50/50.
- Fixed height per homepage: group home `600px`, Dhruv/Precise company homepages `560px` (Precise's exact height is inferred by symmetry with Dhruv — the canvas only mocks group and Dhruv, never a separate Precise homepage instance).
- **Left panel (47%, type):** `background: steel-900 (#23282D)`. Contents, top to bottom: an optional breadcrumb (company homepages only — "Home → Dhruv EPC Solutions" — rendered `rgba(255,255,255,.6)` / arrow in accent-dark / current page `rgba(255,255,255,.92)`; the group homepage has none, since it's the top-level page); 64×2px accent rule; eyebrow at `text-body font-bold`, color **accent-dark (brand-300 `#DC8D89`, not white)** — this is a change from the previous non-split hero, which used white; H1 at **`text-display` (56px, NOT `text-display-xl` 64px)**, weight 700, `-0.02em` tracking, white; body copy at `text-body-lg` (19px), color `white/72` (previously `white/82` on the old hero — also changed); CTA pair (accent-fill + outline), unchanged pattern.
- **Right panel (53%, photo):** a **plain grid cell**, `position:relative`, **no scrim, no gradient overlay, no type rendered over it** — this is the headline difference from every other hero in the system. Photo crop is portrait (4:5 in the applied group/Dhruv instances). A datum-rule tick device (`12px end ticks, 1px line`) plus a real dimension label (e.g. "Ø 5,000 mm max shell", "400 T max unit weight") sits pinned to the bottom of this photo panel specifically — not the type panel, not the page.
- **Stat band:** a separate, standalone light section immediately below the hero — unchanged in kind from before, and now identical across all three homepages. It is never overlaid on the photo.

**What this removes:**
- `statsOverlay` (boolean prop) is retired entirely. Do not implement it. Do not keep it as an unused/dead prop on `HomeHero`'s interface. Do not add it "for future compatibility." If any planning or implementation artifact still names `statsOverlay`, treat that language as **SUPERSEDED BY HERO C — DO NOT IMPLEMENT**, not as a live option.
- `1e` ("Hero B — marketing: left-lower type, figures pulled onto the photo") — the option `statsOverlay` was originally built to express — is not applied anywhere in the current canvas and is deprioritized below `1f`. It is not deleted from the artifact and remains readable as design history, but it is not the implementation target.
- The old lower-left, full-bleed-photo-with-scrim treatment for homepages specifically (not for `PageHero`/`ProductHero`, which keep their own full-bleed+scrim treatment untouched).

**Scope — this decision governs `HomeHero` only:**

| Page type | Component | Treatment |
|---|---|---|
| Group home (`/`) | `HomeHero` | `variant="split"`; no breadcrumb; standalone stat band retained below |
| Dhruv EPC home (`/dhruv-epc`) | `HomeHero` | `variant="split"`; breadcrumb inside the type panel; standalone stat band retained below |
| Precise Engineers home (`/precise-engineers`) | `HomeHero` | `variant="split"`, by symmetry with Dhruv (no direct canvas instance); standalone stat band retained below |
| Product pages | `ProductHero` | **Unchanged by this decision** — full-bleed photo, graduated scrim, breadcrumb on the photo, per `1c`. See Decision 6 for its relationship to the exploded-sequence question. |
| Interior / utility pages | `PageHero` | **Unchanged by this decision** — full-bleed photo, graduated scrim (0.35→0.82), breadcrumb on the photo, per `1d`. The canvas's own `1f` commentary explicitly confirms this: *"keeping 1d everywhere else."* |

`HomeHero`, `PageHero`, and `ProductHero` remain three separate components with three separate contracts. `align`/scrim/breadcrumb-on-photo behavior is retained only where `PageHero`/`ProductHero` already used it — it is not extended to the split `HomeHero`, and the split `HomeHero`'s `variant`/grid-panel contract is not extended back onto them.

**A genuine, but partial, upside on the exploded-sequence question:** the canvas's own `1f` commentary states *"the photo is a normal grid cell rather than an absolute ground, which removes the sticky-track conflict with the exploded-view sequence."* This is directionally true — a plain grid cell is a less hostile container than the `position:absolute inset-0` layer the previous hero contract used — but it does not, by itself, give `ExplodedSequence`'s `.exploded-track` the ~220vh of real in-flow scroll height it needs; the split hero's panel is still fixed at 600px/560px. See Decision 6: `ExplodedSequence` was never a `HomeHero` concern in practice (zero current consumers), and this update does not change that — if anything, it confirms `ExplodedSequence`'s real relevance, if any, is to `PageHero`/`ProductHero`'s full-bleed hero pattern, not to the split `HomeHero`.

**Evidence:**
- Re-fetched `Vedanta Brand Evolution.dc.html` directly from the Claude Design project this session (file grew from 98,075 to 99,981 bytes since the prior fetch — a real, verified update, not assumed). `1f`'s label now reads *"chosen, applied to 1a and 1b"*, and both `1a` (group) and `1b` (Dhruv) now render the 47fr/53fr split hero in place of the previous full-bleed lower-left hero.
- `1c` (product detail) was re-verified byte-for-byte identical to the prior fetch — full-bleed, `height:440px`, graduated scrim (`rgba(0,0,0,.42/.6/.84)`), breadcrumb over the photo. Untouched.
- `1f`'s own updated commentary: *"it drops the overlay-plus-white-type formula... and it moves the breadcrumb off the photo onto charcoal — both cited as load-bearing. Mitigated by scoping it to the three homepages... and keeping 1d everywhere else."*
- Every exact value above (grid fractions, panel heights, eyebrow color, H1 token, body opacity, datum-rule placement) is read directly from the live canvas markup, not estimated.

**Open item, flagged not resolved:** the type panel's `white/72` body copy is opacity-blended text, not a solid token — per this project's own standing rule (`docs/mistakes.md`, 2026-09-01, the `IndustryCard` opacity-contrast incident), its real contrast must be computed against the actual blended RGB during Phase 9's build, not assumed safe from the nominal white-on-dark ratio.

**Confidence: HIGH**

---

## Decision 3 — Mega panel

**Preserve interaction and structure exactly.** Retheme only.

**Do not change, under any framing:** keyboard interaction logic, focus management, state management, event architecture (`useEffect` structure), component hierarchy, open/close behavior, submenu structure, navigation behavior, spacing. `[correction pass]` No `useEffect` may be added, removed, or restructured in either component as part of this work — the existing focus-trap/ESC/outside-click logic in `MegaPanel.tsx` and `Header.tsx`'s legacy dropdown is verified working and is explicitly off-limits.

**Allowed (retheme only):**
- Background → white
- Existing shadow → the approved overlay/shadow token equivalent
- Add a top border using the approved steel border token
- Color and typography **token values** change automatically via the `steel`/`fontFamily` primitive swap (every `steel-*`/`font-mono`/`font-display` class maps to its new-ramp value) — this is a value substitution, not a hierarchy change. `[correction pass]` No new typographic scale, weight, size, or decorative element (e.g. a rule/underline under a label) may be introduced. The company-label caption (`font-mono text-xs uppercase tracking-caption`) stays exactly as structured today — it already qualifies as mono/data usage under the typography system, so it needs a color-token remap only, nothing else.

**Applies to:** `MegaPanel.tsx` (group nav) and the legacy mega-menu grid inside `Header.tsx` (Dhruv/Precise nav).

**Evidence:** the approved artifact never renders either menu's open state anywhere in the `.dc.html` file — confirmed by full-file inspection, not a sampling gap. The white-background direction is not itself an invention: it follows necessarily from the already-decided header background change (dark → white), since a dark panel hanging off a white bar would read as visually detached. Everything beyond background/shadow/border has zero artifact evidence and is therefore explicitly out of scope for this pass.

**Confidence: MEDIUM** (background direction) / **LOW** (any treatment beyond background/shadow/border — which is exactly why nothing beyond that is authorized)

---

## Decision 4 — Footer Zone 3

**Zone 3 goes dark**, reusing Zone 1's already-established dark-chrome treatment — not a new dark color.

**Update:** Zone 3 background, heading text, link text, and any icon colors, using the existing white/opacity-white values already established in Zone 1.

**Add:** a 44px circular back-to-top control, implemented inline inside Zone 3 (no new component file).

**Preserve exactly:** `pb-20 md:pb-6` (the existing `MobileBottomBar` clearance reservation on mobile).

**Evidence:**
- Three independent renders in the approved artifact (`1a`'s full footer, `1b`'s explicit cross-reference to `1a`'s footer, `1l`'s dedicated footer-linework detail) all show Zone 3's nav content and legal bar on the same dark chrome as Zone 1 — no light Zone 3 appears anywhere in the artifact.
- Independently corroborated by direct forensics of the client's live production site (`VEDANTA_DESIGN_LANGUAGE.md` §4): *"copyright bar at 40%-opacity white"* on a *"dark charcoal band (#23282D)"* — i.e. a fully dark footer, including the legal bar, is what the real Vedanta site does today. The current codebase's light Zone 3 is the deviation, not the artifact.
- No icon assets currently exist in `Footer.tsx` (LinkedIn/WhatsApp are plain text links) — "icon colors" applies to link/text color only, not to any image or SVG asset.

**Confidence: HIGH**

---

## Decision 5 — FAQ

**The existing implementation is authoritative. Retheme only.**

**Do not:** create a new FAQ component, change the FAQ schema, change the JSON-LD, change FAQ data logic.

**Evidence (direct codebase inspection):**
- Implementation: native `<details>`/`<summary>` accordion, `apps/web/lib/product-detail-page.tsx` (~L228–248), using the `ChevronDown` glyph already barrel-exported specifically for this purpose.
- Schema gate: `ProductFAQ` (`packages/schemas/src/cms.ts`), `Product.faqs` requires 4–6 entries — a hard publish gate, not a suggestion.
- JSON-LD: `buildFAQPage(product.faqs)` (`packages/schemas/src/jsonld.ts`), emitted on every product detail route.
- Live routes: every `[category]/[slug]` product page for both companies, via the shared `productDetailPage()` factory.
- The artifact's own `1c` FAQ section (chevron-accordion, 5 sample Q&As) is structurally identical to what already ships — same interaction, same content shape, same count, inside the same 4–6 gate.

**Confidence: HIGH**

---

## Decision 6 — ExplodedSequence architecture (added 2 September 2026, second reconciliation pass)

**`ExplodedSequence` is never passed as `HomeHero`'s `photo` prop, and reviving/wiring it into any live route is out of scope for this redesign.**

**Revised 2 September 2026 (Hero C reconciliation):** `HomeHero` no longer has an `absolute inset-0` photo-as-ground layer at all — under Hero C, its photo panel is a plain 53%-width grid cell (see Decision 2). This *reduces* the original conflict this decision worried about (a tall in-flow scroll track jammed into an absolute-positioned layer), but does not eliminate the underlying incompatibility, since the grid cell is still fixed at 600px/560px — nowhere near the ~220vh `ExplodedSequence` needs. More importantly, `ExplodedSequence` was never actually a `HomeHero` problem in practice: it has zero current route consumers (see Evidence). If it has a real home in this system, its full-bleed, unconstrained-height photo pattern is structurally far closer to `PageHero`/`ProductHero`'s treatment (`1c`/`1d` — full-bleed photo, no grid-cell width constraint) than to the new split `HomeHero`. This decision's guard therefore moves to where it actually applies.

**Rules:**
- `HomeHero`'s `photo` prop is retired along with `align`/`statsOverlay` (Decision 2) — there is no photo-ground slot on `HomeHero` for `ExplodedSequence` to conflict with in the first place under Hero C. No JSDoc guard is needed there.
- `PageHero`'s and `ProductHero`'s `photo` props each gain a JSDoc note: ordinary object-cover photography only; `<ExplodedSequence>` requires its own in-flow, unconstrained-height section and must never be passed here either.
- `ExplodedSequence.tsx`, its CSS (`.exploded-track`/`.exploded-scrub`/`.exploded-static` in `globals.css`), and `site-data.ts`'s `*ExplodedFrames` exports are **not modified** by this redesign.
- The `.exploded-scrub{top:60px}` → `76px` CSS update still happens alongside the Header height change (mechanical consistency), independent of the component's live-usage status.
- Reviving/wiring the feature into any route — homepage, interior, or product — is DEFERRED — a separate, future decision, not authorized here.

**Evidence:**
- `ExplodedSequence` has **zero current route consumers** — confirmed by a repository-wide search. `dhruv-epc/page.tsx` and `precise-engineers/page.tsx` carry a comment describing an exploded-view photo slot, and `site-data.ts` still exports real frame-path data (`dhruvExplodedFrames` etc., backed by real WebP assets on disk), but neither `<HomeHero>` call actually passes a `photo` prop today. The feature is orphaned, not live.
- The live canvas's own updated `1f` commentary states the split hero's grid-cell photo panel *"removes the sticky-track conflict with the exploded-view sequence"* — directionally correct (no more `overflow`/`absolute` clipping ancestor) but not a full fix (the panel is still height-constrained), and in any case moot for `HomeHero` specifically now that it has no photo-ground slot to guard.
- Neither the canvas nor `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` depict, mention, or authorize an exploded-view sequence anywhere in `1c`/`1d`'s full-bleed hero pattern either — every hero photo slot in the canvas, split or full-bleed, is a plain static placeholder.
- The DOM/CSS incompatibility (tall in-flow scroll track vs. any fixed-height container, absolute or grid-cell) is a structural fact of `ExplodedSequence`'s own implementation, independent of which hero component it's hypothetically discussed against.

**Confidence: HIGH**

---

## Summary table

| Decision | Locked value/rule | Confidence |
|---|---|---|
| D-11 | UI accent stays `#AA3833`; `#CD0101` added as scoped `logoRed`, `Logo.tsx`-only | HIGH |
| Hero (Hero C) | All three homepages use `HomeHero variant="split"` — 47/53 grid, no scrim, breadcrumb in type panel (company homes only), standalone stat band retained. **`statsOverlay` retired — SUPERSEDED BY HERO C, DO NOT IMPLEMENT.** `ProductHero`/`PageHero` unchanged (`1c`/`1d`, full-bleed + scrim + breadcrumb-on-photo). | HIGH |
| Mega panel | Retheme background/shadow/border/color-tokens only; zero interaction, state, event, or hierarchy change | MEDIUM/LOW |
| Footer Zone 3 | Goes dark, reusing Zone 1's palette; add back-to-top; preserve mobile clearance; type panel and Zone 3 both require explicit `data-chrome="dark"` for correct focus-ring contrast | HIGH |
| FAQ | No change beyond token retheme; existing implementation is final | HIGH |
| ExplodedSequence | Never a `HomeHero` concern (no photo-ground slot under Hero C); guard moves to `PageHero`/`ProductHero`; reviving it into any route remains deferred | HIGH |

---

## Correction log

**2 September 2026 — Implementation Plan Correction + Final Gate.** No decision value changed. Wording tightened in Decisions 2 and 3 to close two ambiguity risks identified before Phase 1 authorization: (1) explicit confirmation that all three homepages route through `HomeHero`, with the group home's `statsOverlay={false}` restated as an absolute rule, not a default; (2) explicit confirmation that MegaPanel's "typography" retheme means token-value substitution only, with a named example (the company-label caption) showing what "unchanged structure" looks like in practice.

**2 September 2026 — second correction pass.** Removed a duplicated/overloaded Status line (the original line had the correction-pass restatement appended inline, redundant with this log). One canonical Status line now stands at the top of the document; this log remains the sole record of what changed and why.

**2 September 2026 — third pass (plan reconciliation).** Added Decision 6 (ExplodedSequence architecture) following a structured review of `FINAL_IMPLEMENTATION_PLAN.md` that surfaced a genuine architectural gap the original five decisions didn't cover. Investigation found the review's premise was more specific than assumed — `ExplodedSequence` has zero current route consumers, not an active feature at risk — but the underlying architectural conclusion (keep it structurally separate from `HomeHero`'s photo-as-ground layer) holds regardless. No other decision value changed.

**2 September 2026 — fourth pass (Hero C).** The Claude Design project itself was updated between sessions — re-fetched and verified directly (file grew from 98,075 to 99,981 bytes; `1f`'s label now reads "chosen, applied to 1a and 1b"). Decision 2 is rewritten in full: `HomeHero` moves from the `align`/`statsOverlay` contract to a single `variant="split"` contract (47/53 grid, no scrim, breadcrumb in the type panel, standalone stat band). `statsOverlay` is retired — any surviving reference to it anywhere in project documentation should be read as superseded, not live. Decision 6 is updated to reflect that `ExplodedSequence` was never really a `HomeHero` concern and its guard moves to `PageHero`/`ProductHero`. `ProductHero`/`PageHero` are confirmed unchanged by this revision — re-verified byte-for-byte identical to the prior canvas fetch.
