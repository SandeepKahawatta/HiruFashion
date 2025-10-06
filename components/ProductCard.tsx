import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/lib/cart'
import { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product & { images?: string[] } }) {
  const cover = product.images?.[0] || product.image || '/placeholder.png'; // fallback to legacy and placeholder
  return (
    <div className="border rounded-xl overflow-hidden group">
      <div className="relative aspect-square">
        <Image src={cover} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" />
      </div>
      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block font-medium">{product.name}</Link>
        <div className="text-sm text-gray-600">{product.category}</div>
        <div className="mt-2 font-semibold">${(product.price / 100).toFixed(2)}</div>
        <div className="mt-4">
          <AddToCartButton id={product.id ?? ''} size="sm" />
        </div>
      </div>
    </div>
  )
}
