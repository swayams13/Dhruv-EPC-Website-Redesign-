// Pure data half of the Industry/Capability templates (Session 8, VG-020/
//021) — mirrors product-category-pages-data.ts / product-detail-page-data.ts:
// no JSX, so metadata-uniqueness.test.ts can import it directly.
//
// Both entities are content-gated (docs brief, Session 8): every record
// ships with contentComplete: false until real narrative/engineering copy
// replaces the placeholder text. `robots.index` reads that field directly —
// flipping the JSON field is what makes a record indexable, not a code
// change. See industries/page.tsx and capabilities/page.tsx for the same
// gate applied to the index route.
import type { Metadata } from 'next'
import { getCapabilities, getIndustries } from './content-loader'
import { capabilityHref, industryHref } from './product-urls'

export function industryIndexMetadata(): Metadata {
  const anyComplete = getIndustries().some((i) => i.contentComplete)
  return {
    title: 'Industries — Vedanta Group',
    description:
      'Sectors served by Dhruv EPC Solutions and Precise Engineers — products, capabilities and evidence grouped by industry.',
    alternates: { canonical: '/industries/' },
    robots: { index: anyComplete, follow: true },
  }
}

export function industryDetailPageData() {
  function generateStaticParams(): { slug: string }[] {
    return getIndustries().map((i) => ({ slug: i.slug }))
  }

  function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const industry = getIndustries().find((i) => i.slug === params.slug)
    if (!industry) return {}
    return {
      title: `${industry.name} — Vedanta Group`,
      description: industry.oneLineScope,
      alternates: { canonical: `${industryHref(industry.slug)}/` },
      robots: { index: industry.contentComplete, follow: true },
    }
  }

  return { generateStaticParams, generateMetadata }
}

export function capabilityIndexMetadata(): Metadata {
  const anyComplete = getCapabilities().some((c) => c.contentComplete)
  return {
    title: 'Capabilities — Vedanta Group',
    description:
      'Process capabilities across Dhruv EPC Solutions and Precise Engineers — envelope figures for what each works can build.',
    alternates: { canonical: '/capabilities/' },
    robots: { index: anyComplete, follow: true },
  }
}

export function capabilityDetailPageData() {
  function generateStaticParams(): { slug: string }[] {
    return getCapabilities().map((c) => ({ slug: c.slug }))
  }

  function generateMetadata({ params }: { params: { slug: string } }): Metadata {
    const capability = getCapabilities().find((c) => c.slug === params.slug)
    if (!capability) return {}
    return {
      title: `${capability.name} — Vedanta Group`,
      description: `Process envelope and equipment for ${capability.name} at Vedanta Group.`,
      alternates: { canonical: `${capabilityHref(capability.slug)}/` },
      robots: { index: capability.contentComplete, follow: true },
    }
  }

  return { generateStaticParams, generateMetadata }
}
