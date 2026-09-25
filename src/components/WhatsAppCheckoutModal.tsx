import { CheckCircle2, MessageCircle, ShieldCheck, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { businessConfig } from '../config/business'
import { formatCurrency, pluralize } from '../lib/format'
import { openWhatsAppOrder } from '../lib/whatsapp'
import type { CartLine, CustomerDetails } from '../types'

interface WhatsAppCheckoutModalProps {
  cart: CartLine[]
  onClose: () => void
}

type FormErrors = Partial<Record<keyof CustomerDetails, string>>

export function WhatsAppCheckoutModal({ cart, onClose }: WhatsAppCheckoutModalProps) {
  const [values, setValues] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    address: '',
    note: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0)
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const whatsappUnavailable = import.meta.env.PROD && !businessConfig.isWhatsAppConfigured

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const updateValue = (field: keyof CustomerDetails, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    if (submitError) setSubmitError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (whatsappUnavailable) {
      setSubmitError('WhatsApp ordering is not configured yet. Please contact the store directly.')
      return
    }
    const nextErrors: FormErrors = {}
    if (values.fullName.trim().length < 2) nextErrors.fullName = 'Enter your full name'
    const digits = values.phone.replace(/\D/g, '')
    if (digits.length < 7) nextErrors.phone = 'Enter a valid phone number'
    if (values.address.trim().length < 5) nextErrors.address = 'Enter your delivery location'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      openWhatsAppOrder(cart, values)
      setSubmitting(false)
      showToast('Your order is ready in WhatsApp')
      onClose()
    }, 350)
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <section
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close checkout">
          <X size={21} />
        </button>
        <div className="checkout-modal__header">
          <span className="checkout-modal__icon"><MessageCircle size={25} /></span>
          <div>
            <span>Quick & easy checkout</span>
            <h2 id="checkout-title">Complete your WhatsApp order</h2>
            <p>Tell us where to deliver. We’ll confirm stock and payment on WhatsApp.</p>
          </div>
        </div>

        <div className="checkout-modal__grid">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="customer-name">Full name <b>*</b></label>
              <input
                id="customer-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Musa Adeyemi"
                value={values.fullName}
                onChange={(event) => updateValue('fullName', event.target.value)}
                className={errors.fullName ? 'has-error' : ''}
              />
              {errors.fullName && <small className="field-error">{errors.fullName}</small>}
            </div>
            <div className="form-field">
              <label htmlFor="customer-phone">Phone number <b>*</b></label>
              <input
                id="customer-phone"
                type="tel"
                autoComplete="tel"
                placeholder="e.g. +234 801 234 5678"
                value={values.phone}
                onChange={(event) => updateValue('phone', event.target.value)}
                className={errors.phone ? 'has-error' : ''}
              />
              {errors.phone && <small className="field-error">{errors.phone}</small>}
            </div>
            <div className="form-field">
              <label htmlFor="customer-address">Delivery address / location <b>*</b></label>
              <textarea
                id="customer-address"
                autoComplete="street-address"
                placeholder="Street, city and state"
                rows={3}
                value={values.address}
                onChange={(event) => updateValue('address', event.target.value)}
                className={errors.address ? 'has-error' : ''}
              />
              {errors.address && <small className="field-error">{errors.address}</small>}
            </div>
            <div className="form-field">
              <label htmlFor="customer-note">Note <small>(optional)</small></label>
              <textarea
                id="customer-note"
                placeholder="Vehicle details or delivery instructions"
                rows={2}
                value={values.note}
                onChange={(event) => updateValue('note', event.target.value)}
              />
            </div>
            {submitError && <p className="form-error checkout-error">{submitError}</p>}
            <button type="submit" className="button button--whatsapp button--block" disabled={submitting}>
              <MessageCircle size={19} />
              {submitting ? 'Preparing your order…' : 'Open WhatsApp & send order'}
            </button>
            <p className="form-assurance"><ShieldCheck size={15} /> No online payment is taken on this website.</p>
          </form>

          <aside className="checkout-summary">
            <h3>Order summary</h3>
            <div className="checkout-summary__items">
              {cart.map((item) => (
                <div key={item.productId}>
                  <span>
                    {item.quantity}× {item.product.brand} {item.product.name}
                    <small>{item.product.size}</small>
                  </span>
                  <strong>{formatCurrency(item.lineTotal)}</strong>
                </div>
              ))}
            </div>
            <div className="checkout-summary__count">
              <CheckCircle2 size={16} /> {pluralize(quantity, 'tyre')} selected
            </div>
            <div className="checkout-summary__total">
              <span>Total</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <p>Delivery is confirmed separately with our team.</p>
          </aside>
        </div>
      </section>
    </div>
  )
}
