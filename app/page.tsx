"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BottomNav } from "@/components/bottom-nav"
import { CategoryPills } from "@/components/category-pills"
import { RestaurantCard } from "@/components/restaurant-card"
import { RestaurantDetail } from "@/components/restaurant-detail"
import { ReviewModal } from "@/components/review-modal"
import { SearchView } from "@/components/search-view"
import { FavoritesView } from "@/components/favorites-view"
import { ProfileView } from "@/components/profile-view"
import { AuthModal } from "@/components/auth-modal"
import { ToastNotification, type ToastType } from "@/components/toast-notification"
import { restaurants, categories } from "@/lib/data"
import { useUserStore } from "@/lib/store"
import type { Restaurant } from "@/lib/types"

interface ToastState {
  message: string
  type: ToastType
  isVisible: boolean
}

export default function CaliEatsApp() {
  const [activeTab, setActiveTab] = useState("explore")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    isVisible: false,
  })

  const { login, favorites, saved } = useUserStore()
  const [visibleCount, setVisibleCount] = useState(10)

  // Calculate favorite/saved counts for bottom nav badges
  const favoritesCount = favorites.length + saved.length

  const allFilteredRestaurants = activeCategory
    ? restaurants.filter((r) => {
        const category = categories.find((c) => c.id === activeCategory)
        return category && r.category === category.name
      })
    : restaurants

  // Show only visible restaurants for performance
  const visibleRestaurants = allFilteredRestaurants.slice(0, visibleCount)
  const hasMore = visibleCount < allFilteredRestaurants.length

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(10)
  }, [activeCategory])

  // Load more restaurants when scrolling
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 200
    if (bottom && hasMore) {
      setVisibleCount((prev) => Math.min(prev + 10, allFilteredRestaurants.length))
    }
  }, [hasMore, allFilteredRestaurants.length])

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }))
    }, 3000)
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

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

  const handleAuthRequired = useCallback(() => {
    setIsAuthOpen(true)
  }, [])

  const handleCloseAuth = useCallback(() => {
    setIsAuthOpen(false)
  }, [])

  const handleLogin = useCallback((user: { name: string; email: string; avatar: string }) => {
    login(user)
    showToast(`Bienvenido, ${user.name}!`, "success")
  }, [login, showToast])

  const handleLike = useCallback((isLiked: boolean) => {
    if (isLiked) {
      showToast("Agregado a favoritos", "like")
    } else {
      showToast("Eliminado de favoritos", "info")
    }
  }, [showToast])

  const handleSave = useCallback((isSaved: boolean) => {
    if (isSaved) {
      showToast("Guardado para despues", "save")
    } else {
      showToast("Eliminado de guardados", "info")
    }
  }, [showToast])

  const handleReviewSuccess = useCallback(() => {
    showToast("Resena publicada con exito!", "success")
  }, [showToast])

  const handleShowNotification = useCallback((message: string, type: "success" | "error" | "info") => {
    showToast(message, type)
  }, [showToast])

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

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
                      Descubre sabores unicos
                    </p>
                  </div>
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent cursor-pointer touch-manipulation"
                    onClick={handleAuthRequired}
                  >
                    <span className="text-lg font-bold text-primary-foreground">
                      C
                    </span>
                  </motion.div>
                </div>
              </header>

              {/* Category Pills */}
              <CategoryPills
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              {/* Restaurant Feed */}
              <div 
                className="flex-1 overflow-y-auto no-scrollbar pb-32"
                onScroll={handleScroll}
              >
                <div className="px-4 mb-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {allFilteredRestaurants.length} restaurantes disponibles
                  </p>
                  {activeCategory && (
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="text-xs font-medium text-primary touch-manipulation"
                    >
                      Ver todos
                    </button>
                  )}
                </div>
                {visibleRestaurants.length > 0 ? (
                  <>
                  {visibleRestaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index < 5 ? index * 0.05 : 0 }}
                    >
                      <RestaurantCard
                        restaurant={restaurant}
                        onPress={() => handleRestaurantPress(restaurant)}
                        onLike={handleLike}
                        onSave={handleSave}
                        onAuthRequired={handleAuthRequired}
                      />
                    </motion.div>
                  ))
                  )}
                  {/* Load more indicator */}
                  {hasMore && (
                    <div className="flex items-center justify-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent"
                      />
                    </div>
                  )}
                </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-4">
                    <p className="text-center text-muted-foreground">
                      No hay restaurantes en esta categoria
                    </p>
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="mt-4 text-sm font-medium text-primary touch-manipulation"
                    >
                      Ver todos
                    </button>
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
              <FavoritesView 
                onSelectRestaurant={handleRestaurantPress} 
                onAuthRequired={handleAuthRequired}
              />
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
              <ProfileView 
                onAuthRequired={handleAuthRequired}
                onShowNotification={handleShowNotification}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        favoritesCount={favoritesCount}
      />

      {/* Restaurant Detail Sheet */}
      <RestaurantDetail
        restaurant={selectedRestaurant}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onWriteReview={handleOpenReview}
        onAuthRequired={handleAuthRequired}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={handleCloseReview}
        restaurantName={selectedRestaurant?.name ?? ""}
        onSuccess={handleReviewSuccess}
        onAuthRequired={handleAuthRequired}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleCloseAuth}
        onLogin={handleLogin}
      />
    </div>
  )
}
