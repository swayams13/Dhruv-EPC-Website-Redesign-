// D7 — "the point of VG-040": an email-provider failure must never lose a
// lead. Runs the actual route handler (not a mock of it) against a real
// Postgres database, with only the email provider mocked to throw, and
// asserts the lead still landed in `leads` with a 200 response and a
// reference number.
//
// Requires DATABASE_URL pointed at a disposable database with
// migrations/0001_leads.sql applied (`pnpm migrate`) — see .env.example.
// Wired in CI via a postgres service container (.github/workflows/ci.yml).
// This establishes the convention for route-handler integration tests in
// this repo (none existed before).
import { afterAll, describe, expect, it, vi } from 'vitest'

if (!process.env.DATABASE_URL) {
  throw new Error(
    'route.test.ts requires DATABASE_URL — point it at a disposable Postgres database with migrations applied ' +
      '(`pnpm migrate`). See .env.example. This is a real integration test, not a mock of the persistence layer.',
  )
}

vi.mock('../../../lib/notify', () => ({
  sendLeadEmail: vi.fn().mockRejectedValue(new Error('Resend is down (simulated)')),
  whatsappNotifier: { send: vi.fn().mockResolvedValue(undefined) },
}))

// vi.mock calls are hoisted above these imports by vitest, so ./route picks
// up the mocked ../../../lib/notify.
import { POST } from './route'
import { query } from '../../../lib/db'

const TEST_EMAIL = 'engineer+d7-test@refinery.example'

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    equipmentType: 'heat-exchangers',
    message: 'Shell & tube exchanger, 50 m², SS316L, need budgetary quote.',
    uploadedFileKeys: [], // empty — presign-key verification (D4) is out of scope for this test
    name: 'A. Engineer',
    contactCompany: 'Refinery Ltd',
    email: TEST_EMAIL,
    phone: '+919876543210',
    honeypot: '',
    submittedAt: Date.now() - 10_000, // clears the 5s time-trap
    idempotencyKey: crypto.randomUUID(),
    ...overrides,
  }
}

function post(body: unknown, ip = `203.0.113.${Math.floor(Math.random() * 255)}`) {
  return POST(
    new Request('http://localhost/api/rfq', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify(body),
    }),
  )
}

afterAll(async () => {
  await query('DELETE FROM leads WHERE email = $1', [TEST_EMAIL])
})

describe('POST /api/rfq — D7 (VG-040)', () => {
  it('persists the lead and returns 200 + a reference even though the email provider throws', async () => {
    const body = validBody()
    const response = await post(body)

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.referenceNumber).toMatch(/^VG-\d+$/)

    const rows = await query<{ email: string }>('SELECT email FROM leads WHERE reference = $1', [
      json.referenceNumber,
    ])
    expect(rows).toHaveLength(1)
    expect(rows[0].email).toBe(TEST_EMAIL)

    // The email attempt is a fire-and-forget side effect kicked off after
    // the response is built (see route.ts) — poll for it to settle rather
    // than assuming it already has by the time POST() resolves.
    await vi.waitFor(async () => {
      const [row] = await query<{ notification_status: { email?: string } }>(
        'SELECT notification_status FROM leads WHERE reference = $1',
        [json.referenceNumber],
      )
      expect(row.notification_status.email).toBe('failed')
    })
  })

  it('returns the same reference on an idempotent retry instead of creating a second row', async () => {
    const body = validBody({ idempotencyKey: crypto.randomUUID() })
    const first = await post(body)
    const firstJson = await first.json()

    const second = await post(body)
    const secondJson = await second.json()

    expect(second.status).toBe(200)
    expect(secondJson.referenceNumber).toBe(firstJson.referenceNumber)
    expect(secondJson.duplicate).toBe(true)

    const rows = await query('SELECT id FROM leads WHERE idempotency_key = $1', [body.idempotencyKey])
    expect(rows).toHaveLength(1)
  })

  it('rejects an uploaded file key that was never issued by /api/presign (D4)', async () => {
    const body = validBody({ uploadedFileKeys: ['uploads/forged-uuid/drawing.pdf'] })
    const response = await post(body)

    expect(response.status).toBe(400)
    const rows = await query('SELECT id FROM leads WHERE idempotency_key = $1', [body.idempotencyKey])
    expect(rows).toHaveLength(0)
  })
})
