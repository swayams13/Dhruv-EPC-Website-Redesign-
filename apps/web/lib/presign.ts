// AWS SigV4 query-string presigned PUT — TRD §T-4 direct-to-storage upload.
// Hand-rolled with node:crypto instead of @aws-sdk/* — a new dependency is a
// human-review gate (CLAUDE.md) and query presigning is ~50 deterministic lines.
// Works against R2/S3 path-style endpoints. UNSIGNED-PAYLOAD, host-only signing.

import { createHash, createHmac } from 'node:crypto'

export interface PresignConfig {
  endpoint: string // e.g. https://<account>.r2.cloudflarestorage.com
  bucket: string
  region: string // 'auto' for R2
  accessKeyId: string
  secretAccessKey: string
}

// S3 canonical URI encoding: RFC 3986, '/' preserved in the path
function encodePath(segment: string): string {
  return encodeURIComponent(segment).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

function sha256Hex(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac('sha256', key).update(data).digest()
}

export function presignPutUrl(
  config: PresignConfig,
  key: string,
  expiresSeconds: number,
  now: Date = new Date(),
): string {
  const host = new URL(config.endpoint).host
  const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '') // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8)
  const scope = `${dateStamp}/${config.region}/s3/aws4_request`
  const canonicalPath = `/${encodePath(config.bucket)}/${key.split('/').map(encodePath).join('/')}`

  const params: Array<[string, string]> = [
    ['X-Amz-Algorithm', 'AWS4-HMAC-SHA256'],
    ['X-Amz-Credential', `${config.accessKeyId}/${scope}`],
    ['X-Amz-Date', amzDate],
    ['X-Amz-Expires', String(expiresSeconds)],
    ['X-Amz-SignedHeaders', 'host'],
  ]
  const canonicalQuery = params
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .sort()
    .join('&')

  const canonicalRequest = ['PUT', canonicalPath, canonicalQuery, `host:${host}\n`, 'host', 'UNSIGNED-PAYLOAD'].join('\n')
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256Hex(canonicalRequest)].join('\n')

  const signingKey = hmac(hmac(hmac(hmac(`AWS4${config.secretAccessKey}`, dateStamp), config.region), 's3'), 'aws4_request')
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex')

  return `https://${host}${canonicalPath}?${canonicalQuery}&X-Amz-Signature=${signature}`
}
