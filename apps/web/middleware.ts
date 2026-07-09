import { type NextRequest, NextResponse } from 'next/server'

// Redirect map compiled from content/redirect-map.csv at build time
// ponytail: populated Phase 1; edge middleware handles runtime 301s
const LEGACY_REDIRECTS: Record<string, string> = {
  '/index.php': '/',
  '/about.php': '/about/',
  '/contact.php': '/contact/',
}

// Security headers applied at edge (redundant with next.config.ts but belt-and-suspenders for Vercel edge)
const SECURITY_HEADERS = {
  'X-Robots-Tag': 'index, follow',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const destination = LEGACY_REDIRECTS[pathname]

  if (destination) {
    return NextResponse.redirect(new URL(destination, request.url), { status: 301 })
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
