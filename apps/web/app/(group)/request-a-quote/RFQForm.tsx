'use client'
// Two-step RFQ form — Datum §23: Step 1 Requirement (where the buyer's mind
// already is), Step 2 Contact. Labeled progress, not dots. Failure preserves
// every field (FR-3: a lost lead is the one unacceptable failure mode).

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, ChoiceCard, Input, Select, Textarea, UploadDropzone } from '@vedanta/datum-ui'
import { RFQStep1, RFQStep2 } from '@vedanta/schemas'

// ponytail: page-local equipment list mirroring plan §3.3/§3.4 IA —
// becomes CMS-driven when Product records land (Phase 4)
const EQUIPMENT: { value: string; label: string; company: 'dhruv' | 'precise' }[] = [
  { value: 'pressure-vessels', label: 'Pressure Vessels', company: 'dhruv' },
  { value: 'heat-exchangers', label: 'Heat Exchangers', company: 'dhruv' },
  { value: 'pipe-spools', label: 'Pipe Spools', company: 'dhruv' },
  { value: 'plate-flanges', label: 'Plate Flanges', company: 'dhruv' },
  { value: 'process-skids', label: 'Process Skids', company: 'dhruv' },
  { value: 'packages', label: 'Packages', company: 'dhruv' },
  { value: 'base-frames', label: 'Base Frames', company: 'dhruv' },
  { value: 'heavy-fabrication', label: 'Heavy Fabrication', company: 'dhruv' },
  { value: 'heavy-machining', label: 'Heavy Machining', company: 'dhruv' },
  { value: 'metallic-bellows-expansion-joint', label: 'Metallic Bellows Expansion Joint', company: 'precise' },
  { value: 'telescopic-expansion-joint', label: 'Telescopic Expansion Joint', company: 'precise' },
  { value: 'rubber-bellows', label: 'Rubber Bellows', company: 'precise' },
  { value: 'fabric-bellows', label: 'Fabric Bellows', company: 'precise' },
  { value: 'dismantling-joint', label: 'Dismantling Joint', company: 'precise' },
  { value: 'flange-adaptor', label: 'Flange Adaptor', company: 'precise' },
]

const DESIGN_CODES = ['ASME VIII Div 1', 'ASME VIII Div 2', 'IBR', 'IS 2825', 'EJMA', 'ASME B31.3', 'Other']
const TIMELINES = ['Urgent — under 1 month', '1–3 months', '3–6 months', '6+ months', 'Budgetary estimate only']

type Company = 'dhruv' | 'precise'

export interface RFQFormProps {
  initialCompany?: Company | undefined
  fallbackEmail?: string | undefined
  fallbackPhone?: string | undefined
}

async function presignFile(file: File): Promise<{ url: string; key: string }> {
  const res = await fetch('/api/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSizeBytes: file.size }),
  })
  const data = (await res.json().catch(() => ({}))) as { url?: string; key?: string; error?: string }
  if (!res.ok || !data.url || !data.key) throw new Error(data.error ?? 'Could not prepare the upload')
  return { url: data.url, key: data.key }
}

