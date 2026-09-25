interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_BUSINESS_NAME?: string
  readonly VITE_BUSINESS_LEGAL_NAME?: string
  readonly VITE_BUSINESS_TAGLINE?: string
  readonly VITE_BUSINESS_DESCRIPTION?: string
  readonly VITE_BUSINESS_PHONE_DISPLAY?: string
  readonly VITE_BUSINESS_EMAIL?: string
  readonly VITE_BUSINESS_ADDRESS?: string
  readonly VITE_BUSINESS_HOURS?: string
  readonly VITE_DELIVERY_NOTE?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_INSTAGRAM_URL?: string
  readonly VITE_FACEBOOK_URL?: string
  readonly VITE_ENABLE_ADMIN_DEMO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
