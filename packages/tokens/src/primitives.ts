// Datum Design System v1.3 — Primitive tokens (§4-§11)
// Never consumed directly by components — use semantic aliases
// v1.1: palette shift to warm-gray (paper/ink) and industrial amber per approved design direction (2026-07-15)
// v1.3 (2026-09-02): warm-bone ramp retired per VEDANTA_DESIGN_DECISIONS.md D-1 —
// cool neutral remap sampled from the client's production site
// (VEDANTA_DESIGN_LANGUAGE.md §1.2). The ink step carries a faint blue-violet
// cast (#23282D/#1A1E22, not a true gray) — that cast is the sample, not a
// mistake. 500/600/700 derived on the same hue to hold the §4.5 covenant.
//
// steel-400 CORRECTION (FINAL_IMPLEMENTATION_PLAN.md Phase 1, Class E): the
// spec's literal #8A8D99 measures 4.05–4.49:1 as text.onDarkSecondary on the
// new dark surfaces — below the 4.5:1 floor. #A5A8B2 (6.26:1 on steel-900,
// 7.06:1 on steel-950, hue-checked at 226° against the ramp's 228–230°, same
// family, lightened not re-hued) is used instead. This is a value fix, not a
// tracked exception.
export const steel = {
  50:  '#F5F6F8',  // panel / alternating section ground (was #F2F0EA)
  100: '#EDEFF2',  // table header, chip fill
  200: '#E0E0E0',  // hairline border — the site's dominant divider
  300: '#D9D9D9',  // stronger border, stamp outline
  400: '#A5A8B2',  // muted text on light; on-dark secondary — corrected, see above
  500: '#707070',  // secondary text (4.94:1 on white ✓ AA)
  600: '#5C5F6E',  // secondary text, emphasized (6.33:1 on white ✓)
  700: '#3F4250',  // emphasized body (9.4:1 on white ✓)
  800: '#2B2F38',
  900: '#23282D',  // THE dark chrome — footer, RFQ band, split-hero type panel
  950: '#1A1E22',  // deepest dark, hero photo fallback ground
} as const

// Vedanta brand red — the group's actual mark colour (§4.3)
// v1.2 (2026-08-27): replaces arc amber as the Dhruv/group accent. Rationale: the
// amber was invented by the redesign; #AA3833 is the colour the client's own mark,
// section headings and active nav states already render at on vedantagroup.net.
// Adopting it is the single change that makes the new site read as the same company.
//
// PROVENANCE — brand-500 sampled from three independent regions of the client's
// live site (masthead banner, active sidebar item, section eyebrow); all three
// returned #AA3833 exactly. The Claude Design exploration used #B82828, described
// as sampled from the wordmark. The two disagree. #AA3833 is used here because it
// is measured from what the client actually ships. CONFIRM against the source
// artwork at /dhruv-epc-solutions/images/logo.png before print/collateral use.
//
// 300/600/700 are derived (constant hue 2.5°, constant saturation) purely to
// satisfy the §4.5 contrast covenant — they are not independent brand colours.
export const brand = {
  300: '#DC8D89',  // on-dark accent + focus ring on steel-950 chrome (7.04:1 on steel-950 ✓)
  500: '#AA3833',  // THE brand red — fills, ticks, RFQ button (white label 6.32:1 ✓)
  600: '#8D2F2A',  // accent text on light (7.16:1 on steel-50 ✓) + rfqHover
  700: '#66221F',  // hover/pressed for brand-600 text (10.16:1 on steel-50 ✓)
} as const

// Logo red — the wordmark's own ink colour, sampled from the supplied emblem
// artwork (D-10). NOT the same colour as `brand` above and NOT a swap-in for
// it: VEDANTA_DESIGN_DECISIONS.md Decision 1 (D-11) investigated both and
// found the artifact deliberately ships them as two distinct, unrelated
// values — `brand` is the live site's UI accent (buttons, links, focus
// rings), `logoRed` is only the wordmark ink inside `Logo.tsx`.
//
// HARD CONSTRAINTS (Decision 1) — enforced by
// apps/web/lib/logo-consumer-boundary.test.ts:
// - consumed by Logo.tsx and nowhere else
// - never exposed through semantic.ts
// - never exposed through any accent.* token or tailwind.ts colors
// - never used for buttons, links, focus rings, or generic decorative UI
export const logoRed = '#CD0101' as const // 5.83:1 on white ✓ AA

// Arc amber — RETIRED as an accent at v1.2; superseded by `brand` above.
// Retained as a primitive only because §4.3's "amber is heat" law may still be
// wanted for thermal/temperature signalling. Not consumed by any semantic map.
// Do not reintroduce as a company accent without a design review.
export const arc = {
  300: '#E5AF6A',  // lighter amber for on-dark text/icons (8.7:1 on steel-950 ✓)
  500: '#C98A2E',  // primary — RFQ button fill, datum ticks (6.1:1 with steel-950 text ✓)
  600: '#8A5D1D',  // accent text on light (4.56:1 on steel-50 ✓ WCAG AA)
  700: '#6B4915',  // hover/pressed for arc-600 text (6.5:1 on steel-50 ✓)
} as const

// Flex blue — Precise Engineers accent; "blue is pressure" law mirrors "amber is heat" (§5)
export const flex = {
  300: '#5BA8D4',
  500: '#0E6BA8',
  600: '#0A5589',
  700: '#083F6A',
} as const

