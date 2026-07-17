// Dual Plate Check Valves — Datum §21 product page (template contract locked after Session 8).
import type { Metadata } from 'next'
import { ChevronDown, MobileBottomBar, ProductHero, SpecTable } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage, buildProduct } from '@vedanta/schemas'
import { RFQBand } from '../../../../components/RFQBand'
import { AnchorRailMobile } from '../../../../components/AnchorRail'
import { dualPlateCheckValve, preciseEntity, precisePhoneHref, preciseWhatsappHref } from '../../../../lib/content/precise-engineers'

const BASE = 'https://vedantagroup.net'

export const metadata: Metadata = {
  title: 'Dual Plate Check Valves — API 594, ASME Class 150–600, Wafer & Lug | Precise Engineers',
  description:
    'Wafer and lug dual plate check valves to API 594, ASME Class 150, 300 and 600. WCB, CF8M, CF8, LCC. Metal-seated and soft-seated. EIL approved, ISO 9001:2015, Anand.',
}

const SECTIONS = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'types', label: 'Types & configurations' },
  { id: 'materials-codes', label: 'Materials & codes' },
  { id: 'fabrication-qa', label: 'Fabrication & QA' },
  { id: 'faq', label: 'FAQ' },
]

const QA_STEPS = [
  { step: 'Body inspection', caption: 'Casting NDE and dimensional check per API 594 and ASME B16.34' },
  { step: 'Plate & hinge assembly', caption: 'Disc flatness, hinge-pin fit and spring preload verified' },
  { step: 'Seat leak test', caption: 'API 598 seat test at design pressure; zero leakage confirmed for soft-seat types' },
  { step: 'Shell hydrostatic test', caption: 'Shell proof test at 1.5× CWP per ASME B16.34' },
  { step: 'Final inspection & dispatch', caption: 'Torque table, material certificates and test records compiled; dispatch' },
]

export default function DualPlateCheckValvePage() {
  const breadcrumbs = [
    { label: 'Precise Engineers', href: '/precise-engineers' },
    { label: 'Products', href: '/precise-engineers#products' },
    { label: 'Dual Plate Check Valves' },
  ]

  const jsonLd = [
    buildProduct(dualPlateCheckValve, preciseEntity),
    buildFAQPage(dualPlateCheckValve.faqs),
    buildBreadcrumbList([
      { name: 'Precise Engineers', url: `${BASE}/precise-engineers` },
      { name: 'Products', url: `${BASE}/precise-engineers#products` },
      { name: 'Dual Plate Check Valves', url: `${BASE}/precise-engineers/products/dual-plate-check-valve` },
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
        title="Dual Plate Check Valves"
        valueStatement="Wafer and lug dual plate check valves to API 594 — shorter and lighter than swing checks, fast-closing to minimise reverse-flow surge, installable in any orientation. ASME Class 150, 300 and 600."
        chips={['API 594', 'ASME Class 150 · 300 · 600', 'Wafer · lug · metal-seated · soft-seated']}
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
              <SpecTable rows={dualPlateCheckValve.specTable} caption="Dual plate check valve capability" />
            </div>
          </section>

          <section id="types" aria-labelledby="types-heading">
            <h2 id="types-heading" className="font-display text-h3 font-medium text-steel-950">
              Types &amp; configurations
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {dualPlateCheckValve.types.map((t) => (
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
              {dualPlateCheckValve.materials.map((m) => (
                <li key={m} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
                  {m}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
              Design codes
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dualPlateCheckValve.codes.map((c) => (
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
              Tested to API 598; executed under EIL approval and ISO 9001:2015 QMS.
            </p>
          </section>

          <section id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-h3 font-medium text-steel-950">
              Frequently asked questions
            </h2>
            <div className="mt-6 flex flex-col divide-y divide-steel-200 border-y border-steel-200">
              {dualPlateCheckValve.faqs.map((faq) => (
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
