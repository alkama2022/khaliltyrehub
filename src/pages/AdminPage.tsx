import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileText,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminProductModal } from '../components/AdminProductModal'
import { businessConfig } from '../config/business'
import { useProducts } from '../context/ProductContext'
import { useToast } from '../context/ToastContext'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatCurrency, formatDate, pluralize } from '../lib/format'
import { getOrderRecords } from '../lib/whatsapp'
import type { Product } from '../types'

type AdminTab = 'overview' | 'products' | 'orders' | 'reviews'

export function AdminPage() {
  usePageMeta({
    title: 'Store Admin',
    description: 'Treadly catalogue and order workspace.',
    path: '/admin',
    noIndex: true,
  })
  const { products, saveProduct, deleteProduct, resetProducts } = useProducts()
  const { showToast } = useToast()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | undefined>()
  const [query, setQuery] = useState('')
  const orders = getOrderRecords()

  const stats = useMemo(() => {
    const stock = products.reduce((sum, product) => sum + product.stock, 0)
    const value = products.reduce((sum, product) => sum + product.price * product.stock, 0)
    const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 4).length
    const rating = products.length
      ? products.reduce((sum, product) => sum + product.rating, 0) / products.length
      : 0
    return { stock, value, lowStock, rating }
  }, [products])

  const visibleProducts = products.filter((product) =>
    `${product.brand} ${product.name} ${product.size}`.toLowerCase().includes(query.toLowerCase()),
  )
  const allReviews = products.flatMap((product) =>
    product.reviews.map((review) => ({ ...review, product })),
  )
  const orderValue = orders.reduce((sum, order) => sum + order.total, 0)

  const openAdd = () => {
    setEditing(undefined)
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setModalOpen(true)
  }

  const handleSave = async (product: Product) => {
    await saveProduct(product)
    showToast(`${product.brand} ${product.name} saved`)
  }

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete ${product.brand} ${product.name}? This cannot be undone.`)) return
    await deleteProduct(product.id)
    showToast('Tyre removed from the catalogue', 'info')
  }

  const handleReset = () => {
    if (!window.confirm('Restore the original sample catalogue? Your local catalogue changes will be replaced.')) return
    resetProducts()
    showToast('Sample catalogue restored', 'info')
  }

  const removeReview = async (product: Product, reviewId: string) => {
    if (!window.confirm('Hide this customer review from the product page?')) return
    await saveProduct({
      ...product,
      reviews: product.reviews.filter((review) => review.id !== reviewId),
      reviewCount: Math.max(0, product.reviewCount - 1),
    })
    showToast('Review hidden', 'info')
  }

  return (
    <section className="admin-page">
      <div className="container admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__brand"><span><BarChart3 size={20} /></span><div><strong>{businessConfig.name} admin</strong><small>Store workspace</small></div></div>
          <nav className="admin-tabs" aria-label="Admin sections">
            <button className={tab === 'overview' ? 'is-active' : ''} onClick={() => setTab('overview')}><BarChart3 size={18} /> Overview</button>
            <button className={tab === 'products' ? 'is-active' : ''} onClick={() => setTab('products')}><Package size={18} /> Tyre catalogue <span>{products.length}</span></button>
            <button className={tab === 'orders' ? 'is-active' : ''} onClick={() => setTab('orders')}><FileText size={18} /> WhatsApp orders <span>{orders.length}</span></button>
            <button className={tab === 'reviews' ? 'is-active' : ''} onClick={() => setTab('reviews')}><Star size={18} /> Reviews <span>{allReviews.length}</span></button>
          </nav>
          <div className="admin-sidebar__note"><ShieldCheck size={18} /><p><strong>Local demo workspace</strong>Changes are stored in this browser. Connect a protected API before production.</p></div>
          <Link to="/" className="admin-sidebar__back">← Back to storefront</Link>
        </aside>

        <div className="admin-main">
          <header className="admin-main__header">
            <div><span className="section-kicker">Good morning, team</span><h1>{tab === 'overview' ? 'Store overview' : tab === 'products' ? 'Tyre catalogue' : tab === 'orders' ? 'WhatsApp orders' : 'Customer reviews'}</h1></div>
            <div className="admin-main__actions">
              {tab === 'products' && <button type="button" className="button button--outline" onClick={handleReset}><RefreshCw size={16} /> Reset sample</button>}
              <button type="button" className="button button--dark" onClick={openAdd}><Plus size={18} /> Add tyre</button>
            </div>
          </header>

          {tab === 'overview' && (
            <>
              <div className="admin-stats">
                <article><span><Package size={20} /></span><div><small>Catalogue items</small><strong>{products.length}</strong><em>Across {new Set(products.map((product) => product.brand)).size} brands</em></div></article>
                <article><span><CircleDollarSign size={20} /></span><div><small>Stock value</small><strong>{formatCurrency(stats.value)}</strong><em>At listed prices</em></div></article>
                <article><span><AlertTriangle size={20} /></span><div><small>Low stock</small><strong>{stats.lowStock}</strong><em>4 units or fewer</em></div></article>
                <article><span><Star size={20} /></span><div><small>Average rating</small><strong>{stats.rating.toFixed(1)} <small>/ 5</small></strong><em>Catalogue average</em></div></article>
              </div>
              <div className="admin-overview-grid">
                <section className="admin-panel">
                  <div className="admin-panel__header"><div><h2>Inventory attention</h2><p>Keep these products ready for customers.</p></div><button type="button" onClick={() => setTab('products')}>View catalogue <ChevronRight size={15} /></button></div>
                  <div className="attention-list">
                    {products.filter((product) => product.stock <= 4).slice(0, 5).map((product) => (
                      <div key={product.id}><img src={product.images[0]} alt="" /><span><strong>{product.brand} {product.name}</strong><small>{product.size}</small></span><b className={product.stock === 0 ? 'is-out' : 'is-low'}>{product.stock === 0 ? 'Out of stock' : `${product.stock} left`}</b></div>
                    ))}
                    {products.filter((product) => product.stock <= 4).length === 0 && <p className="admin-empty">Everything is well stocked.</p>}
                  </div>
                </section>
                <section className="admin-panel">
                  <div className="admin-panel__header"><div><h2>WhatsApp order pulse</h2><p>Orders generated from this device.</p></div><button type="button" onClick={() => setTab('orders')}>View all <ChevronRight size={15} /></button></div>
                  <div className="admin-pulse"><span><MessageCircle size={23} /></span><strong>{orders.length}</strong><small>orders started</small><b>{formatCurrency(orderValue)}</b><p>Orders are recorded locally when a customer continues to WhatsApp.</p></div>
                </section>
              </div>
            </>
          )}

          {tab === 'products' && (
            <section className="admin-panel admin-products-panel">
              <div className="admin-panel__header admin-panel__header--table"><div><h2>All tyres</h2><p>Update prices, stock and product information.</p></div><label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search catalogue" /></label></div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {visibleProducts.map((product) => (
                      <tr key={product.id}>
                        <td><div className="admin-product-cell"><img src={product.images[0]} alt="" /><span><strong>{product.brand} {product.name}</strong><small>{product.size} • {product.vehicleType}</small></span></div></td>
                        <td><strong>{formatCurrency(product.price)}</strong></td>
                        <td><span className={product.stock === 0 ? 'admin-status admin-status--out' : product.stock <= 4 ? 'admin-status admin-status--low' : 'admin-status'}>{product.stock} units</span></td>
                        <td><span className={`availability-pill ${product.stock > 0 ? 'is-in' : 'is-out'}`}><i />{product.stock > 0 ? 'In stock' : 'Out of stock'}</span></td>
                        <td><div className="table-actions"><button type="button" onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`}><Pencil size={16} /></button><button type="button" onClick={() => handleDelete(product)} aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visibleProducts.length === 0 && <p className="admin-empty">No products match your search.</p>}
              </div>
            </section>
          )}

          {tab === 'orders' && (
            <section className="admin-panel admin-orders-panel">
              <div className="admin-panel__header"><div><h2>Orders sent to WhatsApp</h2><p>Each record is created when a customer submits their order details.</p></div><span className="admin-panel__count">{pluralize(orders.length, 'order')}</span></div>
              {orders.length ? <div className="order-list">{orders.map((order) => <article key={order.id}><div className="order-list__id"><span><CheckCircle2 size={19} /></span><div><strong>{order.id}</strong><small>{formatDate(order.createdAt)} • {order.customer.fullName}</small></div></div><div><small>Phone</small><strong>{order.customer.phone}</strong></div><div><small>Location</small><strong>{order.customer.address}</strong></div><div><small>Items</small><strong>{order.itemCount}</strong></div><div><small>Total</small><strong>{formatCurrency(order.total)}</strong></div><span className="order-status">Sent to WhatsApp</span></article>)}</div> : <div className="admin-empty-state"><MessageCircle size={28} /><h3>No WhatsApp orders yet</h3><p>Orders submitted through the storefront will appear here for a local preview.</p></div>}
            </section>
          )}

          {tab === 'reviews' && (
            <section className="admin-panel admin-reviews-panel">
              <div className="admin-panel__header"><div><h2>Review inbox</h2><p>Review the customer feedback shown on product pages.</p></div><span className="admin-panel__count">{pluralize(allReviews.length, 'review')}</span></div>
              {allReviews.length ? <div className="admin-review-list">{allReviews.map((review) => <article key={review.id}><div className="admin-review-list__product"><img src={review.product.images[0]} alt="" /><span><strong>{review.product.brand} {review.product.name}</strong><small>{review.product.size}</small></span></div><div className="admin-review-list__body"><div><span className="review-card__avatar">{review.customerName.charAt(0)}</span><p><strong>{review.customerName}</strong><small>{formatDate(review.date)}</small></p><span className="mini-stars">{'★'.repeat(review.rating)}</span></div><p>“{review.comment}”</p></div><button type="button" className="table-actions__delete" onClick={() => removeReview(review.product, review.id)}><Trash2 size={15} /> Hide</button></article>)}</div> : <div className="admin-empty-state"><Star size={28} /><h3>No reviews to moderate</h3><p>New product reviews will appear here when connected to your backend.</p></div>}
            </section>
          )}
        </div>
      </div>

      {modalOpen && <AdminProductModal product={editing} onClose={() => setModalOpen(false)} onSave={handleSave} />}
    </section>
  )
}
