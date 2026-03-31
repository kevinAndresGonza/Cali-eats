"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Drawer } from "vaul"
import {
  X,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store"
import type { Restaurant, Review } from "@/lib/types"
import { reviews as mockReviews } from "@/lib/data"

interface RestaurantDetailProps {
  restaurant: Restaurant | null
  isOpen: boolean
  onClose: () => void
  onWriteReview: () => void
  onAuthRequired: () => void
}

export function RestaurantDetail({
  restaurant,
  isOpen,
  onClose,
  onWriteReview,
  onAuthRequired,
}: RestaurantDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { isLoggedIn, isFavorite, isSaved, toggleFavorite, toggleSaved } = useUserStore()
  const [showShareSheet, setShowShareSheet] = useState(false)

  if (!restaurant) return null

  const isLiked = isFavorite(restaurant.id)
  const isSavedItem = isSaved(restaurant.id)

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === restaurant.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? restaurant.images.length - 1 : prev - 1
    )
  }

  const handleDirections = () => {
    const address = encodeURIComponent(restaurant.address + ", Cali, Colombia")
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, "_blank")
  }

  const handleCall = () => {
    window.location.href = `tel:${restaurant.phone}`
  }

  const handleShare = async () => {
    const shareData = {
      title: restaurant.name,
      text: `Mira ${restaurant.name} en Cali Eats! ${restaurant.category} en ${restaurant.neighborhood}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback - copy to clipboard
      await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`)
      setShowShareSheet(true)
      setTimeout(() => setShowShareSheet(false), 2000)
    }
  }

  const handleLike = () => {
    if (!isLoggedIn) {
      onAuthRequired()
      return
    }
    toggleFavorite(restaurant.id)
  }

  const handleSave = () => {
    if (!isLoggedIn) {
      onAuthRequired()
      return
    }
    toggleSaved(restaurant.id)
  }

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      onAuthRequired()
      return
    }
    onWriteReview()
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Drawer.Content 
          className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[95vh] flex-col rounded-t-3xl bg-background outline-none"
          aria-describedby={undefined}
        >
          <Drawer.Title className="sr-only">{restaurant.name}</Drawer.Title>
          <Drawer.Description className="sr-only">
            Informacion detallada del restaurante {restaurant.name}
          </Drawer.Description>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* Image Carousel */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={restaurant.images[currentImageIndex]}
                  alt={`${restaurant.name} - Imagen ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  crossOrigin="anonymous"
                />
              </AnimatePresence>
              
              {/* Carousel Controls */}
              {restaurant.images.length > 1 && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </motion.button>
                </>
              )}
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {restaurant.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-200",
                      index === currentImageIndex
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50"
                    )}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Close Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5 text-white" />
              </motion.button>
              
              {/* Action Buttons */}
              <div className="absolute right-4 top-4 flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleLike}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                  aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isLiked ? "fill-red-500 text-red-500" : "text-white"
                    )}
                  />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleSave}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                  aria-label={isSavedItem ? "Quitar de guardados" : "Guardar"}
                >
                  <Bookmark
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isSavedItem ? "fill-primary text-primary" : "text-white"
                    )}
                  />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleShare}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                  aria-label="Compartir"
                >
                  <Share2 className="h-5 w-5 text-white" />
                </motion.button>
              </div>

              {/* Share confirmation toast */}
              <AnimatePresence>
                {showShareSheet && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-16 left-4 right-4 rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
                  >
                    Enlace copiado al portapapeles
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Content */}
            <div className="px-4 pb-36">
              {/* Header */}
              <div className="border-b border-border py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground">
                      {restaurant.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                      <span className="text-sm">{restaurant.category}</span>
                      <span>·</span>
                      <span className="text-sm">{restaurant.priceRange}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5">
                    <Star className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
                    <span className="text-sm font-bold text-primary-foreground">
                      {restaurant.rating}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {restaurant.description}
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 border-b border-border py-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCall}
                  className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 touch-manipulation"
                >
                  <Phone className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-foreground">Llamar</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-xl bg-secondary py-3 touch-manipulation"
                >
                  <ExternalLink className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-foreground">Compartir</span>
                </motion.button>
              </div>
              
              {/* Info */}
              <div className="space-y-4 border-b border-border py-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDirections}
                  className="flex w-full items-start gap-3 text-left touch-manipulation"
                >
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {restaurant.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {restaurant.zone} - {restaurant.neighborhood}
                    </p>
                    <p className="text-xs text-primary mt-0.5">Ver en mapa</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-0.5" />
                </motion.button>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 flex-shrink-0 text-accent" />
                  <div>
                    <p className="text-sm text-foreground">{restaurant.hours}</p>
                    <p className="text-xs text-green-500">Abierto ahora</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCall}
                  className="flex w-full items-center gap-3 text-left touch-manipulation"
                >
                  <Phone className="h-5 w-5 flex-shrink-0 text-accent" />
                  <span className="text-sm text-foreground">{restaurant.phone}</span>
                </motion.button>
              </div>
              
              {/* Reviews */}
              <div className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Resenas ({restaurant.reviewCount})
                  </h3>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWriteReview}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground touch-manipulation"
                  >
                    Escribir resena
                  </motion.button>
                </div>
                
                {/* Review Cards - Chat Bubble Style */}
                <div className="space-y-4">
                  {mockReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ReviewBubble review={review} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Fixed Bottom Button */}
          <div className="fixed inset-x-0 bottom-0 glass safe-bottom">
            <div className="px-4 py-4">
              <Button
                onClick={handleDirections}
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-semibold"
                size="lg"
              >
                <Navigation className="mr-2 h-5 w-5" />
                Como llegar
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function ReviewBubble({ review }: { review: Review }) {
  return (
    <div className="flex gap-3">
      <img
        src={review.userAvatar}
        alt={review.userName}
        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
        crossOrigin="anonymous"
      />
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl rounded-tl-none bg-secondary p-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground text-sm">
              {review.userName}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < review.rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="mt-1.5 text-sm text-foreground/90 leading-relaxed">
            {review.comment}
          </p>
        </div>
        <span className="mt-1 block text-xs text-muted-foreground pl-1">
          {review.date}
        </span>
      </div>
    </div>
  )
}
