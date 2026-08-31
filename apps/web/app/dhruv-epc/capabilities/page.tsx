import type { Metadata } from 'next'
import Link from 'next/link'
import { MobileBottomBar, PageHero, SpecTable } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { RFQBand } from '../../../components/RFQBand'
import { getEntity, phoneHref, whatsappHref } from '../../../lib/content-loader'
import { dhruvEquipment } from '../../../lib/site-data'
import { BASE } from '../../../lib/site'

const dhruvEntity = getEntity('dhruv-epc')
const dhruvPhoneHref = phoneHref(dhruvEntity)
const dhruvWhatsappHref = whatsappHref(dhruvEntity)

export const metadata: Metadata = {
  title: 'Capabilities — Max Sizes, Materials & Codes | Dhruv EPC',
  description:
    'Dhruv EPC holds ASME U, U2 and IBR stamps. Vessels to 3,600 mm dia / 200 T, design pressures full vacuum to 400 bar(g). TEMA · API 650 class. TPI by LRS, BV, DNV.',
  alternates: { canonical: '/dhruv-epc/capabilities/' },
}

const CAPABILITY_ROWS = [
  { param: 'Max vessel / shell diameter', value: '3,600', unit: 'mm', note: 'DEMO figure — engineering data pending' },
  { param: 'Max unit weight / tonnage', value: '200', unit: 'T', note: 'DEMO figure — engineering data pending' },
  { param: 'Vessel shell length', value: 'up to 18', unit: 'm', note: 'DEMO figure — engineering data pending' },
  { param: 'Heat exchanger shell area', value: 'up to 300', unit: 'm²', note: 'DEMO figure — engineering data pending' },
  { param: 'Design pressure range', value: 'full vacuum to 400', unit: 'bar(g)', note: 'DEMO figure — engineering data pending' },
  { param: 'Design temperature range', value: '−196 to +600', unit: '°C', note: 'DEMO figure — engineering data pending' },
  { param: 'MOC families', value: 'CS · LAS · SS 304/316/321/347 · Duplex · Ni alloys · clad' },
  { param: 'Design codes — vessels', value: 'ASME Sec. VIII Div. 1 & 2 · IBR' },
  { param: 'Design codes — exchangers', value: 'ASME Sec. VIII Div. 1 & 2 · TEMA R/C/B' },
  { param: 'Design codes — tanks', value: 'API 650 class duty', note: 'DEMO — API 650 unverified; verify before launch' },
  { param: 'Stamps & authorizations', value: 'ASME U · U2 · IBR' },
  { param: 'NDT methods', value: 'RT · UT · PT · MT · PAUT', note: 'DEMO — confirm full NDT scope with engineering' },
  { param: 'Testing', value: 'Hydrotest · pneumatic test · PWHT · radiographic review', note: 'DEMO figure — engineering data pending' },
  { param: 'TPI agencies accepted', value: "Lloyd's Register (LRS) · Bureau Veritas (BV) · DNV" },
]

const GROUP_LABELS: Record<string, string> = {
  'static-equipment': 'Static Equipment',
  'skids-packages': 'Skids & Packages',
  'fabrication-machining': 'Fabrication & Machining',
}

export default function DhruvCapabilitiesPage() {
  const breadcrumbs = [
    { label: 'Dhruv EPC', href: '/dhruv-epc' },
    { label: 'Capabilities' },
  ]

  const jsonLd = buildBreadcrumbList([
    { name: 'Dhruv EPC', url: `${BASE}/dhruv-epc` },
    { name: 'Capabilities', url: `${BASE}/dhruv-epc/capabilities` },
  ])

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Engineering capability"
        title="Capabilities — what we build and to what limits."
        lead="ASME U and U2 stamped works at Manjusar, Vadodara — vessels to 3,600 mm / 200 T, TEMA heat exchangers, API 650 tanks and fabricated packages across full vacuum to 400 bar(g) in carbon steel through high-nickel alloys. Third-party inspection by LRS, BV and DNV."
      />

      {/* Capability envelope spec table */}
      <section className="mx-auto max-w-wide px-6 py-12" aria-labelledby="capability-heading">
        <h2 id="capability-heading" className="font-display text-h3 font-medium text-steel-950">
          Capability envelope
        </h2>
        <div className="mt-6">
          <SpecTable
            rows={CAPABILITY_ROWS}
            density="engineering"
            caption="Dhruv EPC capability envelope"
          />
        </div>
      </section>

      {/* Equipment families */}
      <section className="mx-auto max-w-wide px-6 py-12" aria-labelledby="equipment-heading">
        <h2 id="equipment-heading" className="font-display text-h3 font-medium text-steel-950">
          Equipment families
        </h2>
        <div className="mt-8 flex flex-col gap-8">
          {(Object.entries(dhruvEquipment) as [keyof typeof dhruvEquipment, typeof dhruvEquipment[keyof typeof dhruvEquipment]][]).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-xs font-medium uppercase tracking-caption text-steel-600">
                {GROUP_LABELS[group] ?? group}
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-sm border border-steel-200 bg-white p-6 transition-colors duration-instant hover:border-steel-400"
                  >
                    <p className="font-medium text-steel-950">{item.name}</p>
                    <p className="mt-1 text-helper text-steel-600">{item.scope}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO figures notice */}
      <div className="mx-auto max-w-wide px-6 py-4">
        <p className="rounded-sm border border-steel-200 bg-steel-50 px-4 py-3 text-helper text-steel-600">
          <span className="font-medium text-steel-950">DEMO figures:</span> Size, weight, pressure
          and temperature limits are prototype placeholders pending engineering confirmation. Verify
          all capability data with Dhruv EPC before publication.
        </p>
      </div>

      <RFQBand company="dhruv" whatsappHref={dhruvWhatsappHref} />

      <MobileBottomBar
        phoneHref={dhruvPhoneHref}
        whatsappHref={dhruvWhatsappHref}
        rfqHref="/request-a-quote?company=dhruv"
      />
    </main>
  )
}
