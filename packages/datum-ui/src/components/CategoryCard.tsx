// CategoryCard — Datum §16 family, product-category tier (VG-012).
// Same anatomy law as ProductCard (flat, bordered, machined — no shadow, §8)
// but this tier sits one rung above a product: the accent rule at the top
// is the only visual signal that distinguishes "this groups products" from
// "this is a product" — everything else (border, radius, padding, arrow
// nudge) is deliberately identical so the two tiers read as one family.
// Rule is 32×3px (§2.9's "card tier rule", formalized) — 3px has no spacing
// token, so height is set inline, same reasoning as Logo.tsx's size ladder.
// Kept as a filled bar (not ProductCard's layout="spec" border-top) so the
// two tiers' accent devices stay visually distinct, per §2.4.
// Thin state: a category with zero products (pre-launch, content pending)
// renders muted and non-interactive rather than linking to an empty index —
// an empty index page is a worse experience than no link at all.

import { ArrowRight } from './glyphs'

export interface CategoryCardProps {
  name: string
  /** Mandatory (§16 precedent): "Metallic, rubber and fabric expansion joints, 25–9,000 mm NB" */
  oneLineScope: string
  href: string
  /** Number of published products in this category — drives the thin state at 0 */
  productCount: number
  /** Dark ground variant — steel-900 card, accent-border hover (§T-2, ProductCard precedent) */
  onDark?: boolean
  className?: never
}

export function CategoryCard({
  name,
  oneLineScope,
  href,
  productCount,
  onDark = false,
}: CategoryCardProps): React.ReactElement {
  const thin = productCount === 0
  const countLabel = thin ? 'Coming soon' : `${productCount} ${productCount === 1 ? 'product' : 'products'}`

  if (onDark) {
    if (thin) {
      return (
        <div className="block h-full rounded-sm border border-steel-800 bg-steel-900 p-6 opacity-60">
          <span aria-hidden className="mb-4 block w-8 bg-steel-700" style={{ height: 3 }} />
          <h3 className="font-display text-h3 font-semibold text-steel-400">{name}</h3>
          <p className="mt-2 text-sm text-steel-600">{oneLineScope}</p>
          <p className="mt-4 font-mono text-helper text-steel-600">{countLabel}</p>
        </div>
      )
    }
    return (
      <a
        href={href}
        className="group block h-full rounded-sm border border-steel-800 bg-steel-900 p-6 transition-colors duration-fast ease-standard hover:border-accent"
      >
        <span aria-hidden className="mb-4 block w-8 bg-accent" style={{ height: 3 }} />
        <h3 className="font-display text-h3 font-semibold text-steel-50">{name}</h3>
        <p className="mt-2 text-sm text-steel-500">{oneLineScope}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="font-mono text-helper text-steel-400">{countLabel}</p>
          <span className="text-steel-400 transition-transform duration-instant ease-standard group-hover:text-accent motion-safe:group-hover:translate-x-1">
            <ArrowRight size={20} />
          </span>
        </div>
      </a>
    )
  }

  if (thin) {
    return (
      <div className="block h-full rounded-sm border border-steel-200 bg-steel-50 p-6 opacity-70">
        <span aria-hidden className="mb-4 block w-8 bg-steel-300" style={{ height: 3 }} />
        <h3 className="font-display text-h3 font-semibold text-steel-500">{name}</h3>
        <p className="mt-2 text-sm text-steel-500">{oneLineScope}</p>
        <p className="mt-4 font-mono text-helper text-steel-500">{countLabel}</p>
      </div>
    )
  }

  return (
    <a
      href={href}
      className="group block h-full rounded-sm border border-steel-200 bg-white p-6 transition-colors duration-instant ease-standard hover:border-accent"
    >
      <span aria-hidden className="mb-4 block w-8 bg-accent" style={{ height: 3 }} />
      <h3 className="font-display text-h3 font-semibold text-steel-950">{name}</h3>
      <p className="mt-2 text-sm text-steel-600">{oneLineScope}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-helper text-steel-700">{countLabel}</p>
        <span className="text-steel-500 transition-transform duration-instant ease-standard group-hover:text-accent motion-safe:group-hover:translate-x-1">
          <ArrowRight size={20} />
        </span>
      </div>
    </a>
  )
}
