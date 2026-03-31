"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

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
  login: (user: User) => void
  logout: () => void
  toggleFavorite: (restaurantId: string) => boolean
  toggleSaved: (restaurantId: string) => boolean
  isFavorite: (restaurantId: string) => boolean
  isSaved: (restaurantId: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      favorites: [],
      saved: [],
      
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
    }),
    {
      name: "cali-eats-user",
    }
  )
)
