// /clients-projects — Clients & Projects spec §1/§7 step 2.
// Header nav's "Projects" item now points here (product-urls.ts
// projectsIndexHref). Steel-only group scope (§5) — no company accent.
import type { Metadata } from 'next'
import {
  ApprovalWall,
  ClientLogoWall,
  PageHero,
  ProjectRecordList,
  SectorGrid,
  StatBand,
} from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { RFQBand } from '../../../components/RFQBand'
import {
  getApprovals,
  getClients,
  getProjectHighlights,
  getSectors,
} from '../../../lib/content-loader'

export const metadata: Metadata = {
  title: 'Clients & Projects — Vedanta Group',
  description:
    'Named buyers, sectors served, executed jobs and the third-party agencies the group’s work is inspected and approved under — Dhruv EPC Solutions and Precise Engineers.',
}

const breadcrumbLd = buildBreadcrumbList([
  { name: 'Vedanta Group', url: 'https://vedantagroup.net' },
  { name: 'Clients & projects', url: 'https://vedantagroup.net/clients-projects' },
])

// Dhruv EPC's closing statement (spec §6) — presentation copy for this page
// only, not a content-collection record (nothing in §2's schema models a
// section pull-quote).
const DHRUV_PULL_QUOTE =
  'Interested in developing design and execution challenges of static equipment and skid/modular systems in partnership or individually.'

// Dropped, deliberately: the spec (§1) wants a `?works=dhruv`/`?works=precise`
// query resolved server-side to scope the project list, but also wants this
// page "fully static" (§ State management — zero client state, read at
// build time). Those two requirements conflict in the App Router: reading
// the `searchParams` prop in a Server Component forces the whole route to
// dynamic rendering (no static HTML output at all — confirmed by build:
// the route below shows as `ƒ` instead of `○`/`●`, and dropped out of the
// snapshot-routes.mjs crawl entirely, which only walks static HTML output).
// Kept the page fully static and dropped the query-filter feature rather
// than the static requirement, since "fully static" is the harder,
// load-bearing constraint (performance budget, snapshot testing, and this
// page's own explicit "if you find yourself adding a hook, re-read this"
// spirit). Flagged for a follow-up decision: implement `?works=` later as
// a small client-side filter (contradicts "not in the client") or drop it.
export default function ClientsProjectsPage() {
  const sectors = getSectors()
  const approvals = getApprovals('group')
  const clients = getClients()
  const grantedClientCount = clients.filter((c) => c.consent === 'granted').length

  const dhruvProjects = getProjectHighlights('dhruv-epc')
  const preciseProjects = getProjectHighlights('precise-engineers')

  // Reconstructable-from-data stats (§Persona C — a crawler must be able to
  // rebuild this page's claims from its own JSON records): sectors and
  // approvals counts come straight from the collections rendered below.
  // "Named clients" is computed from content/clients/ too (44 real records
  // — see docs/mistakes.md 2026-09-03: the verbatim §6 list actually names
  // 44 companies against the brochure's 42 logo marks, because two crops
  // each bundle two companies' marks into one image. Human confirmed 44 is
  // the authoritative count, 2026-09-03 — the spec's own "42" undercounts
  // the real list by 2 and is now the stale figure, not this page.
  // "Export destinations" (7) isn't derivable from the 15 highlighted jobs
  // (only 5 distinct countries appear in their statements) — kept as a
  // sourced brochure figure, not computed.
  const stats = [
    { value: String(clients.length), label: 'Named clients', source: 'Vedanta Group Brochure, 2026' },
    { value: String(sectors.length), label: 'Sectors served' },
    { value: String(approvals.length), label: 'Approving agencies' },
    { value: '7', label: 'Export destinations', source: 'Vedanta Group Brochure, 2026' },
  ]

  return (
    <>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        <PageHero
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Clients & projects' }]}
          eyebrow="Executed work, named buyers"
          title="Clients & projects"
        />

        <section aria-label="Group figures" className="mx-auto max-w-wide px-6">
          <StatBand stats={stats} />
        </section>

        {grantedClientCount > 0 && (
          <section aria-labelledby="clientele-heading" className="border-t border-steel-200 bg-white">
            <div className="mx-auto max-w-wide px-6 py-24 text-center">
              <h2 id="clientele-heading" className="font-display text-h1 font-medium text-steel-950">
                Our clientele
              </h2>
              <p className="mx-auto mt-4 max-w-content text-body-lg text-steel-700">
                Real, named buyers across oil &amp; gas, power, fertilizer and heavy industry.
              </p>
              <div className="mt-12 text-left">
                <ClientLogoWall clients={clients} />
              </div>
              <p className="mt-6 font-mono text-helper text-steel-500">Vedanta Group Brochure, 2026</p>
            </div>
          </section>
        )}

        <section aria-labelledby="sectors-heading" className="border-t border-steel-200 bg-steel-50">
          <div className="mx-auto max-w-wide px-6 py-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 id="sectors-heading" className="font-display text-h1 font-medium text-steel-950">
                Sectors served
              </h2>
              <p className="max-w-content text-body-lg text-steel-700">
                Ten sectors, from compressed bio-gas to nuclear power, where the group&apos;s static equipment and
                expansion joints are already in service.
              </p>
            </div>
            <div className="mt-12">
              <SectorGrid sectors={sectors} />
            </div>
          </div>
        </section>

        <section aria-labelledby="projects-heading" className="border-t border-steel-200 bg-white">
          <div className="mx-auto max-w-wide px-6 py-24">
            <div className="text-center">
              <h2 id="projects-heading" className="font-display text-h1 font-medium text-steel-950">
                Project track record
              </h2>
              <p className="mx-auto mt-4 max-w-content text-body-lg text-steel-700">
                Fifteen named jobs — eight from Dhruv EPC Solutions, seven from Precise Engineers — each with the
                number that made it hard.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-2">
              <div>
                <h3 className="text-xs font-medium uppercase tracking-caption text-steel-600">
                  Dhruv EPC Solutions
                </h3>
                <div className="mt-4">
                  <ProjectRecordList projects={dhruvProjects} />
                </div>
                <blockquote className="mt-6 border-l-2 border-accent bg-steel-50 p-6 text-body font-semibold text-steel-950">
                  {DHRUV_PULL_QUOTE}
                </blockquote>
              </div>
              <div>
                <h3 className="text-xs font-medium uppercase tracking-caption text-steel-600">
                  Precise Engineers
                </h3>
                <div className="mt-4">
                  <ProjectRecordList projects={preciseProjects} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="approvals-heading" className="border-t border-steel-200 bg-steel-50">
          <div className="mx-auto max-w-wide px-6 py-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 id="approvals-heading" className="font-display text-h1 font-medium text-steel-950">
                Approved &amp; inspected by
              </h2>
              <p className="max-w-content text-body-lg text-steel-700">
                Third-party inspection and approved-vendor relationships the group&apos;s jobs are executed and
                reviewed under.
              </p>
            </div>
            <div className="mt-12">
              <ApprovalWall approvals={approvals} />
            </div>
          </div>
        </section>
      </main>

      <RFQBand />
    </>
  )
}
