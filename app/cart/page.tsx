"use client"

import { useCartDetails } from "@/lib/cart"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { enriched, subtotalCents, updateQty, removeItem } = useCartDetails()
  const router = useRouter()

  if (enriched.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-12 h-12 mb-3 text-gray-400" />
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <Link className="underline text-sm" href="/">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
      {/* Line items */}
      <div className="md:col-span-2 space-y-4">
        {enriched.map((row) => {
          const p = row.product
          const img = p.images?.[0] || p.image
          const lineKey = `${row.id}-${row.size || ""}-${row.color || ""}`

          return (
            <div
              key={lineKey}
              className="flex gap-4 border rounded-2xl p-4 items-center shadow-sm bg-white"
            >
              <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                {img ? (
                  <Image src={img} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-2">
                  {row.size ? (
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                      <span className="text-[11px] uppercase tracking-wide">Size</span>
                      <span className="text-[11px] font-semibold">{row.size}</span>
                    </span>
                  ) : null}
                  {row.color ? (
                    <span className="inline-flex items-center gap-2 rounded-full border px-2 py-0.5">
                      <span className="text-[11px] uppercase tracking-wide">Color</span>
                      <span
                        aria-label={row.color}
                        className="inline-block w-3 h-3 rounded-full border"
                        style={{ background: row.color }}
                      />
                      <span className="text-[11px] font-semibold">{row.color}</span>
                    </span>
                  ) : null}
                </div>

                <div className="text-sm text-gray-600 mt-1">Rs {(p.price / 100).toFixed(2)}</div>
              </div>

              {/* qty + remove */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border">
                  <button
                    className="p-2 active:opacity-70"
                    onClick={() => updateQty(row.id, Math.max(1, row.qty - 1), row.size, row.color)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm">{row.qty}</span>
                  <button
                    className="p-2 active:opacity-70"
                    onClick={() => updateQty(row.id, row.qty + 1, row.size, row.color)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  className="p-2 rounded-full border hover:bg-gray-50 active:opacity-70"
                  onClick={() => removeItem(row.id, row.size, row.color)}
                  aria-label="Remove"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="border rounded-2xl p-4 h-fit sticky top-24 bg-white shadow-sm">
        <div className="flex justify-between mb-1 text-sm text-gray-600">
          <span>Subtotal</span>
          <span>Rs {(subtotalCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>Calculated at next step</span>
        </div>
        <div className="h-px bg-gray-200 my-3" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>Rs {(subtotalCents / 100).toFixed(2)}</span>
        </div>

        <button
          className="w-full mt-4 py-3 rounded-xl bg-black text-white active:opacity-90"
          onClick={() => router.push("/checkout")}
        >
          Proceed to Checkout
        </button>

        <p className="text-[11px] text-gray-500 mt-2">
          Taxes and shipping will be calculated in checkout.
        </p>
      </div>
    </div>
  )
}
