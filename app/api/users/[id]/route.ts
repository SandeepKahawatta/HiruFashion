export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);
  const user = await User.findById(params.id).select('-passwordHash');
  return NextResponse.json(user);
}

export async function PUT(req: Request, { params }: Params) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);
  const updates = await req.json();
  const updated = await User.findByIdAndUpdate(params.id, updates, { new: true }).select('-passwordHash');
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);
  await User.findByIdAndDelete(params.id);
  return new NextResponse(null, { status: 204 });
}
