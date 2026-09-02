# VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md

**Purpose:** apply the Vedanta brand evolution to the existing `apps/web` + `packages/datum-ui` + `packages/tokens` monorepo.
**Companion artifact:** `Vedanta Brand Evolution.dc.html` (option ids `1a`–`1l` are referenced throughout).
**Governing sources, in order:** `VEDANTA_DESIGN_LANGUAGE.md` → the client's live site → this repo's IA → design judgment.
**Date:** 2 September 2026

This is a **token-and-chrome change, not an architecture change.** No route moves. No content model changes. No component is deleted. The Datum system's structural ideas — spec tables with provenance, stat band in the first viewport, sticky spec rail, card tiering, scoped certification cards, the RFQ closer, omit-not-empty — all survive intact. What changes is the palette, the type family, the header, the hero and the ornament.

---

## 0. Decisions taken (these close open questions; do not re-litigate in a component commit)

| # | Question | Decision | Authority |
|---|---|---|---|
| D-1 | Warm bone vs cool neutral (`VEDANTA_DESIGN_LANGUAGE.md` §10 rule 3, `07-p0-decisions-locked.md` P0-1) | **Cool.** Remap the `steel` ramp to the sampled values. P0-1's warm lock is superseded. | Client decision, 2 Sep 2026 |
| D-2 | Typeface (rule 7) | **Plus Jakarta Sans** for display + body. **IBM Plex Mono** retained for figures, specs, provenance, codes and labels only. Archivo and IBM Plex Sans retired. | Client decision |
| D-3 | Header | **White ground, 123px (32px utility strip + 91px main bar), logo-forward, title-case text nav.** Compresses to 76px on scroll, staying white. The always-dark fixed bar is retired. | Client decision · §4 Header |
| D-4 | Hero | **Full-bleed real photography + graduated dark scrim + white type + breadcrumb on the photo.** Applies to every page type. | Client decision · §10 rules 9, 10 |
| D-5 | Photography | Real shot library exists. Build photo-first; every card and hero keeps a no-photo variant. Never stock, never AI, never a third-party watermark. | Client decision · §5, CLAUDE.md |
| D-6 | Uppercase tracked type (rule 12) | **Mono/data only.** Prose eyebrows, section labels and nav go title case. `text-caption` stops being a prose token. | Client decision |
| D-7 | Two-company accent | **Keep red/blue split.** Red for group + Dhruv, flex blue for Precise. The amber/blue law is unchanged: one accent-filled element per view. | Client decision |
| D-8 | Testimonial | Stays absent. No unattributed layout exists and none is to be built. | §10 rule 4 + CMS gate |
| D-9 | Vendor credit | Absent. Never reintroduce a "Design and Developed by" line. | §10 rule 17 |

| D-10 | Logo | **Official emblem raster supplied by the client, used as an image — never redrawn.** One lockup proportion system across all three marks (§2.0). | Client, 2 Sep 2026 |

**Open, and now answerable — the artwork red is not the site red.** The design doc's §0 asked for a check against the source artwork "before print/collateral use". The artwork now supplied answers it:

| | Hex | Contrast on white | Provenance |
|---|---|---|---|
| Logo artwork red | `#CD0101` | 5.83:1 ✓ AA | sampled off the supplied emblem, 2,156 px at the modal value |
| Site UI red (`brand-500`) | `#AA3833` | 6.32:1 ✓ AA | multi-region sample of the rendered site, locked in `primitives.ts` |

These are visibly different colours side by side, not one hue family — `#CD0101` is a pure red, `#AA3833` a muted brick. **Current state of the artifact:** wordmarks are set in `#CD0101` so each lockup is internally consistent with its own emblem; every UI element (buttons, links, rules, hovers, borders) is still `#AA3833`.

**Recommendation: unify on `#CD0101`** — it matches the mark exactly, still clears AA on white, and two reds a few pixels apart in the same header reads as sloppiness even to someone who can't name why. If unifying, remap `brand` as follows and re-run the contrast tests; do not eyeball the derived steps.

```ts
// only if D-11 resolves to unify
export const brand = {
  300: '#F08A8A',  // on-dark accent + focus ring on steel-950
  500: '#CD0101',  // artwork red
  600: '#A80101',  // accent text on light
  700: '#7C0101',  // hover/pressed for the -600 text step
} as const
```

