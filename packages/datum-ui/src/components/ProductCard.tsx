// ProductCard — Datum §16.
// Flat, bordered, machined: white surface, 1px steel-200 border, radius 2px,
// 24px body padding, no shadow (§8). Hover: border deepens to steel-400 + the
// arrow glyph nudges 4px right (100ms) — never a floating-card lift.
// Anatomy: 4:3 photograph (graded per §2.1) → h3 title → one-line scope →
// mono spec chips (max 3) → arrow.
// oneLineScope is REQUIRED — a card that only names the product wastes the
// buyer's glance (Phase 1 §10: numbers are the copy). The digit rule itself is
// enforced at the CMS layer (Product.oneLineScope Zod regex).

import { ArrowRight } from './glyphs'

export interface ProductCardProps {
  name: string
  /** Mandatory (§16): "Shell & tube, ASME U/U2, up to 250 T" — no numberless render */
  oneLineScope: string
  href: string
  /** Real works photograph filling the 4:3 frame (pass next/image from pages).
      Absent → the no-photo variant: text-only card, never a stock placeholder. */
  photo?: React.ReactNode
  /** Mono spec chips, max 3 rendered (§16) */
  chips?: string[]
  className?: never
}

export function ProductCard({
  name,
  oneLineScope,
  href,
  photo,
  chips,
}: ProductCardProps): React.ReactElement {
  return (
    <a
      href={href}
      className="group block h-full rounded-sm border border-steel-200 bg-white transition-colors duration-instant ease-standard hover:border-steel-400"
    >
      {photo && <div className="aspect-4/3 w-full overflow-hidden bg-steel-100">{photo}</div>}
      <div className="p-6">
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
        <span className="mt-4 block text-steel-500 transition-transform duration-instant ease-standard group-hover:text-steel-950 motion-safe:group-hover:translate-x-1">
          <ArrowRight size={20} />
        </span>
      </div>
    </a>
  )
}
