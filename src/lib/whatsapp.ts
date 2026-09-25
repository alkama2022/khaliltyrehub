import { businessConfig } from '../config/business'
import type { CartLine, CustomerDetails, OrderRecord } from '../types'
import { formatCurrency, pluralize } from './format'

export const buildWhatsAppOrder = (
  cart: CartLine[],
  customer: CustomerDetails,
) => {
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0)
  const orderLines = cart
    .map((item, index) => {
      const { product } = item
      return `${index + 1}. ${product.brand} ${product.name}
   Size: ${product.size}
   Quantity: ${item.quantity}
   Price: ${formatCurrency(product.price)} each
   Total: ${formatCurrency(item.lineTotal)}`
    })
    .join('\n\n')

  return `Hello, I would like to order the following tyres:

${orderLines}

Total: ${formatCurrency(subtotal)}
Total quantity: ${pluralize(
    cart.reduce((sum, item) => sum + item.quantity, 0),
    'tyre',
  )}

Customer name: ${customer.fullName}
Phone number: ${customer.phone}
Delivery/location: ${customer.address}${customer.note ? `\nNote: ${customer.note}` : ''}

Please confirm availability and delivery details.`
}

export const getWhatsAppUrl = (message: string) =>
  `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(message)}`

export const openWhatsAppOrder = (
  cart: CartLine[],
  customer: CustomerDetails,
) => {
  const message = buildWhatsAppOrder(cart, customer)
  const order: OrderRecord = {
    id: `TDL-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    customer,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    total: cart.reduce((sum, item) => sum + item.lineTotal, 0),
    status: 'Sent to WhatsApp',
  }

  const existing = readOrderRecords().filter(
    (item) => Date.now() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30,
  )
  localStorage.setItem('treadly_orders', JSON.stringify([order, ...existing]))
  window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
  return order
}

const readOrderRecords = (): OrderRecord[] => {
  try {
    return JSON.parse(localStorage.getItem('treadly_orders') || '[]') as OrderRecord[]
  } catch {
    return []
  }
}

export const getOrderRecords = readOrderRecords
