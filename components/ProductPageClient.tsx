"use client"

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import { ChevronLeft, ChevronRight, Minus, Plus, Heart, Share2, Truck, RefreshCw, Star, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RelatedProducts from './RelatedProducts'
import Link from 'next/link'

export default function ProductPageClient({ product, relatedProducts = [] }: { product: Product, relatedProducts?: Product[] }) {
  const router = useRouter()
  const { addItem } = useCart()

  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<'Description' | 'Fit' | 'Shipping'>('Description')
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Build gallery safely
  const gallery = useMemo(() => {
    const arr = (Array.isArray(product.images) && product.images.length > 0)
      ? product.images
      : (product.image ? [product.image] : ['https://placehold.co/800x800/png'])
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

  const priceLKR = (product.price / 100).toFixed(2)
  const subtotalLKR = ((product.price * quantity) / 100).toFixed(2)

  const mustChooseColor = (product.colors?.length ?? 0) > 0
  const mustChooseSize = (product.sizes?.length ?? 0) > 0
  const canAdd = !!productId && (!mustChooseColor || selectedColor) && (!mustChooseSize || selectedSize)

  const handleAddToCart = () => {
    if (!canAdd) return
    addItem(productId, quantity, selectedSize, selectedColor)
  }

  const handleBuyNow = () => {
    if (!canAdd) return
    addItem(productId, quantity, selectedSize, selectedColor)
    router.push('/cart')
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePos({ x, y })
  }

  return (
    <div className="min-h-screen bg-white pb-32 lg:pb-0">
      {/* Breadcrumbs */}
      <div className="w-full lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${product.category?.toLowerCase()}`} className="hover:text-black transition-colors capitalize">
            {product.category || 'Shop'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="w-full lg:w-[80%] mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT COLUMN: Images (Col Span 6) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Main Image Container */}
            <div
              className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-gray-50 group cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isZoomed ? 2 : 1,
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
                className="w-full h-full relative"
              >
                <Image
                  src={gallery[currentImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </motion.div>

              {/* Mobile Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between p-4 lg:hidden pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImage((prev) => (prev - 1 + gallery.length) % gallery.length)
                  }}
                  className="pointer-events-auto bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImage((prev) => (prev + 1) % gallery.length)
                  }}
                  className="pointer-events-auto bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white/90 backdrop-blur-md text-black text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                  New Season
                </span>
              </div>
            </div>

            {/* Desktop Thumbnails */}
            {gallery.length > 1 && (
              <div className="hidden lg:grid grid-cols-6 gap-4">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300 ${currentImage === idx
                      ? 'ring-2 ring-black ring-offset-2 opacity-100'
                      : 'opacity-70 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`View ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Dots */}
            {gallery.length > 1 && (
              <div className="flex justify-center gap-2 lg:hidden">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImage === idx ? 'bg-black w-6' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* MIDDLE COLUMN: Details (Col Span 3) */}
          <div className="lg:col-span-3 flex flex-col space-y-8">
            {/* Header */}
            <div className="border-b border-gray-100 pb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-500 ml-2 text-xs font-medium tracking-wide text-black">(4.9)</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-gray-500 font-medium tracking-wide uppercase">
                  {product.category}
                </span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-light text-gray-900">
                  Rs. {priceLKR}
                </span>
              </div>
            </div>

            {/* Selectors */}
            <div className="space-y-6">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Color: <span className="text-gray-500 font-normal normal-case ml-1">{selectedColor}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${selectedColor === color
                          ? 'ring-1 ring-offset-2 ring-black scale-105'
                          : 'hover:scale-105'
                          }`}
                      >
                        <span
                          className="w-full h-full rounded-full border border-gray-200 shadow-sm"
                          style={{ backgroundColor: isHexColor(color) ? color : '#fff' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Size: <span className="text-gray-500 font-normal normal-case ml-1">{selectedSize}</span></span>
                    <button className="text-xs text-gray-500 underline hover:text-black uppercase tracking-wide">Size Guide</button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 rounded-lg text-xs font-medium transition-all duration-300 border ${selectedSize === size
                          ? 'bg-black text-white border-black shadow-md'
                          : 'bg-white text-gray-900 border-gray-200 hover:border-black'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Actions (Col Span 3) - Sticky on Desktop */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6 p-6 bg-gray-50 rounded-3xl hidden lg:block">
              <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Quantity</span>
                  <div className="flex items-center border border-gray-200 rounded-full bg-white px-2">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 hover:text-black text-gray-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900 text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 hover:text-black text-gray-400 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-sm font-bold text-gray-900">Subtotal</span>
                  <span className="text-xl font-bold text-gray-900">Rs. {subtotalLKR}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-lg ${canAdd
                    ? 'bg-black text-white hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!canAdd}
                  className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 border ${canAdd
                    ? 'border-black text-black hover:bg-black hover:text-white'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Buy Now
                </button>
              </div>

              {/* Features Mini */}
              <div className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-gray-900" />
                  <span className="text-xs text-gray-600">Free shipping over Rs. 6000</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-gray-900" />
                  <span className="text-xs text-gray-600">30-day easy returns</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Info Tabs Section (Below Main Grid) */}
        <div className="mt-16 lg:mt-24">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              {(['Description', 'Fit', 'Shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === tab
                      ? 'text-black'
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {tab === 'Fit' ? 'Fit & Fabric' : tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8 min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-gray-600 leading-relaxed max-w-3xl"
              >
                {activeTab === 'Description' && (
                  <div className="prose prose-sm max-w-none">
                    <p>{product.description || 'No description available for this product.'}</p>
                  </div>
                )}
                {activeTab === 'Fit' && (
                  <ul className="list-disc list-inside space-y-2">
                    <li>True to size fit</li>
                    <li>Premium quality fabric</li>
                    <li>Machine washable</li>
                    <li>Model is wearing size M</li>
                  </ul>
                )}
                {activeTab === 'Shipping' && (
                  <ul className="list-disc list-inside space-y-2">
                    <li>Free standard shipping on orders over Rs. 6000</li>
                    <li>Delivery within 3-5 business days</li>
                    <li>Express shipping available at checkout</li>
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-bottom">
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          {/* Price & Quantity Row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Total</span>
              <span className="text-xl font-bold text-gray-900">Rs. {subtotalLKR}</span>
            </div>
            <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 px-2 h-10">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 hover:text-black text-gray-400 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-gray-900 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 hover:text-black text-gray-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className={`flex-1 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-md ${canAdd
                ? 'bg-black text-white active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!canAdd}
              className={`flex-1 py-3 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 border ${canAdd
                ? 'border-black text-black active:bg-gray-50'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function isHexColor(value: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}
