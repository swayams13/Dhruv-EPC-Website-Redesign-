// Datum Design System v1.0 — Semantic aliases (§26, tier 2)
// These are the ONLY tokens components may consume directly.
// Primitives are never referenced in component code.

import { steel, arc, flex, signal, space, shadow, motion, radius } from './primitives'

// Base semantic map — company-agnostic (Dhruv accent = arc by default)
export const semanticBase = {
  color: {
    text: {
      primary: steel[950],
      secondary: steel[600],
      tertiary: steel[500],
      placeholder: steel[400],
      disabled: steel[400],
      onDark: steel[50],
      onDarkSecondary: steel[400],
    },
    action: {
      // ponytail: rfq is the ONLY arc-filled element; override per company below
      rfq: arc[500],
      rfqHover: arc[600],
      rfqPressed: arc[700],
      // rfqFg: label text on the RFQ button fill — must meet 4.5:1 against rfq fill.
      // arc-500 (amber) is light enough for steel-950 text (5.79:1).
      // flex-500 (dark blue) requires white text — see semanticPrecise override below.
      rfqFg: steel[950],
      primary: steel[950],
      primaryHover: steel[800],
      secondary: 'transparent',
    },
    border: {
      scribed: steel[200],
      strong: steel[300],
      focus: arc[500],
      input: steel[300],
      inputFocus: arc[500],
      card: steel[200],
      cardHover: steel[400],
    },
    surface: {
      page: steel[50],
      alt: steel[100],
      white: '#FFFFFF',
      dark: steel[900],
      darkElevated: steel[800],
      overlay: steel[950] + '66',  // 40% — modal scrim
    },
    signal: {
      success: signal.success,
      successTint: signal.successTint,
      error: signal.error,
      errorTint: signal.errorTint,
      warn: signal.warn,
      warnTint: signal.warnTint,
      info: steel[600],
    },
    focus: {
      ring: arc[500],
    },
    // Accent — remapped per company (§5)
    accent: {
      default: arc[500],
      onDark: arc[300],
      text: arc[600],
      textHover: arc[700],
    },
  },
  shadow,
  radius,
  space,
  motion,
} as const

// Dhruv EPC — arc amber accent (identical to base; explicit for clarity)
export const semanticDhruv = {
  ...semanticBase,
  color: {
    ...semanticBase.color,
    action: {
      ...semanticBase.color.action,
      rfq: arc[500],
      rfqHover: arc[600],
      rfqPressed: arc[700],
    },
    accent: {
      default: arc[500],
      onDark: arc[300],
      text: arc[600],
      textHover: arc[700],
    },
    focus: { ring: arc[500] },
    border: { ...semanticBase.color.border, focus: arc[500], inputFocus: arc[500] },
  },
} as const

// Precise Engineers — flex blue accent (§5)
export const semanticPrecise = {
  ...semanticBase,
  color: {
    ...semanticBase.color,
    action: {
      ...semanticBase.color.action,
      rfq: flex[500],
      rfqHover: flex[600],
      rfqPressed: flex[700],
      // flex-500 (#0E6BA8) is dark; steel-950 text gives only 3.2:1 — WCAG fail.
      // White text on flex-500 is ~7.1:1. Design-review gate before merge (CLAUDE.md §26).
      rfqFg: steel[50],
    },
    accent: {
      default: flex[500],
      onDark: flex[300],
      text: flex[600],
      textHover: flex[700],
    },
    focus: { ring: flex[500] },
    border: { ...semanticBase.color.border, focus: flex[500], inputFocus: flex[500] },
  },
} as const

// Group holding page — steel only, no accent (§5)
export const semanticGroup = {
  ...semanticBase,
  color: {
    ...semanticBase.color,
    action: {
      ...semanticBase.color.action,
      rfq: steel[950],      // group page has no amber primary action
      rfqHover: steel[800],
      rfqPressed: steel[700],
    },
    accent: {
      default: steel[950],
      onDark: steel[200],
      text: steel[700],
      textHover: steel[900],
    },
    focus: { ring: steel[950] },
    border: { ...semanticBase.color.border, focus: steel[950], inputFocus: steel[950] },
  },
} as const

export type Company = 'dhruv' | 'precise' | 'group'

export const semanticByCompany = {
  dhruv: semanticDhruv,
  precise: semanticPrecise,
  group: semanticGroup,
} as const
