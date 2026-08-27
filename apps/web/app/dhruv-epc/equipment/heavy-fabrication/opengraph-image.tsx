import { ImageResponse } from 'next/og'
import { brand, steel } from '@vedanta/tokens'

export const runtime = 'edge'
export const alt = 'Heavy Fabrication — IS 2062, AWS D1.1, up to 200 T — Dhruv EPC'
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
            Heavy Fabrication
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 64, height: 4, backgroundColor: brand[500] }} />
          <div style={{ fontSize: 36, fontFamily: 'monospace', color: steel[50] }}>
            IS 2062 · AWS D1.1 · Up to 200 T
          </div>
        </div>
      </div>
    ),
    size,
  )
}
