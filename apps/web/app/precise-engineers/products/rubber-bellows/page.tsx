// Rubber Bellows — Datum §21 product page (template contract locked after Session 8).
import type { Metadata } from 'next'
import { ChevronDown, MobileBottomBar, ProductHero, SpecTable } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage, buildProduct } from '@vedanta/schemas'
import { RFQBand } from '../../../../components/RFQBand'
import { AnchorRailDesktop, AnchorRailMobile } from '../../../../components/AnchorRail'
import { preciseEntity, precisePhoneHref, preciseWhatsappHref, rubberBellows } from '../../../../lib/content/precise-engineers'

const BASE = 'https://vedantagroup.net'

export const metadata: Metadata = {
  title: 'Rubber Bellows — Elastomeric Expansion Joints, EPDM · NBR · Neoprene | Precise Engineers',
  description:
    'Single arch, dual arch and wide arch rubber expansion joints for vibration isolation and thermal movement. EPDM, NBR, Neoprene, Hypalon. Flanged, grooved. EIL approved, ISO 9001:2015.',
}

const SECTIONS = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'types', label: 'Types & configurations' },
  { id: 'materials-codes', label: 'Materials & codes' },
  { id: 'fabrication-qa', label: 'Fabrication & QA' },
  { id: 'faq', label: 'FAQ' },
]

const QA_STEPS = [
  { step: 'Compound selection', caption: 'Elastomer grade confirmed per medium, temperature and cyclic duty' },
  { step: 'Moulding', caption: 'Controlled cure temperature and time per compound specification' },
  { step: 'Dimensional check', caption: 'Bore, arch height, flange drilling and reinforcement verified' },
  { step: 'Pressure & vacuum test', caption: 'Proof test to design pressure; vacuum pull for suction-side units' },
  { step: 'Final inspection & dispatch', caption: 'Hardness check, visual inspection, packaging and dispatch' },
]

export default function RubberBellowsPage() {
  const breadcrumbs = [
    { label: 'Precise Engineers', href: '/precise-engineers' },
    { label: 'Products', href: '/precise-engineers#products' },
    { label: 'Rubber Bellows' },
  ]

  const jsonLd = [
    buildProduct(rubberBellows, preciseEntity),
    buildFAQPage(rubberBellows.faqs),
    buildBreadcrumbList([
      { name: 'Precise Engineers', url: `${BASE}/precise-engineers` },
      { name: 'Products', url: `${BASE}/precise-engineers#products` },
      { name: 'Rubber Bellows', url: `${BASE}/precise-engineers/products/rubber-bellows` },
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
        title="Rubber Bellows"
        valueStatement="Elastomeric expansion joints in single arch, dual arch and wide arch configurations for vibration isolation at pump connections and thermal movement in water, process and industrial piping."
        chips={['EPDM · NBR · Neoprene · Hypalon', 'BS 6129 · ASME B31.3', 'Flanged · grooved · threaded']}
        specHref="#specifications"
        certChips={['EIL Approved Vendor', 'ISO 9001:2015']}
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=precise&equipment=rubber-bellows' }}
      />

      <AnchorRailMobile sections={SECTIONS} />

      <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-12">
        <div className="flex flex-col gap-16 lg:col-span-8">
          <section id="specifications" aria-labelledby="spec-heading">
            <h2 id="spec-heading" className="font-display text-h3 font-medium text-steel-950">
              Specifications
            </h2>
            <div className="mt-6">
              <SpecTable rows={rubberBellows.specTable} caption="Rubber bellows capability" />
            </div>
          </section>

          <section id="types" aria-labelledby="types-heading">
            <h2 id="types-heading" className="font-display text-h3 font-medium text-steel-950">
              Types &amp; configurations
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {rubberBellows.types.map((t) => (
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
              Elastomer grades
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rubberBellows.materials.map((m) => (
                <li key={m} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
                  {m}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
              Design codes
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {rubberBellows.codes.map((c) => (
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
                  <span className="font-mono text-h3 font-light leading-none text-steel-300">{i + 1}</span>
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
              {rubberBellows.faqs.map((faq) => (
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

        <AnchorRailDesktop sections={SECTIONS} />
      </div>

      <RFQBand company="precise" equipment="rubber-bellows" whatsappHref={preciseWhatsappHref} />

      <MobileBottomBar
        phoneHref={precisePhoneHref}
        whatsappHref={preciseWhatsappHref}
        rfqHref="/request-a-quote?company=precise"
      />
    </main>
  )
}
