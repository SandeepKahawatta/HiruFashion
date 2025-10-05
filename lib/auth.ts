import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = 'session';

export type SessionPayload = { userId: string; role: 'user'|'admin'; email: string };

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySession(token?: string): SessionPayload | null {
  try {
    return token ? (jwt.verify(token, JWT_SECRET) as SessionPayload) : null;
  } catch {
    return null;
  }
}

export function getSessionFromCookies(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySession(token);
}

export function setSessionCookie(payload: SessionPayload) {
  const token = signSession(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 0 });
}

export function requireAdmin(role: string | undefined) {
  if (role !== 'admin') throw new Response('Forbidden', { status: 403 });
}