**Still unresolved, and left unresolved deliberately** (§0, §10 rule 18) — confirm against production `vedantagroup.net`, not the ifox staging mirror:
- Card affordance: `Learn More ↗` (used here) vs `View details ⊕` (prior research).
- Whether a header-mounted certification mark is live (drives `1g` vs `1h`).

---

## 1. Design tokens

### 1.1 `packages/tokens/src/primitives.ts`

Replace the `steel` ramp. Keys stay identical, so **no component's class names change** — this is the entire reason to do it at the primitive layer rather than per-component.

```ts
// v1.3 (2026-09-02): warm-bone ramp retired per D-1. Values sampled from the
// client's production site (VEDANTA_DESIGN_LANGUAGE.md §1.2) — the ink step
// carries a faint blue-violet cast (#222334, not a true gray); that cast is
// the sample, not a mistake. 500/600/700 derived on the same hue to hold the
// §4.5 contrast covenant.
export const steel = {
  50:  '#F5F6F8',  // panel / alternating section ground (was #F2F0EA)
  100: '#EDEFF2',  // table header, chip fill
  200: '#E0E0E0',  // hairline border — the site's dominant divider
  300: '#D9D9D9',  // stronger border, stamp outline
  400: '#8A8D99',  // muted text on light; on-dark secondary
  500: '#707070',  // secondary text (4.94:1 on #FFF ✓ AA)
  600: '#5C5F6E',  // secondary text, emphasized (6.6:1 on #FFF ✓)
  700: '#3F4250',  // emphasized body (9.4:1 on #FFF ✓)
  800: '#2B2F38',
  900: '#23282D',  // THE dark chrome — footer, RFQ band (§1.2)
  950: '#1A1E22',  // deepest dark, hero photo fallback ground
} as const
```

`brand` is **unchanged** — `#AA3833 / #8D2F2A / #66221F / #DC8D89` were already the client's values. `flex` unchanged. `arc` stays retired.

Two new primitives:

```ts
export const overlay = {
  // §10 rule 9: graduated, never a flat tint. Three stops, top→bottom.
  hero: 'linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.55) 46%, rgba(0,0,0,0.82) 100%)',
  heroInterior: 'linear-gradient(180deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.58) 48%, rgba(0,0,0,0.82) 100%)',
} as const

export const radius = {
  sm: '3px',    // was 2px — the client's measured card/button radius (§3)
  pill: '26px', // buttons only, where a pill is wanted; not used by default
  full: '100%', // back-to-top, avatar crop, circular controls only
} as const
```

`shadow` — replace both values with the site's single recipe. Cards are **flat by default**; the shadow is the hover state.

```ts
export const shadow = {
  raised:  '0 0 10px rgba(34,35,52,0.05)',  // resting, barely-there
  hover:   '0 0 10px rgba(34,35,52,0.14)',  // card hover only
  overlay: '0 0 24px rgba(34,35,52,0.18)',  // mega panel, modal
} as const
```

`fontFamily`:

```ts
export const fontFamily = {
  display: 'Plus Jakarta Sans, sans-serif',  // was Archivo
  body:    'Plus Jakarta Sans, sans-serif',  // was IBM Plex Sans
  data:    'IBM Plex Mono, monospace',       // unchanged
} as const
```

`typeScale` — the client's scale jumps hard (64 → 47 → 25) and sets headings at line-height 1.0. **Keep the jump** (§2.2: don't smooth it into a flat modular scale). Weights go up: the client's H1 is 700, not 500.

| Token | min → max | LH | Weight | Note |
|---|---|---|---|---|
| `display-xl` | 40 → 64 | 1.0 | 700 | hero H1 only |
| `display` | 34 → 56 | 1.02 | 700 | product-page H1 |
| `h1` | 32 → 47 | 1.05 | 600 | section headline |
| `h2` | 26 → 32 | 1.15 | 600 | |
| `h3` | 21 → 25 | 1.3 | 600 | card title |
| `h4` | 18 → 21 | 1.35 | 600 | footer heading |
| `body-lg` | 19 | 1.55 | 400 | hero subhead, value statement |
| `body` | 16 | 1.5 | 400 | |
| `small` | 15 | 1.55 | 400 | card scope |
| `data` | 15 | 1.5 | 400 | mono values |
| `helper` | 13 | 1.5 | 400 | mono notes, provenance |
| `caption` | 12 | 1.3 | 600 | **mono only**, `+0.09em`, uppercase |
| `data-lg` | 24 → 32 | 1.1 | 500 | stat figures |

