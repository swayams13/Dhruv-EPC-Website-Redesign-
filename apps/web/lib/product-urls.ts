// URL builders for the product/category tier (VG-012). Deliberately function
// calls, not inline template literals assigned to a name ending in "href"
// (a prop or an object key) — lib/link-integrity.test.ts's HREF_RE scans
// source text for quoted string literals in that position, including
// backtick-delimited ones (it does not special-case interpolation despite
// its own comment's claim), and would misread a computed path built inline
// as a broken hardcoded literal. Routing every computed path through a
// named function call sidesteps that by construction, matching the existing
// phoneHref()/whatsappHref() convention in content-loader.ts.
import type { CompanySlug } from '@vedanta/schemas'

export function companyHref(companySlug: CompanySlug): string {
  return `/${companySlug}`
}

export function productsIndexHref(companySlug: CompanySlug): string {
  return `/${companySlug}/products`
}

export function categoryHref(companySlug: CompanySlug, categorySlug: string): string {
  return `/${companySlug}/products/${categorySlug}`
}

export function productHref(companySlug: CompanySlug, categorySlug: string, slug: string): string {
  return `/${companySlug}/products/${categorySlug}/${slug}`
}

export function rfqHref(rfqCompany: 'dhruv' | 'precise', equipment?: string): string {
  return equipment ? `/request-a-quote?company=${rfqCompany}&equipment=${equipment}` : `/request-a-quote?company=${rfqCompany}`
}

export function industriesIndexHref(): string {
  return '/industries'
}

export function industryHref(slug: string): string {
  return `/industries/${slug}`
}

export function capabilitiesIndexHref(): string {
  return '/capabilities'
}

export function capabilityHref(slug: string): string {
  return `/capabilities/${slug}`
}
