"use client"
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { Product } from './products'

export type CartItem = Product & { qty: number }

type State = { items: CartItem[] }
type Action =
  | { type: 'ADD'; product: Product; qty?: number }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }

const CartCtx = createContext<{
  items: CartItem[]
  count: number
  totalCents: number
  addItem: (p: Product, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
} | null>(null)

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map(i => i.id === existing.id ? { ...i, qty: i.qty + (action.qty ?? 1) } : i)
        }
      }
      return { items: [...state.items, { ...action.product, qty: action.qty ?? 1 }] }
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

const STORAGE_KEY = 'fashion_store_cart_v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as State
        if (Array.isArray(parsed.items)) {
          parsed.items.forEach(i => dispatch({ type: 'ADD', product: i, qty: i.qty }))
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const api = useMemo(() => ({
    items: state.items,
    count: state.items.reduce((n, i) => n + i.qty, 0),
    totalCents: state.items.reduce((n, i) => n + i.qty * i.price, 0),
    addItem: (p: Product, qty = 1) => dispatch({ type: 'ADD', product: p, qty }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE', id }),
    updateQty: (id: string, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty }),
    clear: () => dispatch({ type: 'CLEAR' })
  }), [state])

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>
}

export function useCart() {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function AddToCartButton({ product, size = 'md' }: { product: Product; size?: 'sm' | 'md' }) {
  const { addItem } = useCart()
  const cls = size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-3'
  return (
    <button className={`rounded-xl bg-black text-white ${cls}`} onClick={() => addItem(product)}>
      Add to cart
    </button>
  )
}