`letterSpacing`: headlines tighten to `-0.02em` at `h1` and above (the client's face at 47px+ needs it); everything else `normal`. **Never** track prose.

### 1.2 `apps/web/app/globals.css`

`--accent-*` values are unchanged. Three edits:

1. `@supports not (backdrop-filter)` and `prefers-reduced-transparency` fallbacks: `#F2F0EA` → `#F5F6F8`.
2. `[data-chrome='dark']` focus-ring rebinding stays — `#AA3833` on `#23282D` is 3.6:1, which now *passes* the 3:1 non-text floor, but keep the `-dark` rebinding anyway for the `#1A1E22` step where it is 3.0:1 borderline.
3. Add `--overlay-hero` / `--overlay-hero-interior` custom properties from the new `overlay` primitives, so `PageHero` and `HomeHero` reference a variable rather than a literal gradient.

### 1.3 Fonts

`next/font` — replace the Archivo and IBM Plex Sans loaders with one Plus Jakarta Sans loader, subset `latin`, weights `400,500,600,700,800`, `--font-display` and `--font-sans` both bound to it. IBM Plex Mono loader unchanged. **Net effect: one fewer font family over the wire** — this should *reduce* CSS/font payload, which matters against the ≤120 KB budget.

### 1.4 CI consequence

`packages/tokens/src/tokens.test.ts` asserts contrast pairs against the old ramp; it will fail. Update the expected values, **do not relax the assertions**. `lib/css-parity.test.ts` and `apps/web/__snapshots__/routes-baseline/*` will diff on every page — that is expected; regenerate the baseline in the same commit and review the diff, don't skip the check.

---

## 2. Component changes

### 2.0 `Logo.tsx` — new component (D-10, ref `2a`)

The emblem is a fine-line globe wireframe with an expansion-joint bellows across the top, a red serif `A` above, `VEDANTA` reversed inside the globe, `Group of Companies` beneath and an ®. **Do not redraw it, do not trace it, do not approximate it in SVG.** Use the supplied artwork.

Asset: the client's PNG, cropped to its ink bounding box with near-white knocked out to transparent, aspect **1.167 : 1** (w : h). Ship it as `apps/web/public/brand/vedanta-emblem.svg` once vector source arrives; until then the trimmed PNG at 2× the largest render size, served through `next/image` with `priority` on the header instance.

One proportion rule, all three marks:

```
[ emblem @ height H ] — gap 0.31 H — [ wordmark, flush left, optically centred on emblem ]
                                        line 1  cap height 0.42 H   weight 800   tracking −0.02em   #CD0101
                                        line 2  cap height 0.16 H   weight 700   tracking +0.03em   steel-950
```

| `company` | Line 1 | Line 2 |
|---|---|---|
| `group` | `VEDANTA GROUP` | `OF COMPANIES · EST. 1994` |
| `dhruv-epc` | `DHRUV EPC` | `SOLUTION PVT. LTD` |
| `precise-engineers` | `PRECISE` | `ENGINEERS` |

Copy is verbatim from the official lockups — note `SOLUTION` singular, and no full stop after `LTD`. The group lockup does **not** stack "Group of Companies" twice: the emblem already carries that line and the ®, so the wordmark splits the phrase across its two lines instead.

Size ladder:

| Context | H | Line 1 | Line 2 |
|---|---|---|---|
| Header, 91px bar | 58px | 34px | 13px |
| Header, 76px scrolled | 44px | 25px | 10.5px |
| Secondary / `1g`-style bar | 50px | 27px | 11px |
| Floor | 32px | 17px | 8px |
| **Below 32px** | emblem alone, **no wordmark** | — | — |
| **Below 24px** | do not render — use the wordmark alone | — | — |

The globe wireframe fills in and stops reading under about 32px; that is a property of the artwork, not of the implementation. Favicon and app icons need a purpose-drawn reduction — the red `A` alone is the obvious candidate, but it is a **client decision, not ours**.

Clear space: `0.16 H` on all four sides, measured from the emblem's ink edge and the wordmark's rightmost glyph. Never place the lockup on a photograph, on the accent red, or on any ground below 60% luminance — the emblem's linework is black and will vanish. For the dark chrome band (`steel-900`), the footer uses the entity's legal name as a type heading and carries no lockup at all; keep it that way rather than introducing a knockout variant.

### 2.1 `Header.tsx` — the biggest single change (D-3, ref `1g`)

Current: `fixed`, `bg-steel-950`, `h-header` 72px → `h-header-scrolled` 60px, utility bar on `bg-steel-900`.

New:
- Main bar: `bg-white`, `border-b border-steel-200`. Height `h-header` **91px** → `h-header-scrolled` **76px**. Add both to the Tailwind `height` extension; the `globals.css` `.exploded-scrub { top: 60px }` sticky offset **must move to 76px** in the same commit (the comment in that file already warns about this coupling).
- Utility strip: `bg-steel-900`, `h-8` (32px), mono `text-helper` at `text-white/66`, right-aligned on group routes; on company routes it carries `← Vedanta Group of Companies` left and works address + phone right. Total 123px.
- Logo lockup: roundel mark (vector, from `/dhruv-epc-solutions/images/logo.png` source artwork — **request the vector; do not trace the raster**) at 52px, beside a two-line wordmark: company name at `text-h3` weight 800 `tracking-tight`, subline in mono `text-logo-sub` `+0.14em` uppercase. On company routes the wordmark is `text-accent`, mirroring the client's red "DHRUV EPC".
- Nav: `text-body font-semibold text-steel-500`, hover/active `text-steel-950`. **Title case.** Chevron glyph in `text-accent`. No pills, no underlines, no background states — weight and colour only (§4 Navigation).
- RFQ button: `h-12` (48px) on the tall bar, `h-compact` (40px) when scrolled. Still the only accent fill.
- `data-chrome="dark"` moves off the `<header>` and onto the utility strip only.
- Mega panel: `bg-white`, `shadow-overlay`, `border-t border-steel-200`; group labels go from `text-caption text-accent` to `text-h4 text-steel-950` with a 3px `bg-accent` rule under them (see §2.9). Item scope lines stay mono `text-helper`.

Keyboard, focus, `useRfqAnchorInView` and the `hidden md:flex` breakpoints are all unchanged.

### 2.2 `HomeHero.tsx` / new `PageHero` contract (D-4, ref `1d`/`1e`)

`HomeHero` currently renders a graphite text band with an optional photo band *beneath* it. Invert that: **the photo is the hero ground.**

```
<section> position:relative, min-height 620px desktop / 520px tablet / 440px mobile
  ├─ photo layer      absolute inset-0, object-cover; no photo → bg-steel-950 + the
  │                   hatch placeholder (see §4.2). Never a gradient-only hero.
  ├─ scrim layer      absolute inset-0, var(--overlay-hero)
  └─ content layer    relative, max-w-wide, px-6/px-[86px], flex-col justify-end pb-20
       ├─ 64×2px bg-accent rule
       ├─ eyebrow      text-body font-bold text-white  (title case, NOT tracked)
       ├─ h1           text-display-xl text-white, max-w-content
       ├─ breadcrumb   interior pages only — directly under the title, ON the photo,
       │               → separator in text-accent-dark  (§10 rule 10)
       ├─ subhead      text-body-lg text-white/82
       └─ CTA pair     rfq (accent fill) + secondary (white 42% border, white label)
```

Two compositions, kept distinct because the client's site keeps them distinct (§3 Alignment):
- **`align="lower-left"`** — homepages and marketing pages. Ref `1e`, which also pulls the stat band up onto the photo over a `border-white/22` rule; prefer that on company homepages, it removes a whole white band from the first viewport.
- **`align="center"`** — interior/utility pages (About, Capabilities, Certifications, Careers, Contact). Ref `1d`.

`ProductHero.tsx` becomes `align="lower-left"` at `text-display` (56px) with the full breadcrumb trail on the photo, then a light `bg-steel-50` band below carrying the value statement, spec chips, cert chips and the RFQ button (ref `1c`). The `DatumRule` + `DimensionLabel` signature moment survives — it moves onto the spec rail, where it labels real data instead of decorating the hero.

**Do not** ship a hero with type on a raw photo, a flat-tint overlay, or an illustration. Those are the three named failure modes.

### 2.3 `Button.tsx`

Radius `rounded-sm` now resolves to 3px — no code change. Font family swaps with the token. Label size `text-data` (15px) → `text-body` (16px) to match the client's measured button. Everything else — the amber law, the heights, the one-step hover deepen, the 1px press translate, the loading width lock — unchanged. **Do not introduce a pill variant by default** (§10 rule 14); `radius.pill` exists for a specific future ask, not as a house style.

### 2.4 `ProductCard.tsx` / `CategoryCard.tsx` (refs `1i`, `1j`)

Anatomy is already correct. Changes:
- **Photo variant is now the default** for products (`1i`): 4:3 photo at the top, name `text-h3`, one-line scope `text-small text-steel-500`, then the affordance.
- Affordance changes from a bare `ArrowRight` glyph to the client's own pattern: **`Learn More ↗`** in `text-accent`, `text-body font-semibold` (§10 rule 11). Keep the 4px right-nudge on hover.
- Hover: `border-steel-400` → **`border-accent`** plus `shadow-hover`. Still no lift, no scale, no translate.
- Add variant **`layout="spec"`** (`1j`): no photo slot, 3px `border-t border-accent`, a 3-row `<dl>` of figures pulled from the product's `rail: true` spec rows, an `NN / NN` index in mono. This is the no-photo variant and it should be used deliberately for lines the shoot doesn't cover — **not** as a fallback that looks broken.
- `CategoryCard` keeps its `h-1 w-8 bg-accent` rule as the tier signal; it moves to a `border-t` 3px on the spec layout so the two devices don't collide.

### 2.5 `Stamp.tsx` + new `Seal.tsx` (ref `1k`, §10 rule 5)

The scalloped rosette is the strongest brand-DNA finding in the forensics doc — it ties the certification badges to the logo's own oval-scallop border. Add a proper vector.

`Seal.tsx`: 16-lobe scalloped path on a `0 0 120 120` viewBox, `currentColor` stroke, inner ring at `r=34`, code set in IBM Plex Mono, centred. The path (exact, copy verbatim — it is a 16-point circle at R=44 with r=9 outward arcs):

```
M104,60 A9,9 0 0 1 100.651,76.838 A9,9 0 0 1 91.113,91.113 A9,9 0 0 1 76.838,100.651
A9,9 0 0 1 60,104 A9,9 0 0 1 43.162,100.651 A9,9 0 0 1 28.887,91.113 A9,9 0 0 1 19.349,76.838
A9,9 0 0 1 16,60 A9,9 0 0 1 19.349,43.162 A9,9 0 0 1 28.887,28.887 A9,9 0 0 1 43.162,19.349
A9,9 0 0 1 60,16 A9,9 0 0 1 76.838,19.349 A9,9 0 0 1 91.113,28.887 A9,9 0 0 1 100.651,43.162 Z
```

Size ladder — stroke weight steps **up** as the mark gets smaller so the lobes stay readable:

| Render size | Outer stroke | Inner ring | Contents |
|---|---|---|---|
| 120px | 2 | yes, 1px | issuer line + code, two lines |
| 72px | 2.5 | yes, 1.2px | code only |
| 44px | 4 | no | code only, single glyph |
| < 32px | — | — | fall back to the existing `Stamp` mono tile |

Monochrome `steel-950` by default. The code line may take `text-accent` on the 120px size only. **Never** replace with a checkmark-in-a-circle or a flat filled badge.

`Stamp.tsx` survives unchanged as the tile — footer credentials strip, dense table rows, anywhere under 32px.

### 2.6 `Footer.tsx` (ref `1l`)

Structure reconciles the legacy 3-column footer with the Datum title block. Both are kept; neither wins outright.

- **Zone 1 (dark, `bg-steel-900`):** three columns — *Our Products* · *Quick Links* · *entity block* (legal name, works address, registered office, named phone contacts, emails). Column headings at `text-h4 font-semibold text-white` with an **88×3px `bg-accent` rule** beneath — that rule is the client's own footer device at small scale. Entity data still comes **only** from the `EntityRecord` singleton. Contact lines stay plain stacked mono text, no per-line icons (§4 Contact information — the plainness is doing trust work).
- **Red bracket linework:** two concentric rounded right-angles bleeding off the left edge at `left:-46px; top:56px` and `top:106px`, one off the right at `right:-46px; bottom:96px`. `1px solid rgba(170,56,51, .5/.3/.4)`, `border-radius: 8px` on the outer corners, `border-right:0` / `border-left:0` so they read as open fragments. Anchored to the container gutter so they register the content grid — that is the "clearer structural logic" §4 Footer asks for. `aria-hidden`. **Never more than three.**
- **Zone 2 (credentials strip, `bg-white`):** unchanged — one scribed row of `Stamp` tiles linking to Certifications.
- **Zone 3 (legal bar):** copyright, Privacy, Terms, LinkedIn, `Content revised: <month year>`, and a 44px circular outline back-to-top. **No social icon confetti. No vendor credit.**

### 2.7 `SpecTable.tsx`, `SpecRail`, `StatBand`, `CertificationCard`

Structurally unchanged; they inherit the ramp and the type family. Specifics:
- `SpecTable` header row `bg-steel-100` (now `#EDEFF2`), caption + header cells stay mono uppercase tracked — **this is data voice, permitted under D-6.** Row hover `bg-steel-50`. Horizontal rules only; no zebra, no verticals. The `<768px` definition-list reflow is unchanged and non-negotiable.
- `SpecRail` gains the `DatumRule` tick device at the top of the box and a mono `Envelope at a glance` caption (ref `1c`).
- `StatBand` figure `text-data-lg` in mono; label mono uppercase tracked (data voice, permitted); provenance caption mono `text-helper`. Add a `border-l-2 border-steel-200 pl-5` per item — the client's own left-rule idiom, and it survives the 2-column mobile reflow better than a top border.
- `CertificationCard` swaps the `Stamp` tile for `<Seal size={72} />`, keeps the scope statement, issuer and validity `<dl>`, and its "View certificate" link gains the `↗`.
- `Testimonial.tsx` — leave the component in the library, leave it unused. Do not delete (a real attributed testimonial may arrive); do not render.

### 2.8 Section headings

The client centres section titles and pairs them with a title-case eyebrow (§4 Section titles). Adopt as the default:

```
<p>  eyebrow   text-body font-bold text-accent      (title case)
<h2> headline  text-h1 tracking-tight text-steel-950
<p>  standfirst text-body-lg text-steel-500  max-w-[760px]
```
centred inside a `max-w-[760px] mx-auto` block on marketing sections; **left-aligned** where the section is a working index (the equipment grid on `1b` pairs a left heading with a right-hand standfirst). Both patterns are in the artifact; pick per section type, not per page.

### 2.9 The accent rule, formalized

The site's one repeated non-photographic device. Four sanctioned instances, and no fifth:

| Instance | Spec | Where |
|---|---|---|
| Hero rule | 64 × 2px | above every hero eyebrow |
| Card tier rule | 32 × 3px | `CategoryCard`, `layout="spec"` card top border |
| Footer heading rule | 88 × 3px | under Zone 1 column headings |
| Datum rule | 1px line, 12px end ticks, mono label | spec rail, section dividers |

---

## 3. Responsive behaviour

Breakpoints unchanged (`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1440`). Container `max-w-wide` 1360px; gutter `px-6` to `md`, then 86px at `2xl` (yields the client's measured ~1268px inner content width).

| Element | ≥1024 | 768–1023 | <768 |
|---|---|---|---|
| Header | 123px, utility strip + full nav | 91px, no utility strip, nav collapses to hamburger at 768 | 76px, logo + hamburger + RFQ icon |
| Hero | 620px, `display-xl` 64px | 520px, 48px | 440px, 40px, scrim top stop → 0.45 |
| Breadcrumb on hero | full trail | full trail | **truncate to parent + current**, wrap allowed, never horizontal scroll |
| Stat band | 4 cols | 4 cols | 2 cols, left rules retained |
| Category/product grid | 3 (or 4 for equipment) | 2 | 1 |
| Spec table | table + rail | table, rail moves inline above | **definition list** (§15) |
| Body/rail grid | `2fr 1fr` | stacked, rail above content | stacked |
| Footer Zone 1 | 3 cols | 2 cols, entity block full-width | 1 col |
| Footer brackets | all three | left pair only | **hidden** — they cost horizontal room and read as clutter |

320px: no horizontal scroll except the capability matrix, which keeps its pinned first column and affordance shadow. Touch targets 44×44 primary, 24×24 floor. `MobileBottomBar` unchanged.

---

## 4. Images

### 4.1 Rules
1. Real works photography only. No stock, no AI renders, no illustration, no third-party watermark. A missing photo renders the no-photo variant.
2. Grade cool-to-neutral, slightly desaturated — steel grays, oxide tones, overcast light. Not warm, not vivid.
3Hero crops wide/environmental (21:9). Card crops single-subject (4:3), shop-floor background secondary.
4. Hero scrim is always graduated, never flat, never absent.
5. Alt text carries technical fact, not decoration: `"50 T fixed-tube-sheet exchanger during hydrotest"`. Required CMS field; decorative → explicit `alt=""`.
6. The Vedanta roundel diagonal watermark **does not carry over.** Resolve image rights before publish; if a mark is required, use a small corner-anchored one at ≤6% of frame width.
7. AVIF → WebP via `next/image`. Hero is the LCP element and must be preloaded.

### 4.2 Placeholder (until the shoot lands)
`bg-steel-950` + `repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 10px)`, a 16–22px `1px solid` accent corner bracket top-left, and a mono `text-helper` uppercase label naming the intended subject and crop (`PHOTO SLOT · HERO · 21:9 · MANJUSAR WORKS, WIDE ESTABLISHING SHOT`). The label is a **production artifact and must not ship** — gate it behind an env flag or a `PhotoSlot` component that renders `null` in production and fails the build if a slot is still empty on a published route.

### 4.3 Shot list this design assumes
Group hero (wide works exterior) · Dhruv hero (vessel in yard, overcast) · Precise hero (bellows forming bay) · Product hero per line, 9 total (equipment mid-assembly or finished) · Card crops, 17 total (single subject, 4:3) · Two company-door 4:3 shots · About/company (shop floor with overhead crane — **replaces the Hong Kong glass-office stock photo currently live**, §5).

---

## 5. Animation

Durations and easings unchanged (`instant 100 · fast 180 · standard 240 · deliberate 400 · signature 700`; `enter/exit/standard` cubics, no bounce, no spring). The system is deliberately near-motionless — the brief bans unnecessary animation and the forensics found none on the client's site.

Permitted, exhaustively:
1. Colour transitions on hover/focus — `duration-instant`, colour only.
2. Arrow nudge — 4px translate X on card hover, `duration-instant`.
3. Button press — 1px translate Y. The only vertical movement in the system.
4. Header compress 123→76px — `duration-fast`, height only.
5. Mega panel open — opacity + 4px translate Y, `duration-fast`.
6. Chevron rotate 180° — `duration-instant`.
7. `DatumRule` signature draw — `duration-signature`, once per page load, on the spec rail only. **Not** on every section.
8. Exploded-view scroll scrub — unchanged, `md+` and `prefers-reduced-motion: no-preference` only.

Banned: parallax, scroll-triggered fade-in-up on content sections, card lift/scale, number count-up outside the `DatumRule` moment, carousels (already banned system-wide), any looping animation.

`prefers-reduced-motion` stays a first-class mode: all of the above collapse to final-frame, the exploded sequence renders its static fully-exploded frame, and the page remains fully functional. QA it like any interactive state.

---

## 6. Component variants — the full matrix

| Component | Variants | Default |
|---|---|---|
| `Button` | `rfq` · `primary` · `secondary` · `ghost` · `link`; × `size: default \| compact`; × `onDark` | `rfq` at 48px |
| `Hero` | `align: lower-left \| center`; × `photo \| no-photo`; × `statsOverlay: boolean` (ref `1e`) | `lower-left`, photo, no stats overlay |
| `ProductCard` | `layout: photo \| spec` (refs `1i`/`1j`); × `onDark` | `photo` |
| `CategoryCard` | default · `thin` (0 products, muted + non-interactive); × `onDark` | default |
| `Seal` | `120 \| 72 \| 44`; below 32px → `Stamp` tile | 72 |
| `SpecTable` | `parameter` (reflows to `<dl>`) · `comparative` (pinned col + scroll); × `density: default \| engineering` | `parameter`, default density |
| `Header` | `group` (utility strip = company switcher) · `company` (utility strip = back-link + contact); × `scrolled` | per route group |
| `Footer` | `full` (3 zones) · `compact` (Zone 1 + legal, for product/utility pages) | `full` |
| `StatBand` | `onDark`; × `overlay` (on hero photo, ref `1e`) | light |

---

## 7. Implementation warnings

1. **`.exploded-scrub { top: 60px }` in `globals.css` is coupled to the header height.** It must become `76px` in the same commit as the header change, or the exploded band pins under the header on every product page. The file's own comment flags this.
2. **The `steel` ramp swap changes every route's snapshot.** Regenerate `__snapshots__/routes-baseline/` in the same commit and read the diff. Do not skip `compare-snapshots.mjs`.
3. **`tokens.test.ts` contrast assertions will fail** against the new ramp. Update the expected values; do not loosen the covenant. Every pair in §1.1 has been checked, but re-run rather than trust this document.
4. **`text-caption` is no longer a prose token (D-6).** Grep for `tracking-caption` and audit each hit: mono/data usage stays, prose usage (eyebrows, section labels, footer headings, card labels) converts to title case at `text-body font-bold` or `text-h4`. There are on the order of 40 call sites across `datum-ui` and `apps/web`. Doing this by find-and-replace will produce wrong results — it needs the per-site judgment.
5. **Radius 2px → 3px is a token change, not a licence to round things.** §10 rule 14: no new rounded corners, no pills by default.
6. **The amber/blue law still holds.** The heroes now carry two CTAs, one accent-filled and one outlined — that is still exactly one accent fill per view. Verify at 320px, where the header RFQ and the hero RFQ can both be on screen: `useRfqAnchorInView` already handles this, don't regress it.
7. **Do not restore the diagonal roundel watermark**, and do not publish any image carrying it. This is a rights decision, not a design one.
8. **Industries stays omitted from the group homepage** until industry records flip `contentComplete: true`. All five are currently `CONTENT REQUIRED`. Omit-not-empty; do not render a placeholder grid.
9. **Three product-category scope strings in the artifact (`Skids & Packages`, `Fabrication & Machining`, `Flow Control`) were recombined from real product scope lines** because the category records don't carry their own. They contain no invented figures, but they are not client-approved copy — treat them as placeholder until `content/productCategories/*.json` gains real `oneLineScope` values. `static-equipment` and `expansion-joints` are verbatim from the records.
10. **`DEMO figure — engineering data pending` notes are still live** on shell diameter, max unit weight, design pressure, design temperature and Dhruv's max-unit-weight stat. They render in the artifact by design. The `showDemoFlags` tweak hides them for client review — **it is a review affordance, not a publish path.** Do not ship figures whose provenance is `unverified` with the note suppressed.
11. **The logo is now the client's real artwork, and it is a raster.** Do not trace it, do not rebuild it in SVG, do not "clean it up". Request vector source for print, favicons and any render under 32px — the globe wireframe is too fine to survive reduction, and a favicon drawn from it will be mud. The `Seal` component in §2.5 is a *different* mark (the ASME-style certification rosette) and **is** ours to draw; the two must not be conflated.
12. **Confirm the three §0 discrepancies against production `vedantagroup.net`, not the ifox staging mirror**, before locking the card affordance and the header cert mark. The mirror is a different build.
13. **Performance:** dropping from three font families to two should leave headroom, but the photo-first hero adds a large LCP image on every route. Preload it, serve AVIF, and re-measure — a page over 120 KB gz JS / 40 KB HTML does not merge, and the budget does not move.
14. **Two reds are live in the artifact by design, pending D-11.** Wordmarks `#CD0101`, UI `#AA3833`. Do not resolve this silently in a component commit — it is a token change and a design-review event either way. If it resolves to unify, the `brand` remap in §0 touches every accent surface on the site and needs a fresh contrast pass plus a snapshot regeneration.
15. **`Logo.tsx` must not accept a `className`.** Same rule as the rest of `datum-ui` — theming is CSS-var scope, and a logo whose size can be overridden per call site is how lockup proportions drift. Expose `company` and `size` (`'header' | 'scrolled' | 'secondary' | 'floor' | 'mark-only'`) and nothing else.
