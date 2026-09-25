import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { ToastProvider } from './context/ToastContext'
import { AboutPage } from './pages/AboutPage'
import { AdminPage } from './pages/AdminPage'
import { BrandsPage } from './pages/BrandsPage'
import { CartPage } from './pages/CartPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ProductProvider>
          <CartProvider>
            <ToastProvider>
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
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </ToastProvider>
          </CartProvider>
        </ProductProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
