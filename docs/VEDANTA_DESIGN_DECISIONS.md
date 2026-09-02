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

## Decision 2 — Hero system

Four-tier system, driven by two shared props rather than per-page hero duplication:

```
align: 'lower-left' | 'center'
statsOverlay: boolean   // valid only when align === 'lower-left'
```

| Page type | Component | `align` | `statsOverlay` | Notes |
|---|---|---|---|---|
| Group home (`/`) | `HomeHero` | `lower-left` | `false` | Stats render in their existing post-hero position, unchanged. `[correction pass]` Group home migrates from its current bespoke inline hero markup onto `HomeHero` — it does not stay hand-written, and it does not gain a stats-on-photo overlay. |
| Dhruv EPC home (`/dhruv-epc`) | `HomeHero` | `lower-left` | `true` | Stats move onto the photo; the separate post-hero stat placement is removed |
| Precise Engineers home (`/precise-engineers`) | `HomeHero` | `lower-left` | `true` | Same as Dhruv — identical rule, independently confirmed |
| Product pages | `ProductHero` | — (unchanged) | — | Existing shape retained as-is |
| Interior / utility pages | `PageHero` | `center` | n/a | Breadcrumb-on-photo |

**`statsOverlay` is explicitly NOT enabled for the group homepage — under any circumstance, in any phase, on any route alias of `/`.** This is not an oversight, not a default, and not a temporary state pending a future decision. It is the locked decision. Any implementation step that sets `statsOverlay={true}` on the group home is a defect, not a variant.

**Evidence:**
- Group home currently ships a plain lower-left, no-stats-overlay hero (matches `1a` as literally rendered in the artifact).
- Dhruv/Precise homepages are proposed for the stats-overlay treatment by the artifact's own closing suggestion text, and this satisfies the artifact's explicitly stated kept principle — "stat band in the first viewport" — by construction rather than by approximation.
- Interior pages map to `1d` verbatim ("recommended, used in 1b" per the artifact's own label).
- Product pages are untouched — `1c`'s hero shape was never in question.

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

## Summary table

| Decision | Locked value/rule | Confidence |
|---|---|---|
| D-11 | UI accent stays `#AA3833`; `#CD0101` added as scoped `logoRed`, `Logo.tsx`-only | HIGH |
| Hero | All three homepages use `HomeHero`. Group = `align="lower-left"` `statsOverlay={false}`. Dhruv = `align="lower-left"` `statsOverlay={true}`. Precise = `align="lower-left"` `statsOverlay={true}`. Product = `ProductHero` unchanged. Interior = `PageHero` `align="center"`. | HIGH |
| Mega panel | Retheme background/shadow/border/color-tokens only; zero interaction, state, event, or hierarchy change | MEDIUM/LOW |
| Footer Zone 3 | Goes dark, reusing Zone 1's palette; add back-to-top; preserve mobile clearance | HIGH |
| FAQ | No change beyond token retheme; existing implementation is final | HIGH |

---

## Correction log

**2 September 2026 — Implementation Plan Correction + Final Gate.** No decision value changed. Wording tightened in Decisions 2 and 3 to close two ambiguity risks identified before Phase 1 authorization: (1) explicit confirmation that all three homepages route through `HomeHero`, with the group home's `statsOverlay={false}` restated as an absolute rule, not a default; (2) explicit confirmation that MegaPanel's "typography" retheme means token-value substitution only, with a named example (the company-label caption) showing what "unchanged structure" looks like in practice.

**2 September 2026 — second correction pass.** Removed a duplicated/overloaded Status line (the original line had the correction-pass restatement appended inline, redundant with this log). One canonical Status line now stands at the top of the document; this log remains the sole record of what changed and why.
