// Precise Engineers — Capabilities page (Datum §15 capability matrix).
import type { Metadata } from 'next'
import { MobileBottomBar, PageHero, SpecTable } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { RFQBand } from '../../../components/RFQBand'
import {
  preciseEntity,
  precisePhoneHref,
  preciseWhatsappHref,
  preciseProducts,
} from '../../../lib/content/precise-engineers'

const BASE = 'https://vedantagroup.net'

export const metadata: Metadata = {
  title: 'Capabilities — Size Ranges, Codes & MOC | Precise Engineers',
  description:
    'Metallic bellows expansion joints to EJMA/ASME B31.3, 80–8,000 mm NB; 9 product families across 12 sectors. EIL-approved vendor since 1994, ISO 9001:2015 certified, Anand, Gujarat.',
}

const CAPABILITY_ROWS = [
  { param: 'Metallic bellows — circular size range', value: '80 – 8,000', unit: 'mm NB' },
  // [source: vedantagroup.net]
  { param: 'Metallic bellows — rectangular size range', value: 'up to 9,000 × 5,000', unit: 'mm' },
  // [source: vedantagroup.net]
  { param: 'Telescopic EJ size range', value: '50 – 1,200', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
  { param: 'Rubber bellows size range', value: '25 – 2,000', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
  { param: 'Fabric bellows duct size (rectangular)', value: 'up to 6,000 × 4,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
  { param: 'Dismantling joint / flange adaptor size range', value: '50 – 1,200', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
  { param: 'Zero velocity valve size range', value: '80 – 1,200', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
  { param: 'Dual plate check valve size range', value: '50 – 900', unit: 'mm NB', note: 'DEMO figure — engineering data pending' },
  { param: 'Damper duct size (rectangular)', value: 'up to 4,000 × 3,000', unit: 'mm', note: 'DEMO figure — engineering data pending' },
  { param: 'Design codes — metallic bellows', value: 'EJMA · ASME B31.3' },
  // [source: vedantagroup.net]
  { param: 'Design codes — check valves', value: 'API 594 · ASME B16.34 · ASME B16.10' },
  { param: 'Design codes — zero velocity valves', value: 'IS 14845' },
  { param: 'Design codes — dampers', value: 'AMCA 500' },
  {
    param: 'Bellows MOC families',
    value: 'SS 304 · 316 · 321 · 310 · Inconel 600/625 · Incoloy 800/825 · Hastelloy · Duplex',
  },
  // [source: vedantagroup.net]
  {
    param: 'Sectors served',
    value: 'Oil & gas · refineries · petrochemicals · fertilizers · power · steel · cement · atomic energy',
  },
  // [source: vedantagroup.net about-us.php]
  {
    param: 'Approvals',
    value: 'EIL (Engineers India Limited) — approved vendor, expansion bellows & joints',
  },
  // [source: vedantagroup.net]
]

void preciseEntity // entity imported for type validation at module load

export default function PreciseCapabilitiesPage() {
  const breadcrumbs = [
    { label: 'Precise Engineers', href: '/precise-engineers' },
    { label: 'Capabilities' },
  ]

  const jsonLd = buildBreadcrumbList([
    { name: 'Precise Engineers', url: `${BASE}/precise-engineers` },
    { name: 'Capabilities', url: `${BASE}/precise-engineers/capabilities` },
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
        title="Capabilities — size ranges, codes and materials."
        lead="Metallic bellows from 80 to 8,000 mm NB, nine product families spanning expansion joints, flow control and duct isolation — all designed to EJMA, API 594, IS 14845 and AMCA 500, with EIL approval and ISO 9001:2015 certification."
      />

      <div className="mx-auto max-w-wide px-6 py-12">
        <SpecTable
          rows={CAPABILITY_ROWS}
          density="engineering"
          caption="Precise Engineers capability envelope"
        />
      </div>

      <div className="mx-auto max-w-wide px-6 py-12">
        <h2 className="font-display text-h3 font-medium text-steel-950">Product families</h2>

        <div className="mt-8">
          <h3 className="text-helper font-medium text-steel-600 uppercase tracking-caption">
            Expansion Joints
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preciseProducts['expansion-joints'].map((product) => (
              <a
                key={product.href}
                href={product.href}
                className="block border border-steel-200 bg-white rounded-sm p-6 transition-colors duration-fast hover:border-steel-400"
              >
                <p className="font-medium text-steel-950">{product.name}</p>
                <p className="mt-1 text-helper text-steel-600">{product.scope}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-helper font-medium text-steel-600 uppercase tracking-caption">
            Flow Control
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preciseProducts['flow-control'].map((product) => (
              <a
                key={product.href}
                href={product.href}
                className="block border border-steel-200 bg-white rounded-sm p-6 transition-colors duration-fast hover:border-steel-400"
              >
                <p className="font-medium text-steel-950">{product.name}</p>
                <p className="mt-1 text-helper text-steel-600">{product.scope}</p>
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-helper text-steel-500">
          Note: rows marked &ldquo;DEMO figure — engineering data pending&rdquo; are industry-plausible
          placeholder values for the management prototype only. Engineering-supplied data
          required before launch (plan §P-5).
        </p>
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
