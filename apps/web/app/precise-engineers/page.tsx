// Precise Engineers home — Datum §19 (home hero, graphite + stats band),
// §16 cards, §20 trust, §21.9 RFQ band. Blue law: variant="rfq" is the only
// flex-filled element per view. Content from lib/content-loader
// (JSON-backed, Zod-parsed).
import type { Metadata } from 'next'
import {
  CertificationCard,
  DomainIcon,
  type DomainIconName,
  HomeHero,
  ProductCard,
  type StampProps,
} from '@vedanta/datum-ui'
import { buildLocalBusiness } from '@vedanta/schemas'
import { RFQBand } from '../../components/RFQBand'
import { getCertifications, getEntity, whatsappHref } from '../../lib/content-loader'
import { preciseProducts, preciseStats } from '../../lib/site-data'

const preciseEntity = getEntity('precise-engineers')
const preciseCertifications = getCertifications('precise-engineers')
const preciseWhatsappHref = whatsappHref(preciseEntity)

export const metadata: Metadata = {
  title: 'Precise Engineers — EJMA Bellows & Expansion Joints, Anand',
  description:
    'Metallic bellows expansion joints to EJMA and ASME B31.3, 80 – 8,000 mm NB. Rubber and fabric bellows, dismantling joints, zero velocity valves. EIL approved, ISO 9001:2015.',
}

const STAMP_BY_NAME: Record<string, StampProps['code'] | undefined> = {
  'ISO 9001:2015': 'ISO-9001',
  'EIL Approved Vendor': undefined, // no §12 stamp exists for EIL — card renders without a mark
}

// §12 domain icons on the product grid — interim visual until the works
// shoot supplies real card photography (2026-07-16, docs/ui-ux-review.md §5).
// Bellows variants intentionally share the bellows section view.
const ICON_BY_HREF: Record<string, DomainIconName> = {
  '/precise-engineers/products/expansion-joints/metallic-bellows-expansion-joint/': 'bellows',
  '/precise-engineers/products/expansion-joints/telescopic-expansion-joint/': 'telescopic',
  '/precise-engineers/products/expansion-joints/rubber-bellows/': 'bellows',
  '/precise-engineers/products/expansion-joints/fabric-bellows/': 'bellows',
  '/precise-engineers/products/expansion-joints/dismantling-joint/': 'flange',
  '/precise-engineers/products/expansion-joints/flange-adaptor/': 'flange',
  '/precise-engineers/products/flow-control/zero-velocity-valve/': 'valve',
  '/precise-engineers/products/flow-control/dual-plate-check-valve/': 'valve',
  '/precise-engineers/products/flow-control/damper/': 'damper',
}

export default function PreciseHome() {
  const products = Object.values(preciseProducts).flat()

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildLocalBusiness(preciseEntity)) }}
      />

      {/* Exploded-view metallic bellows expansion joint in the photo slot —
          docs/design.md, override logged in docs/decisions.md [2026-07-16].
          Dimension label: metallic-bellows-expansion-joint spec-table max
          circular size — sourced [vedantagroup.net], not a demo placeholder. */}
      <HomeHero
        eyebrow="EIL Approved · ISO 9001:2015 · V.U.Nagar, Anand"
        headline="Expansion joints to EJMA, from 80 to 8,000 mm."
        subhead="Metallic, rubber and fabric bellows in SS, Inconel, Incoloy, Hastelloy and duplex — for oil & gas, refining, fertilizers, power, steel and atomic energy."
        rfq={{ label: 'Request a quote', href: '/request-a-quote?company=precise' }}
        secondary={{ label: 'View products', href: '#products' }}
        stats={preciseStats}

      />

      {/* Product grid — §16 product cards, no-photo variant until the works shoot (§P-5) */}
      <section id="products" aria-labelledby="products-heading" className="bg-steel-950">
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="products-heading" className="font-display text-h1 font-medium text-steel-50">
            Products
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const iconName = ICON_BY_HREF[p.href]
              return (
                <ProductCard
                  key={p.href}
                  name={p.name}
                  oneLineScope={p.scope}
                  href={p.href}
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
