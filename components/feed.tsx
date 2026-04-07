"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { RestaurantCard } from "@/components/restaurant-card"
import { restaurants } from "@/lib/data"
import type { Restaurant } from "@/lib/types"

const ITEMS_PER_PAGE = 10

interface FeedProps {
  filteredRestaurants: Restaurant[]
  onRestaurantPress: (restaurant: Restaurant) => void
  onLike: (isLiked: boolean) => void
  onSave: (isSaved: boolean) => void
  onAuthRequired: () => void
  activeCategory: string | null
}

export function Feed({
  filteredRestaurants,
  onRestaurantPress,
  onLike,
  onSave,
  onAuthRequired,
  activeCategory,
}: FeedProps) {
  const [displayedRestaurants, setDisplayedRestaurants] = useState<Restaurant[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Reset when category changes
  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setDisplayedRestaurants(filteredRestaurants.slice(0, ITEMS_PER_PAGE))
  }, [filteredRestaurants, activeCategory])

  // Load more restaurants
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate network delay for better UX
    setTimeout(() => {
      const startIndex = page * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const newRestaurants = filteredRestaurants.slice(startIndex, endIndex)
      
      if (newRestaurants.length > 0) {
        setDisplayedRestaurants((prev) => [...prev, ...newRestaurants])
        setPage((prev) => prev + 1)
        setHasMore(endIndex < filteredRestaurants.length)
      } else {
        setHasMore(false)
      }
      
      setIsLoading(false)
    }, 500)
  }, [filteredRestaurants, page, isLoading, hasMore])

  // Setup intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, hasMore, isLoading])

  if (displayedRestaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-center text-muted-foreground">
          No hay restaurantes en esta categoría
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
      {displayedRestaurants.map((restaurant, index) => (
        <motion.div
          key={restaurant.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index % ITEMS_PER_PAGE) * 0.08 }}
        >
          <RestaurantCard
            restaurant={restaurant}
            onPress={() => onRestaurantPress(restaurant)}
            onLike={onLike}
            onSave={onSave}
            onAuthRequired={onAuthRequired}
          />
        </motion.div>
      ))}

      {/* Loading indicator and intersection observer target */}
      <div ref={loadMoreRef} className="py-8 flex flex-col items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span className="text-sm text-muted-foreground">Cargando más restaurantes...</span>
          </div>
        )}
        
        {!hasMore && displayedRestaurants.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {filteredRestaurants.length === restaurants.length 
              ? `Has visto todos los ${restaurants.length} restaurantes` 
              : `Has visto todos los ${filteredRestaurants.length} restaurantes de esta categoría`}
          </p>
        )}
      </div>
    </div>
  )
}
