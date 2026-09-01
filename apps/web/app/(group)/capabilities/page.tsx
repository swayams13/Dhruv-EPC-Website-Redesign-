// /capabilities — index (Session 8, VG-021). Blueprint §11. Steel-only
// group scope (§5) — distinct from the per-company hand-written
// /{company}/capabilities/ prose pages, which stay as-is. Content-gated —
// see capability-capability-pages-data.ts / capabilities/[slug]/page.tsx.
import Link from 'next/link'
import { PageHero } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { getCapabilities } from '../../../lib/content-loader'
import { capabilityHref } from '../../../lib/product-urls'
import { capabilityIndexMetadata } from '../../../lib/industry-capability-pages-data'
import { BASE } from '../../../lib/site'

export const metadata = capabilityIndexMetadata()

const COMPANY_LABEL: Record<string, string> = { 'dhruv-epc': 'Dhruv EPC', 'precise-engineers': 'Precise Engineers' }

export default function CapabilitiesIndexPage() {
  const capabilities = getCapabilities()

  const jsonLd = buildBreadcrumbList([
    { name: 'Vedanta Group', url: BASE },
    { name: 'Capabilities', url: `${BASE}/capabilities` },
  ])

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ label: 'Vedanta Group', href: '/' }, { label: 'Capabilities' }]}
        eyebrow="Process capability"
        title="Capabilities."
        lead="What each works can actually build — the envelope figures behind every product claim. Bay dimensions, crane capacity, size ranges, WPS/PQR count and NDT scope, one page per process."
      />

      <section aria-label="Capabilities" className="mx-auto max-w-wide px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <Link
              key={capability.slug}
              href={capabilityHref(capability.slug)}
              className="block h-full rounded-sm border border-steel-200 bg-white p-6 transition-colors duration-fast hover:border-steel-400"
            >
              <h3 className="font-display text-h4 font-medium text-steel-950">{capability.name}</h3>
              <p className="mt-2 text-helper text-steel-600">
                {capability.companySlugs.map((c) => COMPANY_LABEL[c] ?? c).join(' · ')}
              </p>
            </Link>
          ))}
        </div>
        {capabilities.every((c) => !c.contentComplete) && (
          <p className="mt-8 rounded-sm border border-steel-200 bg-steel-50 px-4 py-3 text-helper text-steel-600">
            <span className="font-medium text-steel-950">Content gate:</span> every capability page below is a
            placeholder pending sourced envelope figures — see docs/content-needed-industries-capabilities.md.
            These pages are noindex and excluded from the sitemap until content ships.
          </p>
        )}
      </section>
    </main>
  )
}
