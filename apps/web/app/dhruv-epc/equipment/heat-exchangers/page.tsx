// Heat Exchangers — Datum §21 product page template ("acts as a sales
// engineer"). Section order mirrors the proposal engineer's evaluation
// sequence; spec table first scroll. Content Zod-parsed in lib/content.
import type { Metadata } from 'next'
import { MobileBottomBar, ProductHero, SpecTable } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage, buildProduct } from '@vedanta/schemas'
import { RFQBand } from '../../../../components/RFQBand'
import { dhruvEntity, dhruvPhoneHref, dhruvWhatsappHref, heatExchangers } from '../../../../lib/content/dhruv-epc'

const BASE = 'https://www.vedantagroup.net' // canonical host until domain decision lands

export const metadata: Metadata = {
  title: 'Shell & Tube Heat Exchangers — ASME U/U2, TEMA | Dhruv EPC',
  description:
    'Fixed tube-sheet, floating head, U-tube and kettle exchangers to ASME Sec. VIII Div. 1 & 2 and TEMA. HTRI thermal design. CS, SS, duplex and high-nickel alloys.',
}

// §21 anchor rail — engineers jump, they don't scroll politely
const SECTIONS = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'types', label: 'Types & configurations' },
  { id: 'materials-codes', label: 'Materials & codes' },
  { id: 'fabrication-qa', label: 'Fabrication & QA' },
  { id: 'faq', label: 'FAQ' },
]

// §21.5 fabrication & QA strip — the TPIA persona's section.
// Photos pending the works shoot (§P-5): text-caption variant, never stock.
const QA_STEPS = [
  { step: 'Drawing & design', caption: 'ASME Sec. VIII calcs, TEMA mechanical, HTRI thermal' },
  { step: 'Material receipt', caption: 'Mill test certificates verified against indent' },
  { step: 'Fabrication', caption: 'WPS/PQR-qualified welding, stage inspections' },
  { step: 'NDT', caption: 'RT/UT/PT/MT per code and client ITP' },
  { step: 'Hydrotest & dispatch', caption: 'Witnessed hydrotest, final dossier, dispatch' },
]

export default function HeatExchangersPage() {
  const breadcrumbs = [
    { label: 'Dhruv EPC', href: '/dhruv-epc' },
    { label: 'Equipment', href: '/dhruv-epc#equipment' },
    { label: 'Heat Exchangers' },
  ]

  const jsonLd = [
    buildProduct(heatExchangers, dhruvEntity),
    buildFAQPage(heatExchangers.faqs),
    buildBreadcrumbList([
      { name: 'Dhruv EPC', url: `${BASE}/dhruv-epc` },
      { name: 'Equipment', url: `${BASE}/dhruv-epc#equipment` },
      { name: 'Heat Exchangers', url: `${BASE}/dhruv-epc/equipment/heat-exchangers` },
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
        title="Shell & Tube Heat Exchangers — ASME U/U2"
        valueStatement="Designed and fabricated to ASME Sec. VIII Div. 1 & 2 with TEMA mechanical standards and HTRI thermal design — under ASME U and U2 Certificates of Authorization."
        chips={['ASME Sec. VIII Div. 1 & 2', 'TEMA · HTRI', 'CS · SS · duplex · Ni alloys']}
        specHref="#specifications"
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=dhruv' }}
      />

      <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-12">
        <div className="flex flex-col gap-16 lg:col-span-8">
          {/* §21.2 — spec table, first scroll, always above FAQ and gallery */}
          <section id="specifications" aria-labelledby="spec-heading">
            <h2 id="spec-heading" className="font-display text-h3 font-medium text-steel-950">
              Specifications
            </h2>
            <div className="mt-6">
              <SpecTable rows={heatExchangers.specTable} caption="Shell & tube heat exchanger capability" />
            </div>
          </section>

          {/* §21.3 — types & configurations */}
          <section id="types" aria-labelledby="types-heading">
            <h2 id="types-heading" className="font-display text-h3 font-medium text-steel-950">
              Types &amp; configurations
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {heatExchangers.types.map((t) => (
                <div key={t.name} className="rounded-sm border border-steel-200 bg-white p-6">
                  <h3 className="text-h4 font-medium text-steel-950">{t.name}</h3>
                  <p className="mt-2 text-sm text-steel-700">{t.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* §21.4 — materials & codes, mono chips */}
          <section id="materials-codes" aria-labelledby="moc-heading">
            <h2 id="moc-heading" className="font-display text-h3 font-medium text-steel-950">
              Materials &amp; codes
            </h2>
            <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
              Materials of construction
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {heatExchangers.materials.map((m) => (
                <li key={m} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
                  {m}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
              Design codes
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {heatExchangers.codes.map((c) => (
                <li key={c} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
                  {c}
                </li>
              ))}
            </ul>
          </section>

          {/* §21.5 — fabrication & QA strip (photos pending §P-5 shoot; text variant) */}
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
              Jobs executed under LRS, BV, DNV and the statutory agency IBR.
            </p>
          </section>

          {/* §21.8 — FAQ: visible accordion AND FAQPage JSON-LD (one artifact, two audiences).
              Native <details>: instant disclosure per §11's compositor law. */}
          <section id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-h3 font-medium text-steel-950">
              Frequently asked questions
            </h2>
            <div className="mt-6 flex flex-col divide-y divide-steel-200 border-y border-steel-200">
              {heatExchangers.faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="flex min-h-row cursor-pointer list-none items-center justify-between gap-4 text-data font-medium text-steel-950 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span aria-hidden className="text-steel-500 transition-transform duration-instant ease-standard group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-3 max-w-content text-sm text-steel-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* §21 anchor rail — desktop only, the 8+4 grid's rail column */}
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

      {/* §21.9 — graphite closer */}
      <RFQBand company="dhruv" whatsappHref={dhruvWhatsappHref} />

      {/* §17 — mobile bottom action bar persists on product pages */}
      <MobileBottomBar
        phoneHref={dhruvPhoneHref}
        whatsappHref={dhruvWhatsappHref}
        rfqHref="/request-a-quote?company=dhruv"
      />
    </main>
  )
}
