// ApprovalsMatrix — Datum §20, the VRV pattern (Phase 1 §3.2).
// Approvals grouped by approving entity class — PSU / EPC / TPIA-PMC — each
// with the approving organization named and, where permitted, the category.
// Rendered as an engineering-density table (§15: 36px rows), not a logo soup:
// an approvals *record*, because that is what a vendor-registration reviewer
// is trying to reconstruct anyway. Horizontal scribed rules only.

import type { Approval } from '@vedanta/schemas'

export interface ApprovalsMatrixProps {
  approvals: Approval[]
  caption?: string
  className?: never
}

const CLASS_ORDER = ['PSU', 'EPC', 'TPIA'] as const
const CLASS_LABEL: Record<(typeof CLASS_ORDER)[number], string> = {
  PSU: 'PSU',
  EPC: 'EPC',
  TPIA: 'TPIA / PMC',
}

const headerCell = 'px-4 py-2 text-left text-xs font-medium uppercase tracking-caption text-steel-600'
const cell = 'h-row-dense px-4 py-2'

export function ApprovalsMatrix({ approvals, caption }: ApprovalsMatrixProps): React.ReactElement {
  return (
    <table className="w-full border-collapse">
      {caption && <caption className={`pb-2 text-left ${headerCell} px-0`}>{caption}</caption>}
      <thead>
        <tr className="bg-steel-100">
          <th scope="col" className={headerCell}>
            Approving organization
          </th>
          <th scope="col" className={headerCell}>
            Category
          </th>
          <th scope="col" className={`${headerCell} text-right`}>
            Year
          </th>
        </tr>
      </thead>
      {CLASS_ORDER.map((cls) => {
        const rows = approvals.filter((a) => a.entityClass === cls)
        if (rows.length === 0) return null
        return (
          <tbody key={cls}>
            <tr className="border-b border-steel-200">
              {/* §5.2: table groups speak in the h4 voice */}
              <th
                colSpan={3}
                scope="colgroup"
                className="px-4 pb-2 pt-6 text-left font-display text-h4 font-semibold text-steel-950"
              >
                {CLASS_LABEL[cls]}
              </th>
            </tr>
            {rows.map((a) => (
              <tr
                key={`${a.approvingOrg}-${a.year}`}
                className="border-b border-steel-200 transition-colors duration-instant hover:bg-steel-100"
              >
                <td className={`${cell} text-sm font-medium text-steel-950`}>{a.approvingOrg}</td>
                <td className={`${cell} text-sm text-steel-600`}>{a.category ?? '—'}</td>
                <td className={`${cell} text-right font-mono text-data text-steel-950`}>
                  {a.year}
                </td>
              </tr>
            ))}
          </tbody>
        )
      })}
    </table>
  )
}
