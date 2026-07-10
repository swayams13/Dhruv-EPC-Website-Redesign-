// Select — Datum §14: "native-styled selects for short lists".
// Native <select> element styled to field chrome; custom chevron (§12 squared
// construction), pointer-events-none so the native control stays in charge.

import { forwardRef } from 'react'
import { FieldShell, fieldDescId } from './FieldShell'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  id: string
  label: string
  options: SelectOption[]
  name?: string
  value?: string
  defaultValue?: string
  /** Rendered as a disabled placeholder option when no default is set */
  placeholder?: string
  optional?: boolean
  helper?: string
  error?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void
  className?: never
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, label, options, optional, helper, error, placeholder, defaultValue, ...rest },
  ref,
): React.ReactElement {
  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          required={!optional}
          aria-invalid={error ? true : undefined}
          aria-describedby={helper || error ? fieldDescId(id) : undefined}
          defaultValue={defaultValue ?? (placeholder !== undefined ? '' : undefined)}
          className={`h-12 w-full appearance-none rounded-sm border bg-white px-4 pr-8 text-base text-steel-950 transition-colors duration-instant focus:border-accent ${
            error ? 'border-signal-error' : 'border-steel-300'
          }`}
          {...rest}
        >
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-6 h-4 w-4 -translate-y-1/2 text-steel-500"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </div>
    </FieldShell>
  )
})
