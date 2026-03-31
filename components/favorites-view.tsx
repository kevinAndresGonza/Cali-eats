"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bookmark, Star, Trash2 } from "lucide-react"
import { restaurants } from "@/lib/data"
import { useUserStore } from "@/lib/store"
import type { Restaurant } from "@/lib/types"
import { useState } from "react"

interface FavoritesViewProps {
  onSelectRestaurant: (restaurant: Restaurant) => void
  onAuthRequired: () => void
}

export function FavoritesView({ onSelectRestaurant, onAuthRequired }: FavoritesViewProps) {
  const { isLoggedIn, favorites, saved, toggleFavorite, toggleSaved } = useUserStore()
  const [activeTab, setActiveTab] = useState<"favorites" | "saved">("favorites")
  
  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id))
  const savedRestaurants = restaurants.filter((r) => saved.includes(r.id))

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Favoritos</h1>
          <p className="text-sm text-muted-foreground">
            Tus lugares guardados
          </p>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground text-center">
            Inicia sesion para ver tus favoritos
          </h3>
          <p className="mt-2 text-center text-sm text-muted-foreground max-w-xs">
            Guarda tus restaurantes favoritos y accede a ellos desde cualquier dispositivo
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAuthRequired}
            className="mt-6 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold touch-manipulation"
          >
            Iniciar sesion
          </motion.button>
        </div>
      </div>
    )
  }

  const currentList = activeTab === "favorites" ? favoriteRestaurants : savedRestaurants
  const isEmpty = currentList.length === 0

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">Favoritos</h1>
        <p className="text-sm text-muted-foreground">
          Tus lugares guardados
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex rounded-xl bg-secondary p-1">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors touch-manipulation ${
              activeTab === "favorites"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 ${activeTab === "favorites" ? "fill-current" : ""}`} />
            Favoritos ({favoriteRestaurants.length})
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors touch-manipulation ${
              activeTab === "saved"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${activeTab === "saved" ? "fill-current" : ""}`} />
            Guardados ({savedRestaurants.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                {activeTab === "favorites" ? (
                  <Heart className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Bookmark className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-medium text-foreground">
                {activeTab === "favorites" ? "Sin favoritos aun" : "Sin guardados aun"}
              </h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                {activeTab === "favorites"
                  ? "Toca el corazon en un restaurante para agregarlo"
                  : "Toca el marcador para guardar restaurantes"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "favorites" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {currentList.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="relative"
                >
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectRestaurant(restaurant)}
                    className="flex w-full items-center gap-3 rounded-xl bg-secondary p-3 text-left touch-manipulation"
                  >
                    <img
                      src={restaurant.images[0]}
                      alt={restaurant.name}
                      className="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {restaurant.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {restaurant.category} · {restaurant.priceRange}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {restaurant.zone} - {restaurant.neighborhood}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-sm font-medium text-primary">
                          {restaurant.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({restaurant.reviewCount})
                        </span>
                      </div>
                    </div>
                  </motion.button>
                  
                  {/* Delete button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (activeTab === "favorites") {
                        toggleFavorite(restaurant.id)
                      } else {
                        toggleSaved(restaurant.id)
                      }
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20 touch-manipulation"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
