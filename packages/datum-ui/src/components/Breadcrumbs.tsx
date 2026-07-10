// Breadcrumbs — Datum §17.
// All interior pages: small type, steel-600, "/" separators, current page
// unlinked. The visible twin of the BreadcrumbList JSON-LD — pages build the
// machine record from the same items via packages/schemas (one artifact, two
// audiences).

export interface BreadcrumbItem {
  label: string
  /** Omit on the last (current) item — it renders unlinked with aria-current */
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: never
}

export function Breadcrumbs({ items }: BreadcrumbsProps): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-steel-600">
        {items.map((item, i) => {
          const current = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-steel-400">
                  /
                </span>
              )}
              {item.href && !current ? (
                <a
                  href={item.href}
                  className="transition-colors duration-instant hover:text-steel-950 hover:underline"
                >
                  {item.label}
                </a>
              ) : (
                <span aria-current={current ? 'page' : undefined}>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
