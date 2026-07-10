// RFQ schema validation — FR-3 / TRD §T-4 gates
import { describe, expect, it } from 'vitest'
import { PresignRequest, RFQSubmission } from './rfq'

const validSubmission = {
  equipmentType: 'heat-exchangers',
  message: 'Shell & tube exchanger, 50 m², SS316L, need budgetary quote.',
  uploadedFileKeys: ['uploads/abc/drawing.pdf'],
  name: 'A. Engineer',
  contactCompany: 'Refinery Ltd',
  email: 'engineer@refinery.example',
  phone: '+919876543210',
  honeypot: '',
  submittedAt: 1_700_000_000_000,
  idempotencyKey: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
}

describe('RFQSubmission', () => {
  it('accepts a complete valid submission', () => {
    expect(RFQSubmission.safeParse(validSubmission).success).toBe(true)
  })

  it('rejects a filled honeypot (spam gate)', () => {
    expect(RFQSubmission.safeParse({ ...validSubmission, honeypot: 'http://spam' }).success).toBe(false)
  })

  it('rejects a non-uuid idempotency key', () => {
    expect(RFQSubmission.safeParse({ ...validSubmission, idempotencyKey: 'not-a-uuid' }).success).toBe(false)
  })

  it('rejects more than 5 uploaded file keys', () => {
    const keys = Array.from({ length: 6 }, (_, i) => `uploads/k${i}/f.pdf`)
    expect(RFQSubmission.safeParse({ ...validSubmission, uploadedFileKeys: keys }).success).toBe(false)
  })

  it('rejects a phone number without country code', () => {
    expect(RFQSubmission.safeParse({ ...validSubmission, phone: '9876543210' }).success).toBe(false)
  })

  it('preserves the target-company slug alongside the contact company name', () => {
    const parsed = RFQSubmission.parse({ ...validSubmission, company: 'dhruv' })
    expect(parsed.company).toBe('dhruv')
    expect(parsed.contactCompany).toBe('Refinery Ltd')
  })

  it('rejects a message under 10 characters', () => {
    expect(RFQSubmission.safeParse({ ...validSubmission, message: 'quote pls' }).success).toBe(false)
  })
})

describe('PresignRequest', () => {
  const base = { fileName: 'GA-drawing.pdf', fileType: 'application/pdf', fileSizeBytes: 1024 }

  it('accepts PDF, DWG, and STEP files (DWG/STEP arrive with empty MIME)', () => {
    expect(PresignRequest.safeParse(base).success).toBe(true)
    expect(PresignRequest.safeParse({ ...base, fileName: 'nozzle.DWG', fileType: '' }).success).toBe(true)
    expect(PresignRequest.safeParse({ ...base, fileName: 'flange.step', fileType: 'application/octet-stream' }).success).toBe(true)
  })

  it('rejects disallowed extensions', () => {
    expect(PresignRequest.safeParse({ ...base, fileName: 'malware.exe' }).success).toBe(false)
    expect(PresignRequest.safeParse({ ...base, fileName: 'no-extension' }).success).toBe(false)
  })

  it('rejects files over 25 MB', () => {
    expect(PresignRequest.safeParse({ ...base, fileSizeBytes: 26 * 1024 * 1024 }).success).toBe(false)
  })
})
