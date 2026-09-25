import { initialProducts } from '../data/products'
import { readStorage, writeStorage } from '../lib/storage'
import type { Product } from '../types'

const PRODUCTS_KEY = 'treadly_products_v1'

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds))

const getProductsFromStorage = () => readStorage<Product[]>(PRODUCTS_KEY, initialProducts)

export const productService = {
  async list(): Promise<Product[]> {
    await wait(260)
    return getProductsFromStorage()
  },

  async save(product: Product): Promise<Product> {
    const products = getProductsFromStorage()
    const exists = products.some((item) => item.id === product.id)
    const next = exists
      ? products.map((item) => (item.id === product.id ? product : item))
      : [product, ...products]
    writeStorage(PRODUCTS_KEY, next)
    return product
  },

  async remove(productId: string): Promise<void> {
    const products = getProductsFromStorage().filter((item) => item.id !== productId)
    writeStorage(PRODUCTS_KEY, products)
  },

  reset(): Product[] {
    writeStorage(PRODUCTS_KEY, initialProducts)
    return initialProducts
  },
}
