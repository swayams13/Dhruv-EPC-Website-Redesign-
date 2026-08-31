// Dhruv EPC product detail — VG-012. Template lives in lib/product-detail-page.tsx
// (shared with precise-engineers) so both companies stay one implementation.
import { productDetailPage } from '../../../../../lib/product-detail-page'

const impl = productDetailPage('dhruv-epc')

export const generateStaticParams = impl.generateStaticParams
export const generateMetadata = impl.generateMetadata
export default impl.Page
