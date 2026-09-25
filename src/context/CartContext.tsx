import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../lib/storage'
import type { CartItem, CartLine, Product } from '../types'
import { useProducts } from '../hooks/useProducts'
import { CartContext, type CartContextValue } from './cart-context'

const CART_KEY = 'treadly_cart_v1'

interface AddResult {
  ok: boolean
  reason?: 'unavailable' | 'stock-limit'
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(CART_KEY, []),
  )
  const { products: productLookup } = useProducts()

  useEffect(() => {
    writeStorage(CART_KEY, items)
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const resolved: CartLine[] = items.flatMap((item) => {
      const product = productLookup.find((candidate) => candidate.id === item.productId)
      if (!product) return []
      return [
        {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        },
      ]
    })

    const addItem = (product: Product, quantity = 1): AddResult => {
      if (product.stock < 1) return { ok: false, reason: 'unavailable' }
      const current = items.find((item) => item.productId === product.id)?.quantity ?? 0
      if (current >= product.stock) return { ok: false, reason: 'stock-limit' }
      const nextQuantity = Math.min(current + quantity, product.stock)
      setItems((currentItems) => {
        const exists = currentItems.some((item) => item.productId === product.id)
        return exists
          ? currentItems.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: nextQuantity }
                : item,
            )
          : [...currentItems, { productId: product.id, quantity: nextQuantity }]
      })
      return { ok: true }
    }

    const updateQuantity = (productId: string, quantity: number) => {
      setItems((currentItems) =>
        currentItems
          .map((item) => {
            if (item.productId !== productId) return item
            const product = productLookup.find((candidate) => candidate.id === productId)
            return {
              ...item,
              quantity: Math.max(1, Math.min(quantity, product?.stock ?? quantity)),
            }
          })
          .filter((item) => item.quantity > 0),
      )
    }

    return {
      items: resolved,
      itemCount: resolved.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: resolved.reduce((sum, item) => sum + item.lineTotal, 0),
      addItem,
      updateQuantity,
      removeItem: (productId) =>
        setItems((current) => current.filter((item) => item.productId !== productId)),
      clearCart: () => setItems([]),
    }
  }, [items, productLookup])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
