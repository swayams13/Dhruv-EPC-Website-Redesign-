// /about — plan §3.1 (group history, leadership, values — one page).
// Steel-only group scope (§5). Leadership section omitted — no sourced
// leadership records exist (no invented claims per CLAUDE.md); flagged in
// progress.md. Values are stated as verifiable practices, not adjectives
// (house style: no superlatives without a sourced number).
import type { Metadata } from 'next'
import { Button, PageHero, StatBand } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { groupStats } from '../../../lib/content/group'

export const metadata: Metadata = {
  title: 'About — Vedanta Group',
  description:
    'Established 1994 at Vitthal Udyognagar, Anand. Two specialized works in Gujarat: expansion joints to EJMA at Anand (Precise Engineers) and ASME U/U2 static equipment at Vadodara (Dhruv EPC Solutions).',
}

const breadcrumbLd = buildBreadcrumbList([
  { name: 'Vedanta Group', url: 'https://vedantagroup.net' },
  { name: 'About', url: 'https://vedantagroup.net/about' },
])

// Values as verifiable practices — each grounded in the sourced record,
// none reliant on an adjective (Datum §1 enforcement-rule format).
const VALUES = [
  {
    name: 'Claims carry numbers',
    body: 'Every capability statement on this site names a size, a code, or a stamp — 80 – 8,000 mm NB bellows, ASME Sec. VIII Div. 1 & 2, IBR. A claim a reviewer cannot verify is not published.',
  },
  {
    name: 'Independent verification',
    body: 'Work is executed under third-party inspection — Lloyd’s Register, Bureau Veritas, DNV — and statutory IBR review. Credentials are reconstructable with the issuing authority, not asserted.',
  },
  {
    name: 'One quality system',
    body: 'Both works operate under ISO 9001:2015 management systems, with EIL vendor approval at Anand and ASME U & U2 Certificates of Authorization at Vadodara.',
  },
]

// Footer is owned by (group)/layout.tsx — pages must not render their own
// (2026-07-16 audit P0-1: per-page Footers stacked a second full footer
// under the layout's on every group route).

export default function AboutPage() {
  return (
    <>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        <PageHero
          breadcrumbs={[{ label: 'Vedanta Group', href: '/' }, { label: 'About' }]}
          eyebrow="The group"
          title="Two works, one record — since 1994."
          lead="Precise Engineers was established in 1994 at Vitthal Udyognagar GIDC, Anand, building metallic, rubber and fabric expansion joints to EJMA. The group's second works, Dhruv EPC Solutions at Manjusar GIDC, Savli, Vadodara, fabricates static equipment to ASME Sec. VIII Div. 1 & 2 under U, U2 and IBR authorizations."
        />

        {/* Group figures — same sourced band as the group home (§19) */}
        <section aria-label="Group figures" className="mx-auto max-w-wide px-6">
          <StatBand stats={groupStats} />
        </section>

        {/* History — sourced facts only; no unsourced founding narrative */}
        <section aria-labelledby="history-heading" className="mx-auto max-w-wide px-6 py-16">
          <h2 id="history-heading" className="font-display text-h1 font-medium text-steel-950">
            History
          </h2>
          <div className="mt-6 flex max-w-content flex-col gap-4 text-body-lg text-steel-700">
            <p>
              The group began at Vitthal Udyognagar GIDC, Anand, Gujarat, in 1994, where Precise
              Engineers manufactures expansion joints and bellows — circular 80 to 8,000 mm NB —
              for twelve sectors, from oil &amp; gas and refineries to the Department of Atomic
              Energy. Precise Engineers is an approved unit of Engineers India Limited and is
              ISO 9001:2015 certified.
            </p>
            <p>
              Dhruv EPC Solutions, the group&apos;s static-equipment works at Manjusar GIDC, Savli,
              Vadodara, fabricates pressure vessels, heat exchangers and process skids to ASME
              Sec. VIII Div. 1 &amp; 2, holding ASME U and U2 Certificates of Authorization and IBR
              approval, with jobs executed under third-party inspection agencies including LRS, BV
              and DNV.
            </p>
          </div>
        </section>

        {/* Values — enforcement-rule format, no unattributed adjectives */}
        <section
          aria-labelledby="values-heading"
          className="border-t border-steel-200 bg-steel-50"
        >
          <div className="mx-auto max-w-wide px-6 py-16">
            <h2 id="values-heading" className="font-display text-h1 font-medium text-steel-950">
              How we work
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {VALUES.map((value) => (
                <div key={value.name} className="rounded-sm border border-steel-200 bg-white p-6">
                  <h3 className="text-h4 font-medium text-steel-950">{value.name}</h3>
                  <p className="mt-3 text-sm text-steel-700">{value.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company doors — light variant of the group-home §6.1.2 pattern */}
        <section aria-labelledby="doors-heading" className="mx-auto max-w-wide px-6 py-16">
          <h2 id="doors-heading" className="font-display text-h1 font-medium text-steel-950">
            The companies
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[
              {
                company: 'dhruv' as const,
                name: 'Dhruv EPC Solutions',
                scope: 'Pressure vessels, heat exchangers and process skids to ASME Sec. VIII Div. 1 & 2 — Vadodara works.',
                href: '/dhruv-epc',
              },
              {
                company: 'precise' as const,
                name: 'Precise Engineers',
                scope: 'Metallic, rubber and fabric expansion joints to EJMA, 80 – 8,000 mm NB — Anand works.',
                href: '/precise-engineers',
              },
            ].map((door) => (
              <article
                key={door.company}
                data-company={door.company}
                className="flex flex-col rounded-sm border border-steel-200 bg-white p-8"
              >
                <h3 className="font-display text-h3 font-medium text-steel-950">{door.name}</h3>
                <p className="mt-2 text-body-lg text-steel-700">{door.scope}</p>
                <div className="mt-6">
                  <Button variant="link" href={door.href}>
                    Enter {door.name} →
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
