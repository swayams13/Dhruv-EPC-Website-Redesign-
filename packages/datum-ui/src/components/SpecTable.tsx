// ponytail: stub — Phase 2 build per Datum §15

export interface SpecTableRow {
  param: string
  value: string
  unit?: string
  note?: string
}

export interface SpecTableProps {
  rows: SpecTableRow[]
  density?: 'default' | 'engineering'
  caption?: string
}

export function SpecTable(_props: SpecTableProps): React.ReactElement {
  throw new Error('SpecTable: Phase 2 not yet built')
}
