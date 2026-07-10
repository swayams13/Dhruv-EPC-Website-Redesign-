// ChoiceCard — Datum §14: "choice cards (bordered tiles with domain icon +
// label, radio semantics) for the RFQ's equipment-type question — visual,
// thumbable, and self-explanatory where a 13-item dropdown is not."
// Radio input is visually hidden but focusable; the tile is the label.
// Focus ring surfaces on the tile via peer-focus-visible (§25 — never hidden).

export interface ChoiceCardProps {
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (value: string) => void
  /** Domain icon per §12 (24px section-view glyph) */
  icon?: React.ReactNode
  className?: never
}

export function ChoiceCard({
  name,
  value,
  label,
  checked,
  onChange,
  icon,
}: ChoiceCardProps): React.ReactElement {
  return (
    <label className="relative block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <span
        className={`flex min-h-control items-center gap-3 rounded-sm border bg-white p-4 transition-colors duration-instant peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
          checked ? 'border-accent' : 'border-steel-300 hover:border-steel-400'
        }`}
      >
        {icon && (
          <span aria-hidden="true" className={checked ? 'text-accent' : 'text-steel-500'}>
            {icon}
          </span>
        )}
        <span className="text-sm font-medium text-steel-950">{label}</span>
      </span>
    </label>
  )
}
