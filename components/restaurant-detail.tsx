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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Restaurant, Review } from "@/lib/types"
import { reviews as mockReviews } from "@/lib/data"

interface RestaurantDetailProps {
  restaurant: Restaurant | null
  isOpen: boolean
  onClose: () => void
  onWriteReview: () => void
}

export function RestaurantDetail({
  restaurant,
  isOpen,
  onClose,
  onWriteReview,
}: RestaurantDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(restaurant?.isFavorite ?? false)

  if (!restaurant) return null

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

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[95vh] flex-col rounded-t-3xl bg-background outline-none">
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
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
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
              <button
                onClick={onClose}
                className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              
              {/* Action Buttons */}
              <div className="absolute right-4 top-4 flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                  aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isLiked ? "fill-red-500 text-red-500" : "text-white"
                    )}
                  />
                </motion.button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm touch-manipulation"
                  aria-label="Compartir"
                >
                  <Share2 className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-4 pb-32">
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
              
              {/* Info */}
              <div className="space-y-4 border-b border-border py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {restaurant.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {restaurant.zone} - {restaurant.neighborhood}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 flex-shrink-0 text-accent" />
                  <p className="text-sm text-foreground">{restaurant.hours}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-accent" />
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="text-sm text-foreground"
                  >
                    {restaurant.phone}
                  </a>
                </div>
              </div>
              
              {/* Reviews */}
              <div className="py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Reseñas ({restaurant.reviewCount})
                  </h3>
                  <button
                    onClick={onWriteReview}
                    className="text-sm font-medium text-primary"
                  >
                    Escribir reseña
                  </button>
                </div>
                
                {/* Review Cards - Chat Bubble Style */}
                <div className="mt-4 space-y-4">
                  {mockReviews.map((review) => (
                    <ReviewBubble key={review.id} review={review} />
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
                Cómo llegar
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
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="mt-1.5 text-sm text-foreground/90 leading-relaxed">
            {review.comment}
          </p>
        </div>
        <span className="mt-1 block text-xs text-muted-foreground">
          {review.date}
        </span>
      </div>
    </div>
  )
}
