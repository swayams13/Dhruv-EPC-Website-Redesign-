// Telescopic Expansion Joints — Datum §21 product page (template contract locked after Session 8).
import type { Metadata } from 'next'
import { ChevronDown, MobileBottomBar, ProductHero, SpecTable } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildFAQPage, buildProduct } from '@vedanta/schemas'
import { RFQBand } from '../../../../components/RFQBand'
import { AnchorRailDesktop, AnchorRailMobile } from '../../../../components/AnchorRail'
import { preciseEntity, precisePhoneHref, preciseWhatsappHref, telescopicExpansionJoint } from '../../../../lib/content/precise-engineers'
import { BASE } from '../../../../lib/site'

export const metadata: Metadata = {
  title: 'Telescopic Expansion Joints — Slip-type, ASME B31.3 | Precise Engineers',
  description:
    'Single and double-slip telescopic expansion joints with graphite, PTFE and live-loaded packing seals. ASME B31.3. CS, SS 304, SS 316. EIL approved, ISO 9001:2015, Anand.',
  alternates: { canonical: '/precise-engineers/products/telescopic-expansion-joint/' },
}

const SECTIONS = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'types', label: 'Types & configurations' },
  { id: 'materials-codes', label: 'Materials & codes' },
  { id: 'fabrication-qa', label: 'Fabrication & QA' },
  { id: 'faq', label: 'FAQ' },
]

const QA_STEPS = [
  { step: 'Design review', caption: 'ASME B31.3 stress calc, traverse, pressure and sealing specification' },
  { step: 'Material receipt', caption: 'Bar, plate and packing MTCs verified against purchase order' },
  { step: 'Machining', caption: 'Sleeve OD and barrel ID machined to tolerance; surface finish checked' },
  { step: 'Packing & assembly', caption: 'Packing installed and adjusted to torque spec; sliding function verified' },
  { step: 'Hydraulic test & dispatch', caption: 'Proof test at 1.5× design pressure, final inspection and dispatch' },
]

export default function TelescopicExpansionJointPage() {
  const breadcrumbs = [
    { label: 'Precise Engineers', href: '/precise-engineers' },
    { label: 'Products', href: '/precise-engineers#products' },
    { label: 'Telescopic Expansion Joints' },
  ]

  const jsonLd = [
    buildProduct(telescopicExpansionJoint, preciseEntity),
    buildFAQPage(telescopicExpansionJoint.faqs),
    buildBreadcrumbList([
      { name: 'Precise Engineers', url: `${BASE}/precise-engineers` },
      { name: 'Products', url: `${BASE}/precise-engineers#products` },
      { name: 'Telescopic Expansion Joints', url: `${BASE}/precise-engineers/products/telescopic-expansion-joint` },
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
        title="Telescopic Expansion Joints"
        valueStatement="Single and double-slip telescopic expansion joints with graphite, PTFE and live-loaded packing seals, designed to ASME B31.3 for steam, hot-water and process piping requiring large axial traverse."
        chips={['ASME B31.3', 'Graphite · PTFE · live-loaded', 'CS · SS 304 · SS 316']}
        specHref="#specifications"
        certChips={['EIL Approved Vendor', 'ISO 9001:2015']}
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=precise&equipment=telescopic-expansion-joint' }}
      />

      <AnchorRailMobile sections={SECTIONS} />

      <div className="mx-auto grid max-w-wide grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-12">
        <div className="flex flex-col gap-16 lg:col-span-8">
          <section id="specifications" aria-labelledby="spec-heading">
            <h2 id="spec-heading" className="font-display text-h3 font-medium text-steel-950">
              Specifications
            </h2>
            <div className="mt-6">
              <SpecTable rows={telescopicExpansionJoint.specTable} caption="Telescopic expansion joint capability" />
            </div>
          </section>

          <section id="types" aria-labelledby="types-heading">
            <h2 id="types-heading" className="font-display text-h3 font-medium text-steel-950">
              Types &amp; configurations
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {telescopicExpansionJoint.types.map((t) => (
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
              {telescopicExpansionJoint.materials.map((m) => (
                <li key={m} className="rounded-sm border border-steel-200 bg-steel-50 px-3 py-1 font-mono text-helper text-steel-700">
                  {m}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xs font-medium uppercase tracking-caption text-steel-600">
              Design codes
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {telescopicExpansionJoint.codes.map((c) => (
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
              {telescopicExpansionJoint.faqs.map((faq) => (
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

      <RFQBand company="precise" equipment="telescopic-expansion-joint" whatsappHref={preciseWhatsappHref} />

      <MobileBottomBar
        phoneHref={precisePhoneHref}
        whatsappHref={preciseWhatsappHref}
        rfqHref="/request-a-quote?company=precise"
      />
    </main>
  )
}
