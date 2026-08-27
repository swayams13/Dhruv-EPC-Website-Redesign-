import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import { BASE } from '../lib/site'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
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
    <html lang="en" className={`${archivo.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-steel-50 font-sans text-steel-950 antialiased">
        {children}
      </body>
    </html>
  )
}
