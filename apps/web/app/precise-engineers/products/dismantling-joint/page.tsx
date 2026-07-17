// Dismantling Joints — Datum §21 product page (template contract locked after Session 8).
import type { Metadata } from 'next'
import { ChevronDown, MobileBottomBar, ProductHero, SpecTable } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage, buildProduct } from '@vedanta/schemas'
import { RFQBand } from '../../../../components/RFQBand'
import { AnchorRailMobile } from '../../../components/AnchorRail'
import { dismantlingJoint, preciseEntity, precisePhoneHref, preciseWhatsappHref } from '../../../../lib/content/precise-engineers'

const BASE = 'https://vedantagroup.net'

export const metadata: Metadata = {
  title: 'Dismantling Joints — Flanged Adjustment Joints for Valve Removal | Precise Engineers',
  description:
    'Single and double-step dismantling joints with adjustment length for in-line valve and pump removal. PN 10 to PN 25. Ductile iron, CS, SS 304/316. EIL approved, ISO 9001:2015.',
}

const SECTIONS = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'types', label: 'Types & configurations' },
  { id: 'materials-codes', label: 'Materials & codes' },
  { id: 'fabrication-qa', label: 'Fabrication & QA' },
  { id: 'faq', label: 'FAQ' },
]

const QA_STEPS = [
  { step: 'Design', caption: 'Adjustment travel, pressure class and flange drilling layout confirmed' },
  { step: 'Body fabrication', caption: 'Material inspection; body and sleeve machined to dimensional tolerances' },
  { step: 'Seal installation', caption: 'Ring gasket seated and lubricated per assembly procedure' },
  { step: 'Hydraulic test', caption: 'Proof test at 1.5× design pressure; adjustment function verified under pressure' },
  { step: 'Final inspection & dispatch', caption: 'Full extension/compression stroke checked; painting and dispatch' },
]

export default function DismantlingJointPage() {
  const breadcrumbs = [
    { label: 'Precise Engineers', href: '/precise-engineers' },
    { label: 'Products', href: '/precise-engineers#products' },
    { label: 'Dismantling Joints' },
  ]

  const jsonLd = [
    buildProduct(dismantlingJoint, preciseEntity),
    buildFAQPage(dismantlingJoint.faqs),
    buildBreadcrumbList([
      { name: 'Precise Engineers', url: `${BASE}/precise-engineers` },
      { name: 'Products', url: `${BASE}/precise-engineers#products` },
      { name: 'Dismantling Joints', url: `${BASE}/precise-engineers/products/dismantling-joint` },
    ]),
  ]

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
        title="Dismantling Joints"
        valueStatement="Flanged dismantling joints with adjustable length for in-line valve, pump and equipment removal without pipe cutting — single-step and double-step configurations to ANSI B16.1, BS 4504 and DIN 2501."
        chips={['PN 10 · PN 16 · PN 25', 'ANSI B16.1 · BS 4504 · DIN 2501', 'DI · CS · SS 304 · SS 316']}
        specHref="#specifications"
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=precise' }}
      />

      <AnchorRailMobile sections={SECTIONS} />

      <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-12">
        <div className="flex flex-col gap-16 lg:col-span-8">
          <section id="specifications" aria-labelledby="spec-heading">
            <h2 id="spec-heading" className="font-display text-h3 font-medium text-steel-950">
              Specifications
            </h2>
            <div className="mt-6">
              <SpecTable rows={dismantlingJoint.specTable} caption="Dismantling joint capability" />
            </div>
          </section>

          <section id="types" aria-labelledby="types-heading">
            <h2 id="types-heading" className="font-display text-h3 font-medium text-steel-950">
              Types &amp; configurations
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {dismantlingJoint.types.map((t) => (
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
              Materials of construction
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dismantlingJoint.materials.map((m) => (
                <li key={m} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
                  {m}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
              Flange standards
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dismantlingJoint.codes.map((c) => (
                <li key={c} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
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
              {QA_STEPS.map((s, i) => (
                <li key={s.step} className="rounded-sm border border-steel-200 bg-white p-4">
                  <span className="font-mono text-helper text-steel-600">{i + 1}</span>
                  <h3 className="mt-1 text-sm font-medium text-steel-950">{s.step}</h3>
                  <p className="mt-1 text-helper text-steel-600">{s.caption}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-helper text-steel-600">
              Executed under EIL approval and ISO 9001:2015 QMS; third-party inspection available.
            </p>
          </section>

          <section id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-h3 font-medium text-steel-950">
              Frequently asked questions
            </h2>
            <div className="mt-6 flex flex-col divide-y divide-steel-200 border-y border-steel-200">
              {dismantlingJoint.faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="flex min-h-row cursor-pointer list-none items-center justify-between gap-4 text-data font-medium text-steel-950 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span aria-hidden className="text-steel-500 transition-transform duration-instant ease-standard group-open:rotate-180">
                      <ChevronDown size={20} />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-content text-sm text-steel-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <nav aria-label="On this page" className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24 rounded-sm border border-steel-200 bg-white p-6">
            <p className="text-xs font-medium uppercase tracking-caption text-steel-600">On this page</p>
            <ul className="mt-3 flex flex-col">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex min-h-row items-center text-sm text-steel-700 transition-colors duration-instant hover:text-steel-950"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <RFQBand company="precise" whatsappHref={preciseWhatsappHref} />

      <MobileBottomBar
        phoneHref={precisePhoneHref}
        whatsappHref={preciseWhatsappHref}
        rfqHref="/request-a-quote?company=precise"
      />
    </main>
  )
}
