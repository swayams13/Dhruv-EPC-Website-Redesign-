// Input — Datum §14
// 48px height, white surface, 1px steel-300 border, radius 2px, 16px text
// (prevents iOS zoom-jump). Focus: border becomes accent + the global 2px ring.

import { forwardRef } from 'react'
import { FieldShell, fieldDescId } from './FieldShell'

export interface InputProps {
  id: string
  label: string
  name?: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'url'
  value?: string
  defaultValue?: string
  placeholder?: string
  optional?: boolean
  helper?: string
  error?: string
  autoComplete?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal'
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  className?: never
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, optional, helper, error, type = 'text', ...rest },
  ref,
): React.ReactElement {
  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
      <input
        ref={ref}
        id={id}
        type={type}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={helper || error ? fieldDescId(id) : undefined}
        className={`h-12 w-full rounded-sm border bg-white px-4 text-base text-steel-950 transition-colors duration-instant placeholder:text-steel-400 focus:border-accent ${
          error ? 'border-signal-error' : 'border-steel-300'
        }`}
        {...rest}
      />
    </FieldShell>
  )
})