// Signal — muted, engineering-toned (§4.4)
export const signal = {
  success: '#1E7A55',
  successTint: '#E8F3EE',
  error: '#B3392E',
  errorTint: '#F8E8E6',
  warn: '#8A6116',
  warnTint: '#F5EDD8',
  // info → semantic maps to steel-600
} as const

// Spacing — base 4px, named steps only (§6)
// Keys are scale numbers; values are pixel strings for Tailwind
export const space = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  24: '96px',
  32: '128px',
  40: '160px',
} as const

// Motion — complete set (§11)
export const motion = {
  instant: '100ms',
  fast: '180ms',
  standard: '240ms',
  deliberate: '400ms',
  signature: '700ms',
} as const

// Easing (§11) — no bounce, no spring
export const easing = {
  enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',   // deceleration — elements arrive with mass
  exit: 'cubic-bezier(0.4, 0.0, 1, 1)',       // acceleration — exits are quick
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
} as const

// Shadows (§9) — v1.3: the client's single recipe (VEDANTA_DESIGN_DECISIONS.md
// D-1 remap). Cards are flat by default; `hover` is the hover state, not a
// resting elevation.
export const shadow = {
  raised: '0 0 10px rgba(34,35,52,0.05)',   // resting, barely-there
  hover: '0 0 10px rgba(34,35,52,0.14)',    // card hover only
  overlay: '0 0 24px rgba(34,35,52,0.18)',  // mega panel, modal
} as const

// Hero scrim gradients (§10 rule 9) — graduated, never a flat tint. Consumed
// by PageHero/ProductHero only (HomeHero's Hero-C split has no photo-as-ground
// slot for a scrim). Mirrored as CSS custom properties in globals.css.
export const overlay = {
  hero: 'linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.55) 46%, rgba(0,0,0,0.82) 100%)',
  heroInterior: 'linear-gradient(180deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.58) 48%, rgba(0,0,0,0.82) 100%)',
} as const

// Typography families (§5.1) — v1.3: Plus Jakarta Sans display + body, per
// VEDANTA_DESIGN_DECISIONS.md D-2. Archivo and IBM Plex Sans retired — one
// fewer font family over the wire (net reduction, not a swap-for-swap).
// IBM Plex Mono unchanged: figures, specs, provenance, codes, labels only.
export const fontFamily = {
  display: 'Plus Jakarta Sans, sans-serif',
  body: 'Plus Jakarta Sans, sans-serif',
  data: 'IBM Plex Mono, monospace',
} as const

// Type scale (§5.2) — v1.3 remap per IMPLEMENTATION_NOTES §1.1: the client's
// scale jumps hard (64 → 47 → 25); kept, not smoothed into a flat modular
// scale. Weights go up — the client's H1 is 700, not 500. Documented as
// [min, max] for fluid implementation; the fluid clamp() strings this
// generates live in tailwind.ts (hand-duplicated there, same as before).
export const typeScale = {
  'display-xl': { min: 40, max: 64, lineHeight: 1.0, weight: 700 },  // hero H1 only
  display: { min: 34, max: 56, lineHeight: 1.02, weight: 700 },      // product-page H1
  h1: { min: 32, max: 47, lineHeight: 1.05, weight: 600 },           // section headline
  h2: { min: 26, max: 32, lineHeight: 1.15, weight: 600 },
  h3: { min: 21, max: 25, lineHeight: 1.3, weight: 600 },            // card title
  h4: { min: 18, max: 21, lineHeight: 1.35, weight: 600 },           // footer heading
  'body-lg': { min: 19, max: 19, lineHeight: 1.55, weight: 400 },    // hero subhead, value statement
  body: { min: 16, max: 16, lineHeight: 1.5, weight: 400 },
  small: { min: 15, max: 15, lineHeight: 1.55, weight: 400 },        // card scope
  // §14 helper text + §15 units/notes cite 13px; absent from §5.2's table.
  // Design-review: approved by Swayam 2026-07-10 (treat §14/§15 as authoritative).
  helper: { min: 13, max: 13, lineHeight: 1.5, weight: 400 },        // mono notes, provenance
  // v1.3: mono only (D-6) — prose eyebrows/section labels/nav go title case
  // instead. Migrating existing usage sites is Phase 3's job, not this token's.
  caption: { min: 12, max: 12, lineHeight: 1.3, weight: 600, tracking: '0.09em', transform: 'uppercase' as const },
  'data-lg': { min: 24, max: 32, lineHeight: 1.1, weight: 500 },     // stat figures
  data: { min: 15, max: 15, lineHeight: 1.5, weight: 400 },          // mono values
} as const

// Radius (§13) — v1.3: 2px → 3px is the client's measured card/button radius
// (VEDANTA_DESIGN_DECISIONS.md D-1 remap). `pill`/`full` are new, narrow-use
// additions — not a default; most surfaces still take `sm`.
export const radius = {
  sm: '3px',
  pill: '26px',  // buttons only, where a pill is wanted
  full: '100%',  // back-to-top, avatar crop, circular controls only
} as const

// Elevation levels (§8)
export const elevation = {
  surface: 0,
  raised: 1,
  overlay: 2,
} as const
