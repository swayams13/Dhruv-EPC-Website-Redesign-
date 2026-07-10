// Button — Datum §13
// The Amber Law: variant="rfq" is the ONLY accent-filled element; max one per view.
// Heights 48px default / 40px compact; radius 2px machined edge; Inter 500 15px,
// verb-first sentence case. Hover deepens one step (100ms); pressed deepens two +
// translates down 1px (the only vertical movement); loading locks width;
// disabled = steel-200 fill / steel-400 text, never hidden.
// Focus ring comes from the global :focus-visible rule (§25) — never suppressed here.

export interface ButtonProps {
  variant: 'rfq' | 'primary' | 'secondary' | 'ghost' | 'link'
  children: React.ReactNode
  /** 48px default / 40px compact (§13) */
  size?: 'default' | 'compact'
  disabled?: boolean
  /** Label swaps to spinner + "Sending…", width locked (§13) */
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: never // components accept no className — theming is CSS-var scope
}

const box = 'inline-flex items-center justify-center gap-2 rounded-sm px-6 font-medium text-data'
const press = 'active:translate-y-px'
const tick = 'transition-colors duration-instant ease-standard'

const variantClass: Record<ButtonProps['variant'], string> = {
  // fill: --accent · label: --accent-fg (rfqFg — steel-950 on amber, steel-50 on blue)
  rfq: `${box} ${press} ${tick} bg-accent text-accent-fg hover:bg-accent-hover active:bg-accent-pressed disabled:hover:bg-steel-200`,
  primary: `${box} ${press} ${tick} bg-steel-950 text-white hover:bg-steel-800 active:bg-steel-700 disabled:hover:bg-steel-200`,
  secondary: `${box} ${press} ${tick} border border-steel-300 bg-transparent text-steel-950 hover:border-steel-400 disabled:border-steel-200 disabled:hover:border-steel-200`,
  ghost: `${box} ${press} ${tick} bg-transparent text-steel-700 hover:bg-steel-100 disabled:hover:bg-transparent`,
  // inline navigation within prose — no box, no height
  link: `${tick} inline font-medium text-data text-accent-text hover:text-accent-text-hover hover:underline`,
}

const disabledFill = 'disabled:bg-steel-200 disabled:text-steel-400'

export function Button({
  variant,
  children,
  size = 'default',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
}: ButtonProps): React.ReactElement {
  const height = variant === 'link' ? '' : size === 'compact' ? 'h-compact' : 'h-12'
  const dis = variant === 'link' ? 'disabled:text-steel-400' : disabledFill

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={`relative ${variantClass[variant]} ${height} ${dis}`}
    >
      {/* width lock: real label keeps its box, made invisible; overlay centers */}
      <span className={loading ? 'invisible' : 'contents'}>{children}</span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2">
          <svg
            aria-hidden="true"
            className="h-4 w-4 animate-spin motion-reduce:animate-none"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
            <path d="M8 1.5A6.5 6.5 0 0 1 14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          Sending…
        </span>
      )}
    </button>
  )
}
