export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const orders = await Order.find({ userId: session.userId })
    .sort({ createdAt: -1 })
    .lean();

  // Optional: normalize id
  const normalized = orders.map(o => ({ ...o, id: o._id?.toString?.() ?? o.id }));
  return NextResponse.json(normalized);
}
