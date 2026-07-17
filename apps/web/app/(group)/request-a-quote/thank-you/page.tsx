// RFQ thank-you — Datum §23: reference number (mono), restated SLA,
// company/product links at peak goodwill, contact fallback.
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Requirement received — Vedanta Group',
  robots: { index: false },
}

const WHAT_NEXT = [
  'An engineer reviews your requirement',
  'We respond within one business day with a technical quotation or clarifying questions',
  'Quote your reference number in any follow-up',
]

const COMPANY_LINKS = [
  {
    company: 'Dhruv EPC Solutions',
    href: '/dhruv-epc',
    products: [
      { label: 'Pressure Vessels', href: '/dhruv-epc/equipment/pressure-vessels' },
      { label: 'Heat Exchangers', href: '/dhruv-epc/equipment/heat-exchangers' },
      { label: 'Proof & Certifications', href: '/dhruv-epc/proof' },
    ],
  },
  {
    company: 'Precise Engineers',
    href: '/precise-engineers',
    products: [
      { label: 'Metallic Bellows', href: '/precise-engineers/products/metallic-bellows-expansion-joint' },
      { label: 'Telescopic Joints', href: '/precise-engineers/products/telescopic-expansion-joint' },
      { label: 'Rubber Bellows', href: '/precise-engineers/products/rubber-bellows' },
    ],
  },
]

export default function ThankYouPage({ searchParams }: { searchParams: { ref?: string } }) {
  const reference = searchParams.ref
  const fallbackEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  const fallbackPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE

  return (
    <main className="mx-auto max-w-content px-4 py-16 md:px-6">
      <h1 className="font-display text-h1 text-steel-950">Requirement received</h1>

      {reference && (
        <p className="mt-6 text-sm text-steel-700">
          Your reference —{' '}
          <span className="font-mono text-data font-medium text-steel-950">{reference}</span>.
          Quote it in any follow-up.
        </p>
      )}

      {/* What happens next — mirrors the reassurance rail on the RFQ page */}
      <div className="mt-12 rounded-sm border border-steel-200 bg-steel-50 p-6">
        <h2 className="text-h4 font-medium text-steel-950">What happens next</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {WHAT_NEXT.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-steel-700">
              <span className="font-mono text-helper text-steel-400">0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Company/product links */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {COMPANY_LINKS.map(({ company, href, products }) => (
          <div key={company}>
            <Link
              href={href}
              className="font-display text-h4 font-semibold text-steel-950 hover:text-accent-text"
            >
              {company}
            </Link>
            <ul className="mt-3 space-y-2">
              {products.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-sm text-steel-700 hover:text-steel-950 hover:underline"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact fallback */}
      {(fallbackEmail || fallbackPhone) && (
        <div className="mt-12 border-t border-steel-200 pt-8">
          <p className="text-sm font-medium text-steel-950">Need to amend your requirement?</p>
          <p className="mt-2 flex flex-col gap-1">
            {fallbackPhone && (
              <a
                href={`tel:${fallbackPhone}`}
                className="inline-flex min-h-row items-center font-mono text-sm text-accent-text hover:text-accent-text-hover hover:underline"
              >
                {fallbackPhone}
              </a>
            )}
            {fallbackEmail && (
              <a
                href={`mailto:${fallbackEmail}`}
                className="inline-flex min-h-row items-center text-sm text-accent-text hover:text-accent-text-hover hover:underline"
              >
                {fallbackEmail}
              </a>
            )}
          </p>
        </div>
      )}

      <p className="mt-12 border-t border-steel-200 pt-8">
        <Link href="/" className="text-sm font-medium text-steel-600 hover:text-steel-950 hover:underline">
          ← Vedanta Group
        </Link>
      </p>
    </main>
  )
}
