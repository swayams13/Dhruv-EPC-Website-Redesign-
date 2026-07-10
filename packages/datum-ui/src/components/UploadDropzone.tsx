'use client'
// UploadDropzone — Datum §14 drawing intake, a first-class component.
// Presigned-PUT contract (validation addendum §3.1): caller supplies presign();
// files go direct-to-storage, never through the server body (CLAUDE.md: the
// 4.5MB Vercel limit makes server-body upload a silent production failure).
// Per-file row: name, size (mono), progress bar (accent), remove, retry.
// The confidentiality caption ships WITH the component (§14: "the reassurance
// is a conversion element … so it ships with the component, not with someone's
// memory to add it").

import { useRef, useState } from 'react'

export interface UploadDropzoneProps {
  /** Returns a presigned PUT url + storage key for one file */
  presign: (file: File) => Promise<{ url: string; key: string }>
  /** Fired with the keys of all successfully uploaded files, on every change */
  onChange: (keys: string[]) => void
  /** Fired when uploads start/finish — lets the form block submit mid-upload (§T-4 upload-before-submit) */
  onBusyChange?: (busy: boolean) => void
  /** RFQ schema caps at 5 (packages/schemas rfq.ts) */
  maxFiles?: number
  /** §14: up to 25 MB each */
  maxSizeBytes?: number
  accept?: string
  /** Confidentiality caption slot — defaults to the §14 line */
  confidentialityNote?: string
  className?: never
}

interface FileEntry {
  id: string
  file: File
  status: 'uploading' | 'done' | 'error'
  progress: number // 0–100
  key?: string | undefined
  message?: string | undefined
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function putWithProgress(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`))
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(file)
  })
}

export function UploadDropzone({
  presign,
  onChange,
  onBusyChange,
  maxFiles = 5,
  maxSizeBytes = 25 * 1024 * 1024,
  accept = '.pdf,.dwg,.jpg,.jpeg,.png,.webp',
  confidentialityNote = 'Drawings are confidential and reviewed only by our engineering team.',
}: UploadDropzoneProps): React.ReactElement {
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const entriesRef = useRef(entries)
  entriesRef.current = entries

  function emit(next: FileEntry[]) {
    setEntries(next)
    entriesRef.current = next
    onChange(next.filter((e) => e.status === 'done' && e.key).map((e) => e.key as string))
    onBusyChange?.(next.some((e) => e.status === 'uploading'))
  }

  function patch(id: string, changes: Partial<FileEntry>) {
    emit(entriesRef.current.map((e) => (e.id === id ? { ...e, ...changes } : e)))
  }

  async function upload(entry: FileEntry) {
    patch(entry.id, { status: 'uploading', progress: 0, message: undefined })
    try {
      const { url, key } = await presign(entry.file)
      await putWithProgress(url, entry.file, (pct) => patch(entry.id, { progress: pct }))
      patch(entry.id, { status: 'done', progress: 100, key })
    } catch (err) {
      patch(entry.id, { status: 'error', message: err instanceof Error ? err.message : 'Upload failed' })
    }
  }

  function addFiles(list: FileList | null) {
    if (!list) return
    const room = maxFiles - entriesRef.current.length
    const picked = Array.from(list).slice(0, room)
    const fresh: FileEntry[] = picked.map((file) => {
      const oversize = file.size > maxSizeBytes
      return {
        id: crypto.randomUUID(),
        file,
        status: oversize ? 'error' : 'uploading',
        progress: 0,
        message: oversize ? `File exceeds ${Math.round(maxSizeBytes / (1024 * 1024))} MB` : undefined,
      }
    })
    emit([...entriesRef.current, ...fresh])
    fresh.filter((e) => e.status === 'uploading').forEach((e) => void upload(e))
  }

  function remove(id: string) {
    emit(entriesRef.current.filter((e) => e.id !== id))
  }

  const full = entries.length >= maxFiles

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={full}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          if (!full) addFiles(e.dataTransfer.files)
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed bg-white p-8 transition-colors duration-instant disabled:bg-steel-100 disabled:text-steel-400 ${
          dragOver ? 'border-accent' : 'border-steel-300 hover:border-steel-400'
        }`}
      >
        {/* drawing icon — §12 squared construction */}
        <svg aria-hidden="true" className="h-8 w-8 text-steel-500" viewBox="0 0 32 32" fill="none">
          <path d="M7 4.5h13l5 5V27.5H7V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M20 4.5v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M11 16h10M11 20h10M11 24h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
        <span className="text-sm text-steel-950">
          {full ? `Maximum ${maxFiles} drawings` : 'Drop drawings here or browse'}
        </span>
        <span className="text-helper text-steel-600">PDF, DWG, images · up to 25 MB each</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        aria-label="Browse for drawings"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {entries.length > 0 && (
        <ul aria-live="polite" className="flex flex-col gap-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex min-h-row items-center gap-3 rounded-sm border border-steel-200 bg-white px-4 py-2"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-steel-950">{entry.file.name}</span>
                <span className="font-mono text-helper text-steel-500">{formatSize(entry.file.size)}</span>
                {entry.status === 'uploading' && (
                  <span
                    role="progressbar"
                    aria-valuenow={entry.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Uploading ${entry.file.name}`}
                    className="mt-1 block h-1 w-full rounded-sm bg-steel-200"
                  >
                    {/* §11 performance law: compositor-only — scaleX, never width */}
                    <span
                      className="block h-1 w-full origin-left rounded-sm bg-accent transition-transform duration-fast ease-standard"
                      style={{ transform: `scaleX(${entry.progress / 100})` }}
                    />
                  </span>
                )}
                {entry.status === 'error' && (
                  <span className="text-helper text-signal-error">{entry.message}</span>
                )}
                {entry.status === 'done' && (
                  <span className="text-helper text-signal-success">Uploaded</span>
                )}
              </span>
              {entry.status === 'error' && entry.file.size <= maxSizeBytes && (
                <button
                  type="button"
                  onClick={() => void upload(entry)}
                  className="h-compact shrink-0 rounded-sm border border-steel-300 px-3 text-sm font-medium text-steel-950 transition-colors duration-instant hover:border-steel-400"
                >
                  Retry
                </button>
              )}
              <button
                type="button"
                aria-label={`Remove ${entry.file.name}`}
                onClick={() => remove(entry.id)}
                className="flex h-compact w-compact shrink-0 items-center justify-center rounded-sm text-steel-700 transition-colors duration-instant hover:bg-steel-100"
              >
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-helper text-steel-600">{confidentialityNote}</p>
    </div>
  )
}
