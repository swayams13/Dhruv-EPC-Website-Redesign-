// Internal glyph set per Datum §12 — 24×24 grid, 1.5px stroke, squared caps
// and joins ("drafted, not doodled"). Not exported from the barrel: pages use
// the icon library; these exist only where a Datum component's anatomy names
// a glyph (card arrow, nav chrome, contact icons).
// All are decorative (aria-hidden) — accessible names live on the parent control.

interface GlyphProps {
  /** §12 sizes: 16 inline · 20 buttons · 24 default */
  size?: 16 | 20 | 24
}

function svgProps({ size = 24 }: GlyphProps) {
  return {
    'aria-hidden': true,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'square',
    strokeLinejoin: 'miter',
  } as const
}

export function ArrowRight(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M4 12h15M14 6l6 6-6 6" />
    </svg>
  )
}

export function ChevronDown(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M5 9l7 7 7-7" />
    </svg>
  )
}

export function Menu(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  )
}

export function Close(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

export function Phone(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M4 4h5l2 5-3 2a13 13 0 0 0 5 5l2-3 5 2v5h-2A16 16 0 0 1 4 6V4Z" />
    </svg>
  )
}

// WhatsApp mark, simplified to the §12 construction (outline speech ring + handset)
export function WhatsApp(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M12 3.5a8.5 8.5 0 0 1 0 17 8.6 8.6 0 0 1-4.1-1L3.5 20.5l1-4.4a8.5 8.5 0 0 1 7.5-12.6Z" />
      <path d="M9.3 8.5h1.2l.8 2-1 1a6 6 0 0 0 2.2 2.2l1-1 2 .8v1.2c-.5.5-1.2.7-1.9.5a8 8 0 0 1-4.8-4.8c-.2-.7 0-1.4.5-1.9Z" />
    </svg>
  )
}

// SpecRail provenance marks (Session 6, golden page) — sourced/unverified.
export function Check(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M4 12l6 6L20 6" />
    </svg>
  )
}

export function Triangle(props: GlyphProps): React.ReactElement {
  return (
    <svg {...svgProps(props)}>
      <path d="M12 4l9 16H3L12 4zM12 10v4M12 17h.01" />
    </svg>
  )
}
