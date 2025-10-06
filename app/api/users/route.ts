export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);
  const users = await User.find({}).select('-passwordHash');
  return NextResponse.json(users);
}
