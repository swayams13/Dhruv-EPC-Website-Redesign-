// ClientLogoWall — Clients & Projects spec §3/§5.
// The consent publish gate lives here, not in the caller: a client record
// renders only when consent === 'granted' — everything else is omitted, not
// greyed out. If nothing is granted yet, the whole wall renders null so the
// page can omit the section around it rather than show an empty grid
// (omit-not-empty, CLAUDE.md's CMS rules). A client without a logo path
// still renders — as a text-tile with its name, never blank, same house
// rule ClientWall.tsx already follows for the older Client schema.
//
// `bordered` (default, ref 3a): 7 columns, gap-px on steel-200 reads as
// hairlines between white cells. `quiet` (ref 3b): 6 columns, row rules
// only, no vertical hairlines.
//
// Cell heights (112px bordered / 104px quiet) and padding (18px) have no
// exact spacing-scale token; rounded to h-24 (96px, unified across both
// variants) and p-4 (16px) per the 2026-09-03 token-gap policy. The
// artifact's 84%-of-cell logo width cap has no non-arbitrary Tailwind
// equivalent either — reproduced instead with cell padding + `object-contain`,
// which gives the same visual inset without a bracketed percentage value.

import type { ClientRecord } from '@vedanta/schemas'

export interface ClientLogoWallProps {
  clients: ClientRecord[]
  columns?: 7 | 6
  variant?: 'bordered' | 'quiet'
  className?: never
}

export function ClientLogoWall({ clients, variant = 'bordered' }: ClientLogoWallProps): React.ReactElement | null {
  const granted = clients.filter((c) => c.consent === 'granted')
  if (granted.length === 0) return null

  const bordered = variant === 'bordered'
  const gridCols = bordered
    ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-7'
    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
  const gridGround = bordered ? 'gap-px bg-steel-200' : 'divide-y divide-steel-200'
  const logoCap = bordered ? 'max-h-16' : 'max-h-12'

  return (
    <ul className={`grid ${gridCols} ${gridGround}`}>
      {granted.map((client) => (
        <li key={client.slug} className="flex h-24 items-center justify-center bg-white p-4">
          {client.logo ? (
            <img src={client.logo} alt={client.name} className={`w-auto ${logoCap} object-contain`} />
          ) : (
            // text-tile fallback — a granted client without a logo path yet
            // still renders, never blank (CLAUDE.md CMS rules)
            <span className="text-center font-display text-sm font-semibold text-steel-700">{client.name}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
