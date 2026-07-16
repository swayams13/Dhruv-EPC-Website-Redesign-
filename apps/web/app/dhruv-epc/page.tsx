// Dhruv EPC home — Datum §19 (home hero, graphite + stats band), §16 cards,
// §20 trust, §21.9 RFQ band. Content from lib/content/dhruv-epc (Zod-parsed).
import type { Metadata } from 'next'
import { CertificationCard, HomeHero, ProductCard, type StampProps } from '@vedanta/datum-ui'
import { buildLocalBusiness } from '@vedanta/schemas'
import { RFQBand } from '../../components/RFQBand'
import { dhruvCertifications, dhruvEntity, dhruvEquipment, dhruvStats, dhruvWhatsappHref } from '../../lib/content/dhruv-epc'

export const metadata: Metadata = {
  title: 'Dhruv EPC Solutions — ASME U/U2 Static Equipment Fabricator, Vadodara',
  description:
    'Pressure vessels, heat exchangers, pipe spools and process skids. ASME U & U2 stamp, IBR, ISO 9001/14001/45001.',
}

const STAMP_BY_NAME: Record<string, StampProps['code']> = {
  'ASME U Certificate of Authorization': 'U',
  'ASME U2 Certificate of Authorization': 'U2',
  'IBR Approval': 'IBR',
  'ISO 9001:2015 · 14001:2015 · 45001:2018': 'ISO-9001',
}

export default function DhruvHome() {
  const equipment = Object.values(dhruvEquipment).flat()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusiness(dhruvEntity)) }}
      />

      <HomeHero
        eyebrow="ASME U & U2 · IBR · Manjusar GIDC, Vadodara"
        headline="Static equipment to ASME Sec. VIII, built in Vadodara."
        subhead="Pressure vessels, heat exchangers, columns and skids in CS, LAS, SS, duplex and high-nickel alloys — for oil & gas, refining, fertilizers, power and steel."
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=dhruv' }}
        secondary={{ label: 'View equipment', href: '#equipment' }}
        stats={dhruvStats}
      />

      {/* Equipment grid — §16 product cards, no-photo variant until the works shoot (§P-5) */}
      <section id="equipment" aria-labelledby="equipment-heading" className="bg-steel-950">
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="equipment-heading" className="font-display text-h1 font-medium text-steel-50">
            Equipment
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((eq) => (
              <ProductCard key={eq.href} name={eq.name} oneLineScope={eq.scope} href={eq.href} onDark />
            ))}
          </div>
        </div>
      </section>

      {/* Trust — §20 certification cards with plain-words scope */}
      <section aria-labelledby="certs-heading" className="border-t border-steel-200 bg-steel-50">
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="certs-heading" className="font-display text-h1 font-medium text-steel-950">
            Certifications
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dhruvCertifications.map((cert) => (
              <CertificationCard
                key={cert.name}
                stampCode={STAMP_BY_NAME[cert.name]}
                name={cert.name}
                scopeStatement={cert.scopeStatement}
                issuer={cert.issuer}
                validFrom={cert.validFrom}
                validTo={cert.validTo}
                artifactUrl={cert.artifactUrl}
              />
            ))}
          </div>
        </div>
      </section>

      <RFQBand company="dhruv" whatsappHref={dhruvWhatsappHref} />
    </main>
  )
}
