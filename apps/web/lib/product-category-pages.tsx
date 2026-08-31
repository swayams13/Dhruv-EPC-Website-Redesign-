// Product category tier — VG-012 R3. Two factories, shared between
// dhruv-epc and precise-engineers so both companies stay one implementation:
//   productCategoryIndexPage(companySlug)   → /{company}/products/
//   productCategoryListingPage(companySlug) → /{company}/products/[category]/
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import { CategoryCard, MobileBottomBar, PageHero, ProductCard } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import type { CompanySlug } from '@vedanta/schemas'
import { RFQBand } from '../components/RFQBand'
import { getProductCategoriesByCompany, getProductsByCompany, whatsappHref, phoneHref, getEntity } from './content-loader'
import { BASE } from './site'
import { categoryHref, companyHref, productHref, productsIndexHref, rfqHref } from './product-urls'
import {
  companyLabel,
  companyRfqSlug,
  productCategoryIndexPageData,
  productCategoryListingPageData,
} from './product-category-pages-data'

export function productCategoryIndexPage(companySlug: CompanySlug) {
  const label = companyLabel(companySlug)
  const { metadata } = productCategoryIndexPageData(companySlug)

  function Page(): ReactElement {
    const categories = getProductCategoriesByCompany(companySlug)
    const entity = getEntity(companySlug)

    const breadcrumbs = [{ label, href: companyHref(companySlug) }, { label: 'Products' }]
    const jsonLd = buildBreadcrumbList([
      { name: label, url: `${BASE}${companyHref(companySlug)}` },
      { name: 'Products', url: `${BASE}${productsIndexHref(companySlug)}` },
    ])

    return (
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <PageHero
          breadcrumbs={breadcrumbs}
          eyebrow="Products"
          title={`${label} product categories`}
          lead="Every category groups individually specified products — spec table, materials, codes and FAQs, one page per product."
        />

        <section className="mx-auto max-w-wide px-6 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                oneLineScope={category.oneLineScope}
                href={categoryHref(companySlug, category.slug)}
                productCount={category.productSlugs.length}
              />
            ))}
          </div>
        </section>

        <RFQBand company={companyRfqSlug(companySlug)} whatsappHref={whatsappHref(entity)} />
      </main>
    )
  }

  return { metadata, Page }
}

export function productCategoryListingPage(companySlug: CompanySlug) {
  const label = companyLabel(companySlug)
  const { generateStaticParams, generateMetadata } = productCategoryListingPageData(companySlug)

  function Page({ params }: { params: { category: string } }): ReactElement {
    const category = getProductCategoriesByCompany(companySlug).find((c) => c.slug === params.category)
    if (!category) notFound()

    const entity = getEntity(companySlug)
    const products = getProductsByCompany(companySlug).filter((p) => p.categorySlug === category.slug)

    const breadcrumbs = [
      { label, href: companyHref(companySlug) },
      { label: 'Products', href: productsIndexHref(companySlug) },
      { label: category.name },
    ]
    const jsonLd = buildBreadcrumbList([
      { name: label, url: `${BASE}${companyHref(companySlug)}` },
      { name: 'Products', url: `${BASE}${productsIndexHref(companySlug)}` },
      { name: category.name, url: `${BASE}${categoryHref(companySlug, category.slug)}` },
    ])

    return (
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <PageHero breadcrumbs={breadcrumbs} eyebrow="Products" title={category.name} lead={category.oneLineScope} />

        <section className="mx-auto max-w-wide px-6 py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                oneLineScope={product.oneLineScope}
                href={productHref(companySlug, category.slug, product.slug)}
                chips={product.page?.heroChips?.slice(0, 3) ?? product.codes.slice(0, 3)}
              />
            ))}
          </div>
        </section>

        <RFQBand company={companyRfqSlug(companySlug)} whatsappHref={whatsappHref(entity)} />

        <MobileBottomBar
          phoneHref={phoneHref(entity)}
          whatsappHref={whatsappHref(entity)}
          rfqHref={rfqHref(companyRfqSlug(companySlug))}
        />
      </main>
    )
  }

  return { generateStaticParams, generateMetadata, Page }
}
