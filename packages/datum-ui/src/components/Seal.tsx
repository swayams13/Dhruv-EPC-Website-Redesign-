// Seal — the scalloped rosette vector, Datum §12 / §2.5, ref `1k`, §10 rule 5.
// The strongest brand-DNA finding in the forensics doc: it ties certification
// marks to the logo's own oval-scallop border. Add a proper vector — never a
// checkmark-in-a-circle, never a flat filled badge.
//
// 16-lobe scalloped path, 0 0 120 120 viewBox, currentColor stroke, inner
// ring at r=34, code set in mono, centred. Monochrome steel-950 by default;
// the code line may take text-accent, but only at the 120px size.
//
// Size ladder (stroke steps UP as the mark shrinks, so the lobes stay
// readable): 120 (stroke 2, inner ring 1px, issuer + code) · 72 (stroke 2.5,
// inner ring 1.2px, code only) · 44 (stroke 4, no inner ring, code only).
// Below 32px there's no Seal rung at all — use Stamp, the mono tile, instead
// (CertificationCard/Footer's credential strip already do).
//
// Closed 3-value size union, not an arbitrary number — same reasoning as
// Logo.tsx's named size rungs: this is a fixed brand-asset ladder, not a
// scalable primitive.

import type { StampProps } from './Stamp'

export interface SealProps {
  /** Certification code — same closed set Stamp renders */
  code: StampProps['code']
  /** Issuer name — rendered only at the 120px size (two-line layout) */
  issuer?: string
  size: 120 | 72 | 44
}

// Exact path per §2.5 — copied verbatim, do not hand-adjust.
const SCALLOP_PATH =
  'M104,60 A9,9 0 0 1 100.651,76.838 A9,9 0 0 1 91.113,91.113 A9,9 0 0 1 76.838,100.651 ' +
  'A9,9 0 0 1 60,104 A9,9 0 0 1 43.162,100.651 A9,9 0 0 1 28.887,91.113 A9,9 0 0 1 19.349,76.838 ' +
  'A9,9 0 0 1 16,60 A9,9 0 0 1 19.349,43.162 A9,9 0 0 1 28.887,28.887 A9,9 0 0 1 43.162,19.349 ' +
  'A9,9 0 0 1 60,16 A9,9 0 0 1 76.838,19.349 A9,9 0 0 1 91.113,28.887 A9,9 0 0 1 100.651,43.162 Z'

const RUNG: Record<SealProps['size'], { outerStroke: number; innerRing: number | null; fontSize: number }> = {
  120: { outerStroke: 2, innerRing: 1, fontSize: 13 },
  72: { outerStroke: 2.5, innerRing: 1.2, fontSize: 11 },
  44: { outerStroke: 4, innerRing: null, fontSize: 12 },
}

export function Seal({ code, issuer, size }: SealProps): React.ReactElement {
  const label = code.replace('-', ' ')
  const { outerStroke, innerRing, fontSize } = RUNG[size]
  const codeFill = size === 120 ? 'fill-accent' : 'fill-current'
  const showIssuer = size === 120 && issuer

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label={issuer ? `${issuer} ${label}` : label}
      className="text-steel-950"
    >
      <path d={SCALLOP_PATH} stroke="currentColor" strokeWidth={outerStroke} />
      {innerRing !== null && (
        <circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth={innerRing} />
      )}
      {showIssuer && (
        <text
          x="60"
          y="54"
          textAnchor="middle"
          className="fill-current font-mono"
          style={{ fontSize: fontSize - 2 }}
        >
          {issuer}
        </text>
      )}
      <text
        x="60"
        y={showIssuer ? 70 : 65}
        textAnchor="middle"
        className={`font-mono font-medium ${codeFill}`}
        style={{ fontSize }}
      >
        {label}
      </text>
    </svg>
  )
}
