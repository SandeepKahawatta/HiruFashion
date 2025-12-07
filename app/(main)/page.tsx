// app/page.tsx  (Home)
import Link from 'next/link'
import WelcomeGate from '@/components/WelcomeGate'
import CategoryCard from '@/components/CategoryCard'
import HeroSection from '@/components/HeroSection'
import FeaturedCarousel from '@/components/FeaturedCarousel'
import TestimonialSection from '@/components/TestimonialSection'
import NewsletterSection from '@/components/NewsletterSection'
import { cookies } from 'next/headers'

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
  let products: Product[] = []

  try {
    const res = await fetch(`${base}/api/products`, { cache: 'no-store' })
    if (res.ok) {
      products = await res.json()
    }
  } catch (error) {
    console.error("Failed to fetch products", error)
  }

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean) as string[])
  ).sort()

  // If no categories found (e.g. empty DB), provide some defaults for UI testing
  const displayCategories = categories.length > 0 ? categories : ['Dresses', 'Shirts', 'Pants', 'Frock', 'Slippers', 'Bags']

  const trending = pickRandom(products, Math.min(8, products.length))
  const newArrivals = pickRandom(products, Math.min(8, products.length))

  const showWelcome = cookies().get('welcome_toast')?.value === 'true'

  return (
    <>
      <WelcomeGate initialShow={showWelcome} />

      <div className="flex flex-col min-h-screen">
        <HeroSection />

        {/* Categories Section */}
        <section className="py-16 px-4 container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our wide range of collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {displayCategories.map((c) => (
              <CategoryCard key={c} name={c} />
            ))}
          </div>
        </section>

        {/* Trending Products */}
        {products.length > 0 && (
          <FeaturedCarousel products={trending} title="Trending Now" />
        )}

        {/* New Arrivals */}
        {products.length > 0 && (
          <FeaturedCarousel products={newArrivals} title="New Arrivals" />
        )}

        <TestimonialSection />

        <NewsletterSection />
      </div>
    </>
  )
}
