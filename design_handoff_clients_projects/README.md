# Handoff: Clients & Projects

## Overview

A new page and one homepage band that put the Vedanta Group brochure's four credibility blocks onto the website for the first time: the 42-company clientele wall, the 10 sectors served, the 15 named executed jobs (Dhruv EPC 8, Precise Engineers 7), and the 12 third-party inspection and approval agencies.

This is the content the site's generous whitespace was built for and never received — the current product pages carry a photo and two paragraphs with no dimensional figure, pressure rating or capacity number anywhere. The project track record is the first place on the site where a real diameter, pressure, alloy and destination appear together.

**Start with `PROMPT.md` in this folder** — it is the literal text to paste into Claude Code. This README is the reference it points at.

## About the design files

`Vedanta Brand Evolution.dc.html` in this folder is a **design reference created in HTML** — a prototype showing intended look and behaviour. It is **not production code to copy**. It uses inline styles and a small streaming runtime (`support.js`) that exist only to make the prototype paint; neither belongs in the target codebase.

The task is to **recreate these designs in the existing Next.js monorepo** (`apps/web` + `packages/datum-ui` + `packages/tokens` + `packages/schemas` + `content/`), using its established Tailwind token classes, component conventions and content-JSON loading pattern. Every colour, size and spacing value in the prototype already exists as a token — find the token, use the token, and never introduce a new one.

Open the file in a browser. The relevant options are badged in the page:

| Option | What it is |
|---|---|
| `3a` | The full Clients & Projects page at 1440 — **the primary target** |
| `3b` | The clientele wall, borderless, six across — alternative treatment |
| `3c` | Static 14-mark homepage band — the no-motion fallback |
| `4a` | Moving 7 × 2 clientele band — **chosen for the homepages** |

`1a` (group homepage), `1c` (product detail) and `1g` (header) are in the same file as the surrounding system, for reference on chrome and section rhythm.

## Fidelity

**High fidelity.** Final colours, typography, spacing and interaction states. Recreate the UI to the values given here and in `CLIENTS_AND_PROJECTS_IMPLEMENTATION.md`, using the codebase's existing token classes rather than raw hex. The one place the prototype is deliberately not literal: its marquee cells are hardcoded at `205.714px` because it renders at a fixed 1440 width — production sizes them `calc(100% / 7)`.

## Governing documents

Read in this order. Both are in this folder and both are already in the repo.

1. `CLIENTS_AND_PROJECTS_IMPLEMENTATION.md` — this feature's spec: route, content model, five components, marquee mechanics, the verbatim content, and the build sequence.
2. `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` — the site-wide design law (tokens, components, animation, warnings). §5 carries the 2 Sep 2026 animation rule change that permits the marquee.
3. `VEDANTA_DESIGN_LANGUAGE.md` — the forensics the whole system derives from, including the 18-rule design constitution in §10.

## Screens / views

### 1. Clients & Projects page — `/clients-projects` (option `3a`)

**Purpose.** A procurement engineer evaluating the group as a vendor reads it top to bottom: who already buys → where the equipment goes → what was actually built → who signed it off → send a drawing.

**Layout.** Single column of full-bleed bands. Container `max-w-wide` 1360px, gutter 86px at `2xl`, alternating white / `steel-50` grounds, `border-b border-steel-200` between bands. Band padding 96px vertical.

| Band | Ground | Content |
|---|---|---|
| Header | white | Existing `Header` component, `group` variant. 32px dark utility strip + 91px main bar. `Projects` nav item active: `text-steel-950` with a 2px `bg-accent` bottom rule. |
| Hero | photo | Interior pattern (`1d`). 440px tall, photo `absolute inset-0`, `var(--overlay-hero-interior)` scrim, centred content. 64 × 2px accent rule, eyebrow "Executed work, named buyers" in `accent-dark`, H1 "Clients & projects" at `display` 56px/1.0 white, breadcrumb `Home → Clients & projects` **on the photo** with the `→` in `accent-dark`. |
| Stat band | white | 4 columns, each `border-l-2 border-steel-200 pl-5`: figure in mono 32px, label mono uppercase tracked, provenance in mono 13px. Values: `42` Named clients · `10` Sectors served · `12` Approved TPI agencies · `7` Export destinations. |
| Our clientele | white | Centred eyebrow / H2 / standfirst, then the 7-column logo wall. Mono provenance line beneath. |
| Sectors served | `steel-50` | Left heading + right standfirst, then a 5 × 2 hairline grid of the 10 sectors. |
| Project track record | white | Centred heading block, then two columns — Dhruv EPC (8 rows) and Precise Engineers (7 rows). Dhruv's column closes with the brochure's partnership statement as a pull-quote. |
| Approved & inspected by | `steel-50` | Left heading + right standfirst, then a 6-column card grid of the 12 agency marks. |
| RFQ closer | `steel-900` | Existing pattern: red bracket linework bleeding off the left edge, 64 × 2px accent rule, H2 "Ask for a job reference.", accent-filled primary + outlined secondary. |

