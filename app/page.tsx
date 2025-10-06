'use client'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import ProductCard from '@/components/ProductCard'

export default function ProductsGrid() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch('/api/products')
      const data = await res.json()
      setProducts(data)
    }
    load()
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}
