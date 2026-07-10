// Textarea — Datum §14 field chrome on a multi-line control.

import { forwardRef } from 'react'
import { FieldShell, fieldDescId } from './FieldShell'

export interface TextareaProps {
  id: string
  label: string
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  optional?: boolean
  helper?: string
  error?: string
  rows?: number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  className?: never
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, optional, helper, error, rows = 4, ...rest },
  ref,
): React.ReactElement {
  return (
    <FieldShell id={id} label={label} optional={optional} helper={helper} error={error}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={helper || error ? fieldDescId(id) : undefined}
        className={`min-h-control w-full rounded-sm border bg-white px-4 py-3 text-base text-steel-950 transition-colors duration-instant placeholder:text-steel-400 focus:border-accent ${
          error ? 'border-signal-error' : 'border-steel-300'
        }`}
        {...rest}
      />
    </FieldShell>
  )
})
