// IndustryCard — Vedanta Component Specs.html §1b. Unlike CategoryCard/
// ProductCard, this card takes no company accent on any page: both works
// serve the same industries, and an enquiry routes to whichever fabricates
// the item, so there is no accent to give either of them (§03). Focus ring
// is steel-950 explicitly rather than var(--accent-focus) — the one place
// this component overrides the shared focus color, per spec.

export interface IndustryCardProps {
  /** Sector name, verbatim from the published list */
  name: string
  /** Two-digit editorial index, e.g. "02" — order, not a rank */
  index: string
  href: string
  /** Which works serve the sector. Both names render identically. */
  servedBy: Array<'dhruv' | 'precise'>
  /** Projects linked to the sector. 0 renders the thin state; "0" is never printed. */
  projectCount: number
  /** Dark-ground variant */
  onDark?: boolean
  /** Denser index+name only, for the footer sector list */
  compact?: boolean
  headingLevel?: 2 | 3 | 4
  className?: never
}

const WORKS_LABEL: Record<'dhruv' | 'precise', string> = {
  dhruv: 'Dhruv EPC',
  precise: 'Precise Engineers',
}

function Heading({
  level = 3,
  className,
  children,
}: {
  level: 2 | 3 | 4
  className: string
  children: React.ReactNode
}): React.ReactElement {
  const Tag = (`h${level}` as const)
  return <Tag className={className}>{children}</Tag>
}

export function IndustryCard({
  name,
  index,
  href,
  servedBy,
  projectCount,
  onDark = false,
  compact = false,
  headingLevel = 3,
}: IndustryCardProps): React.ReactElement {
  const thin = projectCount === 0
  const servedByLabel = servedBy.map((w) => WORKS_LABEL[w]).join(' · ')
  const projectLabel = thin ? 'Coming soon' : `${projectCount} ${projectCount === 1 ? 'project' : 'projects'}`
  // Never var(--accent-focus) here (§03). On dark grounds, use steel-50 for visible contrast; on light, steel-950.
  const focusRing = onDark
    ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel-50'
    : 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel-950'

  if (compact) {
    const surfaceText = onDark ? 'text-steel-50' : 'text-steel-950'
    const indexText = onDark ? 'text-steel-500' : 'text-steel-400'
    if (thin) {
      return (
        <div className={`flex items-baseline gap-3 opacity-60 ${onDark ? 'text-steel-500' : 'text-steel-400'}`}>
          <span aria-hidden className={`font-mono text-helper ${indexText}`}>{index}</span>
          <span className="text-sm">{name}</span>
        </div>
      )
    }
    return (
      <a
        href={href}
        className={`group flex items-baseline gap-3 rounded-sm ${focusRing} ${surfaceText}`}
      >
        <span aria-hidden className={`font-mono text-helper ${indexText}`}>{index}</span>
        <span className="text-sm underline-offset-4 group-hover:underline">{name}</span>
      </a>
    )
  }

  if (onDark) {
    if (thin) {
      return (
        <div className="block h-full rounded-sm border border-steel-800 bg-steel-900 p-6 opacity-60">
          <span aria-hidden className="font-mono text-helper text-steel-600">{index}</span>
          <Heading level={headingLevel} className="mt-2 font-display text-h3 font-semibold text-steel-400">
            {name}
          </Heading>
          <p className="mt-2 text-sm text-steel-600">{servedByLabel}</p>
          <p className="mt-4 font-mono text-helper text-steel-600">{projectLabel}</p>
        </div>
      )
    }
    return (
      <a
        href={href}
        className={`group block h-full rounded-sm border border-steel-800 bg-steel-900 p-6 transition-colors duration-fast ease-standard hover:border-steel-500 ${focusRing}`}
      >
        <span aria-hidden className="font-mono text-helper text-steel-500">{index}</span>
        <Heading level={headingLevel} className="mt-2 font-display text-h3 font-semibold text-steel-50">
          {name}
        </Heading>
        <p className="mt-2 text-sm text-steel-500">{servedByLabel}</p>
        <p className="mt-4 font-mono text-helper text-steel-400">{projectLabel}</p>
      </a>
    )
  }

  if (thin) {
    return (
      <div className="block h-full rounded-sm border border-steel-200 bg-steel-50 p-6 opacity-70">
        <span aria-hidden className="font-mono text-helper text-steel-400">{index}</span>
        <Heading level={headingLevel} className="mt-2 font-display text-h3 font-semibold text-steel-500">
          {name}
        </Heading>
        <p className="mt-2 text-sm text-steel-500">{servedByLabel}</p>
        <p className="mt-4 font-mono text-helper text-steel-500">{projectLabel}</p>
      </div>
    )
  }

  return (
    <a
      href={href}
      className={`group block h-full rounded-sm border border-steel-200 bg-white p-6 transition-colors duration-instant ease-standard hover:border-steel-950 ${focusRing}`}
    >
      <span aria-hidden className="font-mono text-helper text-steel-500">{index}</span>
      <Heading level={headingLevel} className="mt-2 font-display text-h3 font-semibold text-steel-950">
        {name}
      </Heading>
      <p className="mt-2 text-sm text-steel-600">{servedByLabel}</p>
      <p className="mt-4 font-mono text-helper text-steel-700">{projectLabel}</p>
    </a>
  )
}
