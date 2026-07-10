// ClientWall — Datum §20.
// Uniform-height monochrome logos on steel-50 tiles, each labeled with
// name + sector, alphabetical (no false hierarchy). Text-tile fallback for
// clients without logo permission — never a blank. Labeled because unlabeled
// logos are invisible to screen readers, to AI crawlers, and to any buyer who
// doesn't already recognize the mark. Monochrome is enforced with a grayscale
// filter so mixed-brand assets still read as one wall.

import type { Client } from '@vedanta/schemas'

export interface ClientWallProps {
  clients: Client[]
  className?: never
}

export function ClientWall({ clients }: ClientWallProps): React.ReactElement {
  const sorted = [...clients].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {sorted.map((client) => {
        const hasLogo = client.permission === 'logo-approved' && client.logoUrl
        return (
          <li
            key={client.name}
            className="flex h-full flex-col justify-between rounded-sm border border-steel-200 bg-steel-50 p-6"
          >
            {hasLogo ? (
              // the visible label below carries the name — the mark is decorative
              <div className="flex h-16 items-center">
                <img src={client.logoUrl} alt="" className="max-h-8 w-auto grayscale" />
              </div>
            ) : (
              // text-tile fallback (addendum §5-5) — never blank
              <div className="flex h-16 items-center">
                <span className="font-display text-h4 font-semibold text-steel-700">
                  {client.name}
                </span>
              </div>
            )}
            <div className="mt-4 border-t border-steel-200 pt-3">
              <p className="text-sm font-medium text-steel-950">{client.name}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-caption text-steel-500">
                {client.sector}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
