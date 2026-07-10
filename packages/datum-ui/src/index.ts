// @vedanta/datum-ui — Datum Design System component library
// Build order per Datum §27: stamp → datum-rule → button → form fields →
// upload dropzone → spec table → cards → nav → footer → hero → trust

export { Stamp, type StampProps } from './components/Stamp'
export { DatumRule, type DatumRuleProps } from './components/DatumRule'
export { Button, type ButtonProps } from './components/Button'
export { Input, type InputProps } from './components/Input'
export { Select, type SelectProps, type SelectOption } from './components/Select'
export { Textarea, type TextareaProps } from './components/Textarea'
export { ChoiceCard, type ChoiceCardProps } from './components/ChoiceCard'
export { UploadDropzone, type UploadDropzoneProps } from './components/UploadDropzone'
export {
  SpecTable,
  type SpecTableProps,
  type SpecTableRow,
  type SpecTableMatrixRow,
} from './components/SpecTable'
export { ProductCard, type ProductCardProps } from './components/ProductCard'
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from './components/Breadcrumbs'
export {
  Header,
  type HeaderProps,
  type HeaderNavLink,
  type MegaMenuGroup,
  type MegaMenuItem,
} from './components/Header'
export {
  MobileDrawer,
  type MobileDrawerProps,
  type DrawerGroup,
  type DrawerNavLink,
} from './components/MobileDrawer'
export { MobileBottomBar, type MobileBottomBarProps } from './components/MobileBottomBar'
export {
  Footer,
  type FooterProps,
  type FooterColumn,
  type FooterLink,
} from './components/Footer'
export {
  ProjectCard,
  type ProjectCardProps,
  type ProjectMetric,
} from './components/ProjectCard'
