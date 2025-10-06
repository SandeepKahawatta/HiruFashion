export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();

  // normalize email to match your registration flow
  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  // sets an httpOnly session cookie
  setSessionCookie({ userId: user._id.toString(), role: user.role, email: user.email });

  // 👇 include the role (and id if you want) in the response
  return NextResponse.json({ ok: true, role: user.role, userId: user._id.toString() });
}
