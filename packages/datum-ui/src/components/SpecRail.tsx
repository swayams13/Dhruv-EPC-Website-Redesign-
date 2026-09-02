// SpecRail — INFERRED, not formally specced. Vedanta Product Page Directions.html
// direction 1c (the recommended "Structured Hybrid") names "SpecRail (sticky)" and
// "SectionNav" as implied new components in a one-line footnote, with no prop table,
// state list, or per-company variant spec — unlike CategoryCard/IndustryCard in
// Vedanta Component Specs.html, which get full sheets. This shape is inferred from:
//  - the mockup caption "Dhruv EPC · 360 px — rail collapses above the column, nav
//    becomes a sticky chip row, RFQ moves to a bottom bar" (mobile behavior)
//  - the direction notes: "Two RFQ buttons are visible at once (rail + header) —
//    resolved by the existing useRfqAnchorInView hook: the header yields while the
//    rail is in view" (dual-RFQ handling — reuses [data-rfq-anchor], no new hook call)
//  - "Same template, accent remapped... no structural change was needed for the
//    second company" (accent comes free from Button's variant="rfq", no company prop,
//    matching every other Datum component)
// Mirrors the existing AnchorRailMobile/AnchorRailDesktop split
// (apps/web/components/AnchorRail.tsx) for the mobile/desktop DOM-position problem,
// per CLAUDE.md's ambiguity protocol step 2 ("check how an existing component solved
// the same problem — consistency > novelty"). Flagged in the PR as a design-review
// item: confirm this shape before it's replicated to other products in Session 7.
//
// §2.7 (Phase 8): gains the DatumRule tick device at the top of the box, and
// its caption is "Envelope at a glance" (was "Key figures") — ref `1c`.
//
// Phase 12: `DimensionLabel` joins `DatumRule` here — the §11 signature
// moment (line draws, tick drops, dimension counts up) moved off
// `ProductHero` onto this rail per IMPLEMENTATION_NOTES §2.2/§2.7, so it
// now labels real spec-rail data instead of decorating the hero.

import { Button } from './Button'
import { DatumRule } from './DatumRule'
import { DimensionLabel } from './DimensionLabel'
import { Check, Triangle } from './glyphs'
import type { SpecTableRow } from './SpecTable'

export interface SpecRailCta {
  label: string
  href: string
}

export interface SpecRailProps {
  rows: SpecTableRow[]
  primaryCta: SpecRailCta
  secondaryCta?: SpecRailCta
  /** True dimension counted up by the §11 signature moment, e.g. "Ø 3,600 mm" */
  dimensionLabel?: string
  className?: never
}

function ProvenanceMark({ row }: { row: SpecTableRow }): React.ReactElement | null {
  if (!row.provenance) return null
  const sourced = row.provenance === 'sourced'
  return (
    <span
      className={`inline-flex items-center gap-1 text-helper ${
        sourced ? 'text-signal-success' : 'text-signal-warn'
      }`}
    >
      {sourced ? <Check size={16} /> : <Triangle size={16} />}
      <span className="sr-only">{sourced ? 'Sourced' : 'Unverified'}</span>
    </span>
  )
}

function RailRow({ row }: { row: SpecTableRow }): React.ReactElement {
  return (
    <div className="border-b border-steel-200 py-3 last:border-b-0">
      <dt className="flex items-start justify-between gap-2 text-sm font-medium text-steel-600">
        <span>{row.param}</span>
        <ProvenanceMark row={row} />
      </dt>
      <dd className="font-mono text-data text-steel-950">
        {row.value}
        {row.unit && <span className="ml-1 text-helper text-steel-600">{row.unit}</span>}
        {row.note && (
          <span className="mt-1 block font-sans text-helper normal-case text-steel-500">
            {row.note}
          </span>
        )}
      </dd>
    </div>
  )
}

function CtaRow({
  primaryCta,
  secondaryCta,
}: {
  primaryCta: SpecRailCta
  secondaryCta?: SpecRailCta
}): React.ReactElement {
  return (
    // data-rfq-anchor: same yield contract as ProductHero/RFQBand (Datum §13,
    // amber law) — Header/MobileBottomBar hide their own RFQ CTA while this is
    // in view, so the rail's button never creates a second live accent element.
    <div data-rfq-anchor className="mt-4 flex flex-col items-stretch gap-2">
      <Button variant="rfq" href={primaryCta.href}>
        {primaryCta.label}
      </Button>
      {secondaryCta && (
        <Button variant="secondary" href={secondaryCta.href}>
          {secondaryCta.label}
        </Button>
      )}
    </div>
  )
}

/** Static block placed BEFORE the content grid, hidden on lg+. No CTA buttons —
    MobileBottomBar (already rendered globally) owns RFQ at this width, per the
    360px mockup caption ("RFQ moves to a bottom bar"). */
export function SpecRailMobile({
  rows,
  dimensionLabel,
}: {
  rows: SpecTableRow[]
  dimensionLabel?: string
}): React.ReactElement {
  return (
    <div className="mx-auto max-w-wide px-6 lg:hidden">
      <div className="mt-6 rounded-sm border border-steel-200 bg-white p-6">
        {dimensionLabel && (
          <div className="pb-2">
            <DimensionLabel label={dimensionLabel} animate />
          </div>
        )}
        <DatumRule animate />
        <p className="mt-4 text-xs font-medium uppercase tracking-caption text-steel-600">Envelope at a glance</p>
        <dl className="mt-3">
          {rows.map((row) => (
            <RailRow key={row.param} row={row} />
          ))}
        </dl>
      </div>
    </div>
  )
}

/** Sticky sidebar — place inside the lg:grid-cols-12 grid alongside
    AnchorRailDesktop, both hidden below lg. Native CSS sticky stacking pushes
    this rail below the nav's sticky box once both are pinned within a shared
    scroll ancestor — no extra offset math needed. */
export function SpecRailDesktop({
  rows,
  primaryCta,
  secondaryCta,
  dimensionLabel,
}: SpecRailProps): React.ReactElement {
  return (
    <div className="sticky top-24 mt-6 hidden rounded-sm border border-steel-200 bg-white p-6 lg:block">
      {dimensionLabel && (
        <div className="pb-2">
          <DimensionLabel label={dimensionLabel} animate />
        </div>
      )}
      <DatumRule animate />
      <p className="mt-4 text-xs font-medium uppercase tracking-caption text-steel-600">Envelope at a glance</p>
      <dl className="mt-3">
        {rows.map((row) => (
          <RailRow key={row.param} row={row} />
        ))}
      </dl>
      <CtaRow primaryCta={primaryCta} {...(secondaryCta ? { secondaryCta } : {})} />
    </div>
  )
}
