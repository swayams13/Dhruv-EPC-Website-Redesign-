// RFQ thank-you — Datum §23: reference number (mono), restated SLA,
// capability-statement PDF at peak goodwill, link back.
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Requirement received — Vedanta Group',
  robots: { index: false },
}

export default function ThankYouPage({ searchParams }: { searchParams: { ref?: string } }) {
  const reference = searchParams.ref

  return (
    <main className="mx-auto max-w-content px-4 py-16 md:px-6">
      <h1 className="font-display text-h1 text-steel-950">Requirement received</h1>

      {reference && (
        <p className="mt-6 text-sm text-steel-700">
          Your reference number —{' '}
          <span className="font-mono text-data font-medium text-steel-950">{reference}</span>. Quote it in any
          follow-up.
        </p>
      )}

      <p className="mt-4 max-w-content text-body-lg text-steel-700">
        {/* SLA figure pending client commitment (§23 placeholder, flagged) */}
        An engineer reviews your requirement and responds within one business day with a technical quotation or
        clarifying questions.
      </p>

      {/* §23 capability-statement PDF omitted — the P1 lead-magnet asset does
          not exist yet; a 404 link at peak goodwill is worse than none. */}

      <p className="mt-8">
        <Link href="/" className="font-medium text-accent-text hover:text-accent-text-hover hover:underline">
          Back to Vedanta Group
        </Link>
        {/* becomes the Projects link once /projects routes exist (Phase 4) */}
      </p>
    </main>
  )
}
