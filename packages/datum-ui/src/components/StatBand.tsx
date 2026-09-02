// StatBand — Datum §19.
// Four mono figures with mono caption labels (years, max tonnage, max Ø,
// sectors served), each sourced from the approved entity/capability record.
// Putting measurable capability in the first viewport is the single
// highest-leverage UX decision on the site (Phase 1 §4: our users verify,
// they don't browse). Principle 5 (nothing unattributed): each figure
// carries its source caption. §2.7 (Phase 8): each item gets its own
// border-l-2 rule — the client's own left-rule idiom, and it survives the
// 2-column mobile reflow better than a top border would.

export interface Stat {
  /** Mono figure with unit: "38 yrs", "250 T", "Ø 4,000 mm" */
  value: string
  label: string
  /** Provenance caption, e.g. "EIL vendor record, 2024" */
  source?: string
}

export interface StatBandProps {
  stats: Stat[]
  /** Home hero renders the band on graphite (§19) */
  onDark?: boolean
  className?: never
}

export function StatBand({ stats, onDark = false }: StatBandProps): React.ReactElement {
  const figure = onDark ? 'text-steel-50' : 'text-steel-950'
  const caption = onDark ? 'text-steel-400' : 'text-steel-600'
  const rule = onDark ? 'border-steel-800' : 'border-steel-200'

  return (
    <ul className={`grid grid-cols-2 gap-8 border-t py-8 md:grid-cols-4 ${rule}`}>
      {stats.map((stat) => (
        <li key={stat.label} className={`border-l-2 pl-5 ${rule}`}>
          <p className={`font-mono text-data-lg font-medium ${figure}`}>{stat.value}</p>
          <p className={`mt-1 font-mono text-xs font-medium uppercase tracking-caption ${caption}`}>
            {stat.label}
          </p>
          {stat.source && <p className={`mt-1 font-mono text-helper ${caption}`}>{stat.source}</p>}
        </li>
      ))}
    </ul>
  )
}
