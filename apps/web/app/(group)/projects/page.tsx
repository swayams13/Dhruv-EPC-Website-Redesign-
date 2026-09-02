// /projects — stub (Session 9, VG-051 N2). The real Project system
// (blueprint §8) is a later, separate session gated on real project
// records that don't exist yet (⛔C-1). This route exists so the new
// primary nav's "Projects" item has somewhere real to go instead of a
// 404 or a silently-dead link — it states the gap honestly rather than
// hiding it. noindex: nothing here is real content yet, matching the
// content-gate convention industry-capability-pages-data.ts already uses.
import type { Metadata } from 'next'
import { PageHero } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { BASE } from '../../../lib/site'

export const metadata: Metadata = {
  title: 'Projects — Vedanta Group',
  description: 'Selected fabrication and flow-control projects across Dhruv EPC Solutions and Precise Engineers.',
  alternates: { canonical: '/projects/' },
  robots: { index: false, follow: true },
}

export default function ProjectsIndexPage() {
  const jsonLd = buildBreadcrumbList([
    { name: 'Vedanta Group', url: BASE },
    { name: 'Projects', url: `${BASE}/projects` },
  ])

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ label: 'Vedanta Group', href: '/' }, { label: 'Projects' }]}
        eyebrow="Selected work"
        title="Projects."
        lead="Real, attributable project records — scope, challenge, evidence — are in progress. In the meantime, send us your drawing and an engineer will point you to relevant past work directly."
      />

      <section aria-label="Projects" className="mx-auto max-w-wide px-6 py-12">
        <p className="rounded-sm border border-steel-200 bg-steel-50 px-4 py-3 text-helper text-steel-600">
          <span className="font-medium text-steel-950">Content gate:</span> this index is a placeholder
          until sourced project records with client permission-on-file ship. See docs/01-final-implementation-blueprint-v2.md §8.
        </p>
      </section>
    </main>
  )
}
