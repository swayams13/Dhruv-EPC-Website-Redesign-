// Breadcrumbs — Datum §17.
// Interior pages (onDark=false, the default): small type, steel-600, "/"
// separators, current page unlinked. The visible twin of the BreadcrumbList
// JSON-LD — pages build the machine record from the same items via
// packages/schemas (one artifact, two audiences).
//
// onDark: the dark-ground variant used where the breadcrumb sits directly on
// a dark surface — HomeHero's split-hero type panel (Decision 2) and
// PageHero/ProductHero's breadcrumb-on-photo (§10 rule 10, Phase 11) both
// use this exact treatment: "→" separator in accent-dark (not "/"), white/60
// links, white/92 current page.

export interface BreadcrumbItem {
  label: string
  /** Omit on the last (current) item — it renders unlinked with aria-current */
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  onDark?: boolean
  className?: never
}

export function Breadcrumbs({ items, onDark = false }: BreadcrumbsProps): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={`flex flex-wrap items-center gap-2 text-sm ${onDark ? 'text-white/60' : 'text-steel-600'}`}
      >
        {items.map((item, i) => {
          const current = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className={onDark ? 'text-accent-dark' : 'text-steel-400'}>
                  {onDark ? '→' : '/'}
                </span>
              )}
              {item.href && !current ? (
                <a
                  href={item.href}
                  className={`transition-colors duration-instant hover:underline ${
                    onDark ? 'hover:text-white' : 'hover:text-steel-950'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={current ? 'page' : undefined}
                  className={onDark ? 'text-white/92' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
