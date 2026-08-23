# Brand Realignment Proposal — matching the live site's identity
**Status:** Proposal — requires design-review sign-off before any `primitives.ts`/`semantic.ts` edit (Datum §26 event, per CLAUDE.md)
**Author:** Claude (Cowork), drafted from the codebase + 5 screenshots of the live site (`vedantagroup.net` / `dhruv-epc-solutions`) supplied 2026-07-21
**Supersedes:** the 2026-07-15 "v1.1 industrial luxury" palette decision recorded in `docs/decisions.md` and `packages/tokens/src/primitives.ts` — scope confirmed by Swayam 2026-07-21 as **full realignment**
**Values below are estimated by eye from screenshots + the three official logo files Swayam shared, not measured from live CSS** — flagged everywhere they matter.
**Update 2026-07-21 (same day):** Swayam confirmed (1) one shared color scheme across Vedanta Group, Dhruv EPC, and Precise Engineers — no per-company accent split — and (2) provided the Vedanta Group, Dhruv EPC, and Precise Engineers logo lockups as the color reference. I cross-checked the red against all three logos (the "A" mark, the Dhruv EPC wordmark, and the solid-red Precise Engineers banner) — consistent across all three, which supports one shared `forge` scale rather than per-company tints. Contrast ratios below are now computed (WCAG relative-luminance formula), not estimated.

---

## 0. What this changes and why it needs sign-off

The current system (`docs/datum-design-system.md` + `packages/tokens`) is a deliberate, from-scratch "industrial luxury" identity: warm paper/ink neutrals, a golden-amber accent for Dhruv EPC, a blue accent for Precise Engineers, Archivo + IBM Plex Sans. It was built specifically to move *away* from the current live site's look. Going back toward the live site's actual branding is a legitimate call — dated sites often get redesigned into something that no longer reads as "us" to the people who already know the brand — but it touches the same governance-gated layer (`primitives.ts`, `semantic.ts`) that required sign-off last time, so it gets the same treatment: values proposed here, nothing written to the token files until you confirm.

## 1. Palette read from the screenshots

| Role | Where it appears | Estimated hex | Notes |
|---|---|---|---|
| Brand red (primary) | "A" Vedanta mark, timeline rule + icon dots, footer links/social icons, decorative corner linework | `#B71E2C` – `#C41230` | Proposing **`#C41E3A`** as the mid-scale anchor — confirm against the actual logo file if you have one; logos are usually the most reliable color source. |
| Ink navy (secondary / text) | Nav links, section headings ("Photo Gallery", "Configuration"), footer background | `#1A2438` – `#1E2A3A` | Proposing **`#1B2637`** as the anchor — dark enough to double as the footer fill and the heading-text color. |
| Paper / surface | Page background, gallery background | `#FFFFFF`, `#F7F7F5` | Close to the current `steel-50`/white — likely no change needed here. |
| Table band | Configuration table alternating rows | `#F0F0EE` ish | Light neutral, low contrast — a lighter step of the same neutral scale. |

Proposed structure: a new **`forge`** primitive scale (red, named to fit the existing metaphor pattern — `arc` = welding arc, `flex` = flexure, `forge` = the red of hot steel) **replacing both `arc` and `flex`** as the single shared accent for Vedanta Group, Dhruv EPC, and Precise Engineers — per Swayam's confirmation, this removes the current per-company accent split entirely. Also darkening `steel-900`/`steel-950` toward the cooler navy hue above so headings and the footer read as true brand navy rather than the current warm near-black.

```
forge-300  ~#E0808C   (light tint — on-dark text/icons only)
forge-500  ~#C41E3A   (primary — RFQ fill, links, timeline rule, logo red)
forge-600  ~#9C1830   (hover/pressed, accent text on light)
forge-700  ~#7A1226   (pressed-hard / high-contrast text on light)
ink        ~#1B2637   (new dark neutral anchor — footer fill, heading text, replaces steel-900/950's hue)
```

**Computed WCAG contrast (relative-luminance formula, not estimated):**

| Pair | Ratio | Result |
|---|---|---|
| forge-500 text on white / steel-50 paper | 5.84 / 5.13 | AA normal-text ✓ |
| forge-500 fill + **white** label text | 5.84 | AA normal-text ✓ |
| forge-500 fill + navy-ink label text | 2.61 | **fails** — RFQ button must use white text, not dark text (this differs from the current amber system, where `rfqFg` is dark) |
| forge-300 on ink / steel-950 (on-dark use) | 5.54 / 6.54 | AA normal-text ✓ |
| forge-300 on white / paper (on-light use) | 2.41 / 2.75 | fails — confirms forge-300 is dark-surface-only, same role as today's `arc-300` |
| forge-600 / forge-700 text on white / paper | 8.12–10.81 | AA normal-text ✓ (text-on-light only — both fail on dark surfaces, expected) |
| ink (#1B2637) text on white / paper | 15.23 / 13.36 | AA ✓ — safe for headings/nav |
| white text on ink fill (footer) | 15.23 | AA ✓ |
| steel-300 secondary text on ink fill (footer secondary copy) | 8.58 | AA ✓ |

Net effect: the scale slots into the existing arc/flex-shaped structure cleanly, with one concrete required change — `semantic.ts`'s `rfqFg` (the RFQ button's label color) must become **white** (`steel-50`) everywhere, not `steel-950`, since forge-500 is darker than arc-500 amber was.

