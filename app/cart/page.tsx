"use client"
import { useCartDetails } from '@/lib/cart'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { enriched, subtotalCents, updateQty, removeItem, clear } = useCartDetails()
  const router = useRouter()

  if (enriched.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <Link className="underline" href="/">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {enriched.map(row => {
          const p = row.product
          const img = p.images?.[0] || p.image
          return (
            <div key={row.id + (row.size || '')} className="flex gap-4 border rounded-xl p-4 items-center">
              <div className="relative w-20 h-20 rounded overflow-hidden">
                {img ? (
                  <Image src={img} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                {row.size ? <div className="text-xs text-gray-500">Size: {row.size}</div> : null}
                <div className="text-sm text-gray-600">Rs {(p.price / 100).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 border rounded" onClick={() => updateQty(row.id, Math.max(1, row.qty - 1))}>-</button>
                <span className="w-6 text-center">{row.qty}</span>
                <button className="px-2 py-1 border rounded" onClick={() => updateQty(row.id, row.qty + 1)}>+</button>
              </div>
              <button className="px-3 py-2 border rounded" onClick={() => removeItem(row.id)}>Remove</button>
            </div>
          )
        })}
      </div>

      <div className="border rounded-xl p-4 h-fit sticky top-24">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span className="font-semibold">Rs {(subtotalCents / 100).toFixed(2)}</span>
        </div>
        <button
          className="w-full mt-4 py-3 rounded-xl bg-black text-white"
          onClick={() => router.push("/checkout")}
        >
          Checkout
        </button>
        <p className="text-xs text-gray-500 mt-2">(Demo) This clears the cart and simulates a checkout.</p>
      </div>
    </div>
  )
}
