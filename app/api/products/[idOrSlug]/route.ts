// app/api/products/[idOrSlug]/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/lib/models/Product';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';
import { Types } from 'mongoose';

type ProductLean = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  category?: string;
  price: number;
  description?: string;
  image?: string;       // legacy cover
  images?: string[];    // new multi-images
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};

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

  // ✅ tell TS exactly what lean returns
  const product = await Product.findOne(query).lean<ProductLean | null>();
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // ✅ normalize + strip mongoose internals
  const id = product._id.toString();
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const { _id, __v, ...rest } = product;
  return NextResponse.json({ ...rest, id, images });
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
