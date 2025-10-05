import { getAllProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export default async function HomePage() {
  const products = await getAllProducts()
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">New Arrivals</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}