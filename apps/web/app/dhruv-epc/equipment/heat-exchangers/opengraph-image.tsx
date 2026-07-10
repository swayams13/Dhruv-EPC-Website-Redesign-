// OG image — product name + one spec figure on graphite (playbook Session 7).
// next/og ImageResponse (built into Next 14 — no new dependency).
// ImageResponse renders off-DOM (satori), outside Tailwind — colors come from
// @vedanta/tokens primitives directly, never hand-typed hex.
import { ImageResponse } from 'next/og'
import { arc, steel } from '@vedanta/tokens'

export const runtime = 'edge'
export const alt = 'Shell & Tube Heat Exchangers — ASME Sec. VIII Div. 1 & 2, TEMA — Dhruv EPC'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          backgroundColor: steel[900],
          color: steel[50],
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 28, color: steel[400], textTransform: 'uppercase', letterSpacing: 4 }}>
            Dhruv EPC · ASME U &amp; U2 · IBR
          </div>
          <div style={{ marginTop: 24, fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>
            Shell &amp; Tube Heat Exchangers
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 64, height: 4, backgroundColor: arc[500] }} />
          <div style={{ fontSize: 36, fontFamily: 'monospace', color: steel[50] }}>
            ASME Sec. VIII Div. 1 &amp; 2 · TEMA
          </div>
        </div>
      </div>
    ),
    size,
  )
}
