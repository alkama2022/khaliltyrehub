import { createContext } from 'react'
import type { Product } from '../types'

export interface ProductContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  getProduct: (id: string) => Product | undefined
  saveProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  resetProducts: () => void
}

export const ProductContext = createContext<ProductContextValue | null>(null)
