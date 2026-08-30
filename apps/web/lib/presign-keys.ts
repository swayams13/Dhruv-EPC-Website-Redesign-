// Presign issuance ledger (D4) — closes the gap Session 0's B8 fix left
// open: /api/presign issuing a key is not the same fact as /api/rfq's
// startsWith('uploads/') check, which any client could satisfy by typing a
// string. Recording each issued key here and checking real existence +
// expiry turns "shaped like a valid key" into "was actually issued and
// still valid".
import { query } from './db'

export async function recordIssuedKey(key: string, expiresAt: Date): Promise<void> {
  await query('INSERT INTO issued_presign_keys (key, expires_at) VALUES ($1, $2)', [key, expiresAt])
}

/** True only if every key was issued by /api/presign and hasn't expired. */
export async function verifyIssuedKeys(keys: string[]): Promise<boolean> {
  if (keys.length === 0) return true
  const rows = await query<{ key: string }>(
    'SELECT key FROM issued_presign_keys WHERE key = ANY($1) AND expires_at > now()',
    [keys],
  )
  return rows.length === keys.length
}
