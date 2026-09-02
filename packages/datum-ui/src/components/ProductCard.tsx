// ProductCard — Datum §16, retheme per IMPLEMENTATION_NOTES §2.4.
// Flat, bordered, machined: white surface, 1px steel-200 border, radius 2px,
// 24px body padding, no shadow at rest (§8). Hover: border deepens to accent
// + shadow-hover + the affordance nudges 4px right (100ms) — never a
// floating-card lift (no scale/translate on the card itself).
// Anatomy: 4:3 photograph (graded per §2.1) → h3 title → one-line scope →
// mono spec chips (max 3) → "Learn More ↗" affordance (§10 rule 11 — the
// client's own pattern, not a bare arrow glyph).
// onDark: dark steel-900 card with accent-border hover (premium industrial grid).
// layout="spec" (ref `1j`): the no-photo device for lines the shoot doesn't
// cover — deliberate, not a fallback that looks broken. 3px accent top
// border (§2.9's "card tier rule", 32×3px — CategoryCard's own bg-accent bar
// is the same device in a different shape, kept visually distinct on
// purpose per §2.4 so the two tiers don't collide), a 3-row <dl> of spec
// figures, and an "NN / NN" mono index. Figures/index are the caller's
// responsibility (this component has no CMS/schema knowledge) — pass the
// product's `rail: true` rows and a formatted index string.
// oneLineScope is REQUIRED — a card that only names the product wastes the
// buyer's glance (Phase 1 §10: numbers are the copy). The digit rule itself is
// enforced at the CMS layer (Product.oneLineScope Zod regex).

import { ArrowRight } from './glyphs'

export interface ProductCardSpecRow {
  label: string
  value: string
}

export interface ProductCardProps {
  name: string
  /** Mandatory (§16): "Shell & tube, ASME U/U2, up to 250 T" — no numberless render */
  oneLineScope: string
  href: string
  /** `photo` (default): 4:3 photograph is the hero device.
   *  `spec` (ref `1j`): no photo slot — a 3-row spec `<dl>` + index instead. */
  layout?: 'photo' | 'spec'
  /** Real works photograph filling the 4:3 frame (pass next/image from pages).
      Absent → the no-photo variant: text-only card, never a stock placeholder.
      Ignored when layout="spec". */
  photo?: React.ReactNode
  /** §12 domain icon (pass <DomainIcon size={32} />) — interim visual for the
      no-photo variant until the works shoot (2026-07-16, ui-ux-review §5).
      Ignored when photo is present or layout="spec"; steel-500 per §12's
      default icon color. */
  icon?: React.ReactNode
  /** Mono spec chips, max 3 rendered (§16). Ignored when layout="spec". */
  chips?: string[]
  /** layout="spec" only — exactly 3 rows rendered, per `1j`. */
  specRows?: ProductCardSpecRow[]
  /** layout="spec" only — mono position index, e.g. "03 / 12". */
  index?: string
  /** Dark ground variant — steel-900 card, accent-border hover (§T-2) */
  onDark?: boolean
  className?: never
}

function Affordance({ onDark }: { onDark: boolean }): React.ReactElement {
  return (
    <span
      className={`mt-4 flex items-center gap-1 text-body font-semibold ${onDark ? 'text-accent-dark' : 'text-accent'}`}
    >
      Learn More
      <span className="transition-transform duration-instant ease-standard motion-safe:group-hover:translate-x-1">
        <ArrowRight size={20} />
      </span>
    </span>
  )
}

export function ProductCard({
  name,
  oneLineScope,
  href,
  layout = 'photo',
  photo,
  icon,
  chips,
  specRows,
  index,
  onDark = false,
}: ProductCardProps): React.ReactElement {
  if (layout === 'spec') {
    const rows = (specRows ?? []).slice(0, 3)
    if (onDark) {
      return (
        <a
          href={href}
          className="group block h-full rounded-sm border border-steel-800 bg-steel-900 transition-colors duration-fast ease-standard hover:border-accent"
          style={{ borderTopWidth: 3, borderTopColor: 'var(--accent)' }}
        >
          <div className="p-6">
            <h3 className="font-display text-h3 font-semibold text-steel-50">{name}</h3>
            <p className="mt-2 text-sm text-steel-500">{oneLineScope}</p>
            {rows.length > 0 && (
              <dl className="mt-4 space-y-2">
                {rows.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-steel-500">{row.label}</dt>
                    <dd className="font-mono text-data text-steel-100">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {index && <p className="mt-4 font-mono text-helper text-steel-500">{index}</p>}
            <Affordance onDark />
          </div>
        </a>
      )
    }
    return (
      <a
        href={href}
        className="group block h-full rounded-sm border border-steel-200 bg-white transition-colors duration-instant ease-standard hover:border-accent hover:shadow-hover"
        style={{ borderTopWidth: 3, borderTopColor: 'var(--accent)' }}
      >
        <div className="p-6">
          <h3 className="font-display text-h3 font-semibold text-steel-950">{name}</h3>
          <p className="mt-2 text-sm text-steel-600">{oneLineScope}</p>
          {rows.length > 0 && (
            <dl className="mt-4 space-y-2">
              {rows.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm text-steel-600">{row.label}</dt>
                  <dd className="font-mono text-data text-steel-950">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {index && <p className="mt-4 font-mono text-helper text-steel-600">{index}</p>}
          <Affordance onDark={false} />
        </div>
      </a>
    )
  }

  if (onDark) {
    return (
      <a
        href={href}
        className="group block h-full rounded-sm border border-steel-800 bg-steel-900 transition-colors duration-fast ease-standard hover:border-accent"
      >
        {photo && <div className="aspect-4/3 w-full overflow-hidden bg-steel-800">{photo}</div>}
        <div className="p-6">
          {!photo && icon && (
            <span aria-hidden="true" className="mb-4 block text-steel-500">
              {icon}
            </span>
          )}
          <h3 className="font-display text-h3 font-semibold text-steel-50">{name}</h3>
          <p className="mt-2 text-sm text-steel-500">{oneLineScope}</p>
          {chips && chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {chips.slice(0, 3).map((chip) => (
                <li
                  key={chip}
                  className="rounded-sm border border-steel-700 bg-steel-800 px-2 py-1 font-mono text-helper text-steel-400"
                >
                  {chip}
                </li>
              ))}
            </ul>
          )}
          <Affordance onDark />
        </div>
      </a>
    )
  }

  return (
    <a
      href={href}
      className="group block h-full rounded-sm border border-steel-200 bg-white transition-colors duration-instant ease-standard hover:border-accent hover:shadow-hover"
    >
      {photo && <div className="aspect-4/3 w-full overflow-hidden bg-steel-100">{photo}</div>}
      <div className="p-6">
        {!photo && icon && (
          <span aria-hidden="true" className="mb-4 block text-steel-500">
            {icon}
          </span>
        )}
        <h3 className="font-display text-h3 font-semibold text-steel-950">{name}</h3>
        <p className="mt-2 text-sm text-steel-600">{oneLineScope}</p>
        {chips && chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {chips.slice(0, 3).map((chip) => (
              <li
                key={chip}
                className="rounded-sm border border-steel-200 bg-steel-50 px-2 py-1 font-mono text-helper text-steel-700"
              >
                {chip}
              </li>
            ))}
          </ul>
        )}
        <Affordance onDark={false} />
      </div>
    </a>
  )
}
