export const businessConfig = {
  name: 'Treadly',
  legalName: 'Treadly Tyres',
  tagline: 'Premium tyres. Trusted journeys.',
  description:
    'Trusted tyres, transparent pricing and expert support for every drive.',
  whatsappNumber:
    import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '') || '2348001234567',
  phoneDisplay: '+234 800 123 4567',
  email: 'hello@treadly.ng',
  address: '24 Automobile Crescent, Ikeja, Lagos, Nigeria',
  hours: 'Mon–Sat, 8:00 AM–6:00 PM',
  currency: 'NGN',
  locale: 'en-NG',
  deliveryNote: 'Fast nationwide delivery available',
} as const
