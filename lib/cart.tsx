"use client"

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react"

/** What we persist in localStorage */
export type CartItemStored = {
  id: string
  qty: number
  size?: string
  color?: string
}

type State = { items: CartItemStored[] }

type Action =
  | { type: "ADD"; id: string; qty?: number; size?: string; color?: string }
  | { type: "REMOVE"; id: string; size?: string; color?: string }
  | { type: "UPDATE_QTY"; id: string; size?: string; color?: string; qty: number }
  | { type: "CLEAR" }

const STORAGE_KEY = "fashion_store_cart_v3"

/** Helper to compare “same line item” (same product + same variant) */
function sameLine(a: CartItemStored, b: { id: string; size?: string; color?: string }) {
  return a.id === b.id && a.size === b.size && a.color === b.color
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const payload = { id: action.id, size: action.size, color: action.color }
      const existing = state.items.find(i => sameLine(i, payload))
      if (existing) {
        return {
          items: state.items.map(i =>
            sameLine(i, payload) ? { ...i, qty: i.qty + (action.qty ?? 1) } : i
          ),
        }
      }
      return {
        items: [...state.items, { id: action.id, qty: action.qty ?? 1, size: action.size, color: action.color }],
      }
    }
    case "REMOVE":
      return {
        items: state.items.filter(i => !sameLine(i, { id: action.id, size: action.size, color: action.color })),
      }
    case "UPDATE_QTY":
      return {
        items: state.items.map(i =>
          sameLine(i, { id: action.id, size: action.size, color: action.color })
            ? { ...i, qty: Math.max(1, action.qty) }
            : i
        ),
      }
    case "CLEAR":
      return { items: [] }
    default:
      return state
  }
}

/** Context (minimal state + actions) */
const CartCtx = createContext<{
  items: CartItemStored[]
  count: number
  addItem: (id: string, qty?: number, size?: string, color?: string) => void
  removeItem: (id: string, size?: string, color?: string) => void
  updateQty: (id: string, qty: number, size?: string, color?: string) => void
  clear: () => void
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as State
      if (Array.isArray(parsed.items)) {
        parsed.items.forEach(i => dispatch({ type: "ADD", id: i.id, qty: i.qty, size: i.size, color: i.color }))
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const api = useMemo(
    () => ({
      items: state.items,
      count: state.items.reduce((n, i) => n + i.qty, 0),
      addItem: (id: string, qty = 1, size?: string, color?: string) =>
        dispatch({ type: "ADD", id, qty, size, color }),
      removeItem: (id: string, size?: string, color?: string) => dispatch({ type: "REMOVE", id, size, color }),
      updateQty: (id: string, qty: number, size?: string, color?: string) =>
        dispatch({ type: "UPDATE_QTY", id, qty, size, color }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state]
  )

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

/** What we need from /api/products?ids=... */
type ProductLite = {
  category: ReactNode
  id: string
  name: string
  price: number
  images?: string[]
  image?: string // legacy
  slug?: string
  colors?: string[]
  sizes?: string[]
}

/** Enrich cart with product details, compute totals */
export function useCartDetails() {
  const { items, ...actions } = useCart()
  const [productsMap, setProductsMap] = useState<Record<string, ProductLite>>({})

  useEffect(() => {
    const run = async () => {
      if (!items.length) {
        setProductsMap({})
        return
      }
      const uniqueIds = Array.from(new Set(items.map(i => i.id)))
      const idsParam = encodeURIComponent(uniqueIds.join(","))
      const res = await fetch(`/api/products?ids=${idsParam}`, { cache: "no-store" })
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

/** Small helper button */
export function AddToCartButton({
  id,
  qty = 1,
  size,
  color,
  className = "",
}: {
  id: string
  qty?: number
  size?: string
  color?: string
  className?: string
}) {
  const { addItem } = useCart()
  return (
    <button
      className={`rounded-xl bg-black text-white px-4 py-3 ${className}`}
      onClick={() => addItem(id, qty, size, color)}
    >
      Add to cart
    </button>
  )
}
