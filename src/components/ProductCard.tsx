import { ArrowRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatCurrency } from '../lib/format'
import type { Product } from '../types'
import { Stars } from './Stars'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const available = product.stock > 0

  const handleAdd = () => {
    const result = addItem(product)
    if (result.ok) showToast(`${product.brand} ${product.name} added to cart`)
    if (result.reason === 'stock-limit') showToast(`Only ${product.stock} available`, 'info')
    if (result.reason === 'unavailable') showToast('This tyre is currently unavailable', 'error')
  }

  return (
    <article className="product-card">
      <Link to={`/tyre/${product.id}`} className="product-card__image" aria-label={`View ${product.brand} ${product.name}`}>
        <img src={product.images[0]} alt={`${product.brand} ${product.name} tyre`} loading="lazy" />
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        {!available && <span className="product-card__sold">Out of stock</span>}
        <span className="product-card__view">View details <ArrowRight size={15} /></span>
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.brand}</span>
          <span className={`stock ${available ? 'stock--in' : 'stock--out'}`}>
            <i /> {available ? `${product.stock} in stock` : 'Unavailable'}
          </span>
        </div>
        <Link to={`/tyre/${product.id}`} className="product-card__title">
          <h3>{product.name}</h3>
        </Link>
        <div className="product-card__size">{product.size} <span>•</span> {product.vehicleType}</div>
        <div className="product-card__rating">
          <Stars rating={product.rating} size={14} />
          <span>{product.rating}</span>
          <a href={`/tyre/${product.id}#reviews`}>({product.reviewCount})</a>
        </div>
        <div className="product-card__footer">
          <div className="product-card__price">
            <strong>{formatCurrency(product.price)}</strong>
            {product.previousPrice && <s>{formatCurrency(product.previousPrice)}</s>}
          </div>
          <button
            className="button button--dark button--icon"
            type="button"
            onClick={handleAdd}
            disabled={!available}
            aria-label={`Add ${product.brand} ${product.name} to cart`}
          >
            <ShoppingBag size={18} />
            <span>{available ? 'Add' : 'Unavailable'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
