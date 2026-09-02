// PageHero — Datum §19, interior/utility variant (full rebuild, Phase 11).
// Decision 2: "Unchanged by this decision — full-bleed photo, graduated
// scrim (0.35→0.82), breadcrumb on the photo, per `1d`. The canvas's own
// `1f` commentary explicitly confirms this: 'keeping 1d everywhere else.'"
// The old light/no-photo-ground shape (bg-steel-50 band, photo as an inline
// child below the text) is retired — full-bleed photo-as-ground + scrim +
// centered content + breadcrumb-on-photo, same family as ProductHero but
// centered rather than lower-left. H1 carries the real qualifier; proof
// belongs in the page body (§20 components), not here — deliberately no CTA
// pair, unlike the pre-split-era shared hero anatomy this spec descends
// from: no current consumer needs one, and PageHero's own job stops at
// "state the page's claim," not convert.
//
// Anatomy — position:relative, min-height 440/520/620px (<768/768-1023/
// ≥1024, §3's responsive table — flagged IMPLEMENTATION INFERENCE per
// Phase 22's governance note, not directly canvas-verified for this hero):
//   photo layer   absolute inset-0, object-cover; no photo → the §4.2 hatch
//                 placeholder (never a stock image; the scrim still applies
//                 regardless — §4.1 rule 4, never flat/absent).
//   scrim layer   absolute inset-0, var(--overlay-hero-interior) — the
//                 "interior" scrim (not ProductHero's plain --overlay-hero).
//   content layer flex-col justify-end, max-w-wide, pb-20:
//     breadcrumb (interior pages only, ON the photo, → separator in
//     accent-dark, §10 rule 10) → 64×2px accent rule → eyebrow (text-body
//     font-bold text-white, title case — NOT tracked; this rewrite closes
//     out the eyebrow's held-back tracking-caption CONVERT site from
//     Phase 3) → H1 (text-display, unchanged from the pre-rebuild value —
//     Decision 2 doesn't re-specify PageHero's H1 size, and "unchanged by
//     this decision" reads as license to keep it, not to silently bump it
//     to the older shared-anatomy notes' text-display-xl) → lead (text-
//     body-lg text-white/82 — unchanged, NOT Hero C's /72; only HomeHero's
//     eyebrow/body opacities changed).
//
// ExplodedSequence (Decision 6): the JSDoc guard lives on `photo` below —
// this hero's full-bleed, unconstrained-photo-ground pattern is structurally
// where that guard actually applies (unlike Hero C's HomeHero, which has no
// photo-ground slot at all).
//
// No-photo fallback is not a theoretical case: every one of this
// component's ~16 current consumers passes no `photo` today (verified by
// reading them) — the hatch placeholder is what most of the site will
// actually show immediately after this rebuild, not an edge case.

import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs'

export interface PageHeroProps {
  /** Interior pages carry breadcrumbs (§17), rendered ON the photo */
  breadcrumbs?: BreadcrumbItem[]
  /** Title case, NOT tracked/uppercase — e.g. "Company" */
  eyebrow?: string
  title: string
  /** Lead paragraph (body-lg) */
  lead?: string
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

export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  photo,
}: PageHeroProps): React.ReactElement {
  return (
    <section className="relative min-h-page-hero md:min-h-page-hero-md lg:min-h-page-hero-lg">
      <div aria-hidden="true" className="absolute inset-0">
        {photo ?? <HatchPlaceholder />}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: 'var(--overlay-hero-interior)' }}
      />
      {/* data-chrome='dark': the breadcrumb link needs the -dark accent step
          to clear 3:1 — the scrim's bottom stop (rgba(0,0,0,.82)) drives the
          effective ground at least as dark as steel-950, where plain accent
          already fails (2.85:1, the same finding this plan fixed everywhere
          else). Not in the plan's own data-chrome coverage table, but the
          same mechanism applies — treated as a mechanical necessity, same
          class as every other dark-surface fix this session. */}
      <div
        data-chrome="dark"
        className="relative mx-auto flex min-h-page-hero max-w-wide flex-col justify-end px-6 pb-20 md:min-h-page-hero-md lg:min-h-page-hero-lg"
      >
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} onDark />}
        <div className="mt-6 w-16 bg-accent" style={{ height: 2 }} aria-hidden="true" />
        {eyebrow && <p className="mt-6 text-body font-bold text-white">{eyebrow}</p>}
        <h1 className="mt-4 max-w-content font-display text-display font-medium text-white">
          {title}
        </h1>
        {lead && <p className="mt-6 max-w-content text-body-lg text-white/82">{lead}</p>}
      </div>
    </section>
  )
}
