#!/usr/bin/env node
// Applies migrations/*.sql to DATABASE_URL in filename order, one at a time
// inside its own transaction, recording each in a schema_migrations table —
// re-running is a no-op once every file is applied. Plain node + pg, no
// migration framework: one table today, low churn, not worth the dependency.
//
// Run: node scripts/migrate.mjs   (also: pnpm migrate, from the repo root)

import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const MIGRATIONS_DIR = resolve(root, 'migrations')

// pg is a dependency of apps/web (D1), not of the repo root — resolving
// from apps/web/package.json finds it via pnpm's per-package node_modules
// without adding a second copy to the root package.json.
const requireFromWeb = createRequire(resolve(root, 'apps/web/package.json'))
const { Client } = requireFromWeb('pg')

export function migrationFiles() {
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
}

export async function migrate(client, files = migrationFiles()) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  const { rows } = await client.query('SELECT filename FROM schema_migrations')
  const applied = new Set(rows.map((r) => r.filename))
  const results = []

  for (const file of files) {
    if (applied.has(file)) {
      results.push({ file, applied: false })
      continue
    }
    const sql = readFileSync(resolve(MIGRATIONS_DIR, file), 'utf8')
    await client.query('BEGIN')
    try {
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file])
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw new Error(`migrate: ${file} failed — ${err.message}`)
    }
    results.push({ file, applied: true })
  }

  return results
}

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('migrate: DATABASE_URL is not set')

  const client = new Client({ connectionString })
  await client.connect()
  try {
    const results = await migrate(client)
    for (const r of results) {
      console.log(r.applied ? `migrate: applied ${r.file}` : `migrate: skip ${r.file} (already applied)`)
    }
  } finally {
    await client.end()
  }
}

// pathToFileURL handles spaces/special chars in the path correctly — a
// plain `file://${process.argv[1]}` string comparison (the pattern in
// scripts/build-redirects.mjs) breaks on any repo path containing a space.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
}
