import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { ProductContext, type ProductContextValue } from './product-context'
import { productService } from '../services/productService'
import type { Product } from '../types'

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
    // The repository is async by design so it can be replaced with an API later.
    // oxlint-disable-next-line react/set-state-in-effect
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
