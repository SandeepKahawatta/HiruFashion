// app/api/orders/[id]/route.ts
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/lib/models/Order';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const id = params.id?.trim();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const order = await Order.findById(id).lean<{ _id: unknown; userId: unknown }>();
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const isOwner = String(order.userId) === String(session.userId);
  const isAdmin = session.role === 'admin';
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json({ ...order, id: (order as any)._id?.toString?.() ?? (order as any).id });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);

  const id = params.id?.trim();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const body = await req.json();

  const patch: any = {};
  if (body.status) patch.status = body.status;
  if (typeof body.note === 'string') patch.note = body.note;
  if (body.shippingAddress) patch.shippingAddress = body.shippingAddress;
  if (body.billingAddress) patch.billingAddress = body.billingAddress;
  if (Array.isArray(body.items)) {
    // trust admin’s full overwrite for items; recompute subtotal
    patch.items = body.items;
    patch.subtotal = body.items.reduce((n: number, it: any) => n + (Number(it.unitPrice) || 0) * (Number(it.qty) || 0), 0);
  }

  const updated = await Order.findByIdAndUpdate(id, patch, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ ...updated, id: (updated as any)._id?.toString?.() ?? (updated as any).id });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);

  await Order.findByIdAndDelete(params.id);
  return new NextResponse(null, { status: 204 });
}
