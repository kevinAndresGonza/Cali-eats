"use client"

import { motion } from "framer-motion"
import { Heart, Star } from "lucide-react"
import { restaurants } from "@/lib/data"
import type { Restaurant } from "@/lib/types"

interface FavoritesViewProps {
  onSelectRestaurant: (restaurant: Restaurant) => void
}

export function FavoritesView({ onSelectRestaurant }: FavoritesViewProps) {
  const favorites = restaurants.filter((r) => r.isFavorite)
  const saved = restaurants.filter((r) => r.isSaved)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-foreground">Favoritos</h1>
        <p className="text-sm text-muted-foreground">
          Tus lugares guardados
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">
        {favorites.length === 0 && saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              Sin favoritos aún
            </h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Explora restaurantes y guarda tus favoritos aquí
            </p>
          </div>
        ) : (
          <>
            {favorites.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  Favoritos ({favorites.length})
                </h2>
                <div className="space-y-3">
                  {favorites.map((restaurant, index) => (
                    <motion.button
                      key={restaurant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
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
                  ))}
                </div>
              </div>
            )}

            {saved.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span className="text-primary">🔖</span>
                  Guardados ({saved.length})
                </h2>
                <div className="space-y-3">
                  {saved.map((restaurant, index) => (
                    <motion.button
                      key={restaurant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
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
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