export function RFQForm({ initialCompany, fallbackEmail, fallbackPhone }: RFQFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [company, setCompany] = useState<Company | undefined>(initialCompany)
  const [equipmentType, setEquipmentType] = useState('')
  const [designCode, setDesignCode] = useState('')
  const [moc, setMoc] = useState('')
  const [quantity, setQuantity] = useState('')
  const [timeline, setTimeline] = useState('')
  const [message, setMessage] = useState('')
  const [uploadedFileKeys, setUploadedFileKeys] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState('')
  const [contactCompany, setContactCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Time-trap reference (form-open time) + stable idempotency key so a retry
  // after a timed-out-but-delivered submit cannot create a duplicate lead
  const openedAt = useRef(Date.now())
  const idempotencyKey = useRef(crypto.randomUUID())

  const step1Data = () => ({
    company,
    equipmentType,
    designCode: designCode || undefined,
    moc: moc || undefined,
    quantity: quantity ? Number(quantity) : undefined,
    timeline: timeline || undefined,
    message,
    uploadedFileKeys,
  })

  function fieldErrors(issues: { path: (string | number)[]; message: string }[]): Record<string, string> {
    const out: Record<string, string> = {}
    for (const issue of issues) {
      const field = String(issue.path[0] ?? '')
      if (field && !out[field]) out[field] = issue.message
    }
    return out
  }

  function continueToContact() {
    const parsed = RFQStep1.safeParse(step1Data())
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues))
      return
    }
    setErrors({})
    setStep(2)
  }

  async function submit() {
    const parsed = RFQStep2.safeParse({ name, contactCompany, email, phone })
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues))
      return
    }
    setErrors({})
    setSubmitError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...step1Data(),
          ...parsed.data,
          honeypot,
          submittedAt: openedAt.current,
          idempotencyKey: idempotencyKey.current,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { referenceNumber?: string; error?: string }
      if (!res.ok || !data.referenceNumber) {
        throw new Error(data.error ?? 'Your requirement could not be sent.')
      }
      router.push(`/request-a-quote/thank-you?ref=${encodeURIComponent(data.referenceNumber)}`)
    } catch (err) {
      // Every field's state is preserved — the user retries in place (§23)
      setSubmitError(err instanceof Error ? err.message : 'Your requirement could not be sent.')
      setSubmitting(false)
    }
  }

  const visibleEquipment = company ? EQUIPMENT.filter((eq) => eq.company === company) : []

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (step === 2 && !submitting) void submit()
      }}
      className="flex flex-col gap-6"
    >
      <p aria-live="polite" className="font-mono text-helper uppercase tracking-caption text-steel-600">
        {step === 1 ? 'Step 1 of 2 — Requirement' : 'Step 2 of 2 — Contact'}
      </p>

      {step === 1 && (
        <>
          {!initialCompany && (
            <fieldset>
              <legend className="text-sm font-medium text-steel-950">Who is this requirement for?</legend>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ChoiceCard
                  name="company"
                  value="dhruv"
                  label="Dhruv EPC — vessels, exchangers, fabrication"
                  checked={company === 'dhruv'}
                  onChange={() => {
                    setCompany('dhruv')
                    setEquipmentType('')
                  }}
                />
                <ChoiceCard
                  name="company"
                  value="precise"
                  label="Precise Engineers — expansion joints, bellows"
                  checked={company === 'precise'}
                  onChange={() => {
                    setCompany('precise')
                    setEquipmentType('')
                  }}
                />
              </div>
            </fieldset>
          )}

          {company && (
            <fieldset>
              <legend className="text-sm font-medium text-steel-950">Equipment type</legend>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {visibleEquipment.map((eq) => (
                  <ChoiceCard
                    key={eq.value}
                    name="equipmentType"
                    value={eq.value}
                    label={eq.label}
                    checked={equipmentType === eq.value}
                    onChange={setEquipmentType}
                  />
                ))}
              </div>
              {errors.equipmentType && (
                <p role="alert" className="mt-2 text-helper text-signal-error">
                  {errors.equipmentType}
                </p>
              )}
            </fieldset>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Select
              id="rfq-design-code"
              label="Design code"
              optional
              placeholder="Select a code"
              options={DESIGN_CODES.map((c) => ({ value: c, label: c }))}
              value={designCode}
              onChange={(e) => setDesignCode(e.target.value)}
            />
            <Input
              id="rfq-moc"
              label="Material of construction"
              optional
              placeholder="e.g. SS316L, SA-516 Gr 70"
              value={moc}
              onChange={(e) => setMoc(e.target.value)}
            />
            <Input
              id="rfq-quantity"
              label="Quantity"
              optional
              type="number"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <Select
              id="rfq-timeline"
              label="Timeline"
              optional
              placeholder="Select a timeline"
              options={TIMELINES.map((t) => ({ value: t, label: t }))}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            />
          </div>

          <Textarea
            id="rfq-message"
            label="Requirement"
            rows={5}
            placeholder="Size, service conditions, codes, inspection requirements — whatever your enquiry sheet says"
            {...(errors.message ? { error: errors.message } : {})}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div>
            <p className="mb-3 text-sm font-medium text-steel-950">
              Drawings <span className="font-normal text-steel-600">(optional)</span>
            </p>
            <UploadDropzone presign={presignFile} onChange={setUploadedFileKeys} onBusyChange={setUploading} />
          </div>

          <div>
            <Button variant="primary" onClick={continueToContact} disabled={uploading}>
              {uploading ? 'Waiting for uploads…' : 'Continue to contact details'}
            </Button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              id="rfq-name"
              label="Name"
              autoComplete="name"
              {...(errors.name ? { error: errors.name } : {})}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              id="rfq-contact-company"
              label="Company"
              autoComplete="organization"
              {...(errors.contactCompany ? { error: errors.contactCompany } : {})}
              value={contactCompany}
              onChange={(e) => setContactCompany(e.target.value)}
            />
            <Input
              id="rfq-email"
              label="Work email"
              type="email"
              inputMode="email"
              autoComplete="email"
              {...(errors.email ? { error: errors.email } : {})}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="rfq-phone"
              label="Phone (with country code)"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              helper="Include the country code, e.g. +91"
              {...(errors.phone ? { error: errors.phone } : {})}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[\s-]/g, ''))}
            />
          </div>

          {/* Honeypot — hidden from users and assistive tech; bots fill it */}
          <div className="hidden" aria-hidden="true">
            <label>
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          {submitError && (
            <div role="alert" className="rounded-sm border border-signal-error bg-signal-error-tint p-4 text-sm text-steel-950">
              <p>{submitError}</p>
              {(fallbackEmail || fallbackPhone) && (
                <p className="mt-2 text-steel-700">
                  If it fails again, reach us directly:{' '}
                  {fallbackEmail && (
                    <a href={`mailto:${fallbackEmail}`} className="font-medium text-accent-text hover:underline">
                      {fallbackEmail}
                    </a>
                  )}
                  {fallbackEmail && fallbackPhone && ' · '}
                  {fallbackPhone && (
                    <a href={`tel:${fallbackPhone}`} className="font-mono font-medium text-accent-text hover:underline">
                      {fallbackPhone}
                    </a>
                  )}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => setStep(1)} disabled={submitting}>
              Back
            </Button>
            {/* The Amber Law: the one accent-filled element on this view */}
            <Button variant="rfq" type="submit" loading={submitting}>
              {submitError ? 'Retry submission' : 'Submit requirement'}
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
