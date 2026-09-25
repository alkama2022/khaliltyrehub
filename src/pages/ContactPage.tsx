import { ChevronDown, Clock3, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { businessConfig } from '../config/business'
import { useToast } from '../context/ToastContext'
import { getWhatsAppUrl } from '../lib/whatsapp'
import { usePageMeta } from '../hooks/usePageMeta'

const faqs = [
  ['How do I know which tyre size I need?', 'Look for the full size printed on the sidewall of your current tyre, such as 205/55 R16. You can also check your vehicle handbook. Send us the details if you would like confirmation.'],
  ['Do you deliver outside Lagos?', 'Yes. We arrange nationwide delivery. The delivery fee and expected timing are confirmed directly with you on WhatsApp before dispatch.'],
  ['Can I pay online on this website?', 'No online payment is collected here. Your order is prepared on WhatsApp, where the team confirms stock, delivery and the preferred payment method.'],
  ['Can you help choose a tyre for my vehicle?', 'Absolutely. Send us the vehicle make and model, year, current tyre size and what matters most to you—comfort, fuel economy, wet grip or more tread life.'],
]

export function ContactPage() {
  usePageMeta({
    title: 'Contact & Fitment Help',
    description:
      'Contact the Treadly team for tyre size guidance, product availability, fitting and delivery information.',
    path: '/contact',
  })
  const [form, setForm] = useState({ name: '', phone: '', vehicle: '', size: '', message: '' })
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  const { showToast } = useToast()

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, '').length < 7 || !form.message.trim()) {
      setError('Please add your name, a valid phone number and a short message.')
      return
    }
    const message = `Hello ${businessConfig.name}, I would like help with tyres.

Name: ${form.name}
Phone: ${form.phone}
Vehicle: ${form.vehicle || 'Not provided'}
Current tyre size: ${form.size || 'Not provided'}

Message: ${form.message}`
    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
    showToast('Your message is ready in WhatsApp')
    setError('')
  }

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (error) setError('')
  }

  return (
    <>
      <section className="page-hero page-hero--contact">
        <div className="container">
          <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Contact</span></div>
          <span className="section-kicker section-kicker--light">We’re here to help</span>
          <h1>Talk to a tyre expert</h1>
          <p>Ask about fitment, product specifications, availability or delivery. We’ll respond on WhatsApp.</p>
        </div>
      </section>

      <section className="page-section contact-section" id="fitment">
        <div className="container contact-grid">
          <div className="contact-form-wrap">
            <span className="section-kicker">Send a message</span>
            <h2>How can we help?</h2>
            <p>Share a few details and we’ll get your question ready for our team.</p>
            <form className="contact-form" onSubmit={submit} noValidate>
              <div className="form-row">
                <div className="form-field"><label htmlFor="contact-name">Full name <b>*</b></label><input id="contact-name" value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Your name" /></div>
                <div className="form-field"><label htmlFor="contact-phone">Phone number <b>*</b></label><input id="contact-phone" type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+234..." /></div>
              </div>
              <div className="form-row">
                <div className="form-field"><label htmlFor="contact-vehicle">Vehicle</label><input id="contact-vehicle" value={form.vehicle} onChange={(event) => update('vehicle', event.target.value)} placeholder="e.g. 2021 Toyota Camry" /></div>
                <div className="form-field"><label htmlFor="contact-size">Current tyre size</label><input id="contact-size" value={form.size} onChange={(event) => update('size', event.target.value)} placeholder="e.g. 205/55 R16" /></div>
              </div>
              <div className="form-field"><label htmlFor="contact-message">How can we help? <b>*</b></label><textarea id="contact-message" rows={5} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us the tyre size, driving needs or product question..." /></div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="button button--whatsapp button--large"><MessageCircle size={19} /> Send via WhatsApp</button>
              <p className="form-assurance"><ShieldCheck size={15} /> Your details are used only to respond to this enquiry.</p>
            </form>
          </div>
          <aside className="contact-details">
            <div className="contact-details__card">
              <span className="contact-details__icon"><MapPin size={22} /></span><div><small>Visit our store</small><strong>{businessConfig.address}</strong><a href="#map">Get directions</a></div>
            </div>
            <div className="contact-details__card">
              <span className="contact-details__icon"><Phone size={22} /></span><div><small>Call us</small><strong>{businessConfig.phoneDisplay}</strong><span>Tap to call from your phone</span></div>
            </div>
            <div className="contact-details__card">
              <span className="contact-details__icon"><Mail size={22} /></span><div><small>Email</small><strong>{businessConfig.email}</strong><span>We reply as soon as possible</span></div>
            </div>
            <div className="contact-details__card">
              <span className="contact-details__icon"><Clock3 size={22} /></span><div><small>Opening hours</small><strong>{businessConfig.hours}</strong><span>WhatsApp messages accepted anytime</span></div>
            </div>
            <div className="contact-details__whatsapp">
              <MessageCircle size={25} />
              <div><strong>Prefer WhatsApp?</strong><span>Start a quick conversation with our team.</span></div>
              <a href={getWhatsAppUrl(`Hello ${businessConfig.name}, I need help with tyres.`)} target="_blank" rel="noreferrer">Open chat</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="map-section" id="map">
        <div className="map-placeholder">
          <div className="map-placeholder__roads" />
          <div className="map-pin"><span><MapPin size={24} /></span><strong>{businessConfig.name}</strong><small>Ikeja, Lagos</small></div>
        </div>
      </section>

      <section className="page-section faq-section">
        <div className="container faq-grid">
          <div><span className="section-kicker">Common questions</span><h2>Before you order</h2><p>Quick answers to help you shop with confidence.</p><a className="text-link" href={`tel:${businessConfig.phoneDisplay.replace(/\s/g, '')}`}>Still need help? Call our team</a></div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <article className={openFaq === index ? 'is-open' : ''} key={question}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={19} /></button>
                <div><p>{answer}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
