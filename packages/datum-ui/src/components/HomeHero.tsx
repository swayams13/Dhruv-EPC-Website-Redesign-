// HomeHero — Datum §19, Hero C split (Decision 2, rewritten Phase 9,
// responsive stacking added Phase 10).
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
// Responsive stacking (<md, Phase 10 — its own commit per explicit
// instruction, no source specifies the exact stacked treatment, every
// value below is IMPLEMENTATION INFERENCE requiring visual validation):
//   - <md: type panel first (content before image — reading order + LCP
//     priority), photo panel second, natural/auto height (no fixed
//     600/560px — that only applies md+, where it also switches display
//     from flex to grid so the 47fr/53fr inline style below takes effect;
//     grid-template-columns is simply inert while display isn't grid).
//   - Mobile photo crop is 4:3 (not the desktop 4:5 portrait) — over-crops
//     the subject otherwise. A real per-photo mobile crop needs an actual
//     asset, not a CSS reflow of the same image, hence `photoMobile` as
//     its own slot (falls back to `photo` if only one asset exists, which
//     is all that exists anywhere in this codebase today).
//   - Datum-rule + dimension label: already a child of the photo panel's
//     own wrapper (absolutely positioned relative to IT, not the page), so
//     stacking the photo panel below the type panel carries them along for
//     free — no separate repositioning logic needed.
//   - Breadcrumb wrap, CTA wrap, long eyebrow/title wrap: already handled
//     by Phase 9's flex-wrap on both rows and the absence of any
//     white-space:nowrap — carried over unchanged, re-verified at 320px.

import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'
import { Button } from './Button'
import { DatumRule } from './DatumRule'
import { DimensionLabel } from './DimensionLabel'

export interface HeroCta {
  label: string
  href: string
}

function HatchPlaceholder(): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full bg-steel-900"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(255,255,255,.035) 0 1px, transparent 1px 10px)',
      }}
    />
  )
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
  /** Portrait 4:5 photo filling the photo panel at md+ — a plain grid-cell
   *  child, not a photo-ground layer, so it must bring its own sizing
   *  (next/image `fill` + `object-cover`, or an `h-full w-full` wrapper).
   *  Absent renders the §4.2 hatch placeholder — never a stock image. */
  photo?: React.ReactNode
  /** 4:3 crop for <md (Phase 10) — a real, separately-cropped asset, not
   *  the same image reflowed. Falls back to `photo` if omitted. Must bring
   *  its own `h-full w-full object-cover` sizing, same as `photo`. */
  photoMobile?: React.ReactNode
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
  photoMobile,
  dimensionLabel,
}: HomeHeroProps): React.ReactElement {
  return (
    <section
      className={`flex flex-col md:grid ${
        breadcrumb ? 'md:h-hero-split-company' : 'md:h-hero-split-group'
      }`}
      style={{ gridTemplateColumns: '47fr 53fr' }}
    >
      {/* Type panel — 47% at md+, natural height stacked first below it.
          data-chrome='dark': breadcrumb link + both CTAs need the -dark
          accent step to clear 3:1 on steel-900 (new requirement this
          revision, data-chrome coverage table). */}
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

      {/* Photo panel — 53% at md+, stacked second below md. No scrim, no
          gradient, no type over it — the headline difference from every
          other hero. Two crops: 4:3 <md, 4:5 portrait md+ (Decision 2). */}
      <div className="relative">
        <div className="aspect-4/3 w-full md:hidden">
          {photoMobile ?? photo ?? <HatchPlaceholder />}
        </div>
        <div className="hidden h-full w-full md:block">{photo ?? <HatchPlaceholder />}</div>
        {/* Datum-rule + dimension label pinned to the bottom of the photo
            panel specifically — not the type panel, not the page (Decision
            2). Already a child of this wrapper, so it stacks with the
            photo panel for free below md, no separate repositioning. */}
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
