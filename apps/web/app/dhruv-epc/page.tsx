// Dhruv EPC home — Datum §19 (home hero, graphite + stats band), §16 cards,
// §20 trust, §21.9 RFQ band. Content from lib/content-loader (JSON-backed, Zod-parsed).
import type { Metadata } from 'next'
import {
  Button,
  CertificationCard,
  ClientMarquee,
  DomainIcon,
  type DomainIconName,
  HomeHero,
  ProductCard,
  StatBand,
  type StampProps,
} from '@vedanta/datum-ui'
import { buildLocalBusiness } from '@vedanta/schemas'
import { RFQBand } from '../../components/RFQBand'
import { getCertifications, getClients, getEntity, whatsappHref } from '../../lib/content-loader'
import { dhruvEquipment, dhruvStats } from '../../lib/site-data'

const dhruvEntity = getEntity('dhruv-epc')
const dhruvCertifications = getCertifications('dhruv-epc')
const dhruvWhatsappHref = whatsappHref(dhruvEntity)
// Clients & Projects spec §4: even indices row A, odd row B — 44 granted
// clients today (not the spec's "42", see docs/mistakes.md 2026-09-03).
const dhruvClients = getClients()
const dhruvClientMarqueeRowA = dhruvClients.filter((_, i) => i % 2 === 0)
const dhruvClientMarqueeRowB = dhruvClients.filter((_, i) => i % 2 === 1)

export const metadata: Metadata = {
  title: 'Dhruv EPC Solutions — ASME U/U2 Fabricator, Vadodara',
  description:
    'Pressure vessels, heat exchangers, pipe spools and process skids. ASME U & U2 stamp, IBR, ISO 9001/14001/45001.',
}

const STAMP_BY_NAME: Record<string, StampProps['code']> = {
  'ASME U Certificate of Authorization': 'U',
  'ASME U2 Certificate of Authorization': 'U2',
  'IBR Approval': 'IBR',
  'ISO 9001:2015 · 14001:2015 · 45001:2018': 'ISO-9001',
}

// §12 domain icons on the equipment grid — interim visual until the works
// shoot supplies real card photography (2026-07-16, docs/ui-ux-review.md §5).
const ICON_BY_HREF: Record<string, DomainIconName> = {
  '/dhruv-epc/products/static-equipment/pressure-vessels/': 'vessel',
  '/dhruv-epc/products/static-equipment/heat-exchangers/': 'exchanger',
  '/dhruv-epc/products/static-equipment/storage-tanks/': 'tank',
  '/dhruv-epc/products/skids-packages/process-skids/': 'skid',
  '/dhruv-epc/products/skids-packages/pipe-spools/': 'pipeSpool',
  '/dhruv-epc/products/fabrication-machining/heavy-fabrication/': 'weldTorch',
  '/dhruv-epc/products/fabrication-machining/heavy-machining/': 'machining',
  '/dhruv-epc/products/fabrication-machining/plate-flanges/': 'flange',
}

export default function DhruvHome() {
  const equipment = Object.values(dhruvEquipment).flat()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusiness(dhruvEntity)) }}
      />

      {/* Hero C split hero (Decision 2, Phase 9/13-15). No photo/dimensionLabel
          wired yet — real works photography sourcing is explicitly deferred
          (Decision 6); the hatch placeholder renders in the meantime, same
          as the current live site. */}
      <HomeHero
        variant="split"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Dhruv EPC Solutions' }]}
        eyebrow="ASME U & U2 · IBR · Manjusar GIDC, Vadodara"
        headline="Static equipment to ASME Sec. VIII, built in Vadodara."
        subhead="Pressure vessels, heat exchangers, columns and skids in CS, LAS, SS, duplex and high-nickel alloys — for oil & gas, refining, fertilizers, power and steel."
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=dhruv' }}
        secondary={{ label: 'View equipment', href: '#equipment' }}
      />

      {/* Stat band — standalone light section below the hero, never overlaid
          on the photo (Decision 2). Matches (group)/page.tsx's existing
          standalone-band wrapper exactly. */}
      <section className="border-t border-steel-200 bg-steel-50">
        <div className="mx-auto max-w-wide px-6 pt-12">
          <StatBand stats={dhruvStats} />
        </div>
      </section>

      {/* Equipment grid — §16 product cards, no-photo variant until the works shoot (§P-5) */}
      <section id="equipment" aria-labelledby="equipment-heading" className="bg-steel-950">
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="equipment-heading" className="font-display text-h1 font-medium text-steel-50">
            Equipment
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((eq) => {
              const iconName = ICON_BY_HREF[eq.href]
              return (
                <ProductCard
                  key={eq.href}
                  name={eq.name}
                  oneLineScope={eq.scope}
                  href={eq.href}
                  icon={iconName && <DomainIcon name={iconName} size={32} />}
                  onDark
                />
              )
            })}
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

      {/* Clients & Projects spec §2/§4 — homepage clientele band (ref 4a) */}
      <section aria-labelledby="clientele-band-heading" className="border-t border-steel-200 bg-steel-50">
        <div className="mx-auto max-w-wide px-6 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-body font-bold text-steel-950">Who we supply</p>
              <h2 id="clientele-band-heading" className="mt-2 font-display text-h1 font-medium text-steel-950">
                Forty-four named clients
              </h2>
            </div>
            <Button variant="link" href="/clients-projects">
              See all clients &amp; projects ↗
            </Button>
          </div>
          <div className="mt-8 bg-white">
            <ClientMarquee rowA={dhruvClientMarqueeRowA} rowB={dhruvClientMarqueeRowB} />
          </div>
          <p className="mt-4 font-mono text-helper text-steel-500">Vedanta Group Brochure, 2026</p>
        </div>
      </section>

      <RFQBand company="dhruv" whatsappHref={dhruvWhatsappHref} />
    </main>
  )
}
