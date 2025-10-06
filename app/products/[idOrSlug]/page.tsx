// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import ProductPageClient from '@/components/ProductPageClient'

export default async function ProductPage({ params }: { params: { idOrSlug: string } }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || ''
  const idOrSlug = params.idOrSlug ?? ''
  const url = `${base}/api/products/${idOrSlug}`

  const res = await fetch(url)

  if (res.status === 404) return notFound()
  if (!res.ok) {
    // ← helps you see why it failed
    console.log('res.status :>> ', res );
  }

  const product = await res.json()
  if (!product) return notFound()
  return <ProductPageClient product={product} />
}
