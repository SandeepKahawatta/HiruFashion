// app/products/page.tsx
import ProductCard from '@/components/ProductCard'

type Product = {
  id?: string
  _id?: string
  name: string
  slug: string
  category?: string
  price: number
  image?: string
  images?: string[]
}

export const dynamic = 'force-dynamic' // always fresh

export default async function AllProductsPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  const res = await fetch(`${base}/api/products`)
  if (!res.ok) throw new Error('Failed to load products')
  const products: Product[] = await res.json()

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">All Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={(p as any).id || (p as any)._id} product={p as any} />
        ))}
      </div>
    </div>
  )
}
