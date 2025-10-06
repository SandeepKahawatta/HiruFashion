export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: 'Email in use' }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

  const user = await User.create({ name, email, passwordHash, role });
  setSessionCookie({ userId: user._id.toString(), role: user.role as any, email: user.email });

  return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}
