// Testimonial — Datum §20.
// Quote (≤ 40 words, body-lg) + MANDATORY attribution: company, role, and a
// provenance line in caption voice ("Vendor performance evaluation, 2024").
// There is no unattributed layout — attribution is enforced by required props,
// not runtime checks: a Testimonial without attnCompany/attnRole/provenance
// does not typecheck, mirroring the Zod publish rule. Entity-correctness
// (Dhruv praise never on Precise routes) is the data layer's job.

export interface TestimonialProps {
  quote: string
  attnCompany: string
  attnRole: string
  /** e.g. "Vendor performance evaluation, 2024" */
  provenance: string
  className?: never
}

export function Testimonial({
  quote,
  attnCompany,
  attnRole,
  provenance,
}: TestimonialProps): React.ReactElement {
  return (
    <figure className="rounded-sm border border-steel-200 bg-white p-6">
      <blockquote>
        <p className="max-w-content text-body-lg text-steel-950">&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-4 border-t border-steel-200 pt-4">
        <p className="text-sm font-medium text-steel-950">
          {attnRole}, {attnCompany}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-caption text-steel-500">
          {provenance}
        </p>
      </figcaption>
    </figure>
  )
}
