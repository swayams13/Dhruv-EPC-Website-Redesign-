import { ImageResponse } from 'next/og'
import { flex, steel } from '@vedanta/tokens'

export const runtime = 'edge'
export const alt = 'Dampers — Louver, Butterfly & Guillotine Duct Dampers, AMCA 500 — Precise Engineers'
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
            Precise Engineers · EIL Approved · ISO 9001:2015
          </div>
          <div style={{ marginTop: 24, fontSize: 64, fontWeight: 600, lineHeight: 1.1 }}>
            Dampers
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 64, height: 4, backgroundColor: flex[500] }} />
          <div style={{ fontSize: 36, fontFamily: 'monospace', color: steel[50] }}>
            AMCA 500 · Louver · Butterfly · Guillotine
          </div>
        </div>
      </div>
    ),
    size,
  )
}
