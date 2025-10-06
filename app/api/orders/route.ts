export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const { items, subtotal } = await req.json();
  const order = await Order.create({ userId: session.userId, items, subtotal });
  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);
  const orders = await Order.find({}).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}
