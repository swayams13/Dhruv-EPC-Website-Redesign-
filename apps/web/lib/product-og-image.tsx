// Shared product OG image — VG-012 R7. Collapses the 17 per-product
// opengraph-image.tsx routes (satori/next-og, identical layout, differing
// only by headline/chip strings) into one dynamic file per company.
//
// Also fixes the primitive-import violation the pre-development review
// flagged: the old files imported `brand`/`flex` raw from @vedanta/tokens,
// bypassing the semantic per-company theming layer (CLAUDE.md's "Company
// theming is a CSS-variable scope, never a raw value in a component" rule,
// applied here to the one rendering context — next/og's edge satori runtime
// — where a CSS var genuinely can't be used and a resolved value is
// required). Routing through semanticByCompany means an accent change only
// needs editing in one place, not 17.
import { ImageResponse } from 'next/og'
import { semanticByCompany } from '@vedanta/tokens'
import type { CompanySlug, Product } from '@vedanta/schemas'
import { getProductsByCompany } from './content-loader'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function companyLabel(companySlug: CompanySlug): string {
  return companySlug === 'dhruv-epc' ? 'Dhruv EPC' : 'Precise Engineers'
}

function semanticFor(companySlug: CompanySlug) {
  return companySlug === 'dhruv-epc' ? semanticByCompany.dhruv : semanticByCompany.precise
}

export function productOgImage(companySlug: CompanySlug) {
  function generateStaticParams(): { category: string; slug: string }[] {
    return getProductsByCompany(companySlug).map((p) => ({ category: p.categorySlug, slug: p.slug }))
  }

  function findProduct(category: string, slug: string): Product | undefined {
    return getProductsByCompany(companySlug).find((p) => p.categorySlug === category && p.slug === slug)
  }

  // Next's file-based opengraph-image convention requires `alt` as a static
  // export, not a per-params function (that needs generateImageMetadata,
  // a different multi-image API this single-image-per-route case doesn't
  // need) — company-level text here, the per-product headline is in the image.
  const alt = `${companyLabel(companySlug)} — product specification`

  function Image({ params }: { params: { category: string; slug: string } }) {
    const product = findProduct(params.category, params.slug)
    const sem = semanticFor(companySlug)
    const eyebrow = product
      ? `${companyLabel(companySlug)} · ${(product.page?.certChips ?? []).slice(0, 3).join(' · ')}`
      : companyLabel(companySlug)
    const headline = product?.name ?? companyLabel(companySlug)
    const codeLine = product?.codes.slice(0, 3).join(' · ') ?? ''

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 64,
            backgroundColor: sem.color.surface.dark,
            color: sem.color.text.onDark,
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 28, color: sem.color.text.onDarkSecondary, textTransform: 'uppercase', letterSpacing: 4 }}>
              {eyebrow}
            </div>
            <div style={{ marginTop: 24, fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>{headline}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 64, height: 4, backgroundColor: sem.color.accent.default }} />
            <div style={{ fontSize: 36, fontFamily: 'monospace', color: sem.color.text.onDark }}>{codeLine}</div>
          </div>
        </div>
      ),
      size,
    )
  }

  return { generateStaticParams, alt, Image }
}
