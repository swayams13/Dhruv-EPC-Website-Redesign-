// Shared shell for /privacy and /terms.
//
// WHY THESE PAGES EXIST NOW (blueprint §16, P0)
// Footer.tsx renders privacyHref and termsHref on every one of the 30 routes.
// Neither route existed. The moment DNS moved, every page on the site carried a
// link to a 404 — including the RFQ page, which is where a procurement manager
// is deciding whether to trust us with a drawing.
//
// WHY THE CLAUSES ARE MARKED, NOT WRITTEN
// CLAUDE.md forbids invented claims, and a privacy policy is a set of legal
// representations about what this company actually does with personal data —
// retention periods, processors, transfer basis. Those are facts about Vedanta's
// operations that only Vedanta can supply, and a plausible-sounding AI-drafted
// policy is worse than an obviously incomplete one: it reads as compliant while
// representing things that may be false.
//
// So the shell ships (the 404 is closed, the structure and the sourced entity
// facts are real) and every unapproved clause renders as a visible ClauseBlocker.
// Per blueprint §2.2 — a visibly thin page tells us the content is missing before
// a regulator does. These must be resolved before launch; see §22 P0 content list.

import type { EntityRecord } from '@vedanta/schemas'

export interface LegalSection {
  id: string
  heading: string
  /** Approved copy. Omit entirely when the clause still needs sign-off. */
  body?: React.ReactNode
  /** What is missing and who must supply it. Renders as a visible blocker. */
  blocker?: string
}

export function ClauseBlocker({ note }: { note: string }): React.ReactElement {
  return (
    <div
      role="note"
      className="mt-4 border-l-2 border-accent bg-steel-100 px-4 py-3"
      data-content-blocker
    >
      <p className="font-mono text-xs font-medium uppercase tracking-caption text-accent-text">
        Content required — legal sign-off
      </p>
      <p className="mt-2 text-small text-steel-600">{note}</p>
    </div>
  )
}

export interface LegalDocumentProps {
  entity: EntityRecord
  sections: LegalSection[]
  /** ISO date the approved clauses were last reviewed by counsel. */
  revisedDate: string
}

export function LegalDocument({
  entity,
  sections,
  revisedDate,
}: LegalDocumentProps): React.ReactElement {
  const outstanding = sections.filter((s) => s.blocker).length

  return (
    <div className="mx-auto max-w-wide px-6 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Contents rail — same pattern as the product SectionNav */}
        <nav aria-label="Document sections" className="lg:col-span-3">
          <p className="text-xs font-medium text-steel-600">
            Contents
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-small text-steel-700 hover:text-accent-text hover:underline"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-10 lg:col-span-8">
          {outstanding > 0 && (
            <div className="border border-steel-300 bg-steel-100 px-5 py-4">
              <p className="text-small text-steel-700">
                {outstanding} of {sections.length} clauses are awaiting legal sign-off and are
                marked below. This document is not yet a complete statement of our obligations.
              </p>
            </div>
          )}

          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`}>
              <h2
                id={`${s.id}-heading`}
                className="font-display text-h3 font-medium text-steel-950"
              >
                {s.heading}
              </h2>
              {s.body && (
                <div className="mt-4 flex max-w-content flex-col gap-4 text-body text-steel-700">
                  {s.body}
                </div>
              )}
              {s.blocker && <ClauseBlocker note={s.blocker} />}
            </section>
          ))}

          {/* Controller identity is sourced, so it can be stated plainly. */}
          <section id="contact" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="font-display text-h3 font-medium text-steel-950">
              Who to contact
            </h2>
            <dl className="mt-4 flex max-w-content flex-col gap-3 text-body text-steel-700">
              <div>
                <dt className="font-mono text-xs uppercase tracking-caption text-steel-600">
                  Entity
                </dt>
                <dd className="mt-1">{entity.legalName}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-caption text-steel-600">
                  Registered office
                </dt>
                <dd className="mt-1">{entity.registeredOffice}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-caption text-steel-600">
                  Email
                </dt>
                <dd className="mt-1 flex flex-col gap-1">
                  {entity.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="text-accent-text hover:underline">
                      {e}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </section>

          <p className="border-t border-steel-200 pt-6 font-mono text-xs uppercase tracking-caption text-steel-500">
            Approved clauses last reviewed {revisedDate}
          </p>
        </div>
      </div>
    </div>
  )
}