### 2. Homepage clientele band (option `4a`, fallback `3c`)

Mounts on all three homepages between the certifications band and the two-companies section. `steel-50` ground, 80px vertical padding. Heading row: eyebrow "Who we supply" + H2 "Forty-two named clients" left, `See all clients & projects ↗` link right. Then the two counter-scrolling rows on white with hairline cells, and a mono caption line beneath.

## Components

Five new components in `packages/datum-ui`. Full prop tables in the spec, §3.

| Component | Anatomy |
|---|---|
| `ClientLogoWall` | `variant="bordered"` (default): `display:grid` 7 columns, `gap:1px` on a `steel-200` ground so the gaps read as hairlines, cells white, 112px tall, `flex` centred, 18px padding, logo `max-w-[84%] max-h-[64px] object-contain`. `variant="quiet"`: 6 columns, no vertical rules, `border-b border-steel-200` per cell, 104px tall, logo cap 52px. |
| `ClientMarquee` | Two `overflow-hidden` rows; each holds a `width:max-content` flex track containing its row rendered **twice**. Cells `box-sizing:border-box`, `width:calc(100% / 7)`, 104px tall, `border-r border-steel-200`, logo cap 56px. |
| `SectorGrid` | 5-column `gap:1px` hairline grid on `steel-200`, cells white, 96px min height, 28px/24px padding. Each item: a 2px × 28px `bg-accent` left rule + name at `body-lg` 19px/600 `steel-950`. |
| `ProjectRecordList` | `border-t border-steel-200`, then rows of `grid-template-columns: 40px 1fr`, 20px vertical padding, `border-b border-steel-200`, hover `bg-steel-50`. Left cell: index `01`–`08` in mono 13px `steel-400`. Right cell: statement at `body` 16px/1.55 `steel-950`, then tag line in mono 13px `steel-500`. |
| `ApprovalWall` | 6-column grid, 20px gap. Cards: white, `border border-steel-200`, `rounded-sm` 3px, `shadow-raised`, 22px/18px padding, column flex, 16px gap. 56px logo box centred, then agency name centred in mono 13px `steel-600`. |

Pull-quote (Dhruv column close): `bg-steel-50`, `border-l-2 border-accent`, 22px/24px padding, text at 16px/600 `steel-950`.

## Interactions & behaviour

**Marquee** (spec §4 has the copy-ready CSS):

- `@keyframes` translate `0 → -50%` (row A) and `-50% → 0` (row B) on `translate3d`, `will-change: transform`.
- Row A 64s, row B 76s, both `linear infinite`. The unequal periods are deliberate — equal speeds make the two rows read as one sliding block.
- 21 marks per row (even indices row A, odd row B) so all 42 pass in one lap without repeating.
- `:hover` on the row container → `animation-play-state: paused` on both tracks.
- `prefers-reduced-motion: reduce` → `animation: none`, static 7 × 2 grid. **This state must look finished.**
- Responsive: 7 cells visible at `lg+`, 5 at `md`, 3 below 768. Rows never collapse into one.
- Homepage bands only. The Clients page uses the static wall.

**Everything else on the page is motionless.** Permitted states: colour transitions on hover/focus at 100ms, the 4px arrow nudge on the `See all ↗` link, the 1px button press. No scroll-triggered reveals, no card lift, no count-up on the stat band.

**Hover / focus states.** Project rows `bg-steel-50`. Logo cells: none — a logo is not a link unless the client record carries a URL, and none do. Agency cards: none. Links `accent` → `accent-700`. Focus rings come from `--accent-focus`; the RFQ closer band is `steel-900` and must carry `data-chrome="dark"` so the ring rebinds above the 3:1 floor.

## State management

Zero client state. The page is fully static — all four collections are read at build time through the existing content loader. `ClientMarquee` is CSS-only; it needs no JS, no `useEffect`, no `IntersectionObserver`. If you find yourself adding a hook, re-read §4.

