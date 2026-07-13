// /contact — plan §3.1 + FR-6: group + both works, entity records.
// ALL entity data renders from the EntityRecord singletons (CLAUDE.md:
// hard-coding an address in a component is a bug). Map embeds omitted —
// plain Google Maps links carry the same information at zero JS/consent
// cost; flagged in progress.md.
import type { Metadata } from 'next'
import { Footer, PageHero } from '@vedanta/datum-ui'
import type { EntityRecord } from '@vedanta/schemas'
import { buildBreadcrumbList, buildLocalBusiness } from '@vedanta/schemas'
import { dhruvEntity } from '../../../lib/content/dhruv-epc'
import { groupEntity } from '../../../lib/content/group'
import { preciseEntity } from '../../../lib/content/precise-engineers'

export const metadata: Metadata = {
  title: 'Contact — Vedanta Group',
  description:
    'Reach Dhruv EPC Solutions (Manjusar GIDC, Savli, Vadodara) or Precise Engineers (GIDC Estate, Vitthal Udyognagar, Anand) — phones, emails and works addresses for both companies.',
}

const breadcrumbLd = buildBreadcrumbList([
  { name: 'Vedanta Group', url: 'https://vedantagroup.net' },
  { name: 'Contact', url: 'https://vedantagroup.net/contact' },
])

const FOOTER_COLUMNS = [
  {
    heading: 'Companies',
    links: [
      { label: 'Dhruv EPC Solutions', href: '/dhruv-epc' },
      { label: 'Precise Engineers', href: '/precise-engineers' },
    ],
  },
  {
    heading: 'Group',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Request a Quote', href: '/request-a-quote' },
    ],
  },
]

function mapsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

// One entity card — a contact-page rendering of the §18 title-block record.
function EntityBlock({ entity, note }: { entity: EntityRecord; note?: string }) {
  return (
    <article className="rounded-sm border border-steel-200 bg-white p-8">
      <h3 className="font-display text-h3 font-medium text-steel-950">{entity.legalName}</h3>
      {note && <p className="mt-1 text-helper text-steel-600">{note}</p>}

      <dl className="mt-6 flex flex-col gap-6">
        {entity.worksAddresses.map((works) => (
          <div key={works.label}>
            <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">
              {works.label}
            </dt>
            <dd className="mt-1 text-sm text-steel-700">
              {works.address}
              <br />
              <a
                href={mapsHref(works.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-row items-center text-accent-text hover:text-accent-text-hover hover:underline"
              >
                View on Google Maps
              </a>
            </dd>
          </div>
        ))}

        <div>
          <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">
            Registered office
          </dt>
          <dd className="mt-1 text-sm text-steel-700">{entity.registeredOffice}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">Phone</dt>
          <dd className="mt-1 flex flex-col">
            {entity.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="inline-flex min-h-row items-center font-mono text-sm text-accent-text hover:text-accent-text-hover hover:underline"
              >
                {phone}
              </a>
            ))}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-caption text-steel-600">Email</dt>
          <dd className="mt-1 flex flex-col">
            {entity.emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="inline-flex min-h-row items-center text-sm text-accent-text hover:text-accent-text-hover hover:underline"
              >
                {email}
              </a>
            ))}
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default function ContactPage() {
  return (
    <>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              breadcrumbLd,
              buildLocalBusiness(dhruvEntity),
              buildLocalBusiness(preciseEntity),
            ]),
          }}
        />

        <PageHero
          breadcrumbs={[{ label: 'Vedanta Group', href: '/' }, { label: 'Contact' }]}
          eyebrow="Contact"
          title="Two works. Direct lines."
          lead="Requirement with a drawing? The RFQ form routes it to the right engineering team. Everything else — phones, emails and works addresses for both companies are below."
        />

        {/* Company entity records — each scoped to its own accent for links */}
        <section aria-labelledby="companies-heading" className="mx-auto max-w-wide px-6 py-16">
          <h2 id="companies-heading" className="sr-only">
            Company contact records
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div data-company="dhruv">
              <EntityBlock
                entity={dhruvEntity}
                note="Static equipment — pressure vessels, heat exchangers, skids"
              />
            </div>
            <div data-company="precise">
              <EntityBlock
                entity={preciseEntity}
                note="Expansion joints, bellows and flow control"
              />
            </div>
          </div>
        </section>

        {/* Group registered office — from the group singleton */}
        <section
          aria-labelledby="group-heading"
          className="border-t border-steel-200 bg-steel-50"
        >
          <div className="mx-auto max-w-wide px-6 py-16">
            <h2 id="group-heading" className="font-display text-h1 font-medium text-steel-950">
              Group registered office
            </h2>
            <p className="mt-4 max-w-content text-sm text-steel-700">
              {groupEntity.legalName} · {groupEntity.registeredOffice}
            </p>
          </div>
        </section>
      </main>

      <Footer
        entity={groupEntity}
        columns={FOOTER_COLUMNS}
        certificationsHref="/#proof"
        privacyHref="/privacy"
        termsHref="/terms"
      />
    </>
  )
}
