'use client'
// DatumRule — the signature mark per Datum §2:
// "a thin horizontal rule with a short perpendicular tick at its origin".
// animate: the §11 signature draw — line scales left-to-right over
// motion-signature (700ms), tick drops in after. Reduced motion collapses
// both to the final frame via the global media query (§11 — first-class mode).

import { useEffect, useState } from 'react'

export interface DatumRuleProps {
  /** Signature draw on mount — product/home heroes only (§11) */
  animate?: boolean
  /** Dark/photo grounds — Hero C's photo panel (Phase 9). The line itself
   *  (not the tick, already accent) flips from steel-950 to white/60 so it
   *  stays visible with no scrim underneath it. */
  onDark?: boolean
}

export function DatumRule({ animate = false, onDark = false }: DatumRuleProps): React.ReactElement {
  const [drawn, setDrawn] = useState(!animate)

  useEffect(() => {
    if (animate) setDrawn(true)
  }, [animate])

  return (
    <div role="presentation" className="relative h-2 w-full">
      {/* tick at origin — perpendicular, accent-colored (§12: arc when the icon is the accent) */}
      <span
        className={`absolute left-0 top-0 h-2 w-px bg-accent transition-opacity duration-instant ease-enter ${
          drawn ? 'opacity-100 delay-700' : 'opacity-0'
        }`}
      />
      {/* the datum line */}
      <span
        className={`absolute left-0 top-2 block h-px w-full origin-left transition-transform duration-signature ease-enter ${
          onDark ? 'bg-white/60' : 'bg-steel-950'
        } ${drawn ? 'scale-x-100' : 'scale-x-0'}`}
      />
    </div>
  )
}
