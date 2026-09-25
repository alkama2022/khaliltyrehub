import { createContext } from 'react'
import type { CartLine, Product } from '../types'

export interface CartContextValue {
  items: CartLine[]
  itemCount: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => { ok: boolean; reason?: 'unavailable' | 'stock-limit' }
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
