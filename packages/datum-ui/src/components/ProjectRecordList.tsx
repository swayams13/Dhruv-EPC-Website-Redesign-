// ProjectRecordList — Clients & Projects spec §3.
// Horizontal rules only — same voice as SpecTable. Index in mono, statement
// in body copy, an optional tag line beneath in mono (omitted, not rendered
// empty, when a job has no tags). `figures[]` is read by a future spec-style
// project detail page (spec §2); this list view doesn't render it.
//
// The spec's grid-template-columns: 40px 1fr has no arbitrary-value-free
// Tailwind equivalent (no grid-cols token for a fixed 40px column), so this
// uses flex instead: a fixed index cell + a flexed content cell reproduce
// the same layout without a bracketed grid-template. 40px itself isn't a
// spacing-scale token either (nearest are 24/48px) — rounded up to w-12
// (48px) per the 2026-09-03 token-gap policy. Row padding 20px rounds to
// py-6 (24px) the same way.

import type { ProjectHighlight } from '@vedanta/schemas'

export interface ProjectRecordListProps {
  projects: ProjectHighlight[]
  className?: never
}

export function ProjectRecordList({ projects }: ProjectRecordListProps): React.ReactElement {
  const sorted = [...projects].sort((a, b) => a.order - b.order)

  return (
    <ol className="border-t border-steel-200">
      {sorted.map((project) => (
        <li key={project.slug} className="flex gap-x-3 border-b border-steel-200 py-6 transition-colors duration-instant hover:bg-steel-50">
          <span className="w-12 shrink-0 font-mono text-helper text-steel-400">
            {String(project.order).padStart(2, '0')}
          </span>
          <div>
            <p className="text-body text-steel-950">{project.statement}</p>
            {project.tags.length > 0 && (
              <p className="mt-2 font-mono text-helper text-steel-500">{project.tags.join(' · ')}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
