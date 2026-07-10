// HomeHero — Datum §19, graphite variant.
// One message, no rotation (carousels banned system-wide). Caption eyebrow →
// display-xl H1 (≤10 words, what we make and to what codes — the real
// qualifier, not a slogan) → body-lg subhead (materials + sectors) → CTA pair
// (amber RFQ + one secondary; §13: on graphite RFQ stays accent) → full-bleed
// graded photograph framed by the datum-line motif carrying a true dimension
// label (§11 signature: line draws, tick drops, label counts up). Beneath:
// the stats band — proof in the first viewport.
// Photograph is real or absent — never stock; absent skips the photo band.

import { Button } from './Button'
import { DatumRule } from './DatumRule'
import { DimensionLabel } from './DimensionLabel'
import { StatBand, type Stat } from './StatBand'

export interface HeroCta {
  label: string
  href: string
}

export interface HomeHeroProps {
  /** Caption eyebrow: "ASME U & U2 · IBR · Est. Vadodara" */
  eyebrow: string
  /** ≤ 10 words; the page H1 */
  headline: string
  /** Materials + sectors */
  subhead: string
  rfq: HeroCta
  secondary: HeroCta
  /** Real graded works photograph (full-bleed band); absent → no photo band */
  photo?: React.ReactNode
  /** True dimension for the datum frame, e.g. "Ø 3,600 mm" */
  dimensionLabel?: string
  /** Four figures, each sourced from the approved entity/capability record */
  stats?: Stat[]
  className?: never
}

export function HomeHero({
  eyebrow,
  headline,
  subhead,
  rfq,
  secondary,
  photo,
  dimensionLabel,
  stats,
}: HomeHeroProps): React.ReactElement {
  return (
    <section className="bg-steel-900">
      <div className="mx-auto max-w-wide px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-caption text-steel-400">{eyebrow}</p>
        <h1 className="mt-4 max-w-content font-display text-display-xl font-medium text-steel-50">
          {headline}
        </h1>
        <p className="mt-6 max-w-content text-body-lg text-steel-400">{subhead}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="rfq" href={rfq.href}>
            {rfq.label}
          </Button>
          <Button variant="secondary" onDark href={secondary.href}>
            {secondary.label}
          </Button>
        </div>
      </div>

      {photo && (
        <>
          {/* the datum-line motif frames the photograph, carrying a true dimension */}
          <div className="mx-auto max-w-wide px-6">
            {dimensionLabel && (
              <div className="pb-2">
                <DimensionLabel label={dimensionLabel} animate />
              </div>
            )}
            <DatumRule animate />
          </div>
          {/* full-bleed: photography bands alone may exceed the content widths (§7) */}
          <div className="mt-2 aspect-video w-full overflow-hidden bg-steel-800">
            {photo}
          </div>
        </>
      )}

      {stats && stats.length > 0 && (
        <div className="mx-auto max-w-wide px-6 pt-12">
          <StatBand stats={stats} onDark />
        </div>
      )}
      <div aria-hidden="true" className="pb-6" />
    </section>
  )
}
