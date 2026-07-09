// RFQ form schemas — shared client/server (TRD §T-4, FR-3)

import { z } from 'zod'
import { CompanySlug } from './cms'

export const RFQStep1 = z.object({
  company: CompanySlug.optional(),  // prefilled via ?company= but selectable
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
  company: z.string().min(1, 'Company name required'),
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

export const PresignRequest = z.object({
  fileName: z.string().min(1),
  fileType: z.enum(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/octet-stream']),
  fileSizeBytes: z.number().int().max(25 * 1024 * 1024, 'File must be ≤ 25 MB'),
})
export type PresignRequest = z.infer<typeof PresignRequest>
