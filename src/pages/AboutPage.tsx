import { ArrowRight, BadgeCheck, HeartHandshake, MessageCircle, ShieldCheck, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { businessConfig } from '../config/business'
import { getWhatsAppUrl } from '../lib/whatsapp'
import { usePageMeta } from '../hooks/usePageMeta'

export function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero--about">
        <div className="container about-hero__grid">
          <div>
            <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>About</span></div>
            <span className="section-kicker section-kicker--light">About {businessConfig.name}</span>
            <h1>Keeping more drivers moving with confidence.</h1>
            <p>We make it easier to find, understand and order quality tyres without the guesswork.</p>
          </div>
          <div className="about-hero__image">
            <img src="/images/tyre-studio.jpg" alt={`Quality tyres in the ${businessConfig.name} store`} />
            <div><strong>2,500+</strong><span>tyres supplied</span></div>
          </div>
        </div>
      </section>

      <section className="page-section about-story">
        <div className="container about-story__grid">
          <div>
            <span className="section-kicker">Our story</span>
            <h2>A clearer way to buy tyres</h2>
            <p>
              Treadly was created around a simple idea: choosing a tyre should not
              feel confusing. Customers deserve product information they can
              understand, honest availability and a direct way to speak with the
              business supplying their tyres.
            </p>
            <p>
              Our catalogue brings trusted brands together in one place, while our
              team provides the practical guidance needed to match a tyre to the
              vehicle, road and budget.
            </p>
          </div>
          <div className="about-story__values">
            <article><span><Target size={22} /></span><div><h3>Clarity first</h3><p>Useful specifications and straightforward prices.</p></div></article>
            <article><span><ShieldCheck size={22} /></span><div><h3>Quality focused</h3><p>Products and suppliers we are proud to stand behind.</p></div></article>
            <article><span><Users size={22} /></span><div><h3>Customer-led</h3><p>Real support before, during and after your order.</p></div></article>
          </div>
        </div>
      </section>

      <section className="about-numbers">
        <div className="container about-numbers__grid">
          <div><strong>2,500+</strong><span>tyres supplied</span></div>
          <div><strong>4.8/5</strong><span>average rating</span></div>
          <div><strong>9</strong><span>trusted brands</span></div>
          <div><strong>24 hrs</strong><span>Lagos dispatch target</span></div>
        </div>
      </section>

      <section className="page-section about-promise">
        <div className="container about-promise__grid">
          <div className="about-promise__image"><img src="/images/road-car.jpg" alt="Professional tyre service" loading="lazy" /></div>
          <div>
            <span className="section-kicker">Our promise</span>
            <h2>Advice a real driver can trust</h2>
            <p className="about-promise__lead">Your safety matters more than a quick sale.</p>
            <ul>
              <li><BadgeCheck size={19} /><span><strong>Correct information</strong>Full size, rating and compatibility details on every product.</span></li>
              <li><HeartHandshake size={19} /><span><strong>Responsible recommendations</strong>We will flag uncertainty and ask for more details when needed.</span></li>
              <li><MessageCircle size={19} /><span><strong>Direct communication</strong>Your order goes to our team, not an automated payment gateway.</span></li>
            </ul>
            <Link to="/shop" className="button button--dark button--large">Explore our tyres <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="container contact-cta__inner">
          <div>
            <span className="section-kicker section-kicker--light">Have a question?</span>
            <h2>We’re ready to help you choose.</h2>
            <p>Send us your vehicle and current tyre size for a practical recommendation.</p>
          </div>
          <a className="button button--whatsapp button--large" href={getWhatsAppUrl(`Hello ${businessConfig.name}, I need help choosing tyres for my vehicle.`)} target="_blank" rel="noreferrer">
            <MessageCircle size={20} /> Chat with an expert
          </a>
        </div>
      </section>
    </>
  )
}
