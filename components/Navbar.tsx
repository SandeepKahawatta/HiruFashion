"use client"
import Link from 'next/link'
import { useCart } from '@/lib/cart'

export default function Navbar() {
  const { count } = useCart()
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b z-50 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-lg font-semibold tracking-tight">Fashion Store</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart ({count})</Link>
        </nav>
      </div>
    </header>
  )
}