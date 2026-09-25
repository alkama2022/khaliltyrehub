import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CalendarCheck,
  Headphones,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { ProductSkeleton } from '../components/ProductSkeleton'
import { useProducts } from '../context/ProductContext'
import { businessConfig } from '../config/business'
import { getWhatsAppUrl } from '../lib/whatsapp'

const brands = ['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Dunlop', 'Pirelli']

const reviews = [
  {
    name: 'Musa A.',
    car: 'Toyota Camry owner',
    text: 'The team helped me choose the right size and the delivery arrived the next day. Very professional experience.',
    rating: 5,
  },
  {
    name: 'Chidi O.',
    car: 'Honda CR-V owner',
    text: 'Great prices and proper fitting. My SUV feels much quieter and more stable on the highway now.',
    rating: 5,
  },
  {
    name: 'Aisha B.',
    car: 'Mercedes-Benz owner',
    text: 'Ordering on WhatsApp was quick and simple. They confirmed the tyres were fresh before dispatch.',
    rating: 5,
  },
]

export function HomePage() {
  const { products, loading } = useProducts()
  const featured = products.filter((product) => product.stock > 0).slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__content">
            <div className="eyebrow"><Sparkles size={15} /> Premium tyres. Trusted journeys.</div>
            <h1>Find the right tyres for your vehicle.</h1>
            <p>
              Shop trusted passenger, SUV and commercial tyres with honest prices,
              expert fitment guidance and fast WhatsApp ordering.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="button button--accent button--large">
                Shop tyres <ArrowRight size={19} />
              </Link>
              <Link to="/contact#fitment" className="button button--outline button--large">
                Get fitment help
              </Link>
            </div>
            <div className="hero__proof">
              <div><strong>4.8/5</strong><span>Customer rating</span></div>
              <i />
              <div><strong>2,500+</strong><span>Tyres supplied</span></div>
              <i />
              <div><strong>24 hrs</strong><span>Lagos dispatch</span></div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__image-wrap">
              <img src="/images/road-car.jpg" alt="Professional tyre fitting service" />
              </div>
            <div className="hero__floating hero__floating--top">
              <span><ShieldCheck size={18} /></span>
              <div><strong>Verified fitment</strong><small>Get the right size first time</small></div>
            </div>
            <div className="hero__floating hero__floating--bottom">
              <span className="hero__rating"><Star size={17} fill="currentColor" /></span>
              <div><strong>4.9 customer love</strong><small>from 180+ verified reviews</small></div>
            </div>
            <div className="hero__image-label">TYRE CARE, WITHOUT THE RUNAROUND.</div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Shop benefits">
        <div className="container trust-strip__grid">
          <div><BadgeCheck size={22} /><span><strong>Authentic products</strong><small>Trusted brands only</small></span></div>
          <div><Truck size={22} /><span><strong>Nationwide delivery</strong><small>Fast dispatch across Nigeria</small></span></div>
          <div><Wrench size={22} /><span><strong>Expert fitment</strong><small>Advice before you order</small></span></div>
          <div><MessageCircle size={22} /><span><strong>Easy WhatsApp checkout</strong><small>No online payment needed</small></span></div>
        </div>
      </section>

      <section className="page-section featured-section">
        <div className="container">
          <div className="section-heading section-heading--row">
            <div>
              <span className="section-kicker">Curated for the road ahead</span>
              <h2>Featured tyres</h2>
              <p>Popular choices for comfort, safety and everyday performance.</p>
            </div>
            <Link to="/shop" className="text-link">View all tyres <ArrowRight size={17} /></Link>
          </div>
          <div className="product-grid product-grid--four">
            {loading
              ? Array.from({ length: 4 }, (_, index) => <ProductSkeleton key={index} />)
              : featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="brands-section">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">World-leading manufacturers</span>
            <h2>Shop by trusted brand</h2>
            <p>From premium touring tyres to capable all-terrains.</p>
          </div>
          <div className="brand-grid">
            {brands.map((brand, index) => (
              <Link to={`/shop?brand=${encodeURIComponent(brand)}`} key={brand} className="brand-card">
                <span className={`brand-card__mark brand-card__mark--${index + 1}`}>{brand.charAt(0)}</span>
                <div><strong>{brand}</strong><small>{products.filter((product) => product.brand === brand).length || 1} tyre options</small></div>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container tyre-finder">
          <div className="tyre-finder__content">
            <span className="section-kicker section-kicker--light">Not sure what to order?</span>
            <h2>Start with your tyre size.</h2>
            <p>
              Find the width, profile and rim diameter printed on your current tyre,
              for example <strong>205/55 R16</strong>.
            </p>
            <Link to="/shop" className="button button--light button--large">
              <Search size={18} /> Find my tyres
            </Link>
          </div>
          <div className="tyre-finder__visual" aria-hidden="true">
            <div className="size-demo">
              <span>205</span><b>/</b><span>55</span><b>R</b><span>16</span>
            </div>
            <div className="size-demo__legend">
              <span><b>205</b>Width</span><span><b>55</b>Profile</span><span><b>16</b>Rim</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section why-section">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">A better tyre buying experience</span>
            <h2>Built around your safety</h2>
            <p>Not just products. We make every step clear, dependable and easy.</p>
          </div>
          <div className="feature-grid">
            <article>
              <span><Search size={23} /></span>
              <h3>Find your fit</h3>
              <p>Search by brand, model, size or vehicle and see the full technical specification before ordering.</p>
            </article>
            <article>
              <span><BadgeCheck size={23} /></span>
              <h3>Shop with confidence</h3>
              <p>Real stock, clear pricing and quality products from manufacturers we trust.</p>
            </article>
            <article>
              <span><Headphones size={23} /></span>
              <h3>Real human support</h3>
              <p>Send your order on WhatsApp and speak directly with our team about availability and delivery.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="page-section story-section">
        <div className="container story-grid">
          <div className="story-visual">
            <img src="/images/tyre-studio.jpg" alt="Fresh tyres ready for quality inspection" loading="lazy" />
            <div className="story-visual__badge"><strong>2,500+</strong><span>tyres supplied</span></div>
          </div>
          <div className="story-content">
            <span className="section-kicker">About {businessConfig.name}</span>
            <h2>Tyre shopping, without the stress.</h2>
            <p>
              We started {businessConfig.name} to make it easier for Nigerian drivers to access
              quality tyres, understand their options and order from a real business
              that stands behind every product.
            </p>
            <ul>
              <li><Boxes size={19} /><span><strong>Quality checked</strong>Every order checked before dispatch</span></li>
              <li><CalendarCheck size={19} /><span><strong>Convenient ordering</strong>Your cart stays saved on your device</span></li>
              <li><MessageCircle size={19} /><span><strong>Fast communication</strong>One message to confirm your whole order</span></li>
            </ul>
            <Link to="/about" className="text-link">Learn more about us <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="page-section review-section">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">From drivers on the road</span>
            <h2>Trusted by everyday drivers</h2>
          </div>
          <div className="testimonial-grid">
            {reviews.map((review) => (
              <article className="testimonial-card" key={review.name}>
                <div className="testimonial-card__stars" aria-label="5 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}
                </div>
                <blockquote>“{review.text}”</blockquote>
                <div>
                  <span className="testimonial-card__avatar">{review.name.charAt(0)}</span>
                  <p><strong>{review.name}</strong><small>{review.car}</small></p>
                  <BadgeCheck size={17} aria-label="Verified customer" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="container contact-cta__inner">
          <div>
            <span className="section-kicker section-kicker--light">Need a hand choosing?</span>
            <h2>Your tyres are only a message away.</h2>
            <p>Send us your vehicle, current tyre size and budget. We’ll help you choose.</p>
          </div>
          <a
            className="button button--whatsapp button--large"
            href={getWhatsAppUrl(`Hello ${businessConfig.name}, I need help choosing tyres for my vehicle.`)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={20} /> Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}
