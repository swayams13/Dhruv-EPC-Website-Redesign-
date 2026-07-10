// Datum Design System v1.0 — Primitive tokens (§4-§11)
// Never consumed directly by components — use semantic aliases

export const steel = {
  50: '#F7F8F8',
  100: '#EFF1F2',
  200: '#E1E5E7',
  300: '#C7CDD1',
  400: '#A3ACB2',
  500: '#7B858D',
  600: '#59636B',
  700: '#3F4950',
  800: '#2A3238',
  900: '#1C2328',
  950: '#121619',
} as const

// Arc amber — the weld pool; exclusive to action/emphasis (§4.3)
export const arc = {
  300: '#FFA45E',
  500: '#F0670F',
  600: '#C24E05',
  700: '#9A3F06',
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

// Shadows — two values, cool-tinted (§9)
export const shadow = {
  // Raised: tight, low — dropdowns, sticky header, toasts
  raised: '0 2px 8px rgba(18,22,25,0.08), 0 1px 2px rgba(18,22,25,0.06)',
  // Overlay: modals, drawers, lightbox
  overlay: '0 16px 40px rgba(18,22,25,0.16), 0 2px 8px rgba(18,22,25,0.08)',
} as const

// Typography families (§5.1)
export const fontFamily = {
  display: 'Schibsted Grotesk, sans-serif',
  body: 'Inter, sans-serif',
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
