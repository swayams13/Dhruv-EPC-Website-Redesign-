// ProductHero — Datum §19, light variant, compact.
// Breadcrumb → H1 (the SEO-qualified title) → value statement leading with
// codes → inline spec chips (mono: max size, MOC families, codes) that
// anchor-link into the spec table → RFQ button. The signature datum-draw
// moment (§11) plays here: line draws, tick drops, dimension label counts up.
// Chips anchor into the spec table because engineers jump — they don't
// scroll politely (§21).

import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'
import { Button } from './Button'
import { DatumRule } from './DatumRule'
import { DimensionLabel } from './DimensionLabel'

export interface ProductHeroProps {
  breadcrumbs: BreadcrumbItem[]
  /** SEO-qualified: "Shell & Tube Heat Exchangers — ASME U-Stamp" */
  title: string
  /** Leads with codes */
  valueStatement: string
  /** Mono chips, each anchor-linking into the spec table */
  chips: string[]
  /** Spec-table anchor the chips jump to */
  specHref?: string
  /** Credential chips shown below spec chips — e.g. ['ASME U', 'IBR', 'ISO 9001:2015'] */
  certChips?: string[]
  rfq: { label: string; href: string }
  /** Optional real photograph (compact hero — not every product page has one) */
  photo?: React.ReactNode
  /** True dimension counted up by the §11 signature moment */
  dimensionLabel?: string
  className?: never
}

export function ProductHero({
  breadcrumbs,
  title,
  valueStatement,
  chips,
  specHref = '#specifications',
  certChips,
  rfq,
  photo,
  dimensionLabel,
}: ProductHeroProps): React.ReactElement {
  return (
    <section className="border-b border-steel-200 bg-steel-50">
      <div className="mx-auto max-w-wide px-6 py-12">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 max-w-content font-display text-h1 font-semibold text-steel-950">
          {title}
        </h1>
        <p className="mt-4 max-w-content text-body-lg text-steel-600">{valueStatement}</p>
        {chips.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip}>
                <a
                  href={specHref}
                  className="block rounded-sm border border-steel-300 bg-white px-2 py-1 font-mono text-helper text-steel-700 transition-colors duration-instant hover:border-steel-400 hover:text-steel-950"
                >
                  {chip}
                </a>
              </li>
            ))}
          </ul>
        )}
        {certChips && certChips.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {certChips.map((chip) => (
              <li key={chip}>
                <span className="inline-block rounded-sm border border-steel-200 bg-steel-100 px-2 py-1 font-mono text-helper text-steel-600">
                  ✓ {chip}
                </span>
              </li>
            ))}
          </ul>
        )}
        {/* data-rfq-anchor: header RFQ yields while this amber is in view (Datum 13, amber law) */}
        <div data-rfq-anchor className="mt-8">
          <Button variant="rfq" href={rfq.href}>
            {rfq.label}
          </Button>
        </div>

        {/* §11 signature: the datum draws itself on product-page load */}
        <div className="mt-10">
          {dimensionLabel && (
            <div className="pb-2">
              <DimensionLabel label={dimensionLabel} animate />
            </div>
          )}
          <DatumRule animate />
          {photo && (
            <div className="mt-2 aspect-video w-full overflow-hidden bg-steel-100">{photo}</div>
          )}
        </div>
      </div>
    </section>
  )
}
