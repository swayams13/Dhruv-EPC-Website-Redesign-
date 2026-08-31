// Boot-time env validation (D6) — a missing/malformed var logs a named
// warning at startup instead of surfacing as a vague runtime crash the
// first time a route touches process.env. See instrumentation.ts for
// where this module gets imported.
//
// Deliberately non-fatal: none of these vars are needed to render the
// marketing site (nothing here imports `env` — RFQ/presign/notify read
// process.env directly and already degrade per-request, e.g. presign
// returns 503 "temporarily unavailable" when storage vars are unset).
// Crashing the whole process over RFQ-only config would take down
// pages that don't need it. Lead capture, email notify, and file
// upload stay broken (loudly, in these logs) until the real values are
// set — see .env.example.
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
  console.warn(
    `[env] Invalid/missing environment configuration — ${issues}. ` +
      'RFQ lead capture, email notification, and file upload will not work until these are set. ' +
      'The rest of the site is unaffected.',
  )
}

export const env = parsed.success ? parsed.data : undefined
