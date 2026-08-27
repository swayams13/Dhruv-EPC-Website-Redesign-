// Datum Design System v1.0 — Semantic aliases (§26, tier 2)
// These are the ONLY tokens components may consume directly.
// Primitives are never referenced in component code.

import { steel, brand, flex, signal, space, shadow, motion, radius } from './primitives'

// Base semantic map — company-agnostic (Dhruv accent = brand red by default)
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
      // rfq is the ONLY brand-filled element; override per company below
      rfq: brand[500],
      rfqHover: brand[600],
      rfqPressed: brand[700],
      // rfqFg: label text on the RFQ button fill — must meet 4.5:1 against rfq fill.
      // v1.2: brand-500 is a mid-dark red. steel-950 text on it is 2.85:1 — a FAIL.
      // The amber it replaced was light enough for dark text; the red is not.
      // White label on brand-500 is 6.32:1 ✓. This flip is mandatory, not cosmetic.
      rfqFg: steel[50],
      primary: steel[950],
      primaryHover: steel[800],
      secondary: 'transparent',
    },
    border: {
      scribed: steel[200],
      strong: steel[300],
      focus: brand[500],
      input: steel[300],
      inputFocus: brand[500],
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
      ring: brand[500],
      // v1.2: focus rings must also be visible on the steel-950 header/footer chrome.
      // brand-500 on steel-950 is 2.85:1 — below the 3:1 floor for non-text indicators
      // (WCAG 1.4.11). arc-500 was 6.13:1, so this failure mode did not exist before
      // the swap. ringOnDark is the fix; globals.css rebinds --accent-focus inside
      // dark chrome. Regression introduced by this change, closed by this change.
      ringOnDark: brand[300],
    },
    // Accent — remapped per company (§5)
    accent: {
      default: brand[500],
      onDark: brand[300],
      text: brand[600],
      textHover: brand[700],
    },
  },
  shadow,
  radius,
  space,
  motion,
} as const

// Dhruv EPC — Vedanta brand red accent (identical to base; explicit for clarity)
export const semanticDhruv = {
  ...semanticBase,
  color: {
    ...semanticBase.color,
    action: {
      ...semanticBase.color.action,
      rfq: brand[500],
      rfqHover: brand[600],
      rfqPressed: brand[700],
      rfqFg: steel[50],
    },
    accent: {
      default: brand[500],
      onDark: brand[300],
      text: brand[600],
      textHover: brand[700],
    },
    focus: { ring: brand[500], ringOnDark: brand[300] },
    border: { ...semanticBase.color.border, focus: brand[500], inputFocus: brand[500] },
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
    // flex-500 on steel-950 is 3.16:1 — clears the 1.4.11 floor, but only just.
    // flex-300 is used on dark chrome for the same reason as brand-300.
    focus: { ring: flex[500], ringOnDark: flex[300] },
    border: { ...semanticBase.color.border, focus: flex[500], inputFocus: flex[500] },
  },
} as const

// Group — Vedanta brand red (§5, revised v1.2)
//
// §5 previously specified "steel only, no accent" for the group scope. That rule
// was written when the accent was arc amber — an invented colour that belonged to
// neither company, so spending it on the group would have implied a false hierarchy.
//
// That reasoning inverts once the accent is the brand red. Red is not Dhruv's
// colour; it is the VEDANTA mark's colour, and Dhruv inherits it by being inside
// the group. Precise keeps flex blue because it has its own established identity.
// So the group scope is now the one place the red is unambiguously *correct*, and
// a red-free group home would be the version that fails to look like this company.
export const semanticGroup = {
  ...semanticBase,
  color: {
    ...semanticBase.color,
    action: {
      ...semanticBase.color.action,
      rfq: brand[500],
      rfqHover: brand[600],
      rfqPressed: brand[700],
      // steel-50 on brand-500 = 6.32:1 ✓ (§4.5 covenant). See mistakes.md 2026-07-10
      // for the earlier version of this same bug on the steel-950 fill.
      rfqFg: steel[50],
    },
    accent: {
      default: brand[500],
      onDark: brand[300],
      text: brand[600],
      textHover: brand[700],
    },
    focus: { ring: brand[500], ringOnDark: brand[300] },
    border: { ...semanticBase.color.border, focus: brand[500], inputFocus: brand[500] },
  },
} as const

export type Company = 'dhruv' | 'precise' | 'group'

export const semanticByCompany = {
  dhruv: semanticDhruv,
  precise: semanticPrecise,
  group: semanticGroup,
} as const
