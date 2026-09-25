import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { businessConfig } from './config/business'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { ToastProvider } from './context/ToastContext'
import { HomePage } from './pages/HomePage'
import './App.css'

const ShopPage = lazy(() =>
  import('./pages/ShopPage').then((module) => ({ default: module.ShopPage })),
)
const ProductPage = lazy(() =>
  import('./pages/ProductPage').then((module) => ({ default: module.ProductPage })),
)
const CartPage = lazy(() =>
  import('./pages/CartPage').then((module) => ({ default: module.CartPage })),
)
const BrandsPage = lazy(() =>
  import('./pages/BrandsPage').then((module) => ({ default: module.BrandsPage })),
)
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })),
)
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading__spinner" aria-hidden="true" />
      <span>Loading…</span>
    </div>
  )
}

function AdminRoute() {
  if (!businessConfig.isAdminDemoEnabled) return <Navigate to="/" replace />
  return <AdminPage />
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ProductProvider>
          <CartProvider>
            <ToastProvider>
              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/tyre/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/brands" element={<BrandsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                  <Route path="/admin" element={<AdminRoute />} />
                </Routes>
              </Suspense>
            </ToastProvider>
          </CartProvider>
        </ProductProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
