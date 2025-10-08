export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/lib/models/Product';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';

export async function GET() {
  await dbConnect();

  // 1) Return plain JS objects
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .lean();

  // 2) Normalize each product
  const normalized = products.map((doc) => {
    const id = doc._id?.toString?.() ?? doc.id;

    const images = Array.isArray(doc.images) && doc.images.length > 0
      ? doc.images
      : (doc.image ? [doc.image] : []);

    // Option A: keep everything, add id + images
    // return { ...doc, id, images };

    // Option B (recommended): omit legacy `image` and `_id` to keep API tidy
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, image, ...rest } = doc as any;
    return { ...rest, id, images };
  });

  return NextResponse.json(normalized);
}

// app/api/products/route.ts
export async function POST(req: Request) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);

  const data = await req.json();

  // ✅ Validate
  const ALLOWED = ['slippers', 'frocks', 'blouses', 'skirts', 'pants', 'bags'];
  if (!data.name || !data.slug || !data.price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!ALLOWED.includes((data.category || '').toLowerCase())) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  if (!Array.isArray(data.images) || data.images.length === 0) {
    return NextResponse.json({ error: 'At least one image required' }, { status: 400 });
  }
  if (!Array.isArray(data.colors)) data.colors = [];
  if (!Array.isArray(data.sizes)) data.sizes = [];

  data.category = data.category.toLowerCase();
  data.image = data.images[0]; // keep legacy cover

  const created = await Product.create(data);

  const normalized = {
    ...created.toObject(),
    id: created._id.toString(),
    images: created.images?.length ? created.images : (created.image ? [created.image] : []),
  };

  return NextResponse.json(normalized, { status: 201 });
}
