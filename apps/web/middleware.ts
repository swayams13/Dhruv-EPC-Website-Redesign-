import { type NextRequest, NextResponse } from 'next/server'
import { LEGACY_REDIRECTS } from './lib/redirects.generated'

// Redirect map is COMPILED from content/redirect-map.csv by scripts/build-redirects.mjs.
// This file must never hold a hand-typed redirect — that is exactly how the map
// silently drifted to 3 entries while the CSV held 57 (blueprint §16). Add rows to
// the CSV; redirects.test.ts fails the build if the two disagree.

// Security headers applied at edge (redundant with next.config.ts but belt-and-suspenders for Vercel edge)
const SECURITY_HEADERS = {
  'X-Robots-Tag': 'index, follow',
}

/** Legacy paths are .php files and are matched case-sensitively as authored, but
 *  a trailing-slash variant is cheap to accept and costs one extra lookup. */
function lookup(pathname: string) {
  return LEGACY_REDIRECTS[pathname] ?? LEGACY_REDIRECTS[pathname.replace(/\/$/, '')]
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const match = lookup(pathname)

  if (match) {
    // Preserve the query string: legacy product pages were linked with ?id= params
    // from third-party directories, and dropping them loses referrer attribution.
    const url = new URL(match.to, request.url)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, { status: match.status })
  }

  const response = NextResponse.next()
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export const config = {
  // Skip static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
