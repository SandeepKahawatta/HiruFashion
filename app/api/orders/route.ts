// app/api/orders/route.ts
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { getSessionFromCookies } from '@/lib/auth';

type PostBody = {
  items: Array<{
    productId: string;
    qty: number;
    size?: string;
    color?: string;
  }>;
  shippingAddress?: any;
  billingAddress?: any;
  note?: string;
};

export async function POST(req: Request) {
  await dbConnect();
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const body = (await req.json()) as PostBody;
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'No items in order' }, { status: 400 });
  }

  // Fetch products in one go
  const ids = body.items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: ids } }).lean();

  const productsMap = new Map<string, any>();
  for (const p of products) productsMap.set(String(p._id), p);

  // Build validated order items & recompute subtotal
  let subtotal = 0;
  const items = body.items.map((it) => {
    const p = productsMap.get(it.productId);
    if (!p) throw new Error('Product not found');

    // Optionally validate variant choices
    if (p.sizes?.length && it.size && !p.sizes.includes(it.size)) {
      throw new Error(`Invalid size for ${p.name}`);
    }
    if (p.colors?.length && it.color && !p.colors.includes(it.color)) {
      throw new Error(`Invalid color for ${p.name}`);
    }

    const unitPrice = Number(p.price) || 0;
    const image = (Array.isArray(p.images) && p.images[0]) || p.image || '';
    const qty = Math.max(1, Number(it.qty) || 1);

    subtotal += unitPrice * qty;

    return {
      productId: p._id,
      size: it.size,
      color: it.color,
      qty,
      name: p.name,
      unitPrice,
      image,
    };
  });

  const order = await Order.create({
    userId: session.userId,
    email: session.email,
    name: (session as any).name, // if you store it in the token
    shippingAddress: body.shippingAddress || {},
    billingAddress: body.billingAddress || {},
    note: body.note || '',
    items,
    subtotal,
  });

  return NextResponse.json({ ...order.toObject(), id: order._id.toString() }, { status: 201 });
}

export async function GET() {
  await dbConnect();
  const session = getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const query = session.role === 'admin' ? {} : { userId: session.userId };
  const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

  const normalized = orders.map(o => ({ ...o, id: o._id?.toString?.() ?? o.id }));
  return NextResponse.json(normalized);
}
