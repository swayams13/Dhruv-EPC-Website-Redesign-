-- 0001_leads.sql — RFQ lead persistence (VG-040) + rate-limit/idempotency
-- durability (VG-041) + presign issuance ledger (D4, hardens the B8 gap:
-- verifying an uploaded key was actually issued by /api/presign, not just
-- shaped like one).
--
-- Applied by scripts/migrate.mjs, tracked in schema_migrations. Written to
-- be safely re-runnable (IF NOT EXISTS throughout) even though the runner
-- also skips already-applied files by name.

CREATE SEQUENCE IF NOT EXISTS leads_reference_seq START 1000;

-- Reference format VG-XXXXXX from a sequence, not Date.now().toString(36) —
-- sequential and monotonic, but not derivable from a submission timestamp,
-- which is the "non-guessable" requirement (D5). A determined party could
-- still enumerate references, but that was equally true of the timestamp
-- version and is out of scope here (no PII is reachable via a bare reference).
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL DEFAULT ('VG-' || lpad(nextval('leads_reference_seq')::text, 6, '0')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  company TEXT,
  product_slug TEXT NOT NULL,
  industry_slug TEXT,
  name TEXT NOT NULL,
  contact_company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  uploaded_keys JSONB NOT NULL DEFAULT '[]',
  source_page TEXT,
  utm JSONB,
  status TEXT NOT NULL DEFAULT 'new',
  notification_status JSONB NOT NULL DEFAULT '{}',
  scan_status TEXT NOT NULL DEFAULT 'pending',
  idempotency_key UUID UNIQUE NOT NULL,
  -- Not in the reviewed column list verbatim, but required to do IP rate
  -- limiting against this table per D2 ("reuse this one for rate-limiting")
  -- instead of standing up Redis/KV.
  ip TEXT
);

-- Backs isRateLimited()'s "count submissions from this IP in the last 10
-- minutes" query.
CREATE INDEX IF NOT EXISTS leads_ip_created_at_idx ON leads (ip, created_at);

-- D4: every key /api/presign issues is recorded here with its real expiry;
-- /api/rfq checks uploadedFileKeys against this table instead of a
-- startsWith('uploads/') string check, which any client could forge.
CREATE TABLE IF NOT EXISTS issued_presign_keys (
  key TEXT PRIMARY KEY,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS issued_presign_keys_expires_at_idx ON issued_presign_keys (expires_at);
