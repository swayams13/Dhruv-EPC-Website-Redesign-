// /industries/[slug] — detail (Session 8, VG-020). Template order per
// blueprint §10: what the industry demands → applications → engineering
// considerations → products serving it → capabilities → FAQ → CTA.
// Content-gated — see industries/page.tsx and industry-capability-pages-data.ts.
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageHero, ProductCard } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage } from '@vedanta/schemas'
import { getCapabilities, getIndustries, getProductBySlug } from '../../../../lib/content-loader'
import { capabilityHref, companyHref, industryHref, industriesIndexHref, productHref } from '../../../../lib/product-urls'
import { companyLabel } from '../../../../lib/product-detail-page-data'
import { industryDetailPageData } from '../../../../lib/industry-capability-pages-data'
import { BASE } from '../../../../lib/site'

export const { generateStaticParams, generateMetadata } = industryDetailPageData()

export default function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const industry = getIndustries().find((i) => i.slug === params.slug)
  if (!industry) notFound()

  const products = industry.productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
  const capabilities = getCapabilities().filter((c) => industry.capabilitySlugs.includes(c.slug))

  const breadcrumbs = [
    { label: 'Vedanta Group', href: '/' },
    { label: 'Industries', href: industriesIndexHref() },
    { label: industry.name },
  ]

  const industriesUrl = `${BASE}${industriesIndexHref()}`
  const industryUrl = `${BASE}${industryHref(industry.slug)}`
  const jsonLd = [
    buildFAQPage(industry.faqs),
    buildBreadcrumbList([
      { name: 'Vedanta Group', url: BASE },
      { name: 'Industries', url: industriesUrl },
      { name: industry.name, url: industryUrl },
    ]),
  ]

  return (
    <main>
      {jsonLd.map((ld) => (
        <script key={ld['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      {!industry.contentComplete && (
        <div className="mx-auto max-w-wide px-6 pt-6">
          <p className="rounded-sm border border-steel-200 bg-steel-50 px-4 py-3 text-helper text-steel-600">
            <span className="font-medium text-steel-950">Placeholder page</span> — narrative and evidence below
            are marked CONTENT REQUIRED pending sourced copy from Vedanta engineering. Noindex, excluded from
            the sitemap until content ships.
          </p>
        </div>
      )}

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Industry"
        title={industry.name}
        lead={industry.oneLineScope}
      />

      <div className="mx-auto flex max-w-wide flex-col gap-16 px-6 py-12">
        <section aria-labelledby="requirements-heading">
          <h2 id="requirements-heading" className="font-display text-h3 font-medium text-steel-950">
            What this sector demands
          </h2>
          <p className="mt-6 max-w-content text-body-lg text-steel-700">{industry.requirements}</p>
        </section>

        <section aria-labelledby="applications-heading">
          <h2 id="applications-heading" className="font-display text-h3 font-medium text-steel-950">
            Applications
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {industry.applications.map((a) => (
              <li key={a} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 text-sm text-steel-700">
                {a}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="engineering-heading">
          <h2 id="engineering-heading" className="font-display text-h3 font-medium text-steel-950">
            Engineering considerations
          </h2>
          <p className="mt-6 max-w-content text-body-lg text-steel-700">{industry.engineeringConsiderations}</p>
        </section>

        <section aria-labelledby="products-heading">
          <h2 id="products-heading" className="font-display text-h3 font-medium text-steel-950">
            Products serving this sector
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                name={product.name}
                oneLineScope={product.oneLineScope}
                href={productHref(product.companySlug, product.categorySlug, product.slug)}
                chips={product.codes.slice(0, 3)}
              />
            ))}
          </div>
        </section>

        {capabilities.length > 0 && (
          <section aria-labelledby="capabilities-heading">
            <h2 id="capabilities-heading" className="font-display text-h3 font-medium text-steel-950">
              Capabilities
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {capabilities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={capabilityHref(c.slug)}
                    className="block rounded-sm border border-steel-200 bg-white px-4 py-2 text-sm font-medium text-steel-950 transition-colors duration-fast hover:border-steel-400"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-display text-h3 font-medium text-steel-950">
            Frequently asked questions
          </h2>
          <div className="mt-6 flex flex-col divide-y divide-steel-200 border-y border-steel-200">
            {industry.faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="flex min-h-row cursor-pointer list-none items-center justify-between gap-4 text-data font-medium text-steel-950 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                </summary>
                <p className="mt-3 max-w-content text-sm text-steel-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="companies-heading" className="border-t border-steel-200 pt-16">
          <h2 id="companies-heading" className="font-display text-h3 font-medium text-steel-950">
            The companies
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {industry.companySlugs
              .filter((c): c is 'dhruv-epc' | 'precise-engineers' => c !== 'group')
              .map((c) => (
                <Link
                  key={c}
                  href={companyHref(c)}
                  className="block rounded-sm border border-steel-200 bg-white p-6 transition-colors duration-fast hover:border-steel-400"
                >
                  <p className="font-medium text-steel-950">{companyLabel(c)}</p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  )
}
