import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
    await dbConnect();
    const session = getSessionFromCookies();
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Fetch products based on IDs in wishlist
    const products = await Product.find({ _id: { $in: user.wishlist } }).lean();

    // Normalize products (similar to products route)
    const normalized = products.map((doc) => {
        const id = doc._id?.toString?.() ?? doc.id;
        const images = Array.isArray(doc.images) && doc.images.length > 0
            ? doc.images
            : (doc.image ? [doc.image] : []);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, image, ...rest } = doc as any;
        return { ...rest, id, images };
    });

    return NextResponse.json(normalized);
}

export async function POST(req: Request) {
    await dbConnect();
    const session = getSessionFromCookies();
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
        return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
    }

    return NextResponse.json({ message: 'Added to wishlist', wishlist: user.wishlist });
}

export async function DELETE(req: Request) {
    await dbConnect();
    const session = getSessionFromCookies();
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
        return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const user = await User.findById(session.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    user.wishlist = user.wishlist.filter((id: string) => id !== productId);
    await user.save();

    return NextResponse.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
}
