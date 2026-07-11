// RFQ form schemas — shared client/server (TRD §T-4, FR-3)

import { z } from 'zod'

// RFQ target vocabulary matches the form / data-company scopes ('dhruv' |
// 'precise') — not CMS CompanySlug: 'group' is not a valid RFQ target.
export const RFQCompany = z.enum(['dhruv', 'precise'])
export type RFQCompany = z.infer<typeof RFQCompany>

export const RFQStep1 = z.object({
  company: RFQCompany.optional(),  // prefilled via ?company= but selectable
  equipmentType: z.string().min(1, 'Select an equipment type'),
  designCode: z.string().optional(),
  moc: z.string().optional(),
  quantity: z.number().int().min(1).optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, 'Describe your requirement'),
  // Drawing file keys uploaded direct-to-storage before submit (§T-4)
  uploadedFileKeys: z.array(z.string()).max(5, 'Maximum 5 drawings'),
})
export type RFQStep1 = z.infer<typeof RFQStep1>

export const RFQStep2 = z.object({
  name: z.string().min(1, 'Name required'),
  // Named contactCompany — plain `company` would collide with RFQStep1.company
  // (the target-company slug) in the RFQSubmission merge and silently drop it
  contactCompany: z.string().min(1, 'Company name required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^\+[1-9]\d{6,14}$/, 'Enter a valid phone number with country code (e.g. +91 98765 43210)'),
})
export type RFQStep2 = z.infer<typeof RFQStep2>

export const RFQSubmission = RFQStep1.merge(RFQStep2).extend({
  // Spam gates
  honeypot: z.literal(''),         // must be empty
  submittedAt: z.number(),         // epoch ms — time-trap gate server-side
  idempotencyKey: z.string().uuid(),
})
export type RFQSubmission = z.infer<typeof RFQSubmission>

// FR-3: PDF/DWG/STEP/images. Extension is the real gate — browsers report
// '' or application/octet-stream for DWG/STEP, so a MIME enum rejects them.
export const DRAWING_EXTENSIONS = ['pdf', 'dwg', 'step', 'stp', 'jpg', 'jpeg', 'png', 'webp'] as const

export const PresignRequest = z.object({
  fileName: z
    .string()
    .min(1)
    .refine(
      (n) => (DRAWING_EXTENSIONS as readonly string[]).includes(n.split('.').pop()?.toLowerCase() ?? ''),
      'Allowed file types: PDF, DWG, STEP, JPG, PNG, WEBP',
    ),
  fileType: z.string(), // informational only — extension above is authoritative
  fileSizeBytes: z.number().int().positive().max(25 * 1024 * 1024, 'File must be ≤ 25 MB'),
})
export type PresignRequest = z.infer<typeof PresignRequest>
