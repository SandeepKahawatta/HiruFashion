// app/products/[idOrSlug]/page.tsx
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ProductPageClient from '@/components/ProductPageClient'

export default async function ProductPage({ params }: { params: { idOrSlug: string } }) {
  const h = headers()
  const host = h.get('host')!
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const base = `${protocol}://${host}`

  const res = await fetch(`${base}/api/products/${params.idOrSlug}`, { cache: 'no-store' })

  if (res.status === 404) return notFound()
  if (!res.ok) {
    console.error('Product fetch failed:', res.status, await res.text())
    return notFound()
  }

  const product = await res.json()
  if (!product) return notFound()

  return <ProductPageClient product={product} />
}
