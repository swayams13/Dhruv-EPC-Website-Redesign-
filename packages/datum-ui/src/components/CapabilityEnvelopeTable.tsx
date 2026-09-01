// CapabilityEnvelopeTable — the process-envelope spec table a Capability
// page requires to ship (Datum §15, blueprint §11: "a capability without
// figures does not ship"). Thin, named wrapper over SpecTable's engineering
// density rather than a new table implementation — same <th scope> markup,
// same responsive reflow, so a capability envelope and a product spec table
// never drift into two different table conventions.
import { SpecTable } from './SpecTable'
import type { SpecTableRow } from '@vedanta/schemas'

export interface CapabilityEnvelopeTableProps {
  rows: SpecTableRow[]
  caption?: string
  className?: never
}

export function CapabilityEnvelopeTable({ rows, caption }: CapabilityEnvelopeTableProps): React.ReactElement {
  return <SpecTable rows={rows} density="engineering" caption={caption ?? 'Process envelope'} />
}
