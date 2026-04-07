"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Drawer } from "vaul"
import { X, Star, Camera, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useUserStore } from "@/lib/store"
import { ImageUpload } from "./image-upload"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantId: string
  restaurantName: string
  onSuccess: () => void
  onAuthRequired: () => void
}

export function ReviewModal({ 
  isOpen, 
  onClose, 
  restaurantId,
  restaurantName,
  onSuccess,
  onAuthRequired
}: ReviewModalProps) {
  const { isLoggedIn, user, addReview } = useUserStore()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      onAuthRequired()
      return
    }
    
    if (rating === 0) return
    
    setIsSubmitting(true)
    
    // Save review to store
    addReview({
      restaurantId,
      rating,
      comment,
    })
    
    // Simulate API call delay for UX
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setRating(0)
    setComment("")
    setSelectedImages([])
    onSuccess()
    onClose()
  }

  const displayRating = hoveredRating || rating

  const ratingLabels = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"]

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Drawer.Content 
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-background outline-none max-h-[90vh]"
          aria-describedby={undefined}
        >
          <Drawer.Title className="sr-only">Escribir resena para {restaurantName}</Drawer.Title>
          {/* Drag Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
          
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="text-xl font-bold text-foreground">Escribir resena</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary touch-manipulation"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {/* Restaurant info */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-secondary">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{restaurantName}</p>
                <p className="text-xs text-muted-foreground">
                  {isLoggedIn ? `Publicando como ${user?.name}` : "Inicia sesion para publicar"}
                </p>
              </div>
            </div>
            
            {/* Star Rating */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground">
                Como calificas tu experiencia?
              </label>
              <div className="mt-4 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileTap={{ scale: 0.85 }}
                    onTouchStart={() => setHoveredRating(star)}
                    onTouchEnd={() => {
                      setRating(star)
                      setHoveredRating(0)
                    }}
                    onClick={() => setRating(star)}
                    className="touch-manipulation p-1.5"
                    aria-label={`${star} estrellas`}
                  >
                    <motion.div
                      animate={{ 
                        scale: star <= displayRating ? 1.1 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Star
                        className={cn(
                          "h-11 w-11 transition-colors duration-150",
                          star <= displayRating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </motion.div>
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {rating > 0 && (
                  <motion.p
                    key={rating}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-3 text-center text-sm font-medium text-primary"
                  >
                    {ratingLabels[rating]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            
            {/* Comment */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground">
                Cuentanos mas (opcional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con otros usuarios..."
                className="mt-2 min-h-[100px] resize-none rounded-xl border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-primary"
                maxLength={500}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {comment.length}/500
              </p>
            </div>

            {/* Add photos */}
            <div className="mb-6">
              <ImageUpload
                images={selectedImages}
                onImagesChange={setSelectedImages}
                maxImages={5}
              />
            </div>
          </div>
          
          {/* Fixed Submit Button - Above keyboard */}
          <div className="glass safe-bottom">
            <div className="px-4 py-4">
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-semibold disabled:opacity-50"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                    />
                    Publicando...
                  </span>
                ) : (
                  "Publicar resena"
                )}
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
