export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);
  const { status } = await req.json();
  const updated = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
  return NextResponse.json(updated);
}
