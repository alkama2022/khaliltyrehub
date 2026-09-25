import { useEffect } from 'react'
import { businessConfig } from '../config/business'

interface PageMetaOptions {
  title: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

export function usePageMeta({
  title,
  description = businessConfig.description,
  path = '',
  image,
  noIndex = false,
}: PageMetaOptions) {
  useEffect(() => {
    const cleanTitle = title === businessConfig.name ? title : `${title} | ${businessConfig.name}`
    const cleanDescription = description.replace(/\s+/g, ' ').trim().slice(0, 160)
    const canonical = new URL(path || '/', `${businessConfig.siteUrl}/`).toString()
    const socialImage = image
      ? new URL(image, `${businessConfig.siteUrl}/`).toString()
      : new URL('/images/road-car.jpg', `${businessConfig.siteUrl}/`).toString()

    document.title = cleanTitle
    setMeta('meta[name="description"]', 'name', 'description', cleanDescription)
    setMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setMeta('meta[property="og:title"]', 'property', 'og:title', cleanTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', cleanDescription)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    setMeta('meta[property="og:image"]', 'property', 'og:image', socialImage)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', cleanTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', cleanDescription)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', socialImage)

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical
  }, [title, description, path, image, noIndex])
}
