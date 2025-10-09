// components/ProductPageClient.tsx
"use client"

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

// Mirror your Product schema shape
export type Product = {
  id?: string
  _id?: string
  name: string
  slug: string
  category: 'slippers'|'frocks'|'blouses'|'skirts'|'pants'|'bags'
  price: number // cents
  description?: string
  images?: string[]
  image?: string // legacy
  colors?: string[]
  sizes?: string[]
}

export default function ProductPageClient({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()

  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'Description'|'Fit'|'Shipping'>('Description')

  // Build gallery safely
  const gallery = useMemo(() => {
    const arr = (Array.isArray(product.images) && product.images.length > 0)
      ? product.images
      : (product.image ? [product.image] :['https://placehold.co/800x800/png'])
    return arr
  }, [product.images, product.image])

  const productId = String(product.id ?? (product as any)._id ?? "")

  // Keep image index in range if gallery changes
  useEffect(() => {
    if (currentImage >= gallery.length) setCurrentImage(0)
  }, [gallery.length, currentImage])

  // Defaults: preselect first available color/size if present
  useEffect(() => {
    if (product.colors?.length && !selectedColor) {
      setSelectedColor(product.colors[0])
    }
  }, [product.colors, selectedColor])
  useEffect(() => {
    if (product.sizes?.length && !selectedSize) {
      setSelectedSize(product.sizes[0])
    }
  }, [product.sizes, selectedSize])

  const id = String(product.id || product._id || '')
  const priceLKR = (product.price / 100).toFixed(2)
  const subtotalLKR = ((product.price * quantity) / 100).toFixed(2)

  const mustChooseColor = (product.colors?.length ?? 0) > 0
  const mustChooseSize  = (product.sizes?.length ?? 0) > 0
  const canAdd = !!id && (!mustChooseColor || selectedColor) && (!mustChooseSize || selectedSize)

  const handleAddToCart = () => {
    if (!canAdd) return
    // example in your ProductPageClient
    addItem(productId, quantity, selectedSize, selectedColor)

  }

  const handleBuyNow = () => {
    if (!canAdd) return
    // example in your ProductPageClient
    addItem(productId, quantity, selectedSize, selectedColor)
    router.push('/cart')
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left: images */}
      <div className="space-y-4">
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl border">
          <Image
            src={gallery[currentImage]}
            alt={product?.name || 'Product image'}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
          {/* Arrows */}
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentImage((currentImage - 1 + gallery.length) % gallery.length)}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setCurrentImage((currentImage + 1) % gallery.length)}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 shadow"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {gallery.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setCurrentImage(idx)}
                className={`relative w-full aspect-square rounded-xl overflow-hidden border ${
                  currentImage === idx ? 'ring-2 ring-black' : ''
                }`}
                aria-label={`Show image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${product?.name || 'Product'} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: details */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold">{product?.name}</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          SKU: {String(product?.id || product?._id || '').toUpperCase()}
        </p>

        {/* Price */}
        <p className="mt-4 text-2xl font-bold">Rs {priceLKR}</p>
        <p className="text-sm text-gray-500 mt-1">
          or 3 × Rs {(product.price / 100 / 3).toFixed(2)} with your card
        </p>

        {/* Colors */}
        {product.colors?.length ? (
          <div className="mt-5">
            <div className="text-sm font-medium mb-2">Color</div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-9 h-9 rounded-full border shadow-sm flex items-center justify-center ${
                    selectedColor === c ? 'ring-2 ring-black' : ''
                  }`}
                  style={{ backgroundColor: isHexColor(c) ? c : undefined }}
                  aria-label={`Select color ${c}`}
                  title={c}
                >
                  {!isHexColor(c) && (
                    <span className="text-xs px-2">{c}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Sizes */}
        {product.sizes?.length ? (
          <div className="mt-5">
            <div className="text-sm font-medium mb-2">Size</div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 rounded-xl border text-sm shadow-sm ${
                    selectedSize === s ? 'bg-black text-white' : 'bg-white text-gray-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Quantity */}
        <div className="mt-5">
          <span className="text-sm font-medium">Quantity</span>
          <div className="mt-2 inline-flex items-center gap-2 border rounded-xl px-2 py-1">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-3 py-1 rounded hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="px-3 py-1 rounded hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <p className="mt-4 text-sm">Subtotal: Rs {subtotalLKR}</p>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          <button
            disabled={!canAdd}
            onClick={handleAddToCart}
            className={`flex-1 border font-medium py-3 rounded-xl transition ${
              canAdd ? 'border-red-500 text-red-600 hover:bg-red-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ADD TO CART
          </button>
          <button
            disabled={!canAdd}
            onClick={handleBuyNow}
            className={`w-full sm:w-auto bg-black text-white py-3 rounded-xl transition ${
              canAdd ? 'hover:bg-gray-800' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            BUY IT NOW
          </button>
        </div>

        {/* Shipping & policies */}
        <ul className="mt-6 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span role="img" aria-label="shipping">🚚</span>
            <span>Free Shipping<br />Free standard shipping on orders over Rs.6000</span>
          </li>
          <li className="flex items-start gap-2">
            <span role="img" aria-label="exchange">🔄</span>
            <span>Exchange From Physical Outlets<br />Learn more.</span>
          </li>
          <li className="flex items-start gap-2">
            <span role="img" aria-label="international">🌍</span>
            <span>For International Customers<br />Your total will be converted to LKR at checkout.</span>
          </li>
        </ul>
      </div>

      {/* Tabs across full width */}
      <div className="md:col-span-2 mt-8">
        <div className="border-b flex gap-6 text-sm font-medium">
          {(['Description','Fit','Shipping'] as const).map(tab => (
            <button
              key={tab}
              className={`py-2 ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Fit' ? 'Fit and Fabric' : tab}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-700 space-y-4">
          {activeTab === 'Description' && (
            <p>{product.description || 'No description available.'}</p>
          )}
          {activeTab === 'Fit' && (
            <p>This garment is crafted from soft, breathable fabric with a modern fit, perfect for layering or wearing on its own.</p>
          )}
          {activeTab === 'Shipping' && (
            <p>
              We offer free standard shipping on orders over Rs.6000 and accept exchanges at physical outlets. International orders are converted to LKR at checkout.
            </p>
          )}
          <p className="italic text-xs text-gray-500">
            *Product image may differ from actual due to photographic lighting.*
          </p>
        </div>
      </div>
    </div>
  )
}

/** util: check if color string is a hex */
function isHexColor(value: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}
