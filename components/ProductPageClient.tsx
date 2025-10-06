"use client"

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'

export default function ProductPageClient({ product }: { product: Product }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('L')
  const [activeTab, setActiveTab] = useState<'Description' | 'Fit' | 'Shipping'>('Description')
  const [currentImage, setCurrentImage] = useState(0)

  // Build a safe gallery
  const gallery: string[] =
    Array.isArray((product as any).images) && (product as any).images.length > 0
      ? (product as any).images
      : product?.image
      ? [product.image]
      : ['/placeholder.png']

  // Keep index in range if data changes
  useEffect(() => {
    if (currentImage >= gallery.length) setCurrentImage(0)
  }, [gallery.length, currentImage])

  const incrementQty = () => setQuantity(q => q + 1)
  const decrementQty = () => setQuantity(q => (q > 1 ? q - 1 : 1))

  const handleAddToCart = () => addItem(String(product?.id || product?._id || ''), quantity)
  const handleBuyNow = () => { addItem(String(product?.id || product?._id || ''), quantity); router.push('/cart') }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left column: image gallery */}
      <div className="space-y-4">
        <div className="relative w-full aspect-square overflow-hidden rounded-xl border">
          <Image
            src={gallery[currentImage]}
            alt={product?.name || 'Product image'}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <button
            type="button"
            onClick={() => setCurrentImage((currentImage - 1 + gallery.length) % gallery.length)}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-1 shadow"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setCurrentImage((currentImage + 1) % gallery.length)}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-1 shadow"
          >
            →
          </button>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {gallery.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setCurrentImage(idx)}
              className={`relative w-full aspect-square rounded overflow-hidden border ${
                currentImage === idx ? 'ring-2 ring-black' : ''
              }`}
            >
              <Image
                src={img}
                alt={`${product?.name || 'Product'} thumbnail ${idx}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      {/* Right column: details */}
      <div>
        <h1 className="text-3xl font-semibold">{String(product?.name || '').toUpperCase()}</h1>
        <p className="mt-1 text-sm text-gray-500">SKU: {String(product?.id || product?._id || '').toUpperCase()}</p>
        {/* Price and payment info */}
        <p className="mt-4 text-2xl font-bold">Rs {(product.price / 100).toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-1">or 3 × Rs {(product.price / 100 / 3).toFixed(2)} with your card</p>
        {/* Size selection */}
        <div className="mt-4">
          <span className="text-sm font-medium">Size:</span>
          <div className="mt-2 flex gap-2">
            {['L', 'XL'].map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-gray-700'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        {/* Quantity selector */}
        <div className="mt-4">
          <span className="text-sm font-medium">Quantity:</span>
          <div className="mt-2 flex items-center gap-2">
            <button onClick={decrementQty} className="px-3 py-1 border rounded">-</button>
            <span className="w-10 text-center">{quantity}</span>
            <button onClick={incrementQty} className="px-3 py-1 border rounded">+</button>
          </div>
        </div>
        {/* Subtotal */}
        <p className="mt-4 text-sm">Subtotal: Rs {((product.price / 100) * quantity).toFixed(2)}</p>
        {/* Stock warning and progress bar */}
        <p className="mt-2 text-xs text-red-600">Please hurry! Only 4 left in stock</p>
        <div className="mt-1 h-2 w-full bg-red-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: '25%' }} />
        </div>
        {/* Buttons row */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 border border-red-500 text-red-600 font-medium py-3 rounded hover:bg-red-50"
            >
              ADD TO CART
            </button>
            {/* Icons: Heart and Share */}
            <span role="img" aria-label="favorite" className="text-2xl cursor-pointer">❤️</span>
            <span role="img" aria-label="share" className="text-2xl cursor-pointer">🔗</span>
          </div>
          <button
            onClick={handleBuyNow}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
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
            <span>For International Customers<br />Your total bill value will be converted to LKR (Sri Lankan Rupees) at checkout based on the current exchange rate.</span>
          </li>
        </ul>
      </div>
      {/* Tabs below across full width */}
      <div className="md:col-span-2 mt-8">
        <div className="border-b flex gap-6 text-sm font-medium">
          <button
            className={`py-2 ${activeTab === 'Description' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Description')}
          >
            Description
          </button>
          <button
            className={`py-2 ${activeTab === 'Fit' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Fit')}
          >
            Fit and Fabric
          </button>
          <button
            className={`py-2 ${activeTab === 'Shipping' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Shipping')}
          >
            Shipping & Return
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-700 space-y-4">
          {activeTab === 'Description' && (
            <p>{product.description}</p>
          )}
          {activeTab === 'Fit' && (
            <p>This garment is crafted from soft, breathable fabric with a modern fit, perfect for layering or wearing on its own during cooler months.</p>
          )}
          {activeTab === 'Shipping' && (
            <p>
              We offer free standard shipping on orders over Rs.6000 and accept exchanges from physical outlets. International customers will see their total bill converted to LKR at checkout.
            </p>
          )}
          <p className="italic text-xs text-gray-500">
            *Product image may differ to actual due to photographic lighting*
          </p>
        </div>
      </div>
    </div>
  )
}