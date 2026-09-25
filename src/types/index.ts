export type VehicleType =
  | 'Passenger'
  | 'SUV & 4x4'
  | 'Commercial'
  | 'Performance'

export type Season = 'All-season' | 'Summer' | 'Winter' | 'All-terrain'

export interface Review {
  id: string
  customerName: string
  rating: number
  date: string
  comment: string
  verified: boolean
}

export interface Product {
  id: string
  brand: string
  name: string
  description: string
  price: number
  previousPrice?: number
  images: string[]
  size: string
  width: number
  aspectRatio: number
  rimDiameter: number
  loadIndex: number
  speedRating: string
  vehicleType: VehicleType
  season: Season
  construction: string
  tubeless: boolean
  stock: number
  rating: number
  reviewCount: number
  reviews: Review[]
  createdDate: string
  popularity: number
  badge?: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartLine extends CartItem {
  product: Product
  lineTotal: number
}

export interface CustomerDetails {
  fullName: string
  phone: string
  address: string
  note?: string
}

export interface OrderRecord {
  id: string
  createdAt: string
  customer: CustomerDetails
  itemCount: number
  total: number
  status: 'Sent to WhatsApp'
}

export type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'newest'
  | 'popular'
