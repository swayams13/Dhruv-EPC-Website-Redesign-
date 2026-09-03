// SectorGrid — Clients & Projects spec §3.
// 5-column hairline grid: gap-px on a steel-200 ground makes the 1px gaps
// read as dividers between white cells. Each item is a mono-adjacent accent
// rule + a title-case sector name — no icons, no invented copy.
//
// Cell padding is spec'd at 28px/24px; the shipped spacing scale has no 28
// token (4/8/12/16/24/32/48/64/96/128/160 only), so both round to p-6 (24px)
// per the token-gap policy agreed 2026-09-03 — round to nearest existing
// token rather than add a new one silently.

import type { Sector } from '@vedanta/schemas'

export interface SectorGridProps {
  sectors: Sector[]
  className?: never
}

export function SectorGrid({ sectors }: SectorGridProps): React.ReactElement {
  const sorted = [...sectors].sort((a, b) => a.order - b.order)

  return (
    <ul className="grid grid-cols-2 gap-px bg-steel-200 sm:grid-cols-3 md:grid-cols-5">
      {sorted.map((sector) => (
        <li key={sector.slug} className="relative min-h-24 bg-white p-6">
          {/* accent rule: 2 × 28px per spec — thinner than any spacing token
              can express, so it's an inline style like PageHero's own 2px
              accent rule, not a Tailwind class. */}
          <span aria-hidden="true" className="absolute left-6 top-6 bg-accent" style={{ width: 2, height: 28 }} />
          <p className="pl-6 text-body-lg font-semibold text-steel-950">{sector.name}</p>
        </li>
      ))}
    </ul>
  )
}
