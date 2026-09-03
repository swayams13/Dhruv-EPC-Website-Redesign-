// Logo — the Vedanta lockup (D-10, VEDANTA_DESIGN_IMPLEMENTATION_NOTES.md
// §2.0, ref `2a`). Lives in apps/web, not @vedanta/datum-ui, for the same
// reason: it needs next/image directly, and datum-ui
// takes no `next` dependency. Header.tsx (datum-ui) already accepts an
// arbitrary `logo: React.ReactNode` slot — this is what gets passed into it,
// wired up in Phase 5, not here.
//
// The emblem is the client's supplied artwork (apps/web/public/brand/
// vedanta-emblem.png, 1161x995px, cropped to its ink bounding box, near-white
// knocked out to transparent) — never redrawn, never traced, never
// approximated in SVG. Ship an SVG once vector source arrives; until then
// this is the trimmed PNG through next/image.
//
// Sizing: the spec gives literal per-context pixel values for the emblem
// height and both wordmark lines (§2.0's size ladder), not a formula to
// compute at render time — SIZES below is a transcription of that table,
// not a derivation. These are logo-lockup proportions, not prose type scale,
// so they're applied via inline style rather than a new Tailwind token: a
// one-off brand-asset
// constant doesn't clear the bar for a §26 design-review token addition.
//
// Below 32px the globe wireframe fills in and stops reading (a property of
// the artwork, not this component) — use `size="emblem-only"` there, never
// scale the full lockup down further. Below 24px, don't use this component
// at all — render the wordmark's line 1 text alone, per §2.0.
//
// logoRed (#CD0101) is consumed ONLY here — never through semantic.ts, never
// as a Tailwind color, never for buttons/links/focus rings/decorative UI.
// Enforced by apps/web/lib/logo-consumer-boundary.test.ts (Decision 1).

import Image from 'next/image'
import { logoRed } from '@vedanta/tokens'

export type LogoCompany = 'group' | 'dhruv-epc' | 'precise-engineers'

/** Named rungs from §2.0's size ladder. `emblem-only` takes an explicit height instead. */
export type LogoSize = 'header' | 'header-scrolled' | 'secondary' | 'floor'

export interface LogoProps {
  company: LogoCompany
  size: LogoSize
  /** next/image `priority` — set on the header instance only (§1.1's asset note). */
  priority?: boolean
  className?: string
}

export interface EmblemOnlyProps {
  /** Emblem height in px — for placements below the 32px full-lockup floor. */
  height: number
  priority?: boolean
  className?: string
}

const WORDMARK: Record<LogoCompany, { line1: string; line2: string }> = {
  group: { line1: 'VEDANTA GROUP', line2: 'OF COMPANIES · EST. 1994' },
  'dhruv-epc': { line1: 'DHRUV EPC', line2: 'SOLUTION PVT. LTD' },
  'precise-engineers': { line1: 'PRECISE', line2: 'ENGINEERS' },
}

// §2.0 size ladder, transcribed verbatim — h: emblem height, line1/line2: wordmark font sizes, all px.
const SIZES: Record<LogoSize, { h: number; line1: number; line2: number; gap: number }> = {
  header: { h: 58, line1: 34, line2: 13, gap: 0.31 * 58 },
  'header-scrolled': { h: 44, line1: 25, line2: 10.5, gap: 0.31 * 44 },
  secondary: { h: 50, line1: 27, line2: 11, gap: 0.31 * 50 },
  floor: { h: 32, line1: 17, line2: 8, gap: 0.31 * 32 },
}

// Asset aspect ratio, §2.0: cropped to the ink bounding box, 1.167:1 (w:h).
const EMBLEM_ASPECT = 1.167

function Emblem({
  height,
  priority,
  className,
}: {
  height: number
  priority?: boolean | undefined
  className?: string | undefined
}) {
  return (
    <Image
      src="/brand/vedanta-emblem.png"
      alt="" // decorative — the wordmark carries the accessible company name
      width={Math.round(height * EMBLEM_ASPECT)}
      height={Math.round(height)}
      priority={priority}
      className={className}
    />
  )
}

export function Logo({ company, size, priority, className }: LogoProps): React.ReactElement {
  const wordmark = WORDMARK[company]
  const { h, line1, line2, gap } = SIZES[size]

  return (
    <span className={`inline-flex items-center ${className ?? ''}`} style={{ gap }}>
      <Emblem height={h} priority={priority} />
      <span className="flex flex-col justify-center">
        <span
          className="font-extrabold tracking-tight"
          style={{ fontSize: line1, color: logoRed, lineHeight: 1.1 }}
        >
          {wordmark.line1}
        </span>
        {/* spec calls for +0.03em; tracking-wide (0.025em) is the nearest
            existing token — a new token for one component's second line
            isn't a §26 design-review event. */}
        <span
          className="font-bold tracking-wide text-steel-950"
          style={{ fontSize: line2, lineHeight: 1.2 }}
        >
          {wordmark.line2}
        </span>
      </span>
    </span>
  )
}

/** Emblem alone, no wordmark — for placements under the 32px full-lockup floor (§2.0). */
export function LogoEmblem({ height, priority, className }: EmblemOnlyProps): React.ReactElement {
  return <Emblem height={height} priority={priority} className={className} />
}
