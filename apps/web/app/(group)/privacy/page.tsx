import type { Metadata } from 'next'
import { PageHero } from '@vedanta/datum-ui'
import { LegalDocument, type LegalSection } from '../legal/LegalDocument'
import { getEntity } from '../../../lib/content-loader'

const groupEntity = getEntity('group')

export const metadata: Metadata = {
  title: 'Privacy Policy | Vedanta Group of Companies',
  description:
    'How Vedanta Group of Companies handles personal data submitted through this website, including quotation requests and uploaded technical documents.',
  // Incomplete clauses must not be indexed as if they were a compliant policy.
  // Remove this once every blocker below is closed (blueprint §22).
  robots: { index: false, follow: true },
}

const SECTIONS: LegalSection[] = [
  {
    id: 'scope',
    heading: 'What this policy covers',
    // Sourced from the site's own architecture — these are the only two personal
    // data surfaces the application actually has (blueprint §13, /api/rfq + /api/presign).
    body: (
      <>
        <p>
          This policy covers personal data submitted through vedantagroup.net. There are two
          such routes: the quotation request form, and the file upload attached to it.
        </p>
        <p>
          The quotation form collects the name, organisation, email address and telephone
          number you enter, together with the equipment enquiry itself. Uploaded files —
          typically datasheets, drawings and specifications — are stored so that our
          engineering team can price the enquiry.
        </p>
      </>
    ),
  },
  {
    id: 'purpose',
    heading: 'Why we hold it',
    body: (
      <p>
        Enquiry data is used to prepare and issue a quotation and to correspond with you about
        it. We do not sell it, and we do not use it for advertising.
      </p>
    ),
  },
  {
    id: 'retention',
    heading: 'How long we keep it',
    blocker:
      'Retention periods for RFQ records and uploaded drawings. Needed from Vedanta: how long quotations and client technical documents are retained after an enquiry closes or is lost, and whether that differs for awarded work. Do not publish a duration until this is confirmed — a stated period we do not honour is a worse exposure than none.',
  },
  {
    id: 'processors',
    heading: 'Who else processes it',
    blocker:
      'Named list of third-party processors and their locations — hosting, database, object storage and any email or CRM tool that receives RFQ submissions. This depends on the §15 infrastructure decisions (Postgres provider, object store) and must be finalised alongside them.',
  },
  {
    id: 'transfers',
    heading: 'Where it is processed',
    blocker:
      'Whether personal data leaves India, and on what basis. Determined by the hosting region chosen at deployment. Confirm with counsel before publishing.',
  },
  {
    id: 'rights',
    heading: 'Your rights and how to exercise them',
    blocker:
      'Confirmation of the rights offered (access, correction, erasure), the grievance officer named under the DPDP Act 2023, and the response window committed to. The grievance officer must be a named individual with a working contact address.',
  },
  {
    id: 'cookies',
    heading: 'Cookies and measurement',
    blocker:
      'Blocked on the §18 analytics decision. No analytics package is installed at present, so no measurement cookies are set. This clause must be written at the same time the analytics tool is chosen, not after.',
  },
]

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]}
        eyebrow="Legal"
        title="Privacy Policy"
        lead="How we handle the personal data and technical documents you send us through this site."
      />
      <LegalDocument entity={groupEntity} sections={SECTIONS} revisedDate="2026-08-27" />
    </main>
  )
}
