// Boot-time env validation (D6) — a missing/malformed var fails the process
// at startup with a named error, instead of surfacing as a vague runtime
// crash the first time a route touches process.env. See instrumentation.ts
// for where this module gets imported.
import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1),
  RFQ_NOTIFY_TO: z.string().min(1),
  RFQ_NOTIFY_FROM: z.string().min(1),
  STORAGE_ENDPOINT: z.string().min(1),
  STORAGE_BUCKET: z.string().min(1),
  // optional — app/api/presign/route.ts falls back to 'auto' when unset
  STORAGE_REGION: z.string().optional(),
  STORAGE_ACCESS_KEY_ID: z.string().min(1),
  STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string().min(1),
  NEXT_PUBLIC_CONTACT_PHONE: z.string().min(1),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
  throw new Error(`Invalid environment configuration — ${issues}`)
}

export const env = parsed.data
