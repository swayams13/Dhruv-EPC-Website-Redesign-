// Shared product-detail template — VG-012 (session 5). Collapses the 17
// hand-forked page.tsx files (86% identical, ~2,950 lines) into one
// implementation, parameterized by companySlug and driven by the Product
// record's optional `page` block (packages/schemas/src/cms.ts). Markup and
// section order are a faithful port of the two "original" templates
// (heat-exchangers, metallic-bellows-expansion-joint) — this session does
// not redesign the product page (see session brief scoping note).
//
// As of Session 7, this factory renders every product — both companies —
// through the single golden layout introduced in Session 6 for Pressure
// Vessels (SpecRail sidebar + Inspection record section). There is no more
// forked/legacy render path.
//
// Each of the two thin app/{company}/products/[category]/[slug]/page.tsx
// files re-exports generateStaticParams/generateMetadata/default from the
// object this factory returns — Next.js only requires those bindings to
// exist in the route file, not to be declared inline there.
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import {
  ApprovalsMatrix,
  CertificationCard,
  ChevronDown,
  MobileBottomBar,
  ProductHero,
  SpecRailDesktop,
  SpecRailMobile,
  SpecTable,
} from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage, buildProduct } from '@vedanta/schemas'
import type { CompanySlug } from '@vedanta/schemas'
import { RFQBand } from '../components/RFQBand'
import { AnchorRailDesktop, AnchorRailMobile } from '../components/AnchorRail'
import {
  getApprovals,
  getCertifications,
  getEntity,
  getProductCategoriesByCompany,
  phoneHref,
  whatsappHref,
} from './content-loader'
import { BASE } from './site'
import { categoryHref, companyHref, productHref, productsIndexHref, rfqHref } from './product-urls'
import { companyLabel, companyRfqSlug, findProduct, productDetailPageData } from './product-detail-page-data'

const SECTIONS = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'types', label: 'Types & configurations' },
  { id: 'materials-codes', label: 'Materials & codes' },
  { id: 'fabrication-qa', label: 'Fabrication & QA' },
  { id: 'inspection-record', label: 'Inspection record' },
  { id: 'faq', label: 'FAQ' },
]

// Fallback QA strip for a product that hasn't been given page.qaSteps yet —
// generic enough not to invent a claim, specific enough not to look broken.
const GENERIC_QA_STEPS = [
  { step: 'Drawing & design', caption: 'Design calculations per the governing code' },
  { step: 'Material receipt', caption: 'Mill test certificates verified against indent' },
  { step: 'Fabrication', caption: 'Qualified welding/forming, stage inspections' },
  { step: 'NDT & inspection', caption: 'NDT and stage inspection per code and client ITP' },
  { step: 'Testing & dispatch', caption: 'Witnessed testing, final dossier, dispatch' },
]

