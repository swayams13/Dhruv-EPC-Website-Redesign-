// Datum Design System v1.1 — Primitive tokens (§4-§11)
// Never consumed directly by components — use semantic aliases
// v1.1: palette shift to warm-gray (paper/ink) and industrial amber per approved design direction (2026-07-15)

export const steel = {
  50: '#F2F0EA',   // warm paper — page background
  100: '#E5E2D9',
  200: '#DCD8CE',  // light dividers, borders on dark
  300: '#C7C2B7',  // secondary text on dark
  400: '#B5B0A4',  // muted/tertiary text
  500: '#7A7269',
  600: '#5C5850',  // secondary text on light (5.6:1 on steel-50 ✓)
  700: '#3D3A34',  // emphasized text on light (9.1:1 on steel-50 ✓)
  800: '#282520',
  900: '#1C1A18',  // dark elevated surface
  950: '#14171A',  // ink — near-black page dark bg
} as const

// Arc amber — industrial safety accent; exclusive to action/emphasis (§4.3)
// v1.1: shifted to golden amber #C98A2E per approved creative direction (2026-07-15)
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

// Shadows — two values, warm-tinted (§9); updated RGB to match steel-950 = #14171A (20,23,26)
export const shadow = {
  raised: '0 2px 8px rgba(20,23,26,0.08), 0 1px 2px rgba(20,23,26,0.06)',
  overlay: '0 16px 40px rgba(20,23,26,0.16), 0 2px 8px rgba(20,23,26,0.08)',
} as const

// Typography families (§5.1) — v1.1: Archivo display, IBM Plex Sans body per approved design
export const fontFamily = {
  display: 'Archivo, sans-serif',
  body: 'IBM Plex Sans, sans-serif',
  data: 'IBM Plex Mono, monospace',
} as const

// Type scale (§5.2) — documented as [min, max] for fluid implementation
export const typeScale = {
  'display-xl': { min: 40, max: 64, lineHeight: 1.05, weight: 500 },
  display: { min: 34, max: 48, lineHeight: 1.1, weight: 500 },
  h1: { min: 30, max: 40, lineHeight: 1.15, weight: 600 },
  h2: { min: 26, max: 32, lineHeight: 1.2, weight: 600 },
  h3: { min: 21, max: 24, lineHeight: 1.3, weight: 600 },
  h4: { min: 18, max: 20, lineHeight: 1.4, weight: 600 },
  'body-lg': { min: 18, max: 18, lineHeight: 1.6, weight: 400 },
  body: { min: 16, max: 16, lineHeight: 1.6, weight: 400 },
  small: { min: 14, max: 14, lineHeight: 1.5, weight: 400 },
  // §14 helper text + §15 units/notes cite 13px; absent from §5.2's table.
  // Design-review: approved by Swayam 2026-07-10 (treat §14/§15 as authoritative).
  helper: { min: 13, max: 13, lineHeight: 1.5, weight: 400 },
  caption: { min: 12, max: 12, lineHeight: 1.4, weight: 500, tracking: '0.06em', transform: 'uppercase' as const },
  'data-lg': { min: 24, max: 32, lineHeight: 1.2, weight: 500 },
  data: { min: 15, max: 15, lineHeight: 1.5, weight: 400 },
} as const

// Radius (§13 — "machined edge")
export const radius = {
  sm: '2px',  // the system's only corner radius — machined, not pill
} as const

// Elevation levels (§8)
export const elevation = {
  surface: 0,
  raised: 1,
  overlay: 2,
} as const
