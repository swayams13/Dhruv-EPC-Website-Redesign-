// Pooled Postgres query helper — TRD backend-persistence session, D1.
import { Pool } from 'pg'

// Reads DATABASE_URL from process.env directly, not from ./env — importing
// ./env here would create a circular boot dependency with instrumentation.
// Same pattern notify.ts/presign.ts use for their own env reads.
// pg's Pool has no `min` option (only a soft idle-timeout), so there's no
// equivalent to set — `max: 10` is the only pool-size knob available.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
})

/** Runs a parameterized query and returns the result rows. No query
 *  builder, no ORM — this is the whole data access layer. */
export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(text, params)
  return result.rows
}
