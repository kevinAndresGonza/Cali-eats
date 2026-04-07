"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Review } from "./types"

interface User {
  name: string
  email: string
  avatar: string
}

interface UserState {
  user: User | null
  isLoggedIn: boolean
  favorites: string[]
  saved: string[]
  reviews: Review[]
  login: (user: User) => void
  logout: () => void
  toggleFavorite: (restaurantId: string) => boolean
  toggleSaved: (restaurantId: string) => boolean
  isFavorite: (restaurantId: string) => boolean
  isSaved: (restaurantId: string) => boolean
  addReview: (review: Omit<Review, "id" | "userName" | "userAvatar" | "date">) => void
  getRestaurantReviews: (restaurantId: string) => Review[]
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      favorites: [],
      saved: [],
      reviews: [],
      
      login: (user) => set({ user, isLoggedIn: true }),
      
      logout: () => set({ user: null, isLoggedIn: false }),
      
      toggleFavorite: (restaurantId) => {
        const { favorites } = get()
        const isFav = favorites.includes(restaurantId)
        
        if (isFav) {
          set({ favorites: favorites.filter((id) => id !== restaurantId) })
        } else {
          set({ favorites: [...favorites, restaurantId] })
        }
        
        return !isFav
      },
      
      toggleSaved: (restaurantId) => {
        const { saved } = get()
        const isSavedItem = saved.includes(restaurantId)
        
        if (isSavedItem) {
          set({ saved: saved.filter((id) => id !== restaurantId) })
        } else {
          set({ saved: [...saved, restaurantId] })
        }
        
        return !isSavedItem
      },
      
      isFavorite: (restaurantId) => get().favorites.includes(restaurantId),
      
      isSaved: (restaurantId) => get().saved.includes(restaurantId),
      
      addReview: (reviewData) => {
        const { user, reviews } = get()
        if (!user) return
        
        const newReview: Review = {
          id: Date.now().toString(),
          userName: user.name,
          userAvatar: user.avatar,
          date: new Date().toLocaleDateString('es-CO', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }),
          ...reviewData,
        }
        
        set({ reviews: [newReview, ...reviews] })
      },
      
      getRestaurantReviews: (restaurantId) => {
        return get().reviews.filter((review) => review.restaurantId === restaurantId)
      },
    }),
    {
      name: "cali-eats-user",
    }
  )
)
