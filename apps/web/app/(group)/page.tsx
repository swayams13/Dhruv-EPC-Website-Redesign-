// Group home — plan §6.1 (two-doors pattern). Neutral steel system; both
// accents appear ONLY inside each company's door card (data-company scope on
// the card — the group doesn't pick a favorite child). Zero accent-filled
// elements on this page: the door CTAs are accent-colored links (§13
// variant="link"), not fills.
import type { Metadata } from 'next'
import {
  Button,
  CertificationCard,
  StatBand,
  type StampProps,
} from '@vedanta/datum-ui'
import { buildOrganization } from '@vedanta/schemas'
import { dhruvCertifications } from '../../lib/content/dhruv-epc'
import { groupEntity, groupStats } from '../../lib/content/group'
import { preciseCertifications } from '../../lib/content/precise-engineers'

export const metadata: Metadata = {
  title: 'Vedanta Group — Precision Fabrication & Flow-Control Engineering, Gujarat',
  description:
    'Dhruv EPC Solutions (ASME U/U2, IBR static equipment, Vadodara) and Precise Engineers (EJMA expansion joints 80 – 8,000 mm, Anand). Est. 1994.',
}

// §6.1.2 — the page's reason to exist. Equal visual weight; scope lines carry
// numbers (§16 discipline); chips mono. Sourced from the seeded records.
const DOORS = [
  {
    company: 'dhruv' as const,
    name: 'Dhruv EPC Solutions',
    scope: 'Pressure vessels, heat exchangers and process skids to ASME Sec. VIII Div. 1 & 2',
    chips: ['ASME U · U2 · IBR', 'CS · SS · Ni alloys', 'Vadodara works'],
    groups: ['Static Equipment', 'Skids & Packages', 'Fabrication & Machining'],
    href: '/dhruv-epc',
    cta: 'Enter Dhruv EPC',
  },
  {
    company: 'precise' as const,
    name: 'Precise Engineers',
    scope: 'Metallic, rubber and fabric expansion joints to EJMA, 80 – 8,000 mm NB',
    chips: ['EJMA · ASME B31.3', '80 – 8,000 mm NB', 'EIL approved'],
    groups: ['Expansion Joints', 'Flow Control'],
    href: '/precise-engineers',
    cta: 'Enter Precise Engineers',
  },
]

const STAMP_BY_NAME: Record<string, StampProps['code'] | undefined> = {
  'ASME U Certificate of Authorization': 'U',
  'ASME U2 Certificate of Authorization': 'U2',
  'IBR Approval': 'IBR',
  'ISO 9001:2015 · 14001:2015 · 45001:2018': 'ISO-9001',
  'ISO 9001:2015': 'ISO-9001',
}

// Footer is owned by (group)/layout.tsx — pages must not render their own
// (2026-07-16 audit P0-1: this page previously stacked a second full footer
// under the layout's).

export default function GroupHome() {
  return (
    <>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganization(groupEntity)) }}
        />

        {/* §6.1.1 — typographic graphite hero, compressed. Doors-first
            reorder (2026-07-16, docs/ui-ux-review.md §5 / decisions.md): the
            two-doors section is this page's reason to exist and now sits
            inside the first scroll; the exploded-view sequence moved below
            the doors as the shared-capability statement. */}
        <section className="bg-steel-900">
          <div className="mx-auto max-w-wide px-6 pb-16 pt-24">
            <p className="text-xs font-medium uppercase tracking-caption text-steel-400">
              ASME U &amp; U2 · IBR · EIL Approved · ISO 9001:2015
            </p>
            <h1 className="mt-4 max-w-content font-display text-display-xl font-medium text-steel-50">
              Vedanta Group — precision fabrication and flow-control engineering since 1994.
            </h1>
            <p className="mt-6 max-w-content text-body-lg text-steel-400">
              Two specialized works in Gujarat: static equipment to ASME Sec. VIII at Vadodara,
              and expansion joints to EJMA at Anand — one group, one quality system.
            </p>
          </div>
        </section>

        {/* §6.1.2 — two doors, equal visual weight; accents live only inside
            the cards via data-company scope */}
        <section aria-labelledby="doors-heading" className="bg-steel-900">
          <div className="mx-auto max-w-wide px-6 pb-24">
            <h2 id="doors-heading" className="sr-only">
              Group companies
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {DOORS.map((door) => (
                <article
                  key={door.company}
                  data-company={door.company}
                  className="flex h-full flex-col rounded-sm border border-steel-800 bg-steel-950 p-8 transition-colors duration-fast ease-standard hover:border-accent"
                >
                  <div className="mb-8 h-px w-16 bg-accent" aria-hidden="true" />
                  <h3 className="font-display text-h3 font-medium text-steel-50">{door.name}</h3>
                  <p className="mt-2 text-body-lg text-steel-400">{door.scope}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {door.chips.map((chip) => (
                      <li
                        key={chip}
                        className="rounded-sm border border-steel-800 bg-steel-900 px-3 py-1 font-mono text-helper text-steel-400"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-medium uppercase tracking-caption text-steel-600">
                    {door.groups.join(' · ')}
                  </p>
                  <div className="mt-auto pt-8">
                    <Button variant="link" onDark href={door.href}>
                      {door.cta} →
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* §6.1.3 — group stats band, combined figures, each sourced */}
        <section className="bg-steel-900">
          <div className="mx-auto max-w-wide px-6 pt-12">
            <StatBand stats={groupStats} onDark />
          </div>
        </section>

        {/* §6.1.4 — shared proof strip: certifications union, entity-tagged
            via company sub-headings. Client wall omitted — no verified client
            records yet (Session 7 precedent). */}
        <section id="proof" aria-labelledby="proof-heading" className="border-t border-steel-200 bg-steel-50">
          <div className="mx-auto max-w-wide px-6 py-16">
            <h2 id="proof-heading" className="font-display text-h1 font-medium text-steel-950">
              Certifications &amp; approvals
            </h2>
            {[
              { label: 'Dhruv EPC Solutions', certs: dhruvCertifications },
              { label: 'Precise Engineers', certs: preciseCertifications },
            ].map((group) => (
              <div key={group.label} className="mt-8">
                <h3 className="text-xs font-medium uppercase tracking-caption text-steel-600">
                  {group.label}
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {group.certs.map((cert) => (
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
            ))}
          </div>
        </section>
      </main>
      {/* §6.1.5 title-block footer renders from (group)/layout.tsx —
          audit P0-1: this page previously stacked a second full footer. */}
    </>
  )
}
