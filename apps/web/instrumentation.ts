// Runs once at process boot (Next's instrumentation hook, enabled below in
// next.config.mjs). Importing env.ts here triggers its top-level validation
// so a bad deploy fails fast instead of on the first request that touches
// process.env.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./lib/env')
  }
}
