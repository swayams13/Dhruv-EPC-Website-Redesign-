// PageHero — Datum §19, company/capability variant.
// Light, typographic, photograph optional — not every page earns the big
// image; restraint keeps the ones that do impressive. H1 carries the real
// qualifier; proof belongs in the page body (§20 components), not here.

import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'

export interface PageHeroProps {
  /** Interior pages carry breadcrumbs (§17) */
  breadcrumbs?: BreadcrumbItem[]
  /** Caption eyebrow, e.g. "Company" */
  eyebrow?: string
  title: string
  /** Lead paragraph (body-lg) */
  lead?: string
  /** Optional real photograph band */
  photo?: React.ReactNode
  className?: never
}

export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  photo,
}: PageHeroProps): React.ReactElement {
  return (
    <section className="border-b border-steel-200 bg-steel-50">
      <div className="mx-auto max-w-wide px-6 py-12">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && (
          <p className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-content font-display text-display font-medium text-steel-950">
          {title}
        </h1>
        {lead && <p className="mt-6 max-w-content text-body-lg text-steel-600">{lead}</p>}
        {photo && (
          <div className="mt-10 aspect-video w-full overflow-hidden bg-steel-100">{photo}</div>
        )}
      </div>
    </section>
  )
}
