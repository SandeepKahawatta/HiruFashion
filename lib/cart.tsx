"use client"

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'

/** Minimal thing we persist */
export type CartItemStored = { id: string; qty: number; size?: string }
type State = { items: CartItemStored[] }

type Action =
  | { type: 'ADD'; id: string; qty?: number; size?: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }

const STORAGE_KEY = 'fashion_store_cart_v2'

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.id && i.size === action.size)
      // if you want size to be part of identity, include it above (common for apparel)
      if (existing) {
        return {
          items: state.items.map(i =>
            i === existing ? { ...i, qty: i.qty + (action.qty ?? 1) } : i
          ),
        }
      }
      return {
        items: [...state.items, { id: action.id, qty: action.qty ?? 1, size: action.size }],
      }
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      return { items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

/** Context (minimal state + actions) */
const CartCtx = createContext<{
  items: CartItemStored[]
  count: number
  addItem: (id: string, qty?: number, size?: string) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as State
        if (Array.isArray(parsed.items)) {
          // re-add items using ADD to dedupe/merge
          parsed.items.forEach(i => {
            dispatch({ type: 'ADD', id: i.id, qty: i.qty, size: i.size })
          })
        }
      }
    } catch {}
  }, [])

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const api = useMemo(() => ({
    items: state.items,
    count: state.items.reduce((n, i) => n + i.qty, 0),
    addItem: (id: string, qty = 1, size?: string) => dispatch({ type: 'ADD', id, qty, size }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE', id }),
    updateQty: (id: string, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty }),
    clear: () => dispatch({ type: 'CLEAR' }),
  }), [state])

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

/** Client helper to fetch product details for current cart and compute totals */
type ProductLite = {
  id: string
  name: string
  price: number
  images?: string[]
  image?: string
  slug?: string
}

export function useCartDetails() {
  const { items, ...actions } = useCart()
  const [productsMap, setProductsMap] = useState<Record<string, ProductLite>>({})

  useEffect(() => {
    const run = async () => {
      if (!items.length) {
        setProductsMap({})
        return
      }
      const ids = items.map(i => i.id).join(',')
      const res = await fetch(`/api/products?ids=${encodeURIComponent(ids)}`, { cache: 'no-store' })
      const data: ProductLite[] = await res.json()
      const map: Record<string, ProductLite> = {}
      for (const p of data) map[p.id] = p
      setProductsMap(map)
    }
    run()
  }, [items])

  const enriched = items
    .map(i => {
      const p = productsMap[i.id]
      return p ? { ...i, product: p } : null
    })
    .filter(Boolean) as Array<CartItemStored & { product: ProductLite }>

  const subtotalCents = enriched.reduce((sum, row) => sum + row.product.price * row.qty, 0)

  return { items, enriched, subtotalCents, ...actions }
}

/** Optional: small button component */
export function AddToCartButton({ id, qty = 1, size, className = '' }: { id: string; qty?: number; size?: string; className?: string }) {
  const { addItem } = useCart()
  return (
    <button className={`rounded-xl bg-black text-white px-4 py-3 ${className}`} onClick={() => addItem(id, qty, size)}>
      Add to cart
    </button>
  )
}