export function productDetailPage(companySlug: CompanySlug) {
  const { generateStaticParams, generateMetadata } = productDetailPageData(companySlug)

  function Page({ params }: { params: { category: string; slug: string } }): ReactElement {
    const product = findProduct(companySlug, params.category, params.slug)
    if (!product) notFound()

    const entity = getEntity(companySlug)
    const category = getProductCategoriesByCompany(companySlug).find((c) => c.slug === product.categorySlug)
    const rfqCompany = companyRfqSlug(companySlug)
    const page = product.page
    const railRows = product.specTable.filter((r) => r.rail === true)
    // All approvals for the company — TPIA (Dhruv: LRS/BV/DNV) plus any
    // PSU/EPC approved-vendor records (Precise). ApprovalsMatrix groups by
    // entityClass and renders nothing for empty groups, so this is additive
    // per company. IBR (statutory) is already a Certification, rendered below.
    const approvals = getApprovals(product.companySlug)
    const certifications = getCertifications(product.companySlug)

    const breadcrumbs = [
      { label: companyLabel(product.companySlug), href: companyHref(product.companySlug) },
      { label: 'Products', href: productsIndexHref(product.companySlug) },
      ...(category ? [{ label: category.name, href: categoryHref(product.companySlug, category.slug) }] : []),
      { label: page?.breadcrumbLabel ?? product.name },
    ]

    const canonicalPath = productHref(product.companySlug, product.categorySlug, product.slug)
    const jsonLd = [
      buildProduct(product, entity),
      buildFAQPage(product.faqs),
      buildBreadcrumbList([
        { name: companyLabel(product.companySlug), url: `${BASE}${companyHref(product.companySlug)}` },
        { name: 'Products', url: `${BASE}${productsIndexHref(product.companySlug)}` },
        ...(category
          ? [{ name: category.name, url: `${BASE}${categoryHref(product.companySlug, category.slug)}` }]
          : []),
        { name: page?.breadcrumbLabel ?? product.name, url: `${BASE}${canonicalPath}` },
      ]),
    ]

    const qaSteps = page?.qaSteps && page.qaSteps.length > 0 ? page.qaSteps : GENERIC_QA_STEPS

    return (
      <main>
        {jsonLd.map((ld) => (
          <script
            key={ld['@type']}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}

        <ProductHero
          breadcrumbs={breadcrumbs}
          title={page?.heroTitle ?? product.name}
          valueStatement={page?.valueStatement ?? product.oneLineScope}
          chips={page?.heroChips && page.heroChips.length > 0 ? page.heroChips : product.codes.slice(0, 3)}
          specHref="#specifications"
          {...(page?.certChips && page.certChips.length > 0 ? { certChips: page.certChips } : {})}
          rfq={{
            label: 'Request a quote',
            href: rfqHref(rfqCompany, product.slug),
          }}
        />

        <AnchorRailMobile sections={SECTIONS} />
        <SpecRailMobile rows={railRows} />

        <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-12">
          <div className="flex flex-col gap-16 lg:col-span-8">
            <section id="specifications" aria-labelledby="spec-heading">
              <h2 id="spec-heading" className="font-display text-h3 font-medium text-steel-950">
                Specifications
              </h2>
              <div className="mt-6">
                <SpecTable rows={product.specTable} caption={page?.specCaption ?? `${product.name} capability`} />
              </div>
            </section>

            <section id="types" aria-labelledby="types-heading">
              <h2 id="types-heading" className="font-display text-h3 font-medium text-steel-950">
                Types &amp; configurations
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {product.types.map((t) => (
                  <div key={t.name} className="rounded-sm border border-steel-200 bg-white p-6">
                    <h3 className="text-h4 font-medium text-steel-950">{t.name}</h3>
                    <p className="mt-2 text-sm text-steel-700">{t.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="materials-codes" aria-labelledby="moc-heading">
              <h2 id="moc-heading" className="font-display text-h3 font-medium text-steel-950">
                Materials &amp; codes
              </h2>
              <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
                {page?.materialsHeading ?? 'Materials of construction'}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.materials.map((m) => (
                  <li
                    key={m}
                    className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700"
                  >
                    {m}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
                Design codes
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.codes.map((c) => (
                  <li
                    key={c}
                    className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </section>

            <section id="fabrication-qa" aria-labelledby="qa-heading">
              <h2 id="qa-heading" className="font-display text-h3 font-medium text-steel-950">
                Fabrication &amp; QA
              </h2>
              <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {qaSteps.map((s, i) => (
                  <li key={s.step} className="rounded-sm border border-steel-200 bg-white p-4">
                    <span className="font-mono text-h3 font-light leading-none text-steel-300">{i + 1}</span>
                    <h3 className="mt-1 text-sm font-medium text-steel-950">{s.step}</h3>
                    <p className="mt-1 text-helper text-steel-600">{s.caption}</p>
                  </li>
                ))}
              </ol>
              {page?.qaClosing && <p className="mt-4 text-helper text-steel-600">{page.qaClosing}</p>}
            </section>

            <section id="inspection-record" aria-labelledby="inspection-heading">
              <h2 id="inspection-heading" className="font-display text-h3 font-medium text-steel-950">
                Inspection record
              </h2>
              <div className="mt-6">
                <ApprovalsMatrix approvals={approvals} caption="Approvals & third-party inspection" />
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {certifications.map((c) => (
                  <CertificationCard
                    key={c.name}
                    name={c.name}
                    scopeStatement={c.scopeStatement}
                    issuer={c.issuer}
                    validFrom={c.validFrom}
                    {...(c.validTo ? { validTo: c.validTo } : {})}
                    {...(c.artifactUrl ? { artifactUrl: c.artifactUrl } : {})}
                  />
                ))}
              </div>
            </section>

            <section id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="font-display text-h3 font-medium text-steel-950">
                Frequently asked questions
              </h2>
              <div className="mt-6 flex flex-col divide-y divide-steel-200 border-y border-steel-200">
                {product.faqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="flex min-h-row cursor-pointer list-none items-center justify-between gap-4 text-data font-medium text-steel-950 [&::-webkit-details-marker]:hidden">
                      {faq.question}
                      <span
                        aria-hidden
                        className="text-steel-500 transition-transform duration-instant ease-standard group-open:rotate-180"
                      >
                        <ChevronDown size={20} />
                      </span>
                    </summary>
                    <p className="mt-3 max-w-content text-sm text-steel-700">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Single grid item carrying the lg:col-span-4 sidebar slot — nesting
              AnchorRailDesktop and SpecRailDesktop here (rather than as two
              separate lg:col-span-4 grid children, which would overflow the
              12-column grid to 16) lets their own "sticky top-24" boxes share
              one scroll ancestor, so CSS sticky-stacking pushes SpecRailDesktop
              below AnchorRailDesktop's sticky box once both are pinned, with no
              manual offset math. AnchorRailDesktop's own "hidden lg:col-span-4
              lg:block" classes on its <nav> are redundant once nested (col-span
              has no effect on a non-grid-item) but harmless, and were left
              alone rather than edited, since that component is shared by all
              17 products. */}
          <div className="hidden lg:col-span-4 lg:block">
            <AnchorRailDesktop sections={SECTIONS} />
            <SpecRailDesktop
              rows={railRows}
              primaryCta={{ label: 'Request a quote', href: rfqHref(rfqCompany, product.slug) }}
              {...(certifications[0]?.artifactUrl
                ? { secondaryCta: { label: 'Download datasheet', href: certifications[0].artifactUrl } }
                : {})}
            />
          </div>
        </div>

        <RFQBand company={rfqCompany} equipment={product.slug} whatsappHref={whatsappHref(entity)} />

        <MobileBottomBar
          phoneHref={phoneHref(entity)}
          whatsappHref={whatsappHref(entity)}
          rfqHref={rfqHref(rfqCompany)}
        />
      </main>
    )
  }

  return { generateStaticParams, generateMetadata, Page }
}
