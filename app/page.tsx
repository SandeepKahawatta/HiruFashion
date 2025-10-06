// app/page.tsx  (Home)
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import WelcomeGate from '@/components/WelcomeGate'

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

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-')
}

function pickRandom<T>(arr: T[], n: number) {
  // simple Fisher–Yates
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  const res = await fetch(`${base}/api/products`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load products')
  const products: Product[] = await res.json()

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean) as string[])
  ).sort()

  const featured = pickRandom(products, Math.min(6, products.length))

  return (
    <>
    <WelcomeGate />
    <div className="px-4 py-6 space-y-6">
      {/* Categories */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Shop by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/category/${slugify(c)}`}
              className="px-3 py-2 text-sm border rounded-full active:bg-gray-100"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured (random 6) */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Featured</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {featured.map((p) => (
            <ProductCard key={(p as any).id || (p as any)._id} product={p as any} />
          ))}
        </div>
      </section>
    </div>
    </>
  )
}
