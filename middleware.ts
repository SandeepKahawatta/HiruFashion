// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow assets & API
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images')
  ) return NextResponse.next()

  // Read lightweight public cookie set at login
  const publicRaw = req.cookies.get('session_public')?.value
  const hasJwt = !!req.cookies.get('session')?.value

  let session: null | { userId: string; role: 'user'|'admin' } = null
  if (publicRaw && hasJwt) {
    try { session = JSON.parse(publicRaw) } catch {}
  }

  // Require auth except /login and /register
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  if (!session && !isAuthPage) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If logged in and on /login or /register, bounce to home (or admin)
  if (session && isAuthPage) {
    const dest = session.role === 'admin' ? '/admin/products' : '/'
    return NextResponse.redirect(new URL(dest, req.url))
  }

  // Admin gate
  if (pathname.startsWith('/admin') && session?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|api).*)'],
}
