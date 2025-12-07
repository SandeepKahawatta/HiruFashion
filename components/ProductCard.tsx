'use client';

import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/lib/cart'
import { Product } from '@/lib/types';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { useAuthClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }: { product: Product & { images?: string[]; description?: string } }) {
  const cover = product.images?.[0] || product.image || '/placeholder.png';
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuthClient();
  const router = useRouter();

  const inWishlist = isInWishlist(product.id ?? '');

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (inWishlist) {
      removeFromWishlist(product.id ?? '');
    } else {
      addToWishlist(product.id ?? '');
    }
  };

  return (
    <div className="bg-white rounded-[30px] p-4 shadow-lg hover:shadow-xl transition-all duration-300 relative group flex flex-col h-full border border-transparent hover:border-[#C8A17D]/20">

      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] rounded-[20px] overflow-hidden mb-4">
        <Image
          src={cover}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Wishlist Button (Top Left) */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 left-3 w-10 h-10 flex items-center justify-center rounded-full bg-[#C8A17D] text-white hover:bg-[#B08D69] transition-colors shadow-sm z-10"
        >
          <Heart
            size={18}
            className={`transition-colors ${inWishlist ? 'fill-white' : ''}`}
          />
        </button>
      </div>

      {/* Content - Left Aligned */}
      <div className="flex-1 flex flex-col items-start w-full space-y-1 px-2">
        <h3 className="text-sm sm:text-base md:text-lg font-extrabold uppercase text-[#C8A17D] tracking-wider text-left line-clamp-1">
          <Link href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>

        <div className="bg-black text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
          LKR {(product.price / 100).toFixed(2)}
        </div>
      </div>

      {/* Add to Cart Button - 75% Width, Left Aligned */}
      <div className="mt-3 w-full flex justify-start relative z-20 px-2">
        <AddToCartButton
          id={product.id ?? ''}
          size="default"
          className="!w-[85%] sm:!w-[75%] !rounded-xl !bg-[#C8A17D] !text-white hover:!bg-[#B08D69] shadow-md flex items-center justify-center gap-1 sm:gap-2 font-bold tracking-wide text-[10px] sm:text-xs whitespace-nowrap !px-2 !py-2"
          icon={<ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />}
        />
      </div>
    </div>
  )
}
