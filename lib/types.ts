export interface Restaurant {
  id: string
  name: string
  neighborhood: string
  zone: string
  rating: number
  reviewCount: number
  distance: string
  category: string
  priceRange: string
  images: string[]
  description: string
  address: string
  hours: string
  phone: string
  isFavorite: boolean
  isSaved: boolean
}

export interface Review {
  id: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
}

export interface Category {
  id: string
  name: string
  icon: string
}
