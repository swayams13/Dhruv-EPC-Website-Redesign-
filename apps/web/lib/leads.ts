// Leads table access — RFQ durable persistence (VG-040) and DB-backed
// rate-limit/idempotency (VG-041). One small file per table, same shape as
// db.ts's "no ORM" decision — these are the only queries the app needs.
import { query } from './db'
import type { RFQSubmission } from '@vedanta/schemas'

const RATE_WINDOW_MINUTES = 10
const RATE_MAX = 5

/** True once this IP has RATE_MAX+ leads recorded in the last RATE_WINDOW_MINUTES. */
export async function isRateLimited(ip: string): Promise<boolean> {
  const rows = await query<{ count: string }>(
    `SELECT count(*) FROM leads WHERE ip = $1 AND created_at > now() - interval '${RATE_WINDOW_MINUTES} minutes'`,
    [ip],
  )
  return Number(rows[0]?.count ?? 0) >= RATE_MAX
}

/** Looks up a prior submission by idempotency key. No time window: the
 *  unique DB constraint makes a lead permanently non-duplicable, which is a
 *  strictly stronger guarantee than the in-memory version's 24h expiry (that
 *  expiry existed only to bound Map growth, not as a business rule). */
export async function findByIdempotencyKey(idempotencyKey: string): Promise<{ reference: string } | null> {
  const rows = await query<{ reference: string }>('SELECT reference FROM leads WHERE idempotency_key = $1', [
    idempotencyKey,
  ])
  return rows[0] ?? null
}

/** Inserts a lead and returns its reference. Race-safe: if two requests
 *  carrying the same idempotency key land concurrently, ON CONFLICT DO
 *  NOTHING means only one insert wins and the loser fetches the winner's
 *  reference instead of erroring or creating a second row. */
export async function insertLead(
  data: RFQSubmission,
  ip: string,
  sourcePage: string | null,
): Promise<{ reference: string; duplicate: boolean }> {
  const rows = await query<{ reference: string }>(
    `INSERT INTO leads (
       company, product_slug, name, contact_company, email, phone, message,
       uploaded_keys, idempotency_key, ip, source_page
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (idempotency_key) DO NOTHING
     RETURNING reference`,
    [
      data.company ?? null,
      data.equipmentType,
      data.name,
      data.contactCompany,
      data.email,
      data.phone,
      data.message,
      JSON.stringify(data.uploadedFileKeys),
      data.idempotencyKey,
      ip,
      sourcePage,
    ],
  )

  if (rows[0]) return { reference: rows[0].reference, duplicate: false }

  const existing = await findByIdempotencyKey(data.idempotencyKey)
  if (!existing) throw new Error('insertLead: ON CONFLICT fired but no existing row was found')
  return { reference: existing.reference, duplicate: true }
}

/** Merges a patch into notification_status (e.g. { email: 'sent' }) — a
 *  best-effort side effect that must never affect the HTTP response the
 *  caller already returned. */
export async function updateNotificationStatus(reference: string, patch: Record<string, string>): Promise<void> {
  await query('UPDATE leads SET notification_status = notification_status || $2::jsonb WHERE reference = $1', [
    reference,
    JSON.stringify(patch),
  ])
}
