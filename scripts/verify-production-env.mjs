import { loadEnv } from 'vite'

const env = loadEnv('production', process.cwd(), '')
const whatsapp = (env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
const siteUrl = env.VITE_SITE_URL || ''

const errors = []
if (whatsapp.length < 8) {
  errors.push('VITE_WHATSAPP_NUMBER must contain a country code and business number (digits only).')
}
if (!/^https?:\/\//i.test(siteUrl)) {
  errors.push('VITE_SITE_URL must be an absolute https URL.')
}

if (errors.length) {
  console.error('\nProduction configuration is incomplete:\n')
  for (const error of errors) console.error(`- ${error}`)
  console.error('\nCopy .env.example to .env, fill in the production values, and try again.\n')
  process.exit(1)
}

console.log('Production environment verified.')
