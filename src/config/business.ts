const env = import.meta.env

const cleanPhone = (value: string | undefined) => value?.replace(/\D/g, '') || ''

export const businessConfig = {
  name: env.VITE_BUSINESS_NAME || 'Treadly',
  legalName: env.VITE_BUSINESS_LEGAL_NAME || 'Treadly Tyres',
  tagline: env.VITE_BUSINESS_TAGLINE || 'Premium tyres. Trusted journeys.',
  description:
    env.VITE_BUSINESS_DESCRIPTION ||
    'Trusted tyres, transparent pricing and expert support for every drive.',
  whatsappNumber:
    cleanPhone(env.VITE_WHATSAPP_NUMBER) || '2348001234567',
  phoneDisplay:
    env.VITE_BUSINESS_PHONE_DISPLAY || '+234 800 123 4567',
  email: env.VITE_BUSINESS_EMAIL || 'hello@treadly.ng',
  address:
    env.VITE_BUSINESS_ADDRESS ||
    '24 Automobile Crescent, Ikeja, Lagos, Nigeria',
  hours: env.VITE_BUSINESS_HOURS || 'Mon–Sat, 8:00 AM–6:00 PM',
  siteUrl: (env.VITE_SITE_URL || 'https://treadly.ng').replace(/\/$/, ''),
  social: {
    instagram: env.VITE_INSTAGRAM_URL || '',
    facebook: env.VITE_FACEBOOK_URL || '',
  },
  currency: 'NGN',
  locale: 'en-NG',
  deliveryNote: env.VITE_DELIVERY_NOTE || 'Fast nationwide delivery available',
  isWhatsAppConfigured: Boolean(cleanPhone(env.VITE_WHATSAPP_NUMBER)),
} as const
