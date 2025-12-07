'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/lib/wishlist-context';
import { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
    const { wishlist, loading: contextLoading } = useWishlist();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (wishlist.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // We can reuse the wishlist API which returns full product objects
                const res = await fetch('/api/user/wishlist');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch wishlist products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlist.length]); // Re-fetch if count changes (though context handles optimistic updates, full fetch ensures data consistency)

    if (loading || contextLoading) {
        return (
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

            {products.length === 0 ? (
                <div className="p-12 text-center bg-gray-50 rounded-xl">
                    <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
