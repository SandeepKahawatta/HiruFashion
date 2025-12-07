"use client"

import { useCartDetails } from "@/lib/cart"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { enriched, subtotalCents, updateQty, removeItem } = useCartDetails()
  const router = useRouter()

  const FREE_SHIPPING_THRESHOLD = 600000 // Rs. 6000.00 in cents
  const progress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD) * 100)
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalCents)

  if (enriched.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our new arrivals and find something you love.
        </p>
        <Link
          href="/"
          className="bg-black text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12">Shopping Cart</h1>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
        {/* LEFT COLUMN: Cart Items */}
        <div className="lg:col-span-8 space-y-8">

          {/* Free Shipping Progress */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="w-5 h-5 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">
                {remainingForFreeShipping > 0
                  ? `Spend Rs. ${(remainingForFreeShipping / 100).toFixed(2)} more for free shipping`
                  : "You've unlocked free shipping!"}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-black rounded-full"
              />
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {enriched.map((row) => {
                const p = row.product
                const img = p.images?.[0] || p.image
                const lineKey = `${row.id}-${row.size || ""}-${row.color || ""}`

                return (
                  <motion.div
                    key={lineKey}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-6 p-4 sm:p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative w-24 h-32 sm:w-32 sm:h-40 shrink-0 overflow-hidden rounded-2xl bg-gray-50">
                      {img ? (
                        <Image src={img} alt={p.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-bold text-lg text-gray-900 truncate pr-4">
                            <Link href={`/products/${p.slug}`} className="hover:underline">
                              {p.name}
                            </Link>
                          </h3>
                          <button
                            onClick={() => {
                              removeItem(row.id, row.size, row.color)
                              toast.info("Item removed from cart")
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-2">
                          {row.size && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100">
                              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Size</span>
                              <span className="text-xs font-bold text-gray-900">{row.size}</span>
                            </span>
                          )}
                          {row.color && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100">
                              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Color</span>
                              <span
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: row.color }}
                              />
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-white h-10">
                          <button
                            className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-l-xl transition-colors"
                            onClick={() => updateQty(row.id, Math.max(1, row.qty - 1), row.size, row.color)}
                            disabled={row.qty <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900">{row.qty}</span>
                          <button
                            className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-r-xl transition-colors"
                            onClick={() => updateQty(row.id, row.qty + 1, row.size, row.color)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          Rs. {((p.price * row.qty) / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Rs. {(subtotalCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-gray-900">{remainingForFreeShipping <= 0 ? "Free" : "Calculated at checkout"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="text-gray-900">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">Rs. {(subtotalCents / 100).toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Including VAT</p>
              </div>

              <button
                className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                onClick={() => router.push("/checkout")}
              >
                Checkout
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-6 h-6 text-gray-900" />
                <span className="text-xs font-medium text-gray-600">Secure Checkout</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-gray-900" />
                <span className="text-xs font-medium text-gray-600">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
