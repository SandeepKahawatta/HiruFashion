'use client'

import FeaturedCarousel from './FeaturedCarousel'
import { Product } from '@/lib/types'

interface RelatedProductsProps {
    products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) return null

    return (
        <div className="mt-16 border-t pt-16">
            <FeaturedCarousel products={products} title="You May Also Like" />
        </div>
    )
}
