// app/category/[slug]/page.tsx
import ProductCard from '@/components/ProductCard'

function deslugify(s: string) {
  return s.replace(/-/g, ' ')
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  const res = await fetch(`${base}/api/products`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load products')
  const products: any[] = await res.json()

  const wanted = deslugify(params.slug).toLowerCase()
  const filtered = products.filter((p) => (p.category || '').toLowerCase() === wanted)

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Category: {deslugify(params.slug)}</h1>
      {filtered.length === 0 ? (
        <div className="text-sm text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
