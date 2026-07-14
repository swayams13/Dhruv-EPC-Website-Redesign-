import { describe, it, expect } from 'vitest'
import {
  buildOrganization,
  buildLocalBusiness,
  buildProduct,
  buildFAQPage,
  buildBreadcrumbList,
  buildArticle,
} from './jsonld'
import type { EntityRecord, Product, Project } from './cms'

const entity: EntityRecord = {
  companySlug: 'dhruv-epc',
  legalName: 'Dhruv EPC Solutions Pvt. Ltd.',
  worksAddresses: [{ label: 'Works', address: 'Plot 12, GIDC Vatva, Ahmedabad 382445' }],
  registeredOffice: 'Plot 12, GIDC Vatva, Ahmedabad 382445',
  phones: ['+919876543210'],
  emails: ['info@dhruvepc.com'],
  stampsHeld: ['ASME U Stamp'],
  contentRevisedDate: '2024-01-01',
}

const product: Product = {
  companySlug: 'dhruv-epc',
  slug: 'heat-exchanger-shell-tube',
  name: 'Shell & Tube Heat Exchanger',
  oneLineScope: 'TEMA/ASME Sec VIII exchangers up to 150 m² surface area',
  group: 'static-equipment',
  specTable: [{ param: 'Max surface area', value: '150', unit: 'm²' }],
  types: [],
  materials: ['CS', 'SS 316L'],
  codes: ['ASME Sec VIII Div 1', 'TEMA C'],
  faqs: Array.from({ length: 4 }, (_, i) => ({ question: `Q${i + 1}`, answer: `A${i + 1}` })),
  gallery: [],
  relatedProjectSlugs: [],
}

const project: Project = {
  companySlug: 'dhruv-epc',
  slug: 'bpcl-vessel-2024',
  sector: 'Refining',
  title: 'BPCL Pressure Vessel — Mumbai Refinery 2024',
  year: 2024,
  metrics: [{ label: 'Capacity', value: '8 m³' }],
  body: 'Designed and fabricated a fixed-tube-sheet pressure vessel for BPCL Mumbai Refinery hydrotest program. Delivered 100% doc-clean on EIL evaluation. Total weight 18 T.',
  qaSection: 'All welds radiographed; PWHT per ASME Sec VIII Div 1 UCS-56.',
  photos: [{ src: '/works/bpcl-vessel.jpg', alt: '18 T pressure vessel during hydrotest at GIDC Vatva works' }],
  anonymized: false,
}

describe('buildOrganization', () => {
  it('emits @context and @type', () => {
    const ld = buildOrganization(entity)
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('Organization')
  })
  it('maps legalName to name', () => {
    expect(buildOrganization(entity).name).toBe(entity.legalName)
  })
  it('maps all phone/email pairs into contactPoint', () => {
    const ld = buildOrganization(entity)
    expect(ld.contactPoint[0]!.telephone).toBe(entity.phones[0])
    expect(ld.contactPoint[0]!.email).toBe(entity.emails[0])
  })
  it('maps worksAddresses to address array', () => {
    const ld = buildOrganization(entity)
    expect(ld.address[0]!.streetAddress).toBe(entity.worksAddresses[0]!.address)
  })
})

describe('buildLocalBusiness', () => {
  it('emits @context and @type', () => {
    const ld = buildLocalBusiness(entity)
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('LocalBusiness')
  })
  it('uses registeredOffice for address', () => {
    expect(buildLocalBusiness(entity).address.streetAddress).toBe(entity.registeredOffice)
  })
})

describe('buildProduct', () => {
  it('emits @context and @type', () => {
    const ld = buildProduct(product, entity)
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('Product')
  })
  it('uses oneLineScope as description', () => {
    expect(buildProduct(product, entity).description).toBe(product.oneLineScope)
  })
  it('links manufacturer to entity legalName', () => {
    expect(buildProduct(product, entity).manufacturer.name).toBe(entity.legalName)
  })
})

describe('buildFAQPage', () => {
  it('emits @context and @type', () => {
    const ld = buildFAQPage(product.faqs)
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('FAQPage')
  })
  it('maps each FAQ to a Question with acceptedAnswer', () => {
    const ld = buildFAQPage(product.faqs)
    expect(ld.mainEntity).toHaveLength(product.faqs.length)
    expect(ld.mainEntity[0]!['@type']).toBe('Question')
    expect(ld.mainEntity[0]!.acceptedAnswer['@type']).toBe('Answer')
    expect(ld.mainEntity[0]!.name).toBe(product.faqs[0]!.question)
    expect(ld.mainEntity[0]!.acceptedAnswer.text).toBe(product.faqs[0]!.answer)
  })
})

describe('buildBreadcrumbList', () => {
  const crumbs = [
    { name: 'Home', url: 'https://vedantagroup.net/' },
    { name: 'Equipment', url: 'https://vedantagroup.net/dhruv-epc/equipment/' },
    { name: 'Heat Exchangers', url: 'https://vedantagroup.net/dhruv-epc/equipment/heat-exchangers/' },
  ]
  it('emits @context and @type', () => {
    const ld = buildBreadcrumbList(crumbs)
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('BreadcrumbList')
  })
  it('positions start at 1 and increment', () => {
    const ld = buildBreadcrumbList(crumbs)
    expect(ld.itemListElement[0]!.position).toBe(1)
    expect(ld.itemListElement[2]!.position).toBe(3)
  })
  it('maps url to item', () => {
    const ld = buildBreadcrumbList(crumbs)
    expect(ld.itemListElement[1]!.item).toBe(crumbs[1]!.url)
  })
  it('normalizes URLs without trailing slashes to add one', () => {
    const ld = buildBreadcrumbList([
      { name: 'Dhruv EPC', url: 'https://vedantagroup.net/dhruv-epc' },
    ])
    expect(ld.itemListElement[0]!.item).toBe('https://vedantagroup.net/dhruv-epc/')
  })
  it('does not double-slash URLs that already end with /', () => {
    const ld = buildBreadcrumbList([
      { name: 'Home', url: 'https://vedantagroup.net/' },
    ])
    expect(ld.itemListElement[0]!.item).toBe('https://vedantagroup.net/')
  })
  it('does not add trailing slash to fragment URLs', () => {
    const ld = buildBreadcrumbList([
      { name: 'Equipment', url: 'https://vedantagroup.net/dhruv-epc#equipment' },
    ])
    expect(ld.itemListElement[0]!.item).toBe('https://vedantagroup.net/dhruv-epc#equipment')
  })
})

describe('buildArticle', () => {
  it('emits @context and @type', () => {
    const ld = buildArticle(project, entity)
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('Article')
  })
  it('uses project.title as headline', () => {
    expect(buildArticle(project, entity).headline).toBe(project.title)
  })
  it('truncates body to 160 chars for description', () => {
    expect(buildArticle(project, entity).description.length).toBeLessThanOrEqual(160)
  })
  it('sets author from entity legalName', () => {
    expect(buildArticle(project, entity).author.name).toBe(entity.legalName)
  })
})
