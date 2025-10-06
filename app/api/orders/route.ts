export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const data = await req.json();
  if (!data.items || data.items.length === 0) {
    return NextResponse.json({ error: 'No items in order' }, { status: 400 });
  }

  const order = await Order.create({
    userId: session.userId,
    email: session.email,
    name: session.name,
    ...data,
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  await dbConnect();
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  // If admin, return all orders
  if (session.role === 'admin') {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  }

  // Else return only this user's orders
  const orders = await Order.find({ userId: session.userId }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}
