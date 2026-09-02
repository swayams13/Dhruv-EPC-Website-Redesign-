// ProductHero — Datum §19/§2.2, photo-as-ground, `align="lower-left"`
// (full rebuild, Phase 12). Decision 2: ProductHero is one of the two tiers
// Hero C leaves untouched (`PageHero` = center, `ProductHero` = lower-left)
// — same photo-ground/scrim/content-layer family as `PageHero`, but
// bottom-left anchored instead of centered, and carrying the full
// breadcrumb trail rather than PageHero's interior-only breadcrumb.
//
// Anatomy — position:relative, min-height 440/520/620px (<768/768-1023/
// ≥1024, same `min-h-page-hero*` tokens as PageHero — IMPLEMENTATION_NOTES
// §2.2's shared shape, same family per PageHero's own docstring):
//   photo layer   absolute inset-0, object-cover; no photo → the §4.2 hatch
//                 placeholder (never a stock image).
//   scrim layer   absolute inset-0, var(--overlay-hero) — the plain hero
//                 scrim, not PageHero's `--overlay-hero-interior`.
//   content layer flex-col justify-end (lower-left: no centering), pb-12,
//                 data-chrome="dark" (breadcrumb link needs the -dark accent
//                 step to clear 3:1 against the scrim's ~steel-950-dark
//                 bottom stop, same mechanism as PageHero/HomeHero):
//     full breadcrumb trail (→ separator accent-dark, §10 rule 10) →
//     64×2px accent rule → H1 (text-display, 56px — NOT text-display-xl,
//     Decision 2's exact verified value for the lower-left tier).
// Below the photo: a light `bg-steel-50` band (unchanged retheme-only, ref
// `1c`) carrying the value statement, spec chips (anchor into the spec
// table — engineers jump, §21), cert chips and the RFQ button.
//
// The `DatumRule` + `DimensionLabel` §11 signature moment MOVES OFF this
// hero onto `SpecRail` (Phase 8 added `DatumRule`; this phase adds
// `DimensionLabel` alongside it) — it now labels real spec-rail data
// instead of decorating the hero, per IMPLEMENTATION_NOTES §2.2/§2.7.
//
// ExplodedSequence (Decision 6): the JSDoc guard lives on `photo` below —
// this hero's full-bleed, fixed-min-height photo-ground pattern is exactly
// where the guard applies, same reasoning as PageHero.

import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'
import { Button } from './Button'

export interface ProductHeroProps {
  /** Full trail, rendered ON the photo (unlike PageHero, always shown) */
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
  /** Real photograph, absolute inset-0 object-cover ground layer — must
   *  bring its own sizing (next/image `fill` + `object-cover`). Ordinary
   *  photography only: `<ExplodedSequence>` needs its own in-flow,
   *  unconstrained-height section and must never be passed here (Decision
   *  6) — this hero's fixed min-height clips/breaks its sticky scroll
   *  track. Absent renders the §4.2 hatch placeholder, never a stock image. */
  photo?: React.ReactNode
  className?: never
}

function HatchPlaceholder(): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full bg-steel-950"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 10px)',
      }}
    />
  )
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
}: ProductHeroProps): React.ReactElement {
  return (
    <section>
      <div className="relative min-h-page-hero md:min-h-page-hero-md lg:min-h-page-hero-lg">
        <div aria-hidden="true" className="absolute inset-0">
          {photo ?? <HatchPlaceholder />}
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: 'var(--overlay-hero)' }}
        />
        <div
          data-chrome="dark"
          className="relative mx-auto flex min-h-page-hero max-w-wide flex-col justify-end px-6 pb-12 md:min-h-page-hero-md lg:min-h-page-hero-lg"
        >
          <Breadcrumbs items={breadcrumbs} onDark />
          <div className="mt-6 w-16 bg-accent" style={{ height: 2 }} aria-hidden="true" />
          <h1 className="mt-4 max-w-content font-display text-display font-medium text-white">
            {title}
          </h1>
        </div>
      </div>

      <div className="border-b border-steel-200 bg-steel-50">
        <div className="mx-auto max-w-wide px-6 py-12">
          <p className="max-w-content text-body-lg text-steel-600">{valueStatement}</p>
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
        </div>
      </div>
    </section>
  )
}
