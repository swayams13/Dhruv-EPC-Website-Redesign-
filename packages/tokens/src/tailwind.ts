// Datum Design System v1.0 — Tailwind v3 preset
// Generated from token primitives. Do NOT add values here manually —
// new values require a design-review event (Datum §26 governance).

import type { Config } from 'tailwindcss'
import { steel, brand, arc, flex, signal, motion, shadow, radius } from './primitives'

export const datumPreset = {
  theme: {
    // Override ALL Tailwind defaults — everything from the datum
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      steel,
      brand,
      // arc: retired as an accent at v1.2 but still registered so any straggling
      // `arc-*` utility class fails loudly in review rather than silently at runtime.
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
      sm: radius.sm,
      DEFAULT: radius.sm,
      pill: radius.pill,  // buttons only, where a pill is wanted
      full: radius.full,  // back-to-top, avatar crop, circular controls only
    },
    boxShadow: {
      none: 'none',
      raised: shadow.raised,
      hover: shadow.hover,
      overlay: shadow.overlay,
    },
    fontFamily: {
      // v1.3: display and sans share one loader/variable — Plus Jakarta Sans
      // serves both roles (VEDANTA_DESIGN_DECISIONS.md D-2). See
      // apps/web/app/layout.tsx for why there's no separate --font-sans.
      display: ['var(--font-display)', 'Plus Jakarta Sans', 'sans-serif'],
      sans: ['var(--font-display)', 'Plus Jakarta Sans', 'sans-serif'],
      mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
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
      // header 91px / header-scrolled 76px — IMPLEMENTATION_NOTES §2.1 (v1.3,
      // Phase 5).
      height: {
        compact: '40px',
        row: '44px',
        'row-dense': '36px',
        header: '91px',
        'header-scrolled': '76px',
        // Hero C split-hero panel heights (Decision 2, Phase 9) — group home
        // 600px, Dhruv/Precise company homepages 560px (Precise's exact
        // height is inferred by symmetry with Dhruv, per Decision 2).
        'hero-split-group': '600px',
        'hero-split-company': '560px',
      },
      width: {
        compact: '40px',
        row: '44px', // mirrors height.row — a true 44×44 circle (Footer back-to-top, Phase 7)
      },
      minHeight: {
        row: '44px',
        control: '48px',
        // PageHero/ProductHero full-bleed hero (§3 responsive table,
        // Phase 11) — 440px <768 / 520px 768-1023 / 620px ≥1024. Flagged
        // IMPLEMENTATION INFERENCE per Phase 22's governance note (not
        // directly canvas-verified for these two heroes, though Decision 2
        // confirms them "unchanged" by the Hero C revision).
        'page-hero': '440px',
        'page-hero-md': '520px',
        'page-hero-lg': '620px',
      },
      // Type steps missing from Tailwind defaults (§5.2): data 15px, helper 13px
      // §5.2 fluid steps (360px floor → 1440px ceiling, linear between):
      // size(vw) = min + (max−min) · (100vw − 360px) / 1080px
      // v1.3 (2026-09-02): remapped per VEDANTA_DESIGN_DECISIONS.md D-1/
      // IMPLEMENTATION_NOTES §1.1 — mirrors packages/tokens/src/primitives.ts
      // `typeScale`. The client's scale jumps hard (64 → 47 → 25); kept, not
      // smoothed into a flat modular scale.
      fontSize: {
        'logo-sub': ['9px', { lineHeight: '1.4' }],
        data: ['15px', { lineHeight: '1.5' }],
        helper: ['13px', { lineHeight: '1.5' }],
        'display-xl': ['clamp(40px, 32px + 2.2222vw, 64px)', { lineHeight: '1.0' }],
        display: ['clamp(34px, 26.6667px + 2.037vw, 56px)', { lineHeight: '1.02' }],
        h1: ['clamp(32px, 27px + 1.3889vw, 47px)', { lineHeight: '1.05' }],
        h2: ['clamp(26px, 24px + 0.5556vw, 32px)', { lineHeight: '1.15' }],
        h3: ['clamp(21px, 19.6667px + 0.3704vw, 25px)', { lineHeight: '1.3' }],
        h4: ['clamp(18px, 17px + 0.2778vw, 21px)', { lineHeight: '1.35' }],
        'body-lg': ['19px', { lineHeight: '1.55' }],
        body: ['16px', { lineHeight: '1.5' }],
        small: ['15px', { lineHeight: '1.55' }],
        caption: ['12px', { lineHeight: '1.3' }],
        'data-lg': ['clamp(24px, 21.3333px + 0.7407vw, 32px)', { lineHeight: '1.1' }],
      },
      // §10 glass scrim: steel-50 at 88% — the one sanctioned translucency.
      // 60/72/92: Hero C's type-panel breadcrumb + body copy opacities
      // (Decision 2, Phase 9) — 60 is already in Tailwind's default scale,
      // listed here only for the comment; 72/92 are not and silently
      // compile to nothing without this (verified against the build output,
      // same failure mode as border-accent/50 in Phase 7 — Tailwind's
      // opacity modifier only recognizes its own preset percentage steps).
      // 82: PageHero/ProductHero's unchanged body-copy opacity (§2.2,
      // Phase 11) — same missing-preset-step problem as 72/92 above.
      // 66: Header's utility-bar company-switcher links (Session 9, VG-051)
      // — same missing-preset-step failure, found 2026-09-03: `text-white/66`
      // silently compiled to nothing (no CSS rule emitted at all), so the
      // link text fell back to its inherited default color (steel-950) on
      // the dark bg-steel-900 strip — 1.12:1 contrast, effectively
      // invisible. docs/mistakes.md.
      opacity: {
        60: '.6',
        66: '.66',
        72: '.72',
        82: '.82',
        88: '.88',
        92: '.92',
      },
      // §16 card photograph ratio (Tailwind ships only square/video)
      aspectRatio: {
        '4/3': '4 / 3',
      },
      // Caption voice tracking +0.09em (§5.2, v1.3) — Tailwind has 0.05/0.1
      // only. `tight` is new: headlines tighten to -0.02em at h1 and above
      // (IMPLEMENTATION_NOTES §1.1) — never tracked on prose.
      letterSpacing: {
        caption: '0.09em',
        tight: '-0.02em',
      },
      // ClientMarquee (Clients & Projects spec §4) — "the one animated
      // device". Rule change 2 Sep 2026: the blanket loop-animation ban is
      // retired for a continuous, non-interactive band that shows all its
      // content in one lap; auto-advancing carousels remain banned. Values
      // copied verbatim from spec §4's copy-ready CSS — not independently
      // chosen. `motion-reduce:animate-none` on the consuming component
      // handles the prefers-reduced-motion state; the hover-pause behaviour
      // (animation-play-state has no Tailwind core plugin) lives in
      // globals.css next to these.
      keyframes: {
        'client-marq-l': {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'client-marq-r': {
          from: { transform: 'translate3d(-50%,0,0)' },
          to: { transform: 'translate3d(0,0,0)' },
        },
      },
      animation: {
        'client-marq-l': 'client-marq-l 64s linear infinite',
        'client-marq-r': 'client-marq-r 76s linear infinite',
      },
    },
  },
} satisfies Partial<Config>
