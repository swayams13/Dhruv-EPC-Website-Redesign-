// /industries — index (Session 8, VG-020). Blueprint §10. Steel-only group
// scope (§5), no company accent — both works serve every listed sector.
// Content-gated: every Industry record ships with contentComplete: false
// until real sector narrative replaces the placeholder text (see
// docs/content-needed-industries-capabilities.md). robots/sitemap read
// that field, not a code path — see industry-capability-pages-data.ts.
import { IndustryCard, PageHero } from '@vedanta/datum-ui'
import { buildBreadcrumbList } from '@vedanta/schemas'
import { getIndustries } from '../../../lib/content-loader'
import { industryHref } from '../../../lib/product-urls'
import { industryIndexMetadata } from '../../../lib/industry-capability-pages-data'
import { BASE } from '../../../lib/site'

export const metadata = industryIndexMetadata()

export default function IndustriesIndexPage() {
  const industries = getIndustries()

  const jsonLd = buildBreadcrumbList([
    { name: 'Vedanta Group', url: BASE },
    { name: 'Industries', url: `${BASE}/industries` },
  ])

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        breadcrumbs={[{ label: 'Vedanta Group', href: '/' }, { label: 'Industries' }]}
        eyebrow="Sectors served"
        title="Industries."
        lead="Sectors served across Dhruv EPC Solutions and Precise Engineers, grouped by what each demands of the equipment — products, capabilities and project evidence per industry."
      />

      <section aria-label="Industries" className="mx-auto max-w-wide px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <IndustryCard
              key={industry.slug}
              name={industry.name}
              index={String(i + 1).padStart(2, '0')}
              href={industryHref(industry.slug)}
              servedBy={industry.companySlugs.filter((c): c is 'dhruv-epc' | 'precise-engineers' => c !== 'group').map((c) => (c === 'dhruv-epc' ? 'dhruv' : 'precise'))}
              projectCount={0}
            />
          ))}
        </div>
        {industries.every((i) => !i.contentComplete) && (
          <p className="mt-8 rounded-sm border border-steel-200 bg-steel-50 px-4 py-3 text-helper text-steel-600">
            <span className="font-medium text-steel-950">Content gate:</span> every industry page below is a
            placeholder pending sourced sector narrative — see docs/content-needed-industries-capabilities.md.
            These pages are noindex and excluded from the sitemap until content ships.
          </p>
        )}
      </section>
    </main>
  )
}
