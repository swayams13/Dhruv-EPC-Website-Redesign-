// /capabilities/[slug] — detail (Session 8, VG-021). Envelope table is the
// ship gate (blueprint §11: "a capability without figures does not ship" —
// enforced by Capability.envelope.min(1) in packages/schemas/src/cms.ts).
// Content-gated — see capabilities/page.tsx.
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CapabilityEnvelopeTable, PageHero, ProductCard } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage } from '@vedanta/schemas'
import { getCapabilities, getProductBySlug } from '../../../../lib/content-loader'
import { capabilitiesIndexHref, capabilityHref, companyHref, productHref } from '../../../../lib/product-urls'
import { companyLabel } from '../../../../lib/product-detail-page-data'
import { capabilityDetailPageData } from '../../../../lib/industry-capability-pages-data'
import { BASE } from '../../../../lib/site'

export const { generateStaticParams, generateMetadata } = capabilityDetailPageData()

export default function CapabilityDetailPage({ params }: { params: { slug: string } }) {
  const capability = getCapabilities().find((c) => c.slug === params.slug)
  if (!capability) notFound()

  const products = capability.productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  const breadcrumbs = [
    { label: 'Vedanta Group', href: '/' },
    { label: 'Capabilities', href: capabilitiesIndexHref() },
    { label: capability.name },
  ]

  const capabilitiesUrl = `${BASE}${capabilitiesIndexHref()}`
  const capabilityUrl = `${BASE}${capabilityHref(capability.slug)}`
  const jsonLd = [
    buildFAQPage(capability.faqs),
    buildBreadcrumbList([
      { name: 'Vedanta Group', url: BASE },
      { name: 'Capabilities', url: capabilitiesUrl },
      { name: capability.name, url: capabilityUrl },
    ]),
  ]

  return (
    <main>
      {jsonLd.map((ld) => (
        <script key={ld['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      {!capability.contentComplete && (
        <div className="mx-auto max-w-wide px-6 pt-6">
          <p className="rounded-sm border border-steel-200 bg-steel-50 px-4 py-3 text-helper text-steel-600">
            <span className="font-medium text-steel-950">Placeholder page</span> — envelope figures below are
            marked CONTENT REQUIRED pending sourced data from Vedanta engineering. Noindex, excluded from the
            sitemap until content ships.
          </p>
        </div>
      )}

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Capability"
        title={capability.name}
        lead={`${capability.companySlugs.map(companyLabel).join(' · ')} process capability.`}
      />

      <div className="mx-auto flex max-w-wide flex-col gap-16 px-6 py-12">
        <section aria-labelledby="envelope-heading">
          <h2 id="envelope-heading" className="font-display text-h3 font-medium text-steel-950">
            Process envelope
          </h2>
          <div className="mt-6">
            <CapabilityEnvelopeTable rows={capability.envelope} caption={`${capability.name} — process envelope`} />
          </div>
        </section>

        {capability.equipmentList.length > 0 && (
          <section aria-labelledby="equipment-heading">
            <h2 id="equipment-heading" className="font-display text-h3 font-medium text-steel-950">
              Equipment
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {capability.equipmentList.map((e) => (
                <li key={e} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 text-sm text-steel-700">
                  {e}
                </li>
              ))}
            </ul>
          </section>
        )}

        {capability.standards.length > 0 && (
          <section aria-labelledby="standards-heading">
            <h2 id="standards-heading" className="font-display text-h3 font-medium text-steel-950">
              Standards
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {capability.standards.map((s) => (
                <li key={s} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {products.length > 0 && (
          <section aria-labelledby="products-heading">
            <h2 id="products-heading" className="font-display text-h3 font-medium text-steel-950">
              Products built with this capability
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
        )}

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-display text-h3 font-medium text-steel-950">
            Frequently asked questions
          </h2>
          <div className="mt-6 flex flex-col divide-y divide-steel-200 border-y border-steel-200">
            {capability.faqs.map((faq) => (
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
            {capability.companySlugs
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
