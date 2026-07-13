// Dhruv EPC /company — plan §3.3 (about, works, careers).
// Layout provides chrome + footer. Content from lib/content/dhruv-epc
// (Zod-parsed singletons). Careers renders an honest mailto — no fabricated
// openings (no invented claims per CLAUDE.md).
import type { Metadata } from 'next'
import { MobileBottomBar, PageHero, StatBand } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildLocalBusiness } from '@vedanta/schemas'
import { RFQBand } from '../../../components/RFQBand'
import {
  dhruvEntity,
  dhruvPhoneHref,
  dhruvStats,
  dhruvWhatsappHref,
} from '../../../lib/content/dhruv-epc'

export const metadata: Metadata = {
  title: 'Company — About, Works & Careers | Dhruv EPC',
  description:
    'Dhruv EPC Solutions Pvt. Ltd. — static-equipment works at Manjusar GIDC, Savli, Vadodara. ASME U & U2 Certificates of Authorization, IBR approval, ISO 9001:2015 quality system.',
}

const breadcrumbLd = buildBreadcrumbList([
  { name: 'Dhruv EPC', url: 'https://vedantagroup.net/dhruv-epc' },
  { name: 'Company', url: 'https://vedantagroup.net/dhruv-epc/company' },
])

export default function DhruvCompanyPage() {
  const careersEmail = dhruvEntity.emails[0] as string // Zod guarantees emails.min(1)

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbLd, buildLocalBusiness(dhruvEntity)]),
        }}
      />

      <PageHero
        breadcrumbs={[{ label: 'Dhruv EPC', href: '/dhruv-epc' }, { label: 'Company' }]}
        eyebrow="Company"
        title="A static-equipment works built on verifiable authorizations."
        lead="Dhruv EPC Solutions Pvt. Ltd. fabricates pressure vessels, heat exchangers, process skids and heavy fabrication to ASME Sec. VIII Div. 1 & 2 at Manjusar GIDC, Savli, Vadodara — under ASME U and U2 Certificates of Authorization, IBR approval and an ISO 9001:2015 quality system."
      />

      <section aria-label="Company figures" className="mx-auto max-w-wide px-6">
        <StatBand stats={dhruvStats} />
      </section>

      {/* Works — address from the entity singleton, never hard-coded */}
      <section aria-labelledby="works-heading" className="mx-auto max-w-wide px-6 py-16">
        <h2 id="works-heading" className="font-display text-h1 font-medium text-steel-950">
          The works
        </h2>
        <dl className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {dhruvEntity.worksAddresses.map((works) => (
            <div key={works.label}>
              <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">
                {works.label}
              </dt>
              <dd className="mt-1 text-sm text-steel-700">{works.address}</dd>
            </div>
          ))}
          <div>
            <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">
              Registered office
            </dt>
            <dd className="mt-1 text-sm text-steel-700">{dhruvEntity.registeredOffice}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">
              Jobs executed under
            </dt>
            <dd className="mt-1 text-sm text-steel-700">
              Third-party inspection agencies including LRS, BV and DNV, and statutory IBR review.
            </dd>
          </div>
        </dl>
      </section>

      {/* Careers — honest mailto; no fabricated openings */}
      <section aria-labelledby="careers-heading" className="border-t border-steel-200 bg-steel-50">
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="careers-heading" className="font-display text-h1 font-medium text-steel-950">
            Careers
          </h2>
          <p className="mt-4 max-w-content text-body-lg text-steel-700">
            We hire welders, fitters, QA/QC engineers and design engineers for the Vadodara works.
            Send your CV to{' '}
            <a
              href={`mailto:${careersEmail}`}
              className="inline-flex min-h-row items-center text-accent-text hover:text-accent-text-hover hover:underline"
            >
              {careersEmail}
            </a>
            .
          </p>
        </div>
      </section>

      <RFQBand company="dhruv" whatsappHref={dhruvWhatsappHref} />

      <MobileBottomBar
        phoneHref={dhruvPhoneHref}
        whatsappHref={dhruvWhatsappHref}
        rfqHref="/request-a-quote?company=dhruv"
      />
    </main>
  )
}
