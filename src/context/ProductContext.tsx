import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { productService } from '../services/productService'
import type { Product } from '../types'

interface ProductContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  getProduct: (id: string) => Product | undefined
  saveProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  resetProducts: () => void
}

const ProductContext = createContext<ProductContextValue | null>(null)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      setProducts(await productService.list())
    } catch {
      setError('We could not load the tyre catalogue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const value = useMemo<ProductContextValue>(
    () => ({
      products,
      loading,
      error,
      getProduct: (id) => products.find((item) => item.id === id),
      saveProduct: async (product) => {
        const saved = await productService.save(product)
        setProducts((current) => {
          const exists = current.some((item) => item.id === saved.id)
          return exists
            ? current.map((item) => (item.id === saved.id ? saved : item))
            : [saved, ...current]
        })
      },
      deleteProduct: async (id) => {
        await productService.remove(id)
        setProducts((current) => current.filter((item) => item.id !== id))
      },
      resetProducts: () => setProducts(productService.reset()),
    }),
    [products, loading, error],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) throw new Error('useProducts must be used inside ProductProvider')
  return context
}
