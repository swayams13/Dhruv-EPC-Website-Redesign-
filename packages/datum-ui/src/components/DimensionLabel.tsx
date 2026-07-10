'use client'
// DimensionLabel — the §11 signature moment's measurement label.
// On product-page load the hero's datum line draws itself (DatumRule), the
// tick drops, and this label counts up in mono to its true figure
// ("Ø 3,600 mm") over motion-signature. Reduced motion renders the final
// frame — a first-class mode, not a fallback.
// Internal (not in the barrel): it exists only inside hero anatomy (§19).

import { useEffect, useState } from 'react'
import { semanticBase } from '@vedanta/tokens'

const SIGNATURE_MS = parseInt(semanticBase.motion.signature, 10)

export interface DimensionLabelProps {
  /** A true dimension, e.g. "Ø 3,600 mm" — the first figure counts up */
  label: string
  /** §11: home + product heroes only */
  animate?: boolean
}

export function DimensionLabel({ label, animate = false }: DimensionLabelProps): React.ReactElement {
  const match = label.match(/\d[\d,]*(?:\.\d+)?/)
  const final = match ? Number(match[0].replace(/,/g, '')) : null
  const [value, setValue] = useState(animate && final !== null ? 0 : final)

  useEffect(() => {
    if (!animate || final === null) return
    // no matchMedia (jsdom) → final frame, same as reduced motion
    if (
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setValue(final)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - t0) / SIGNATURE_MS, 1)
      // decelerate — the figure arrives with mass, like a crane setting a load
      setValue(p < 1 ? Math.round(final * (1 - Math.pow(1 - p, 3))) : final)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animate, final])

  const text =
    match && value !== null
      ? label.replace(match[0], value.toLocaleString('en'))
      : label

  return (
    <span className="font-mono text-helper text-steel-500">
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{label}</span>
    </span>
  )
}
