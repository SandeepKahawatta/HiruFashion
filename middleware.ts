// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ Allow public files and API
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images')
  ) {
    return NextResponse.next()
  }

  // ✅ Check for session cookie
  const session = req.cookies.get('session')?.value

  // If no session and not already on login page → redirect
  if (!session && pathname !== '/login') {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname) // optional: return path
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // protect all routes except these
    '/((?!_next|favicon.ico|images|api|login|register).*)',
  ],
}
