"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BottomNav } from "@/components/bottom-nav"
import { CategoryPills } from "@/components/category-pills"
import { RestaurantCard } from "@/components/restaurant-card"
import { RestaurantDetail } from "@/components/restaurant-detail"
import { ReviewModal } from "@/components/review-modal"
import { SearchView } from "@/components/search-view"
import { FavoritesView } from "@/components/favorites-view"
import { ProfileView } from "@/components/profile-view"
import { restaurants, categories } from "@/lib/data"
import type { Restaurant } from "@/lib/types"

export default function CaliEatsApp() {
  const [activeTab, setActiveTab] = useState("explore")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const filteredRestaurants = activeCategory
    ? restaurants.filter((r) => {
        const category = categories.find((c) => c.id === activeCategory)
        return category && r.category === category.name
      })
    : restaurants

  const handleRestaurantPress = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
    setIsDetailOpen(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false)
  }, [])

  const handleOpenReview = useCallback(() => {
    setIsReviewOpen(true)
  }, [])

  const handleCloseReview = useCallback(() => {
    setIsReviewOpen(false)
  }, [])

  const handleLike = useCallback(() => {
    // Handle like action - in a real app, this would update state/API
  }, [])

  const handleSave = useCallback(() => {
    // Handle save action - in a real app, this would update state/API
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full flex-col"
            >
              {/* Header */}
              <header className="safe-top px-4 pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Cali Eats
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Descubre sabores únicos
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <span className="text-lg font-bold text-primary-foreground">
                      C
                    </span>
                  </div>
                </div>
              </header>

              {/* Category Pills */}
              <CategoryPills
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              {/* Restaurant Feed */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RestaurantCard
                        restaurant={restaurant}
                        onPress={() => handleRestaurantPress(restaurant)}
                        onLike={handleLike}
                        onSave={handleSave}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-4">
                    <p className="text-center text-muted-foreground">
                      No hay restaurantes en esta categoría
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-dvh flex-col safe-top pt-4"
            >
              <SearchView onSelectRestaurant={handleRestaurantPress} />
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-dvh flex-col safe-top pt-4"
            >
              <FavoritesView onSelectRestaurant={handleRestaurantPress} />
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-dvh flex-col safe-top"
            >
              <ProfileView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Restaurant Detail Sheet */}
      <RestaurantDetail
        restaurant={selectedRestaurant}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onWriteReview={handleOpenReview}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={handleCloseReview}
        restaurantName={selectedRestaurant?.name ?? ""}
      />
    </div>
  )
}
