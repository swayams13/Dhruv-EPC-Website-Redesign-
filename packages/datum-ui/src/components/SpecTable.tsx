// SpecTable — Datum §15, the flagship component.
// Anatomy: param (Inter 500 14px steel-600) | value (Plex Mono 15px steel-950,
// tabular) | units/notes (mono 13px steel-600 — §15 writes steel-500, but at
// 13px that pair is 3.53:1 and §25.1 makes WCAG AA the floor; Session 7 axe
// finding). Header row in caption voice on
// steel-100. Horizontal scribed rules only — no verticals, no zebra. 44px min
// rows / 36px engineering density, 16px cell padding, numeric values
// right-aligned. Row hover steel-100 tint only.
//
// Responsive (§15): parameter tables reflow to a definition list below 768px —
// no horizontal scroll for the core spec table, ever. Wide comparative tables
// (capability matrix) instead pin the first column and scroll horizontally
// with a visible affordance shadow — pass `columns` + `matrixRows`.

export interface SpecTableRow {
  param: string
  value: string
  unit?: string | undefined
  note?: string | undefined
}

export interface SpecTableMatrixRow {
  param: string
  values: string[]
}

export interface SpecTableProps {
  rows?: SpecTableRow[]
  /** Column headers for the comparative (capability-matrix) mode */
  columns?: string[]
  matrixRows?: SpecTableMatrixRow[]
  density?: 'default' | 'engineering'
  caption?: string
  className?: never
}

const headerCell = 'px-4 py-2 text-left text-xs font-medium uppercase tracking-caption text-steel-600'
const paramCell = 'px-4 text-left text-sm font-medium text-steel-600'
const rowLine = 'border-b border-steel-200 transition-colors duration-instant hover:bg-steel-100'

function unitNote(row: SpecTableRow): string {
  return [row.unit, row.note].filter(Boolean).join(' — ')
}

export function SpecTable({
  rows,
  columns,
  matrixRows,
  density = 'default',
  caption,
}: SpecTableProps): React.ReactElement {
  // §15: 16px cell padding at default rhythm; engineering density (36px rows)
  // steps vertical padding down one scale value so the row target holds
  const rowH = density === 'engineering' ? 'h-row-dense py-2' : 'h-row py-4'

  // ── Comparative mode: pinned first column + horizontal scroll (§15) ──
  if (columns && matrixRows) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {caption && <caption className={`pb-2 ${headerCell} px-0`}>{caption}</caption>}
          <thead>
            <tr className="bg-steel-100">
              {/* affordance shadow on the pinned column signals the scroll (§15) */}
              <th scope="col" className={`${headerCell} sticky left-0 z-10 bg-steel-100 shadow-raised`}>
                Parameter
              </th>
              {columns.map((c) => (
                <th key={c} scope="col" className={`${headerCell} text-right`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixRows.map((row) => (
              <tr key={row.param} className={rowLine}>
                <th scope="row" className={`${paramCell} ${rowH} sticky left-0 z-10 bg-white shadow-raised`}>
                  {row.param}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className={`${rowH} px-4 text-right font-mono text-data text-steel-950`}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // ── Parameter mode: table on md+, definition list below (§15, §25-7) ──
  return (
    <>
      <table className="hidden w-full border-collapse md:table">
        {caption && <caption className={`pb-2 ${headerCell} px-0`}>{caption}</caption>}
        <thead>
          <tr className="bg-steel-100">
            <th scope="col" className={headerCell}>
              Parameter
            </th>
            <th scope="col" className={`${headerCell} text-right`}>
              Value
            </th>
            <th scope="col" className={headerCell}>
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          {(rows ?? []).map((row) => (
            <tr key={row.param} className={rowLine}>
              <th scope="row" className={`${paramCell} ${rowH}`}>
                {row.param}
              </th>
              <td className={`${rowH} px-4 text-right font-mono text-data text-steel-950`}>{row.value}</td>
              <td className={`${rowH} px-4 font-mono text-helper text-steel-600`}>{unitNote(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="md:hidden">
        {caption && <p className="pb-2 text-xs font-medium uppercase tracking-caption text-steel-600">{caption}</p>}
        <dl>
          {(rows ?? []).map((row) => (
            <div key={row.param} className="border-b border-steel-200 py-3">
              <dt className="text-sm font-medium text-steel-600">{row.param}</dt>
              <dd className="font-mono text-data text-steel-950">
                {row.value}
                {unitNote(row) && <span className="ml-2 text-helper text-steel-600">{unitNote(row)}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
}
