// Precise Engineers home — Datum §19 (home hero, graphite + stats band),
// §16 cards, §20 trust, §21.9 RFQ band. Blue law: variant="rfq" is the only
// flex-filled element per view. Content from lib/content/precise-engineers
// (Zod-parsed).
import type { Metadata } from 'next'
import { CertificationCard, HomeHero, ProductCard, type StampProps } from '@vedanta/datum-ui'
import { buildLocalBusiness } from '@vedanta/schemas'
import { RFQBand } from '../../components/RFQBand'
import { preciseCertifications, preciseEntity, preciseProducts, preciseStats, preciseWhatsappHref } from '../../lib/content/precise-engineers'

export const metadata: Metadata = {
  title: 'Precise Engineers — EJMA Metallic Bellows & Expansion Joints, Anand',
  description:
    'Metallic bellows expansion joints to EJMA and ASME B31.3, 80 – 8,000 mm NB. Rubber and fabric bellows, dismantling joints, zero velocity valves. EIL approved, ISO 9001:2015.',
}

const STAMP_BY_NAME: Record<string, StampProps['code'] | undefined> = {
  'ISO 9001:2015': 'ISO-9001',
  'EIL Approved Vendor': undefined, // no §12 stamp exists for EIL — card renders without a mark
}

export default function PreciseHome() {
  const products = Object.values(preciseProducts).flat()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusiness(preciseEntity)) }}
      />

      <HomeHero
        eyebrow="EIL Approved · ISO 9001:2015 · V.U.Nagar, Anand"
        headline="Expansion joints to EJMA, from 80 to 8,000 mm."
        subhead="Metallic, rubber and fabric bellows in SS, Inconel, Incoloy, Hastelloy and duplex — for oil & gas, refining, fertilizers, power, steel and atomic energy."
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=precise' }}
        secondary={{ label: 'View products', href: '#products' }}
        stats={preciseStats}
      />

      {/* Product grid — §16 product cards, no-photo variant until the works shoot (§P-5) */}
      <section id="products" aria-labelledby="products-heading" className="mx-auto max-w-wide px-6 py-16">
        <h2 id="products-heading" className="font-display text-h1 font-medium text-steel-950">
          Products
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.href} name={p.name} oneLineScope={p.scope} href={p.href} />
          ))}
        </div>
      </section>

      {/* Trust — §20 certification cards with plain-words scope */}
      <section aria-labelledby="certs-heading" className="border-t border-steel-200 bg-steel-50">
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="certs-heading" className="font-display text-h1 font-medium text-steel-950">
            Certifications &amp; approvals
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {preciseCertifications.map((cert) => (
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

      <RFQBand company="precise" whatsappHref={preciseWhatsappHref} />
    </main>
  )
}
