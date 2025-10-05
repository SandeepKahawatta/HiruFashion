import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import ProductPageClient from '@/components/ProductPageClient'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) return notFound()
  return <ProductPageClient product={product} />
}