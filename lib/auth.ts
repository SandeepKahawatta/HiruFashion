// lib/auth.ts
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = 'session'                // JWT (httpOnly)
const PUBLIC_COOKIE = 'session_public'       // JSON (readable by middleware)

export type SessionPayload = { userId: string; role: 'user'|'admin'; email: string }

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifySession(token?: string): SessionPayload | null {
  try { return token ? (jwt.verify(token, JWT_SECRET) as SessionPayload) : null }
  catch { return null }
}

export function getSessionFromCookies(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value
  return verifySession(token)
}

export function setSessionCookie(payload: SessionPayload) {
  const token = signSession(payload)

  // Secure, httpOnly JWT for API routes
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })

  // Public (non-httpOnly) cookie for middleware check only
  const publicPayload = { userId: payload.userId, role: payload.role }
  cookies().set(PUBLIC_COOKIE, JSON.stringify(publicPayload), {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0,
  })
  cookies().set(PUBLIC_COOKIE, '', {
    httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0,
  })
}

// (Optional) keep this around only if some code uses it, but middleware won't anymore
export function decodeSession(raw: string | undefined) {
  if (!raw) return null
  try { return JSON.parse(raw) as { userId: string; role: string; email?: string } }
  catch { return null }
}

export function requireAdmin(role?: string) {
  if (role !== 'admin') throw new Response('Forbidden', { status: 403 })
}
