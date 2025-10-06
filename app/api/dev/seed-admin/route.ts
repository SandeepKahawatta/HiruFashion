// app/api/dev/seed-admin/route.ts
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  await dbConnect();
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  if (!email) return NextResponse.json({ error: 'ADMIN_EMAIL not set' }, { status: 400 });

  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ ok: true, note: 'Already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name: 'Admin', email, passwordHash, role: 'admin' });
  return NextResponse.json({ ok: true, id: user._id });
}
