// Pooled Postgres query helper — TRD backend-persistence session, D1.
import { Pool, type QueryResultRow } from 'pg'

// Reads DATABASE_URL from process.env directly, not from ./env — importing
// ./env here would create a circular boot dependency with instrumentation.
// Same pattern notify.ts/presign.ts use for their own env reads.
// pg's Pool has no `min` option (only a soft idle-timeout), so there's no
// equivalent to set — `max: 10` is the only pool-size knob available.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
})

// Without this, an idle client hitting a backend/network error (connection
// reset, server restart) emits an unhandled 'error' on the pool and crashes
// the process — this is baseline crash prevention, not retry/backoff logic.
pool.on('error', (err) => console.error('[db] idle client error', err))

/** Runs a parameterized query and returns the result rows. No query
 *  builder, no ORM — this is the whole data access layer. */
export async function query<T extends QueryResultRow>(text: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query<T>(text, params)
  return result.rows
}
