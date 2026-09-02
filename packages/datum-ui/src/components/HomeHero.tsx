// HomeHero — Datum §19, Hero C split (Decision 2, rewritten Phase 9).
// `variant="split"` is the ONLY contract — `align`/`statsOverlay` never
// existed in code and are retired for good; do not reintroduce either.
//
// Anatomy — display:grid, 47fr/53fr, fixed height per homepage (600px group,
// 560px company — derived from whether `breadcrumb` is passed, since that
// correlates exactly with the two rungs per Decision 2's own scope table):
//   left panel  (47%, type, steel-900, data-chrome="dark")
//     optional breadcrumb (company homepages only) → 64×2px accent rule →
//     eyebrow (accent-dark, title case — NOT tracking-caption; this rewrite
//     closes out the eyebrow's held-back tracking-caption CONVERT site from
//     Phase 3) → H1 (text-display, 56px — NOT text-display-xl) → body copy
//     (white/72) → CTA pair (rfq + secondary, unchanged Button pattern)
//   right panel (53%, photo) — a PLAIN grid cell: no scrim, no gradient, no
//     type over it (the headline difference from every other hero in the
//     system). Datum-rule + dimension label pinned to its bottom. No photo →
//     the §4.2 hatch placeholder, never a stock image.
//
// What's deliberately NOT here: the stats band. Decision 2: "a separate,
// standalone light section immediately below the hero... never overlaid on
// the photo" — every homepage already renders (or, post Phase 13-15, will
// render) StatBand as its own sibling, light, outside this component. A
// `stats` prop doesn't belong on this contract at all — see Session 35
// (group)/page.tsx precedent, already standalone.
//
// ExplodedSequence (Decision 6): no guard needed on `photo` — Hero C's photo
// panel was never a photo-*ground* layer for it to conflict with in the
// first place, so there's nothing to warn callers off of here.
//
// Responsive stacking (<md) is Phase 10's own commit, deliberately not in
// this one — the grid below renders unconditionally.

import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'
import { Button } from './Button'
import { DatumRule } from './DatumRule'
import { DimensionLabel } from './DimensionLabel'

export interface HeroCta {
  label: string
  href: string
}

export interface HomeHeroProps {
  variant: 'split'
  /** Company homepages only (Dhruv, Precise) — the group home has none,
   *  being the top-level page. Presence also sets the panel height: 560px
   *  with a breadcrumb, 600px without (Decision 2's scope table). */
  breadcrumb?: BreadcrumbItem[]
  /** Title case, NOT tracked/uppercase — e.g. "ASME U & U2 · IBR · Est. Vadodara" */
  eyebrow: string
  /** ≤ 10 words; the page H1 */
  headline: string
  /** Materials + sectors */
  subhead: string
  rfq: HeroCta
  secondary: HeroCta
  /** Portrait 4:5 photo filling the photo panel — a plain grid-cell child,
   *  not a photo-ground layer, so it must bring its own sizing (next/image
   *  `fill` + `object-cover`, or an `h-full w-full` wrapper). Absent renders
   *  the §4.2 hatch placeholder — never a stock image. */
  photo?: React.ReactNode
  /** True dimension for the datum frame, e.g. "Ø 3,600 mm" */
  dimensionLabel?: string
  className?: never
}

export function HomeHero({
  breadcrumb,
  eyebrow,
  headline,
  subhead,
  rfq,
  secondary,
  photo,
  dimensionLabel,
}: HomeHeroProps): React.ReactElement {
  return (
    <section
      className={`grid ${breadcrumb ? 'h-hero-split-company' : 'h-hero-split-group'}`}
      style={{ gridTemplateColumns: '47fr 53fr' }}
    >
      {/* Type panel — 47%. data-chrome='dark': breadcrumb link + both CTAs
          need the -dark accent step to clear 3:1 on steel-900 (new
          requirement this revision, data-chrome coverage table). */}
      <div data-chrome="dark" className="flex flex-col justify-end bg-steel-900 px-6 py-12">
        {breadcrumb && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumb} onDark />
          </div>
        )}
        <div className="w-16 bg-accent" style={{ height: 2 }} aria-hidden="true" />
        <p className="mt-6 text-body font-bold text-accent-dark">{eyebrow}</p>
        <h1 className="mt-4 font-display text-display font-bold tracking-tight text-white">
          {headline}
        </h1>
        <p className="mt-6 text-body-lg text-white/72">{subhead}</p>
        {/* data-rfq-anchor: header RFQ yields while this accent is in view (§13, amber law) */}
        <div data-rfq-anchor className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="rfq" href={rfq.href}>
            {rfq.label}
          </Button>
          <Button variant="secondary" onDark href={secondary.href}>
            {secondary.label}
          </Button>
        </div>
      </div>

      {/* Photo panel — 53%, a plain grid cell. No scrim, no gradient, no
          type over it — the headline difference from every other hero. */}
      <div className="relative">
        {photo ?? (
          <div
            aria-hidden="true"
            className="h-full w-full bg-steel-900"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 10px)',
            }}
          />
        )}
        {/* Datum-rule + dimension label pinned to the bottom of the photo
            panel specifically — not the type panel, not the page (Decision 2). */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
          {dimensionLabel && (
            <div className="pb-2">
              <DimensionLabel label={dimensionLabel} animate onDark />
            </div>
          )}
          <DatumRule animate onDark />
        </div>
      </div>
    </section>
  )
}
