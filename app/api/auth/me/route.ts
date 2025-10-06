export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';
import User from '@/lib/models/User';

export async function GET() {
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ user: null });
  await dbConnect();
  const user = await User.findById(session.userId).select('name email role');
  return NextResponse.json({ user });
}
