export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/lib/models/Product';
import { getSessionFromCookies, requireAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '0');
  const ids = searchParams.get('ids');

  // Filters
  const categories = searchParams.get('category')?.split(',').filter(Boolean);
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || 'newest';

  let filter: any = {};

  if (ids) {
    const idList = ids.split(',').filter(Boolean);
    if (idList.length > 0) {
      filter._id = { $in: idList };
    }
  } else {
    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { name: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
      ];
    }

    if (categories && categories.length > 0) {
      filter.category = { $in: categories.map(c => new RegExp(`^${c}$`, 'i')) }; // Case-insensitive match
    }

    const colors = searchParams.get('color')?.split(',').filter(Boolean);
    if (colors && colors.length > 0) {
      // Assuming colors are stored as array of strings in DB
      filter.colors = { $in: colors.map(c => new RegExp(`^${c}$`, 'i')) };
    }

    const sizes = searchParams.get('size')?.split(',').filter(Boolean);
    if (sizes && sizes.length > 0) {
      filter.sizes = { $in: sizes.map(s => new RegExp(`^${s}$`, 'i')) };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice) * 100;
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice) * 100;
    }
  }

  let sortOption: any = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };

  let query = Product.find(filter).sort(sortOption);

  if (limit > 0) {
    query = query.limit(limit);
  }

  // 1) Return plain JS objects
  const products = await query.lean();

  // 2) Normalize each product
  const normalized = products.map((doc) => {
    const id = doc._id?.toString?.() ?? doc.id;

    const images = Array.isArray(doc.images) && doc.images.length > 0
      ? doc.images
      : (doc.image ? [doc.image] : []);

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
