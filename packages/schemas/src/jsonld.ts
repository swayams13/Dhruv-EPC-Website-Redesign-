// JSON-LD typed builders — schema.org (TRD §T-3, plan FR-7)
// Each builder consumes a CMS type and returns a typed object.
// Pages embed the result in <script type="application/ld+json"> — never hand-write JSON.

// ponytail: inline schema.org types instead of schema-dts — we only need 6 shapes

import type { EntityRecord, Product, ProductFAQ, Project } from './cms'

type SchemaCtx = { '@context': 'https://schema.org' }

export type OrganizationLD = SchemaCtx & {
  '@type': 'Organization'
  name: string
  contactPoint: { '@type': 'ContactPoint'; telephone: string; email: string }[]
  address: { '@type': 'PostalAddress'; streetAddress: string }[]
}

export type LocalBusinessLD = SchemaCtx & {
  '@type': 'LocalBusiness'
  name: string
  telephone: string
  email: string
  address: { '@type': 'PostalAddress'; streetAddress: string }
}

export type ProductLD = SchemaCtx & {
  '@type': 'Product'
  name: string
  description: string
  manufacturer: { '@type': 'Organization'; name: string }
}

export type FAQPageLD = SchemaCtx & {
  '@type': 'FAQPage'
  mainEntity: {
    '@type': 'Question'
    name: string
    acceptedAnswer: { '@type': 'Answer'; text: string }
  }[]
}

export type BreadcrumbListLD = SchemaCtx & {
  '@type': 'BreadcrumbList'
  itemListElement: { '@type': 'ListItem'; position: number; name: string; item: string }[]
}

export type ArticleLD = SchemaCtx & {
  '@type': 'Article'
  headline: string
  datePublished: string
  author: { '@type': 'Organization'; name: string }
  description: string
}

export function buildOrganization(entity: EntityRecord): OrganizationLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: entity.legalName,
    contactPoint: entity.phones.map((tel, i) => ({
      '@type': 'ContactPoint',
      telephone: tel,
      // Zod guarantees emails.length >= 1; fallback to first when phones > emails
      email: (entity.emails[i] ?? entity.emails[0]) as string,
    })),
    address: entity.worksAddresses.map(a => ({
      '@type': 'PostalAddress',
      streetAddress: a.address,
    })),
  }
}

export function buildLocalBusiness(entity: EntityRecord): LocalBusinessLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: entity.legalName,
    // Zod guarantees phones/emails have >= 1 entry
    telephone: entity.phones[0] as string,
    email: entity.emails[0] as string,
    address: {
      '@type': 'PostalAddress',
      streetAddress: entity.registeredOffice,
    },
  }
}

export function buildProduct(product: Product, entity: EntityRecord): ProductLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.oneLineScope,
    manufacturer: { '@type': 'Organization', name: entity.legalName },
  }
}

export function buildFAQPage(faqs: ProductFAQ[]): FAQPageLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function buildBreadcrumbList(items: { name: string; url: string }[]): BreadcrumbListLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Article builder uses Project as the content source
export function buildArticle(project: Project, entity: EntityRecord): ArticleLD {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    datePublished: String(project.year),
    author: { '@type': 'Organization', name: entity.legalName },
    description: project.body.slice(0, 160),
  }
}
