"use client"
import { useCart } from '@/lib/cart'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQty, totalCents, clear } = useCart()

  if (items.length === 0) {
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
        {items.map(it => (
          <div key={it.id} className="flex gap-4 border rounded-xl p-4 items-center">
            <div className="relative w-20 h-20 rounded overflow-hidden">
              <Image src={it.image} alt={it.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-gray-600">${(it.price / 100).toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border rounded" onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))}>-</button>
              <span className="w-6 text-center">{it.qty}</span>
              <button className="px-2 py-1 border rounded" onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
            </div>
            <button className="px-3 py-2 border rounded" onClick={() => removeItem(it.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="border rounded-xl p-4 h-fit sticky top-24">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span className="font-semibold">${(totalCents / 100).toFixed(2)}</span>
        </div>
        <button className="w-full mt-4 py-3 rounded-xl bg-black text-white" onClick={clear}>Fake Checkout</button>
        <p className="text-xs text-gray-500 mt-2">(Demo) This clears the cart and simulates a checkout.</p>
      </div>
    </div>
  )
}