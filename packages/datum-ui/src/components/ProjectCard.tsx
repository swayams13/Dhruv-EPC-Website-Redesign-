// ProjectCard — Datum §16.
// Photo → sector eyebrow ("Fertilizer · PSU") → title → metric strip: up to 3
// mono figures (weight, Ø, MOC) with caption labels. Metrics live on the card,
// not behind the click, because the metric IS the credibility.
// Labels render in the caption voice (12px) — §16's "11px labels" has no named
// step in the §5.2 scale; 12px caption is the nearest token (deviation noted).

import { ArrowRight } from './glyphs'

export interface ProjectMetric {
  label: string
  /** A figure with unit, mono-rendered: "212 T", "Ø 3,600 mm", "SA-516 Gr.70" */
  value: string
}

export interface ProjectCardProps {
  title: string
  /** Sector eyebrow, e.g. "Fertilizer · PSU" */
  sector: string
  href: string
  /** Real project photograph filling the 4:3 frame; absent → text-only variant */
  photo?: React.ReactNode
  /** Up to 3 rendered (§16) */
  metrics: ProjectMetric[]
  className?: never
}

export function ProjectCard({
  title,
  sector,
  href,
  photo,
  metrics,
}: ProjectCardProps): React.ReactElement {
  return (
    <a
      href={href}
      className="group block h-full rounded-sm border border-steel-200 bg-white transition-colors duration-instant ease-standard hover:border-steel-400"
    >
      {photo && <div className="aspect-4/3 w-full overflow-hidden bg-steel-100">{photo}</div>}
      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-caption text-steel-600">{sector}</p>
        <h3 className="mt-2 font-display text-h3 font-semibold text-steel-950">{title}</h3>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3 border-t border-steel-200 pt-4">
          {metrics.slice(0, 3).map((m) => (
            <div key={m.label}>
              <dt className="text-xs font-medium uppercase tracking-caption text-steel-500">
                {m.label}
              </dt>
              <dd className="mt-1 font-mono text-data text-steel-950">{m.value}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-4 block text-steel-500 transition-transform duration-instant ease-standard group-hover:text-steel-950 motion-safe:group-hover:translate-x-1">
          <ArrowRight size={20} />
        </span>
      </div>
    </a>
  )
}
