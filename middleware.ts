// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // allow APIs and _next/static, images, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images')
  ) return NextResponse.next()

  // your auth check here...
  // if (!loggedIn) return NextResponse.redirect(new URL('/login', req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|api).*)'],
}
