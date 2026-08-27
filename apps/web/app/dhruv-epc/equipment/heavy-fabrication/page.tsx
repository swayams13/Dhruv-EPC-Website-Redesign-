// Heavy Fabrication — Datum §21 product page (template contract locked after Session 8).
import type { Metadata } from 'next'
import { ChevronDown, MobileBottomBar, ProductHero, SpecTable } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage, buildProduct } from '@vedanta/schemas'
import { RFQBand } from '../../../../components/RFQBand'
import { AnchorRailDesktop, AnchorRailMobile } from '../../../../components/AnchorRail'
import { dhruvEntity, dhruvPhoneHref, dhruvWhatsappHref, heavyFabrication } from '../../../../lib/content/dhruv-epc'
import { BASE } from '../../../../lib/site'

export const metadata: Metadata = {
  title: 'Heavy Fabrication — IS 2062, AWS D1.1, up to 200 T | Dhruv EPC',
  description:
    'Structural and equipment fabrication to IS 2062 and AWS D1.1 — pipe racks, module frames, industrial ductwork and access platforms. Shot-blasted and primed before dispatch from Manjusar, Vadodara.',
  alternates: { canonical: '/dhruv-epc/equipment/heavy-fabrication/' },
}

const SECTIONS = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'types', label: 'Types & configurations' },
  { id: 'materials-codes', label: 'Materials & codes' },
  { id: 'fabrication-qa', label: 'Fabrication & QA' },
  { id: 'faq', label: 'FAQ' },
]

const QA_STEPS = [
  { step: 'Drawing review', caption: 'Load case review, connection drawing and fit-up sequence confirmed' },
  { step: 'Material receipt', caption: 'IS 2062 plates and sections; MTCs verified before issue' },
  { step: 'Fabrication', caption: 'Cutting, drilling, fit-up, qualified welding to AWS D1.1 / IS 816' },
  { step: 'NDT & inspection', caption: 'UT of critical welds, dimensional report per drawing' },
  { step: 'Surface prep & dispatch', caption: 'Blast to Sa 2½, primer and finish coat, dispatch' },
]

export default function HeavyFabricationPage() {
  const breadcrumbs = [
    { label: 'Dhruv EPC', href: '/dhruv-epc' },
    { label: 'Equipment', href: '/dhruv-epc#equipment' },
    { label: 'Heavy Fabrication' },
  ]

  const jsonLd = [
    buildProduct(heavyFabrication, dhruvEntity),
    buildFAQPage(heavyFabrication.faqs),
    buildBreadcrumbList([
      { name: 'Dhruv EPC', url: `${BASE}/dhruv-epc` },
      { name: 'Equipment', url: `${BASE}/dhruv-epc#equipment` },
      { name: 'Heavy Fabrication', url: `${BASE}/dhruv-epc/equipment/heavy-fabrication` },
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
        title="Heavy Fabrication — IS 2062 · AWS D1.1"
        valueStatement="Structural and equipment fabrication to IS 2062 and AWS D1.1 — pipe racks, module frames, ductwork, platforms and miscellaneous pressure parts — shot-blasted and primed before dispatch."
        chips={['IS 2062 structural steel', 'AWS D1.1 welding', 'Up to 200 T per unit']}
        specHref="#specifications"
        certChips={['ASME U', 'ASME U2', 'IBR', 'ISO 9001:2015']}
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=dhruv&equipment=heavy-fabrication' }}
      />

      <AnchorRailMobile sections={SECTIONS} />

      <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-12">
        <div className="flex flex-col gap-16 lg:col-span-8">
          <section id="specifications" aria-labelledby="spec-heading">
            <h2 id="spec-heading" className="font-display text-h3 font-medium text-steel-950">
              Specifications
            </h2>
            <div className="mt-6">
              <SpecTable rows={heavyFabrication.specTable} caption="Heavy fabrication capability" />
            </div>
          </section>

          <section id="types" aria-labelledby="types-heading">
            <h2 id="types-heading" className="font-display text-h3 font-medium text-steel-950">
              Types &amp; configurations
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {heavyFabrication.types.map((t) => (
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
              {heavyFabrication.materials.map((m) => (
                <li key={m} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
                  {m}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
              Design codes
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {heavyFabrication.codes.map((c) => (
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
              Third-party inspection under LRS, BV or DNV accepted; same works as pressure vessel fabrication.
            </p>
          </section>

          <section id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="font-display text-h3 font-medium text-steel-950">
              Frequently asked questions
            </h2>
            <div className="mt-6 flex flex-col divide-y divide-steel-200 border-y border-steel-200">
              {heavyFabrication.faqs.map((faq) => (
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

      <RFQBand company="dhruv" equipment="heavy-fabrication" whatsappHref={dhruvWhatsappHref} />

      <MobileBottomBar
        phoneHref={dhruvPhoneHref}
        whatsappHref={dhruvWhatsappHref}
        rfqHref="/request-a-quote?company=dhruv"
      />
    </main>
  )
}
