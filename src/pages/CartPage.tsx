import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  MessageCircle,
  Minus,
  PackageOpen,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WhatsAppCheckoutModal } from '../components/WhatsAppCheckoutModal'
import { useCart } from '../hooks/useCart'
import { useToast } from '../hooks/useToast'
import { formatCurrency, pluralize } from '../lib/format'
import { usePageMeta } from '../hooks/usePageMeta'
import type { CartLine } from '../types'

export function CartPage() {
  usePageMeta({
    title: 'Shopping Cart',
    description: 'Review your tyre order and continue through WhatsApp checkout.',
    path: '/cart',
    noIndex: true,
  })
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [pendingRemoval, setPendingRemoval] = useState<CartLine | null>(null)
  const [clearConfirm, setClearConfirm] = useState(false)
  const { showToast } = useToast()
  const unavailable = items.filter((item) => item.product.stock < item.quantity)

  const confirmRemoval = () => {
    if (!pendingRemoval) return
    removeItem(pendingRemoval.productId)
    showToast(`${pendingRemoval.product.name} removed from cart`, 'info')
    setPendingRemoval(null)
  }

  const confirmClear = () => {
    clearCart()
    setClearConfirm(false)
    showToast('Your cart has been cleared', 'info')
  }

  if (items.length === 0) {
    return (
      <section className="empty-cart page-section">
        <div className="container empty-cart__inner">
          <span className="empty-cart__icon"><PackageOpen size={42} /></span>
          <span className="section-kicker">Your order</span>
          <h1>Your cart is empty</h1>
          <p>Browse our tyre catalogue and add the right products for your vehicle.</p>
          <Link to="/shop" className="button button--accent button--large">
            <ShoppingBag size={19} /> Start shopping
          </Link>
          <Link to="/contact#fitment" className="text-link">Need help with tyre size? <ArrowRight size={16} /></Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="cart-page page-section">
        <div className="container">
          <nav className="breadcrumbs breadcrumbs--dark" aria-label="Breadcrumb">
            <Link to="/">Home</Link><ChevronRight size={14} /><span>Shopping cart</span>
          </nav>
          <div className="cart-page__title">
            <div>
              <span className="section-kicker">Almost yours</span>
              <h1>Shopping cart <small>{pluralize(itemCount, 'item')}</small></h1>
            </div>
            <Link to="/shop" className="text-link"><ArrowLeft size={16} /> Continue shopping</Link>
          </div>

          {unavailable.length > 0 && (
            <div className="cart-alert">
              <PackageOpen size={20} />
              <span><strong>Some stock has changed.</strong> Remove or update the highlighted item before sending your order.</span>
            </div>
          )}

          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-table__head">
                <span>Product</span><span>Price</span><span>Quantity</span><span>Total</span><span />
              </div>
              {items.map((item) => {
                const isUnavailable = item.product.stock < item.quantity
                return (
                  <article className={`cart-item ${isUnavailable ? 'cart-item--unavailable' : ''}`} key={item.productId}>
                    <div className="cart-item__product">
                      <Link to={`/tyre/${item.product.id}`} className="cart-item__image">
                        <img src={item.product.images[0]} alt={`${item.product.brand} ${item.product.name}`} />
                      </Link>
                      <div>
                        <span>{item.product.brand}</span>
                        <Link to={`/tyre/${item.product.id}`}><h2>{item.product.name}</h2></Link>
                        <p>{item.product.size} • {item.product.vehicleType}</p>
                        <small className={item.product.stock > 0 ? 'is-in-stock' : 'is-out-stock'}>
                          {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
                        </small>
                      </div>
                    </div>
                    <div className="cart-item__mobile-label">Price</div>
                    <div className="cart-item__price">{formatCurrency(item.product.price)} <small>each</small></div>
                    <div className="cart-item__mobile-label">Quantity</div>
                    <div className="quantity-picker quantity-picker--small">
                      <button
                        type="button"
                        onClick={() => item.quantity === 1 ? setPendingRemoval(item) : updateQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Decrease ${item.product.name} quantity`}
                      ><Minus size={16} /></button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        aria-label={`Increase ${item.product.name} quantity`}
                      ><Plus size={16} /></button>
                    </div>
                    <div className="cart-item__mobile-label">Total</div>
                    <strong className="cart-item__total">{formatCurrency(item.lineTotal)}</strong>
                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => setPendingRemoval(item)}
                      aria-label={`Remove ${item.product.name}`}
                    ><Trash2 size={18} /></button>
                  </article>
                )
              })}
              <button type="button" className="clear-cart" onClick={() => setClearConfirm(true)}>
                <Trash2 size={16} /> Clear cart
              </button>
            </div>

            <aside className="order-summary">
              <h2>Order summary</h2>
              <div className="order-summary__row"><span>Subtotal ({pluralize(itemCount, 'tyre')})</span><strong>{formatCurrency(subtotal)}</strong></div>
              <div className="order-summary__row"><span>Delivery</span><strong>Confirmed on WhatsApp</strong></div>
              <div className="order-summary__total"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
              <p className="order-summary__note">No online payment is collected. Availability, delivery and final payment are confirmed with our team.</p>
              <button
                type="button"
                className="button button--whatsapp button--block button--large"
                onClick={() => setCheckoutOpen(true)}
                disabled={unavailable.length > 0}
              >
                <MessageCircle size={20} /> Order through WhatsApp
              </button>
              <Link to="/shop" className="button button--outline button--block">
                <ShoppingBag size={18} /> Continue shopping
              </Link>
              <div className="order-summary__trust">
                <span><ShieldCheck size={18} /> Customer details sent only with your order</span>
                <span><BadgeCheck size={18} /> Real people confirm every order</span>
                <span><Truck size={18} /> Nationwide delivery available</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {checkoutOpen && <WhatsAppCheckoutModal cart={items} onClose={() => setCheckoutOpen(false)} />}

      {(pendingRemoval || clearConfirm) && (
        <div className="modal-backdrop" onMouseDown={() => { setPendingRemoval(null); setClearConfirm(false) }}>
          <div className="confirm-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => { setPendingRemoval(null); setClearConfirm(false) }} aria-label="Close"><X size={20} /></button>
            <span className="confirm-modal__icon"><Trash2 size={24} /></span>
            <h2>{clearConfirm ? 'Clear your cart?' : 'Remove this tyre?'}</h2>
            <p>{clearConfirm ? 'This will remove every item from your saved cart.' : `${pendingRemoval?.product.brand} ${pendingRemoval?.product.name} will be removed from your cart.`}</p>
            <div>
              <button type="button" className="button button--outline" onClick={() => { setPendingRemoval(null); setClearConfirm(false) }}>Keep it</button>
              <button type="button" className="button button--danger" onClick={clearConfirm ? confirmClear : confirmRemoval}>Yes, remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
