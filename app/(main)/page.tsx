// app/page.tsx  (Home)
import Link from 'next/link'
import WelcomeGate from '@/components/WelcomeGate'
import CollectionCard from '@/components/CollectionCard'
import { COLLECTIONS } from '@/lib/data'
import { ArrowUpRight } from 'lucide-react'
import HeroSection from '@/components/HeroSection'
import FeaturedCarousel from '@/components/FeaturedCarousel'
import TestimonialSection from '@/components/TestimonialSection'
import NewsletterSection from '@/components/NewsletterSection'
import { cookies } from 'next/headers'

import { Product } from '@/lib/types'

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
        {/* Collections Section */}
        <section className="py-16 px-4 w-full lg:w-[80%] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Our Collections</h2>
              <p className="text-gray-600">Explore our wide range of premium fashion</p>
            </div>
            <Link
              href="/collections"
              className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-gray-600 transition-colors"
            >
              See More <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {COLLECTIONS.slice(0, 6).map((collection, index) => (
              <CollectionCard
                key={collection.name}
                index={index}
                compact={true}
                {...collection}
              />
            ))}
          </div>

          {/* Mobile See More Button */}
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-sm font-semibold border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all"
            >
              View All Collections <ArrowUpRight size={16} />
            </Link>
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
