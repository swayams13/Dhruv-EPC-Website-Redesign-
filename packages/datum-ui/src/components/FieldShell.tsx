// FieldShell — internal label/helper/error chrome shared by Input, Select,
// Textarea per Datum §14. Not exported from the barrel.
//
// §14: labels always visible, above the field, Inter 500 14px steel-950;
// placeholder-as-label banned. Required is default and unmarked — optional
// fields marked "(optional)". Helper 13px steel-600. Errors: signal color +
// leading icon + text (color alone is not information, §25), announced via
// live region.

export interface FieldShellProps {
  /** Field element id — label htmlFor and `${id}-desc` describedby contract */
  id: string
  label: string
  optional?: boolean | undefined
  helper?: string | undefined
  error?: string | undefined
  children: React.ReactNode
}

/** aria-describedby value the field element must carry when helper/error present */
export function fieldDescId(id: string): string {
  return `${id}-desc`
}

export function FieldShell({
  id,
  label,
  optional = false,
  helper,
  error,
  children,
}: FieldShellProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-steel-950">
        {label}
        {optional && <span className="font-normal text-steel-500"> (optional)</span>}
      </label>
      {children}
      {/* live region is always present so error announcements fire on swap */}
      <p id={fieldDescId(id)} aria-live="polite" className="min-h-0 text-helper">
        {error ? (
          <span className="flex items-center gap-1 text-signal-error">
            <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              <path d="M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
            {error}
          </span>
        ) : (
          helper && <span className="text-steel-600">{helper}</span>
        )}
      </p>
    </div>
  )
}
