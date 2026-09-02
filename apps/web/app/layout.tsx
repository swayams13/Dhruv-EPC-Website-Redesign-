import type { Metadata } from 'next'
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import { BASE } from '../lib/site'
import './globals.css'

// v1.3 (2026-09-02): Archivo + IBM Plex Sans retired per
// VEDANTA_DESIGN_DECISIONS.md D-2 — one loader now serves both display and
// body text (net one fewer font family over the wire, not a swap-for-swap).
// A single --font-display variable backs both tailwind.ts fontFamily.display
// and fontFamily.sans — a second loader instance bound to --font-sans would
// just re-embed the same font a second time.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  // Plain string, not a template: 25 of 32 pages already carry their own
  // "| Precise Engineers"/"| Dhruv EPC"/"| Vedanta Group" suffix. A '%s | X'
  // template here double-suffixed every one of them ("... | Precise
  // Engineers | Vedanta Group"). Pages with no title of their own fall back
  // to this string as-is.
  title: 'Vedanta Group — Precision Fabrication & Flow-Control Engineering',
  description: 'Dhruv EPC Solutions and Precise Engineers — ASME U/U2, IBR, ISO certified fabricators of static equipment, pressure vessels, and expansion joints.',
  robots: {
    // Explicit allow for AI crawlers (FR-8 — the 409 dies here)
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-steel-50 font-sans text-steel-950 antialiased">
        {children}
      </body>
    </html>
  )
}
