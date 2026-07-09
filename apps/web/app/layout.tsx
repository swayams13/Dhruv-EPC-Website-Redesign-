import type { Metadata } from 'next'
import { IBM_Plex_Mono, Inter, Schibsted_Grotesk } from 'next/font/google'
import './globals.css'

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://vedantagroup.net'),
  title: {
    template: '%s | Vedanta Group',
    default: 'Vedanta Group — Precision Fabrication & Flow-Control Engineering',
  },
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
    <html lang="en" className={`${schibsted.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-steel-50 font-sans text-steel-950 antialiased">
        {children}
      </body>
    </html>
  )
}
