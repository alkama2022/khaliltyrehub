import { businessConfig } from '../config/business'

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat(businessConfig.locale, {
    style: 'currency',
    currency: businessConfig.currency,
    maximumFractionDigits: 0,
  }).format(amount)

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))

export const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`
