// app/products/[idOrSlug]/page.tsx
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ProductPageClient from '@/components/ProductPageClient'
import { Product } from '@/lib/types'

async function getProduct(base: string, idOrSlug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${base}/api/products/${idOrSlug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getRelatedProducts(base: string, category: string, currentId: string): Promise<Product[]> {
  try {
    // Fetch more than needed to account for filtering out current product
    const res = await fetch(`${base}/api/products?category=${category}&limit=8`, { cache: 'no-store' })
    if (!res.ok) return []
    const products: Product[] = await res.json()
    return products
      .filter(p => (p.id || p._id) !== currentId)
      .slice(0, 4)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

export default async function ProductPage({ params }: { params: { idOrSlug: string } }) {
  const h = headers()
  const host = h.get('host')!
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const base = `${protocol}://${host}`

  const product = await getProduct(base, params.idOrSlug)

  if (!product) {
    return notFound()
  }

  const productId = product.id || product._id || ''
  const relatedProducts = await getRelatedProducts(base, product.category, productId)

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />
}
