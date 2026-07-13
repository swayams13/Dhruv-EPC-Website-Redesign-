// Precise Engineers /company — plan §3.2 (about, works, careers).
// Layout provides chrome + footer. Content from lib/content/precise-engineers
// (Zod-parsed singletons). Careers renders an honest mailto — no fabricated
// openings (no invented claims per CLAUDE.md).
import type { Metadata } from 'next'
import { MobileBottomBar, PageHero, StatBand } from '@vedanta/datum-ui'
import { buildBreadcrumbList, buildLocalBusiness } from '@vedanta/schemas'
import { RFQBand } from '../../../components/RFQBand'
import {
  preciseEntity,
  precisePhoneHref,
  preciseStats,
  preciseWhatsappHref,
} from '../../../lib/content/precise-engineers'

export const metadata: Metadata = {
  title: 'Company — About, Works & Careers | Precise Engineers',
  description:
    'Precise Engineers — expansion joints and bellows to EJMA since 1994 at GIDC Estate, Vitthal Udyognagar, Anand. EIL approved unit, ISO 9001:2015 certified, serving twelve sectors.',
}

const breadcrumbLd = buildBreadcrumbList([
  { name: 'Precise Engineers', url: 'https://vedantagroup.net/precise-engineers' },
  { name: 'Company', url: 'https://vedantagroup.net/precise-engineers/company' },
])

export default function PreciseCompanyPage() {
  const careersEmail = preciseEntity.emails[0] as string // Zod guarantees emails.min(1)

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbLd, buildLocalBusiness(preciseEntity)]),
        }}
      />

      <PageHero
        breadcrumbs={[
          { label: 'Precise Engineers', href: '/precise-engineers' },
          { label: 'Company' },
        ]}
        eyebrow="Company"
        title="Expansion joints from Anand since 1994."
        lead="Precise Engineers was established at Vitthal Udyognagar GIDC, Anand, Gujarat, in 1994. The works designs and manufactures metallic, rubber and fabric expansion joints to EJMA — circular 80 to 8,000 mm NB — as an EIL approved unit with an ISO 9001:2015 quality system, serving twelve sectors from oil & gas to the Department of Atomic Energy."
      />

      <section aria-label="Company figures" className="mx-auto max-w-wide px-6">
        <StatBand stats={preciseStats} />
      </section>

      {/* Works — address from the entity singleton, never hard-coded */}
      <section aria-labelledby="works-heading" className="mx-auto max-w-wide px-6 py-16">
        <h2 id="works-heading" className="font-display text-h1 font-medium text-steel-950">
          The works
        </h2>
        <dl className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {preciseEntity.worksAddresses.map((works) => (
            <div key={works.label}>
              <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">
                {works.label}
              </dt>
              <dd className="mt-1 text-sm text-steel-700">{works.address}</dd>
            </div>
          ))}
          <div>
            <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">
              Sectors served
            </dt>
            <dd className="mt-1 text-sm text-steel-700">
              Oil &amp; gas, refineries &amp; petrochemicals, fertilizers, power &amp; energy,
              steel, cement, ship building, cross-country pipelines, sugar, dairy, paper and the
              Department of Atomic Energy.
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">
              Approvals
            </dt>
            <dd className="mt-1 text-sm text-steel-700">
              Approved unit of Engineers India Limited · ISO 9001:2015 certified.
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
            We hire bellows-forming operators, welders, QA/QC engineers and design engineers for
            the Anand works. Send your CV to{' '}
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

      <RFQBand company="precise" whatsappHref={preciseWhatsappHref} />

      <MobileBottomBar
        phoneHref={precisePhoneHref}
        whatsappHref={preciseWhatsappHref}
        rfqHref="/request-a-quote?company=precise"
      />
    </main>
  )
}
