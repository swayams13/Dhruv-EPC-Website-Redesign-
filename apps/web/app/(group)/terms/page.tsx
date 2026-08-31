import type { Metadata } from 'next'
import { PageHero } from '@vedanta/datum-ui'
import { LegalDocument, type LegalSection } from '../legal/LegalDocument'
import { getEntity } from '../../../lib/content-loader'

const groupEntity = getEntity('group')

export const metadata: Metadata = {
  title: 'Terms of Use | Vedanta Group of Companies',
  description:
    'Terms governing use of the Vedanta Group of Companies website, including the status of published technical specifications and quotation requests.',
  robots: { index: false, follow: true },
}

const SECTIONS: LegalSection[] = [
  {
    id: 'specifications',
    heading: 'Status of published specifications',
    // This is the clause that actually matters on an engineering site: the whole
    // platform exists to publish design envelopes a procurement manager will act
    // on. Stating that they are indicative is a factual description of what the
    // spec tables are, not a legal representation, so it can ship now.
    body: (
      <>
        <p>
          The capability envelopes, design codes, materials and dimensional ranges published
          on this site describe what our works are equipped and certified to produce. They are
          indicative of capability, not an offer, and not a specification for any particular
          item of equipment.
        </p>
        <p>
          Design conditions for a given job are fixed by the purchase order, the approved
          drawing and the agreed inspection and test plan. Where anything on this site
          conflicts with those documents, those documents govern.
        </p>
      </>
    ),
  },
  {
    id: 'certifications',
    heading: 'Certifications and approvals',
    body: (
      <>
        <p>
          Certificates of Authorization, statutory approvals and management-system
          certifications named on this site are held by the works stated against them and are
          valid for the scope and period shown on the certificate itself.
        </p>
        <p>
          Certificates carry expiry dates. Third-party inspection agencies and clients
          verifying our status should request current copies rather than relying on this site,
          which may not reflect a renewal made since it was last revised.
        </p>
      </>
    ),
  },
  {
    id: 'rfq',
    heading: 'Quotation requests',
    body: (
      <p>
        Submitting the quotation form does not create a contract. It is a request; any
        resulting quotation is issued separately and on its own terms.
      </p>
    ),
  },
  {
    id: 'documents',
    heading: 'Documents you upload',
    blocker:
      'Confidentiality undertaking for client drawings and datasheets submitted with an enquiry. Clients in this sector routinely send proprietary process information at RFQ stage and will look for this clause. Needs the commercial position from Vedanta and counsel review — it is a substantive undertaking, not boilerplate.',
  },
  {
    id: 'ip',
    heading: 'Site content and trade marks',
    blocker:
      'Ownership statement for the Vedanta mark and for photography of client equipment. The second half is the harder question: works photographs may show equipment built to a client\'s design, and permission to publish those images needs to be confirmed per client (see the gated client-logo position, blueprint §2).',
  },
  {
    id: 'liability',
    heading: 'Liability',
    blocker:
      'Limitation of liability wording. Must be drafted by counsel against Indian law — do not adapt a template from another jurisdiction.',
  },
  {
    id: 'governing-law',
    heading: 'Governing law and jurisdiction',
    blocker:
      'Confirm the governing law and the courts of competent jurisdiction. The group operates from Anand and Vadodara, Gujarat, but the seat named here is a decision for Vedanta, not an inference from the registered office.',
  },
]

export default function TermsPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Terms' }]}
        eyebrow="Legal"
        title="Terms of Use"
        lead="The basis on which the technical information published here is provided."
      />
      <LegalDocument entity={groupEntity} sections={SECTIONS} revisedDate="2026-08-27" />
    </main>
  )
}
