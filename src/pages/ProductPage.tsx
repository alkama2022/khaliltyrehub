import {
  ArrowLeft,
  BadgeCheck,
  Box,
  Check,
  ChevronRight,
  Clock3,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  SearchX,
  ShieldCheck,
  Truck,
  X,
  ZoomIn,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { Stars } from '../components/Stars'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import { useToast } from '../context/ToastContext'
import { businessConfig } from '../config/business'
import { formatCurrency, formatDate, pluralize } from '../lib/format'
import { getWhatsAppUrl } from '../lib/whatsapp'

const ratingBreakdown = (rating: number, total: number) => {
  const five = Math.round(total * Math.max(0.58, (rating - 3) / 2.25))
  const four = Math.min(total - five, Math.round(total * 0.27))
  const three = Math.max(0, total - five - four)
  return [
    { stars: 5, count: five },
    { stars: 4, count: four },
    { stars: 3, count: three },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ]
}

export function ProductPage() {
  const { id } = useParams()
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [zoomImage, setZoomImage] = useState<string | null>(null)
  const product = products.find((item) => item.id === id)

  useEffect(() => {
    setSelectedImage(0)
    setQuantity(1)
  }, [id])

  useEffect(() => {
    if (!zoomImage) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setZoomImage(null)
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', close)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', close)
    }
  }, [zoomImage])

  const related = useMemo(
    () =>
      product
        ? products
            .filter(
              (item) =>
                item.id !== product.id &&
                (item.vehicleType === product.vehicleType || item.brand === product.brand),
            )
            .slice(0, 3)
        : [],
    [product, products],
  )

  if (loading) return <ProductPageSkeleton />

  if (!product) {
    return (
      <section className="not-found page-section">
        <div className="container not-found__inner">
          <span><SearchX size={35} /></span>
          <h1>We couldn’t find that tyre</h1>
          <p>It may have been removed or the link may be incorrect.</p>
          <Link to="/shop" className="button button--dark"><ArrowLeft size={18} /> Back to shop</Link>
        </div>
      </section>
    )
  }

  const available = product.stock > 0
  const add = () => {
    const result = addItem(product, quantity)
    if (result.ok) showToast(`${quantity} × ${product.brand} ${product.name} added to cart`)
    if (result.reason === 'stock-limit') showToast(`Only ${product.stock} available`, 'info')
    if (result.reason === 'unavailable') showToast('This tyre is currently unavailable', 'error')
  }

  const specification = [
    ['Brand', product.brand],
    ['Model', product.name],
    ['Tyre size', product.size],
    ['Width', `${product.width} mm`],
    ['Aspect ratio', `${product.aspectRatio}%`],
    ['Rim diameter', `${product.rimDiameter} inches`],
    ['Speed rating', product.speedRating],
    ['Load index', String(product.loadIndex)],
    ['Construction', product.construction],
    ['Season / type', product.season],
    ['Vehicle compatibility', product.vehicleType],
    ['Tubeless', product.tubeless ? 'Tubeless (recommended)' : 'Tube type'],
  ]

  return (
    <>
      <section className="product-detail page-section">
        <div className="container">
          <nav className="breadcrumbs breadcrumbs--dark" aria-label="Breadcrumb">
            <Link to="/">Home</Link><ChevronRight size={14} />
            <Link to="/shop">Shop Tyres</Link><ChevronRight size={14} />
            <span>{product.brand} {product.name}</span>
          </nav>

          <div className="product-detail__grid">
            <div className="gallery">
              <button
                type="button"
                className="gallery__main"
                onClick={() => setZoomImage(product.images[selectedImage])}
                aria-label="Zoom product image"
              >
                <img src={product.images[selectedImage]} alt={`${product.brand} ${product.name}`} />
                {product.badge && <span className="product-card__badge">{product.badge}</span>}
                <span className="gallery__zoom"><ZoomIn size={18} /> Click to zoom</span>
              </button>
              <div className="gallery__thumbs">
                {product.images.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={selectedImage === index ? 'is-active' : ''}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-info">
              <div className="product-info__brand">{product.brand} <BadgeCheck size={17} /></div>
              <h1>{product.name}</h1>
              <div className="product-info__size">{product.size} <span>•</span> {product.vehicleType} <span>•</span> {product.season}</div>
              <div className="product-info__rating">
                <Stars rating={product.rating} size={17} showValue />
                <a href="#reviews">{product.reviewCount} verified reviews</a>
              </div>
              <div className="product-info__price">
                <strong>{formatCurrency(product.price)}</strong>
                {product.previousPrice && <s>{formatCurrency(product.previousPrice)}</s>}
                <small>Price per tyre</small>
              </div>
              <p className="product-info__excerpt">{product.description}</p>

              <div className={`availability-panel ${available ? 'is-available' : 'is-unavailable'}`}>
                <span>{available ? <PackageCheck size={21} /> : <Clock3 size={21} />}</span>
                <div>
                  <strong>{available ? `In stock — ${product.stock} available` : 'Currently out of stock'}</strong>
                  <small>{available ? 'Ready for order confirmation and dispatch' : 'Message us to check restock options'}</small>
                </div>
              </div>

              {available && (
                <div className="product-buy-row">
                  <div className="quantity-picker" aria-label="Quantity selector">
                    <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={17} /></button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} aria-label="Increase quantity"><Plus size={17} /></button>
                  </div>
                  <button type="button" className="button button--accent button--large" onClick={add}>
                    <Box size={19} /> Add {quantity} to cart
                  </button>
                </div>
              )}

              {!available && (
                <a
                  className="button button--whatsapp button--block button--large"
                  href={getWhatsAppUrl(`Hello ${businessConfig.name}, I am interested in the ${product.brand} ${product.name} (${product.size}). Is it available?`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={19} /> Ask about availability
                </a>
              )}

              <div className="product-assurances">
                <div><ShieldCheck size={20} /><span><strong>Quality guaranteed</strong><small>Inspected before dispatch</small></span></div>
                <div><Truck size={20} /><span><strong>Fast delivery</strong><small>Confirmed by location</small></span></div>
                <div><MessageCircle size={20} /><span><strong>WhatsApp checkout</strong><small>No online payment needed</small></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-information page-section">
        <div className="container product-information__grid">
          <article>
            <span className="section-kicker">Product overview</span>
            <h2>Built for confident everyday driving</h2>
            <p>{product.description}</p>
            <h3>Why choose this tyre?</h3>
            <ul className="feature-checks">
              <li><Check size={17} /> Stable, predictable handling for daily road use</li>
              <li><Check size={17} /> Designed to balance comfort, grip and tread life</li>
              <li><Check size={17} /> Tubeless construction for convenient fitment</li>
              <li><Check size={17} /> Load and speed ratings suited to compatible vehicles</li>
            </ul>
            <div className="compatibility-note">
              <strong>Fitment note</strong>
              <p>Always confirm the full tyre size, load index and speed rating in your vehicle handbook or on your current tyre before ordering.</p>
            </div>
          </article>
          <aside className="specifications">
            <h2>Tyre specifications</h2>
            <dl>
              {specification.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="reviews-section page-section" id="reviews">
        <div className="container">
          <div className="section-heading section-heading--row reviews-heading">
            <div>
              <span className="section-kicker">Real customer feedback</span>
              <h2>What drivers are saying</h2>
            </div>
            <p>Reviews are collected from verified {businessConfig.name} customers.</p>
          </div>
          <div className="reviews-summary">
            <div className="reviews-score">
              <strong>{product.rating.toFixed(1)}</strong>
              <Stars rating={product.rating} size={18} />
              <span>Based on {pluralize(product.reviewCount, 'review')}</span>
            </div>
            <div className="rating-bars">
              {ratingBreakdown(product.rating, product.reviewCount).map((row) => (
                <div key={row.stars}>
                  <span>{row.stars} star</span>
                  <i><b style={{ width: `${product.reviewCount ? (row.count / product.reviewCount) * 100 : 0}%` }} /></i>
                  <small>{row.count}</small>
                </div>
              ))}
            </div>
            <div className="reviews-summary__badge"><BadgeCheck size={22} /><span><strong>Verified feedback</strong><small>Real orders, real drivers</small></span></div>
          </div>
          <div className="review-list">
            {product.reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card__top">
                  <div><span className="review-card__avatar">{review.customerName.charAt(0)}</span><p><strong>{review.customerName}</strong><small>{review.verified && <><BadgeCheck size={13} /> Verified customer</>}</small></p></div>
                  <time>{formatDate(review.date)}</time>
                </div>
                <Stars rating={review.rating} size={14} />
                <h3>{review.rating === 5 ? 'Excellent tyre' : 'Great tyre'}</h3>
                <p>“{review.comment}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="page-section related-section">
          <div className="container">
            <div className="section-heading section-heading--row">
              <div><span className="section-kicker">Keep comparing</span><h2>You may also like</h2></div>
              <Link to={`/shop?vehicleType=${encodeURIComponent(product.vehicleType)}`} className="text-link">View all <ChevronRight size={16} /></Link>
            </div>
            <div className="product-grid product-grid--three">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        </section>
      )}

      {zoomImage && (
        <div className="zoom-modal" onMouseDown={() => setZoomImage(null)} role="presentation">
          <button type="button" onClick={() => setZoomImage(null)} aria-label="Close image"><X size={23} /></button>
          <img src={zoomImage} alt={`${product.brand} ${product.name} enlarged`} onMouseDown={(event) => event.stopPropagation()} />
        </div>
      )}
    </>
  )
}

function ProductPageSkeleton() {
  return (
    <section className="page-section">
      <div className="container product-detail__grid product-page-skeleton">
        <div className="skeleton skeleton--gallery" />
        <div>
          <div className="skeleton skeleton--line skeleton--short" />
          <div className="skeleton skeleton--line skeleton--title-lg" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line skeleton--title-lg" />
          <div className="skeleton skeleton--line skeleton--medium" />
          <div className="skeleton skeleton--button" />
        </div>
      </div>
    </section>
  )
}
