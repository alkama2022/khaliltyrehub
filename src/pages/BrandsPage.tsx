import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { formatCurrency } from '../lib/format'

const brandNotes: Record<string, string> = {
  Michelin: 'Premium comfort, confident braking and long road-life.',
  Bridgestone: 'Balanced performance for modern sedans and crossovers.',
  Goodyear: 'Dependable everyday tyres for a wide range of vehicles.',
  Continental: 'Precise handling and confident wet-weather control.',
  Dunlop: 'Versatile SUV tyres for road and light all-terrain use.',
  Pirelli: 'High-mileage touring tyres focused on comfort.',
  Hankook: 'Premium feel and strong performance at a practical price.',
  Yokohama: 'Efficient, comfortable tyres for urban and daily driving.',
  Falken: 'Affordable touring performance with dependable grip.',
}

export function BrandsPage() {
  const { products } = useProducts()
  const brands = [...new Set(products.map((product) => product.brand))]

  return (
    <>
      <section className="page-hero page-hero--brands">
        <div className="container">
          <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Brands</span></div>
          <span className="section-kicker section-kicker--light">Trusted names. Proven road confidence.</span>
          <h1>Tyres from brands you can trust</h1>
          <p>We source quality products from established global manufacturers, with clear specifications and honest availability.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading section-heading--center">
            <span className="section-kicker">Our tyre range</span>
            <h2>Find your preferred brand</h2>
            <p>Compare available sizes and choose the option that fits your vehicle and driving style.</p>
          </div>
          <div className="brands-directory">
            {brands.map((brand, index) => {
              const items = products.filter((product) => product.brand === brand)
              const startingPrice = Math.min(...items.map((product) => product.price))
              return (
                <article className="brand-directory-card" key={brand}>
                  <div className={`brand-directory-card__logo brand-directory-card__logo--${(index % 5) + 1}`}>
                    <span>{brand.charAt(0)}</span>
                    <strong>{brand}</strong>
                  </div>
                  <div className="brand-directory-card__body">
                    <div className="brand-directory-card__trust"><BadgeCheck size={16} /> Authentic products</div>
                    <h3>{brand}</h3>
                    <p>{brandNotes[brand] || 'Reliable quality for confident everyday driving.'}</p>
                    <div className="brand-directory-card__meta">
                      <span><strong>{items.length}</strong> available size{items.length === 1 ? '' : 's'}</span>
                      <span>From <strong>{formatCurrency(startingPrice)}</strong></span>
                    </div>
                    <Link to={`/shop?brand=${encodeURIComponent(brand)}`} className="button button--dark">
                      Shop {brand} <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="brand-promise page-section">
        <div className="container brand-promise__grid">
          <article><span><ShieldCheck size={24} /></span><div><h3>Quality you can trust</h3><p>We focus on established brands and inspect products before they leave our store.</p></div></article>
          <article><span><Sparkles size={24} /></span><div><h3>Options for every road</h3><p>From premium passenger touring to SUV and all-terrain capability.</p></div></article>
        </div>
      </section>
    </>
  )
}
