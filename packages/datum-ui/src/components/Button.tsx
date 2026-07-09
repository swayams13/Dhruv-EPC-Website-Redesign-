// ponytail: stub — Phase 2 build per Datum §27

export interface ButtonProps {
  variant: 'rfq' | 'primary' | 'secondary' | 'ghost' | 'link'
  children: React.ReactNode
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: never  // components accept no className — theming is CSS-var scope
}

export function Button(_props: ButtonProps): React.ReactElement {
  throw new Error('Button: Phase 2 not yet built')
}
