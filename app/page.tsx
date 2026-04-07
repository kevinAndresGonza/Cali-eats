"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BottomNav } from "@/components/bottom-nav"
import { CategoryPills } from "@/components/category-pills"
import { Feed } from "@/components/feed"
import { MapView } from "@/components/map-view"
import { LocationBadge } from "@/components/location-badge"
import { FilterModal, type FilterState } from "@/components/filter-modal"
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

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [],
    minRating: 0,
    maxDistance: null,
  })

  const { login, favorites, saved } = useUserStore()

  // Calculate favorite/saved counts for bottom nav badges
  const favoritesCount = favorites.length + saved.length

  // Apply all filters (category + advanced filters)
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants

    // Filter by category
    if (activeCategory) {
      const category = categories.find((c) => c.id === activeCategory)
      if (category) {
        filtered = filtered.filter((r) => r.category === category.name)
      }
    }

    // Filter by price range
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter((r) => filters.priceRange.includes(r.priceRange))
    }

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter((r) => r.rating >= filters.minRating)
    }

    // Filter by maximum distance (would need real distance calculation with user location)
    // For now, we'll parse the distance string as a fallback
    if (filters.maxDistance !== null) {
      filtered = filtered.filter((r) => {
        const distanceStr = r.distance.replace(' km', '').replace(' m', '')
        const distance = parseFloat(distanceStr)
        const isMeters = r.distance.includes('m') && !r.distance.includes('km')
        const distanceInKm = isMeters ? distance / 1000 : distance
        return distanceInKm <= filters.maxDistance!
      })
    }

    return filtered
  }, [activeCategory, filters])

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
                    <div className="flex items-center gap-2 mt-1">
                      <LocationBadge />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-xs font-medium text-foreground"
                      >
                        <SlidersHorizontal className="h-3 w-3" />
                        Filtros
                      </motion.button>
                    </div>
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

              {/* Restaurant Feed with Infinite Scroll */}
              <Feed
                filteredRestaurants={filteredRestaurants}
                onRestaurantPress={handleRestaurantPress}
                onLike={handleLike}
                onSave={handleSave}
                onAuthRequired={handleAuthRequired}
                activeCategory={activeCategory}
              />
            </motion.div>
          )}

          {activeTab === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-dvh flex-col safe-top pt-4"
            >
              <header className="px-4 pb-2">
                <h1 className="text-2xl font-bold text-foreground">Mapa</h1>
                <p className="text-sm text-muted-foreground">
                  Ubicaciones de restaurantes
                </p>
              </header>
              <div className="flex-1 overflow-hidden rounded-t-2xl mx-4 mb-4 border">
                <MapView 
                  onSelectRestaurant={handleRestaurantPress}
                  filteredRestaurants={filteredRestaurants}
                />
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
        restaurantId={selectedRestaurant?.id ?? ""}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onClearFilters={() => setFilters({ priceRange: [], minRating: 0, maxDistance: null })}
      />
    </div>
  )
}
