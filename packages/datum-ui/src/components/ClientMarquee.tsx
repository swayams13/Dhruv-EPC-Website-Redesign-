// ClientMarquee — Clients & Projects spec §4, "the one animated device".
// Two counter-scrolling rows, each a flex track holding its row twice for a
// seam-free loop. Homepages only (§7 sequencing) — the Clients & Projects
// page keeps the static ClientLogoWall.
//
// Sizing math (why 21 marks per row matters, not just a nice round number):
// a row of n marks, duplicated, is a track of 2n cells. Sizing the track to
// `200% * n / visibleCount` of the row and each cell to `100% / (2n)` of the
// track makes every cell render at exactly `100% / visibleCount` of the
// *row* — reproducing the spec's `calc(100% / 7)` using only well-defined
// percentages (a flex/grid container with an intrinsic width can't resolve
// percentage children — this sidesteps that by giving the track a real
// percentage width instead of `max-content`). It only comes out even when n
// is a multiple of visibleCount, which is exactly what 21 marks / 7 visible
// guarantees — "so all 42 pass in one lap without repeating" (spec §4) is
// doing double duty as a CSS-math constraint, not just a content rule.
// `--marquee-visible` (7 lg+ / 5 md / 3 below, spec §4's responsive table)
// is a CSS custom property set in globals.css per breakpoint and read here
// via calc() — the same var()-in-calc() pattern globals.css's
// `.exploded-track` already uses for its own responsive height.
//
// Logo cap rounds the spec's 56px to h-16 (64px) — no exact token exists,
// and 64px keeps one consistent logo-cap size with ClientLogoWall's
// bordered variant rather than introducing a third distinct value (2026-
// 09-03 token-gap policy). Cell height 104px rounds to h-24 (96px) the
// same way, unifying with ClientLogoWall's own rounded cell height.
//
// `speed` isn't a prop — the spec fixes it at 64s/76s (unequal on purpose:
// "equal speeds make the two rows read as one sliding block") and nothing
// in this feature ever needs a different pair, so there's no config
// surface for a value that never changes (YAGNI). The two durations are
// baked into `animate-client-marq-l`/`-r` in tailwind.ts instead.

import type { ClientRecord } from '@vedanta/schemas'

export interface ClientMarqueeProps {
  rowA: ClientRecord[]
  rowB: ClientRecord[]
  className?: never
}

function Track({
  marks,
  direction,
}: {
  marks: ClientRecord[]
  direction: 'l' | 'r'
}): React.ReactElement | null {
  if (marks.length === 0) return null
  const doubled = [...marks, ...marks]
  const trackWidth = `calc(200% * ${marks.length} / var(--marquee-visible))`
  const cellWidth = `calc(100% / ${doubled.length})`
  const animate = direction === 'l' ? 'animate-client-marq-l' : 'animate-client-marq-r'

  return (
    <div className="client-marquee-row relative overflow-hidden">
      <div
        className={`client-marquee-track flex will-change-transform motion-reduce:animate-none ${animate}`}
        style={{ width: trackWidth }}
      >
        {doubled.map((client, i) => (
          <div
            key={`${client.slug}-${i}`}
            style={{ width: cellWidth }}
            className="flex h-24 shrink-0 items-center justify-center border-r border-steel-200 bg-white p-4"
          >
            {client.logo ? (
              <img src={client.logo} alt={client.name} className="h-auto w-auto max-h-16 object-contain" />
            ) : (
              <span className="text-center font-display text-sm font-semibold text-steel-700">{client.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ClientMarquee({ rowA, rowB }: ClientMarqueeProps): React.ReactElement | null {
  const granted = (list: ClientRecord[]) => list.filter((c) => c.consent === 'granted')
  const a = granted(rowA)
  const b = granted(rowB)
  if (a.length === 0 && b.length === 0) return null

  return (
    <div className="flex flex-col">
      <Track marks={a} direction="l" />
      <Track marks={b} direction="r" />
    </div>
  )
}
