'use client'
// AnchorRail — §21 in-page navigation for product pages.
// Two exports because the mobile strip and desktop sidebar sit in different
// DOM positions (mobile before the grid, desktop inside it as col-span-4).
// Active section tracked via IntersectionObserver (rootMargin clips top/bottom
// so only the section currently filling the reading area is "active").

import { useEffect, useState } from 'react'

interface Section {
  id: string
  label: string
}

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState('')
  const key = ids.join(',')
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-10% 0px -60% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

/** Horizontal scroll strip — place BEFORE the content grid, hidden on lg+. */
export function AnchorRailMobile({ sections }: { sections: Section[] }) {
  const active = useActiveSection(sections.map((s) => s.id))
  return (
    <nav aria-label="On this page" className="overflow-x-auto border-b border-steel-200 lg:hidden">
      <div className="mx-auto flex max-w-wide gap-4 px-6 py-3">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`inline-flex min-h-row shrink-0 items-center text-sm transition-colors duration-instant ${
              active === s.id
                ? 'font-medium text-steel-950'
                : 'text-steel-700 hover:text-steel-950'
            }`}
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
  const active = useActiveSection(sections.map((s) => s.id))
  return (
    <nav aria-label="On this page" className="hidden lg:col-span-4 lg:block">
      <div className="sticky top-24 rounded-sm border border-steel-200 bg-white p-6">
        <p className="text-xs font-medium text-steel-600">On this page</p>
        <ul className="mt-3 flex flex-col">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`flex min-h-row items-center text-sm transition-colors duration-instant ${
                  active === s.id
                    ? 'font-medium text-steel-950'
                    : 'text-steel-700 hover:text-steel-950'
                }`}
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
