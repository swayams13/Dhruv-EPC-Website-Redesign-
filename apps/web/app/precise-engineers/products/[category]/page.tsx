// Precise Engineers product category listing — VG-012 R3. Template in
// lib/product-category-pages.tsx (shared with dhruv-epc).
import { productCategoryListingPage } from '../../../../lib/product-category-pages'

const impl = productCategoryListingPage('precise-engineers')

export const generateStaticParams = impl.generateStaticParams
export const generateMetadata = impl.generateMetadata
export default impl.Page
