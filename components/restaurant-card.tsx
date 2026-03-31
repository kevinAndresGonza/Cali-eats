"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Bookmark, Star, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Restaurant } from "@/lib/types"

interface RestaurantCardProps {
  restaurant: Restaurant
  onPress: () => void
  onLike: () => void
  onSave: () => void
}

export function RestaurantCard({
  restaurant,
  onPress,
  onLike,
  onSave,
}: RestaurantCardProps) {
  const [isLiked, setIsLiked] = useState(restaurant.isFavorite)
  const [isSaved, setIsSaved] = useState(restaurant.isSaved)
  const [showHeartPulse, setShowHeartPulse] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    if (!isLiked) {
      setShowHeartPulse(true)
      setTimeout(() => setShowHeartPulse(false), 600)
    }
    onLike()
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
    onSave()
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={onPress}
      className="relative mx-4 mb-4 overflow-hidden rounded-2xl touch-manipulation"
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${restaurant.name}`}
    >
      {/* Background Image */}
      <div className="relative aspect-[4/3] w-full">
        <img
          src={restaurant.images[0]}
          alt={restaurant.name}
          className="h-full w-full object-cover"
          loading="lazy"
          crossOrigin="anonymous"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Floating Action Buttons */}
        <div className="absolute right-3 top-3 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
            aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <AnimatePresence>
              {showHeartPulse && (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-full bg-red-500/30"
                />
              )}
            </AnimatePresence>
            <motion.div
              animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={cn(
                  "h-6 w-6 transition-colors duration-200",
                  isLiked ? "fill-red-500 text-red-500" : "text-white"
                )}
              />
            </motion.div>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleSave}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
            aria-label={isSaved ? "Quitar de guardados" : "Guardar"}
          >
            <Bookmark
              className={cn(
                "h-6 w-6 transition-colors duration-200",
                isSaved ? "fill-primary text-primary" : "text-white"
              )}
            />
          </motion.button>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate">
                {restaurant.name}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {restaurant.zone} - {restaurant.neighborhood}
                </span>
              </div>
            </div>
            
            {/* Rating & Distance */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1">
                <Star className="h-3.5 w-3.5 fill-primary-foreground text-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground">
                  {restaurant.rating}
                </span>
              </div>
              <span className="text-xs text-white/70">
                {restaurant.distance}
              </span>
            </div>
          </div>
          
          {/* Category & Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
              {restaurant.category}
            </span>
            <span className="text-xs text-white/70">
              {restaurant.priceRange}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
