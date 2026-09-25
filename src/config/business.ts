const env = import.meta.env

const cleanPhone = (value: string | undefined) => value?.replace(/\D/g, '') || ''

const cleanSiteUrl = (value: string | undefined) => {
  const candidate = value?.trim() || 'https://treadly.ng'
  return /^https?:\/\//i.test(candidate) ? candidate.replace(/\/$/, '') : 'https://treadly.ng'
}

export const businessConfig = {
  name: env.VITE_BUSINESS_NAME || 'Treadly',
  legalName: env.VITE_BUSINESS_LEGAL_NAME || 'Treadly Tyres',
  tagline: env.VITE_BUSINESS_TAGLINE || 'Premium tyres. Trusted journeys.',
  description:
    env.VITE_BUSINESS_DESCRIPTION ||
    'Trusted tyres, transparent pricing and expert support for every drive.',
  whatsappNumber: cleanPhone(env.VITE_WHATSAPP_NUMBER),
  phoneDisplay:
    env.VITE_BUSINESS_PHONE_DISPLAY || '+234 800 123 4567',
  email: env.VITE_BUSINESS_EMAIL || 'hello@treadly.ng',
  address:
    env.VITE_BUSINESS_ADDRESS ||
    '24 Automobile Crescent, Ikeja, Lagos, Nigeria',
  hours: env.VITE_BUSINESS_HOURS || 'Mon–Sat, 8:00 AM–6:00 PM',
  siteUrl: cleanSiteUrl(env.VITE_SITE_URL),
  social: {
    instagram: env.VITE_INSTAGRAM_URL || '',
    facebook: env.VITE_FACEBOOK_URL || '',
  },
  currency: 'NGN',
  locale: 'en-NG',
  deliveryNote: env.VITE_DELIVERY_NOTE || 'Fast nationwide delivery available',
  isWhatsAppConfigured: Boolean(cleanPhone(env.VITE_WHATSAPP_NUMBER)),
  isAdminDemoEnabled:
    import.meta.env.DEV || env.VITE_ENABLE_ADMIN_DEMO === 'true',
} as const
