// AnchorRail — §21 in-page navigation for product pages.
// Two exports because the mobile strip and desktop sidebar sit in different
// DOM positions (mobile before the grid, desktop inside it as col-span-4).

interface Section {
  id: string
  label: string
}

/** Horizontal scroll strip — place BEFORE the content grid, hidden on lg+. */
export function AnchorRailMobile({ sections }: { sections: Section[] }) {
  return (
    <nav aria-label="On this page" className="overflow-x-auto border-b border-steel-200 lg:hidden">
      <div className="mx-auto flex max-w-wide gap-4 px-6 py-3">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="inline-flex min-h-row shrink-0 items-center text-sm text-steel-700 transition-colors duration-instant hover:text-steel-950"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

/** Sticky sidebar — place inside the lg:grid-cols-12 grid as lg:col-span-4, hidden on mobile. */
export function AnchorRailDesktop({ sections }: { sections: Section[] }) {
  return (
    <nav aria-label="On this page" className="hidden lg:col-span-4 lg:block">
      <div className="sticky top-24 rounded-sm border border-steel-200 bg-white p-6">
        <p className="text-xs font-medium uppercase tracking-caption text-steel-600">On this page</p>
        <ul className="mt-3 flex flex-col">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex min-h-row items-center text-sm text-steel-700 transition-colors duration-instant hover:text-steel-950"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
