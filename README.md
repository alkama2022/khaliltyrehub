# Treadly Tyre Storefront

A responsive tyre e-commerce storefront built with React, TypeScript and Vite. Customers can browse and filter tyres, inspect full specifications and reviews, maintain a persistent cart, provide delivery details, and send a complete order to the business through WhatsApp.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Configure the business WhatsApp number

Set `VITE_WHATSAPP_NUMBER` in `.env` to the WhatsApp country code and business number using digits only.

```env
VITE_WHATSAPP_NUMBER=2348001234567
```

The sample value must be replaced before launch. Business name, contact details, address and currency live in `src/config/business.ts`.

## What is included

- Responsive homepage with featured products, brands, trust sections and WhatsApp CTA
- Searchable and filterable catalogue with sorting and stock filtering
- Detailed product pages with galleries, zoom, specifications and reviews
- Centralized cart context with stock limits and `localStorage` persistence
- Validated customer-information form before checkout
- Reusable WhatsApp message builder with customer and order details
- Brand, about, contact and fitment-help pages
- Local admin workspace for product CRUD, image selection, pricing, stock, reviews and generated WhatsApp-order records
- Loading, empty, error, unavailable and toast states

## Production checklist

1. Set every value in `.env` from `.env.example`, especially a verified `VITE_WHATSAPP_NUMBER`.
2. Replace the sample business name, email, phone, address, social links and `VITE_SITE_URL` with live details.
3. Update the canonical URL, Open Graph URL, `robots.txt` and `sitemap.xml` if the production domain is different from `treadly.ng`.
4. Replace sample products and demo photography with verified catalogue data and original product images.
5. Move the product repository to a real API/database and protect `/admin` with authentication before exposing the admin area.
6. Configure the hosting platform to use `npm run build` and serve `dist/`. `public/_redirects` handles SPA fallback on Netlify-compatible hosts; `vercel.json` covers Vercel.
7. Test the complete order flow on a real phone in both desktop and mobile browsers.

The frontend exposes only public business values through Vite environment variables. Never put private API keys, database credentials or admin secrets in `VITE_*` variables because they are shipped to the browser.


```text
src/
├── components/     Reusable storefront and admin components
├── config/         Business and environment configuration
├── context/        Product, cart and toast state
├── data/           Initial sample product catalogue
├── lib/            Formatting, storage and WhatsApp utilities
├── pages/          Route-level screens
├── services/       Replaceable local product repository
└── types/          Shared domain models
```

The local product repository in `src/services/productService.ts` intentionally mirrors async API behavior. Replace its methods with HTTP requests later while keeping the existing `ProductProvider` and UI contracts.

The current admin and order records are browser-local demonstrations. Before production, protect `/admin` with authentication, move catalogue and review operations behind an API/database, and send orders from a server-side WhatsApp integration or verified business workflow.

## Image sources

The included demo photographs are stored locally under `public/images` and sourced from Unsplash/Pexels under their respective free-use licenses. Replace them with original product photography before launch.
