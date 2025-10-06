// app/api/products/[idOrSlug]/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/lib/models/Product';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';

export async function GET(
  _req: Request,
  { params }: { params: { idOrSlug: string } }
) {
  await dbConnect();

  const idOrSlug = params.idOrSlug?.trim();
  if (!idOrSlug) {
    return NextResponse.json({ error: 'Missing parameter' }, { status: 400 });
  }

  const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug.toLowerCase() };

  const product = await Product.findOne(query).lean();
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...product,
    id: product._id?.toString?.(),
    images: Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [],
  });
}

export async function PUT(req: Request, { params }: { params: { idOrSlug: string } }) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);

  const idOrSlug = params.idOrSlug?.trim();
  const updates = await req.json();

  const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug.toLowerCase() };

  const updated = await Product.findOneAndUpdate(query, updates, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { idOrSlug: string } }) {
  await dbConnect();
  const session = getSessionFromCookies();
  requireAdmin(session?.role);

  const idOrSlug = params.idOrSlug?.trim();

  const query = /^[0-9a-fA-F]{24}$/.test(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug.toLowerCase() };

  await Product.findOneAndDelete(query);
  return new NextResponse(null, { status: 204 });
}
