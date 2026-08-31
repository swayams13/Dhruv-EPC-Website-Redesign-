// Pure data half of the category-tier templates (VG-012) — no JSX, so it can
// be imported directly by vitest (metadata-uniqueness.test.ts). See
// product-detail-page-data.ts for why this split exists.
import type { Metadata } from 'next'
import type { CompanySlug } from '@vedanta/schemas'
import { getProductCategoriesByCompany } from './content-loader'
import { categoryHref, productsIndexHref } from './product-urls'

export function companyLabel(companySlug: CompanySlug): string {
  return companySlug === 'dhruv-epc' ? 'Dhruv EPC' : 'Precise Engineers'
}

export function companyRfqSlug(companySlug: CompanySlug): 'dhruv' | 'precise' {
  return companySlug === 'dhruv-epc' ? 'dhruv' : 'precise'
}

export function productCategoryIndexPageData(companySlug: CompanySlug) {
  const label = companyLabel(companySlug)
  const metadata: Metadata = {
    title: `Products — ${label}`,
    description: `Browse ${label}'s product categories, each linking through to individually specified products.`,
    alternates: { canonical: `${productsIndexHref(companySlug)}/` },
  }
  return { metadata }
}

export function productCategoryListingPageData(companySlug: CompanySlug) {
  const label = companyLabel(companySlug)

  function generateStaticParams(): { category: string }[] {
    return getProductCategoriesByCompany(companySlug).map((c) => ({ category: c.slug }))
  }

  function generateMetadata({ params }: { params: { category: string } }): Metadata {
    const category = getProductCategoriesByCompany(companySlug).find((c) => c.slug === params.category)
    if (!category) return {}
    return {
      title: `${category.name} — ${label}`,
      description: category.oneLineScope,
      alternates: { canonical: `${categoryHref(companySlug, category.slug)}/` },
    }
  }

  return { generateStaticParams, generateMetadata }
}
