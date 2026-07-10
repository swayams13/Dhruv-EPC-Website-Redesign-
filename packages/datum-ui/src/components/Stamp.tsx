// Stamp — credential mark per Datum §12
// "Certification marks are not icons: U/U2/IBR/ISO render as a separate
//  'stamp' component — bordered, mono-labeled, monochrome — because
//  credentials must look like credentials, not UI garnish."

export interface StampProps {
  code: 'U' | 'U2' | 'IBR' | 'ISO-9001' | 'ISO-14001' | 'ISO-45001'
  /** Links to the Certifications page (footer credentials strip, §18 Zone 2) */
  href?: string
}

const base =
  'inline-flex h-compact items-center justify-center rounded-sm border border-steel-400 px-3 font-mono text-sm text-steel-700'

export function Stamp({ code, href }: StampProps): React.ReactElement {
  const label = code.replace('-', ' ')
  if (href) {
    return (
      <a
        href={href}
        className={`${base} transition-colors duration-instant hover:border-steel-600 hover:text-steel-950`}
      >
        {label}
      </a>
    )
  }
  return <span className={base}>{label}</span>
}
