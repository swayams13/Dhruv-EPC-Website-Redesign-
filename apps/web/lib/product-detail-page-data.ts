// Pure data half of the product-detail template (VG-012) — no JSX, so it can
// be imported directly by vitest (metadata-uniqueness.test.ts) without
// hitting apps/web's tsconfig `jsx: "preserve"` (required for Next's own
// compiler, but unparseable by vite's transform outside of Next's build).
// product-detail-page.tsx imports this and adds the JSX Page component.
import type { Metadata } from 'next'
import type { CompanySlug, Product } from '@vedanta/schemas'
import { getProductsByCompany } from './content-loader'
import { productHref } from './product-urls'

export function companyLabel(companySlug: CompanySlug): string {
  return companySlug === 'dhruv-epc' ? 'Dhruv EPC' : 'Precise Engineers'
}

export function companyRfqSlug(companySlug: CompanySlug): 'dhruv' | 'precise' {
  return companySlug === 'dhruv-epc' ? 'dhruv' : 'precise'
}

export function findProduct(companySlug: CompanySlug, category: string, slug: string): Product | undefined {
  const product = getProductsByCompany(companySlug).find((p) => p.slug === slug)
  if (!product || product.categorySlug !== category) return undefined
  return product
}

export function productDetailPageData(companySlug: CompanySlug) {
  function generateStaticParams(): { category: string; slug: string }[] {
    return getProductsByCompany(companySlug).map((p) => ({ category: p.categorySlug, slug: p.slug }))
  }

  function generateMetadata({ params }: { params: { category: string; slug: string } }): Metadata {
    const product = findProduct(companySlug, params.category, params.slug)
    if (!product) return {}
    const canonical = `${productHref(companySlug, product.categorySlug, product.slug)}/`
    const title = product.page?.metaTitle ?? `${product.name} | ${companyLabel(companySlug)}`
    const description = product.page?.metaDescription ?? product.oneLineScope
    return { title, description, alternates: { canonical } }
  }

  return { generateStaticParams, generateMetadata }
}
