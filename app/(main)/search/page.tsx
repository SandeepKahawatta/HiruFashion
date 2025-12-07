import { Suspense } from 'react'
import ProductCard from '@/components/ProductCard'

type Product = {
    id: string
    name: string
    price: number
    images: string[]
    slug: string
    category: string
}

async function getSearchResults(q: string) {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    try {
        const res = await fetch(`${base}/api/products?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
        if (!res.ok) return []
        return res.json() as Promise<Product[]>
    } catch (error) {
        console.error("Failed to fetch search results", error)
        return []
    }
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
    const q = searchParams.q || ''
    const products = await getSearchResults(q)

    return (
        <div className="w-full lg:w-[80%] mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">
                Search Results for <span className="text-gray-500">"{q}"</span>
            </h1>

            {products.length === 0 ? (
                <div className="p-12 text-center bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No products found matching your search.</p>
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