## 2. Typography

I tried to pull the exact font-family off the live site directly (fetched `vedantagroup.net` and the `dhruv-epc-solutions`/`precise-engineers` pages) — confirmed the content matches what's in the screenshots (same address, phone numbers, emails), but the fetch tool strips `<head>`/CSS on the way through, so I can't read the actual `font-family` declaration or any Google Fonts `<link>` this way. No browser-inspection bridge is available in this session either.

Headings in the screenshots and logos read as a rounded, geometric sans at bold weight (nav/body at medium) — closest common web-font families to that shape are **Poppins**, **Jost**, or **Manrope**. Fastest way to get this exact rather than estimated: open the live page, right-click any heading → Inspect → Computed panel → `font-family` — that's a 10-second lookup on your end and removes all guesswork. Failing that, I'll proceed on **Poppins** as the working estimate.

Until confirmed, I'd propose **Poppins** for display/headings (closest rounded-geometric match) and keep **IBM Plex Sans** for body copy/spec tables — Plex Sans has better data-legibility (tabular figures, engineering-doc feel) than Poppins would at small sizes, and the spec-table-heavy pages in this site benefit from that. Both self-host cleanly via `next/font` the same way the current fonts do, so no new-dependency review is triggered.

## 3. Layout/orientation patterns to bring over

These map fairly directly onto components that already exist or are close variants:

- **Hero + breadcrumb overlay** — full-bleed photo, dark scrim, large white H1, breadcrumb beneath. `ProductHero.tsx` and `PageHero.tsx` already have this basic shape; mainly a palette/type swap, not new structure.
- **Banded key/value spec table** ("Configuration") — `SpecTable.tsx` already does two-column spec data; this is a styling variant (row banding, no borders) rather than a new component.
- **"Our Journey" timeline** — vertical rule + circular icon markers + year labels. Nothing in `datum-ui` does this today; it'd be a **new component** (`Timeline.tsx`), which per CLAUDE.md's "NEW COMPONENT CHECKLIST" needs its own Storybook story, keyboard contract, and reduced-motion variant.
- **Photo gallery grid** — simple 3-up image grid. Also not in the current library; small new component, straightforward.
- **Footer** — dark navy fill, products/quick-links columns, contact block, decorative red corner linework, red social icons. `Footer.tsx` already has the products/quick-links/contact structure — this is largely a palette change plus the corner-linework detail (a small SVG/CSS decoration, easy to add without breaking the "no arbitrary values" rule if the linework color resolves to a token).

A second, structural side effect of "one red for everyone": `semantic.ts`'s three per-company maps (`semanticDhruv`/`semanticPrecise`/`semanticGroup`) currently exist mainly to swap the accent color. With one shared accent, those three maps converge on identical `action`/`accent`/`focus`/`border` blocks — worth collapsing toward a single semantic map (keeping company-scoped structure only where it's still load-bearing, e.g. any non-color per-company content) rather than carrying three near-duplicate token maps forward. Flagging this now so it's a conscious simplification, not something a later session "discovers" and has to decide alone.

## 4. Suggested execution order (mirrors the session structure in `BUILD-PLAYBOOK.md`)

1. **Tokens session** — write the `forge` scale + `ink` neutral into `primitives.ts`; collapse `semantic.ts`'s three company maps toward one shared accent (per §3 above); update `tailwind.ts`; log the override in `docs/decisions.md` (supersedes the 2026-07-15 entry, doesn't delete it).
2. **Chrome session** — restyle `Header`, `Footer`, `MobileDrawer`, `MobileBottomBar` against the new tokens; verify one-accent-per-view law still holds (red is now the only accent everywhere, so this is easier to check than before, not harder).
3. **New components session** — build `Timeline` and `PhotoGallery`, each with the same rigor as existing components (stories, a11y pass, reduced-motion).
4. **Page pass session** — re-skin `SpecTable`/`ProductHero`/`PageHero` usages across the built pages (home, product pages, capabilities, proof) against the new palette.
5. **Verify pass** — full Datum checklist (focus-visible, reduced-motion, 320px, one-accent-per-view) plus a side-by-side screenshot diff against these reference images, section by section.

## 5. Status

Resolved: shared color scheme (one `forge` red, no per-company split), logo-cross-checked red anchor, computed contrast ratios, `rfqFg`→white requirement.
Still open: exact font-family (proceeding on Poppins estimate unless/until confirmed via devtools), and final sign-off to actually write `primitives.ts`/`semantic.ts` — per CLAUDE.md this is a design-review event, so nothing gets written to those files until that go-ahead is explicit.