Filter query `?works=dhruv` / `?works=precise` from the company sub-sites scopes the project list; resolve it server-side from `searchParams`, not in the client.

## Design tokens

No new tokens. Everything resolves from `packages/tokens`.

**Colour.** `#FFFFFF` page · `#F5F6F8` steel-50 panel · `#EDEFF2` steel-100 · `#E0E0E0` steel-200 hairline · `#D9D9D9` steel-300 · `#A5A8B2` steel-400 (on-dark only) · `#707070` steel-500 · `#5C5F6E` steel-600 · `#3F4250` steel-700 · `#23282D` steel-900 dark chrome · `#1A1E22` steel-950 · `#AA3833` brand-500 accent · `#8D2F2A` brand-600 · `#66221F` brand-700 · `#DC8D89` brand-300 on-dark · `#0E6BA8` flex (Precise only).

**Type.** Plus Jakarta Sans for all prose, IBM Plex Mono for figures, indexes, tags, provenance and labels. `display` 56/1.0/700 · `h1` 47/1.05/600 `-0.02em` · `h3` 25/1.25/600 · `h4` 21/1.3/600 · `body-lg` 19/1.6/400 · `body` 16/1.55/400 · `small` 15/1.55 · `data` 15 mono · `helper` 13 mono · `caption` 12 mono uppercase `+0.09em` · `data-lg` 32 mono/1.1/500.

**Spacing.** 8px base. Band padding 96px, gutter 86px at `2xl`, grid gaps 1px (hairline grids) / 20–24px (card grids) / 56px (two-column split).

**Radius.** 3px `radius.sm` on cards. Nothing else is rounded.

**Shadow.** `shadow.raised` `0 0 10px rgba(34,35,52,0.05)` resting · `shadow.hover` `0 0 10px rgba(34,35,52,0.14)`.

**Scrim.** `var(--overlay-hero-interior)` = `linear-gradient(180deg, rgba(0,0,0,.40) 0%, rgba(0,0,0,.58) 48%, rgba(0,0,0,.82) 100%)`.

## Assets

`assets/clients/c01.png` … `c42.png` — the 42 client marks, in brochure grid order (the order in spec §6 matches the filenames). `assets/approvals/a1.png` … `a12.png` — the 12 agency marks, same order as §6. `assets/vedanta-emblem.png` — the official group emblem, used as an image and never redrawn.

**Provenance and the publish blocker.** Every client and agency mark was cropped out of `Vedanta Group_Brochure_2026.pdf` page 4, rendered at 3×, cut on the brochure's own (unequal-width) cell grid, white-framed to remove the divider hairlines and trimmed to its ink bounding box. They are **review-grade raster** and must not ship as final artwork:

1. Each is a third party's trademark. Get written permission per client, record it as `consent` on the content record, render only `granted`.
2. Request SVG or 4× transparent PNG from each client's brand page. Crops from a print PDF carry JPEG ringing and a baked white ground.
3. Normalise to a fixed **optical** height per mark, not a bounding box — a 56px cap on a wordmark and on a roundel look nothing alike. One manual pass, and it is what makes the wall look intentional.
4. `alt` text is the company's legal name, never "logo".

No photography is included. The page hero and every card in the prototype render the standard photo-slot placeholder (`steel-950` + 135° hatch + accent corner bracket + mono subject label). That placeholder is a production artifact and must render `null` in production — see notes §4.2.

## Files

| File | What it is |
|---|---|
| `PROMPT.md` | The text to paste into Claude Code |
| `Vedanta Brand Evolution.dc.html` | The design reference. Options `3a`, `3b`, `3c`, `4a` are this feature; `1a`–`1l`, `2a`–`2b` are the surrounding system |
| `support.js` | Runtime the prototype needs to render in a browser. **Not for production** |
| `CLIENTS_AND_PROJECTS_IMPLEMENTATION.md` | This feature's spec — route, content model, components, marquee mechanics, verbatim content, sequencing |
| `VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md` | Site-wide design law. §5 = animation rule change; §7 = the 19 implementation warnings |
| `VEDANTA_DESIGN_LANGUAGE.md` | Brand forensics and the §10 design constitution |
| `assets/clients/`, `assets/approvals/` | 54 logo crops, review-grade |

## Two things the client still owes

- Written logo consent per company. Until then the wall renders whatever subset is `granted`, and step 2 of the sequence ships the page without it.
- A classification of the 12 agencies into "inspected and released our jobs" vs "we sit on their approved-vendor list". The brochure conflates them in one row; they are different claims to a buyer. The `kind` field exists for this.
