// Datum Design System v1.0 — Tailwind v3 preset
// Generated from token primitives. Do NOT add values here manually —
// new values require a design-review event (Datum §26 governance).

import type { Config } from 'tailwindcss'
import { steel, arc, flex, signal, motion, shadow, radius } from './primitives'

export const datumPreset = {
  theme: {
    // Override ALL Tailwind defaults — everything from the datum
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      steel,
      arc,
      flex,
      signal: {
        success: signal.success,
        'success-tint': signal.successTint,
        error: signal.error,
        'error-tint': signal.errorTint,
        warn: signal.warn,
        'warn-tint': signal.warnTint,
      },
      // CSS variable slots — company accent remapped at layout level (§T-2)
      accent: {
        DEFAULT: 'var(--accent)',
        dark: 'var(--accent-dark)',
        text: 'var(--accent-text)',
        'text-hover': 'var(--accent-text-hover)',
        // RFQ button contract (§13) — fill states + label fg (rfqFg, Session 2)
        hover: 'var(--accent-hover)',
        pressed: 'var(--accent-pressed)',
        fg: 'var(--accent-fg)',
      },
    },
    spacing: {
      0: '0',
      px: '1px',
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
    },
    borderRadius: {
      none: '0',
      sm: radius.sm,   // 2px — the only corner radius in the system
      DEFAULT: radius.sm,
    },
    boxShadow: {
      none: 'none',
      raised: shadow.raised,
      overlay: shadow.overlay,
    },
    fontFamily: {
      display: ['Archivo', 'sans-serif'],
      sans: ['IBM Plex Sans', 'sans-serif'],
      mono: ['IBM Plex Mono', 'monospace'],
    },
    transitionDuration: {
      instant: motion.instant,
      fast: motion.fast,
      standard: motion.standard,
      deliberate: motion.deliberate,
      signature: motion.signature,
    },
    transitionTimingFunction: {
      enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
      standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
    // Screens at Datum breakpoints (§25)
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    maxWidth: {
      content: '1200px',
      wide: '1360px',
      '2xl': '1440px',
    },
    extend: {
      // Component heights (§26 tier 3) — NOT spacing; §6's gapped scale stands.
      // compact 40px (§13 button/icon), row 44px (§15/§26 space.11), dense 36px (§15)
      // header 72px / header-scrolled 60px (§17 sticky compress)
      height: {
        compact: '40px',
        row: '44px',
        'row-dense': '36px',
        header: '72px',
        'header-scrolled': '60px',
      },
      width: {
        compact: '40px',
      },
      minHeight: {
        row: '44px',
        control: '48px',
      },
      // Type steps missing from Tailwind defaults (§5.2): data 15px, helper 13px
      // §5.2 fluid steps (360px floor → 1440px ceiling, linear between):
      // size(vw) = min + (max−min) · (100vw − 360px) / 1080px
      fontSize: {
        'logo-sub': ['9px', { lineHeight: '1.4' }],
        data: ['15px', { lineHeight: '1.5' }],
        helper: ['13px', { lineHeight: '1.5' }],
        'display-xl': ['clamp(40px, 32px + 2.2222vw, 64px)', { lineHeight: '1.05' }],
        display: ['clamp(34px, 29.3333px + 1.2963vw, 48px)', { lineHeight: '1.1' }],
        h1: ['clamp(30px, 26.6667px + 0.9259vw, 40px)', { lineHeight: '1.15' }],
        h3: ['clamp(21px, 20px + 0.2778vw, 24px)', { lineHeight: '1.3' }],
        h4: ['clamp(18px, 17.3333px + 0.1852vw, 20px)', { lineHeight: '1.4' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'data-lg': ['clamp(24px, 21.3333px + 0.7407vw, 32px)', { lineHeight: '1.2' }],
      },
      // §10 glass scrim: steel-50 at 88% — the one sanctioned translucency
      opacity: {
        88: '.88',
      },
      // §16 card photograph ratio (Tailwind ships only square/video)
      aspectRatio: {
        '4/3': '4 / 3',
      },
      // Caption voice tracking +0.06em (§5.2) — Tailwind has 0.05/0.1 only
      letterSpacing: {
        caption: '0.06em',
      },
    },
  },
} satisfies Partial<Config>
