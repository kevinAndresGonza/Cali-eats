"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Drawer } from "vaul"
import { X, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantName: string
}

export function ReviewModal({ isOpen, onClose, restaurantName }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setRating(0)
    setComment("")
    onClose()
  }

  const displayRating = hoveredRating || rating

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-background outline-none">
          {/* Drag Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
          
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="text-xl font-bold text-foreground">Escribir reseña</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary touch-manipulation"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <p className="text-sm text-muted-foreground">
              {restaurantName}
            </p>
            
            {/* Star Rating */}
            <div className="mt-6">
              <label className="text-sm font-medium text-foreground">
                ¿Cómo calificas tu experiencia?
              </label>
              <div className="mt-3 flex justify-center gap-2">
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
                    className="touch-manipulation p-2"
                    aria-label={`${star} estrellas`}
                  >
                    <Star
                      className={cn(
                        "h-10 w-10 transition-all duration-150",
                        star <= displayRating
                          ? "fill-primary text-primary scale-110"
                          : "text-muted-foreground"
                      )}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-center text-sm text-muted-foreground"
                >
                  {rating === 1 && "Muy malo"}
                  {rating === 2 && "Malo"}
                  {rating === 3 && "Regular"}
                  {rating === 4 && "Bueno"}
                  {rating === 5 && "Excelente"}
                </motion.p>
              )}
            </div>
            
            {/* Comment */}
            <div className="mt-6">
              <label className="text-sm font-medium text-foreground">
                Cuéntanos más (opcional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con otros..."
                className="mt-2 min-h-[120px] resize-none rounded-xl border-border bg-secondary text-foreground placeholder:text-muted-foreground focus:ring-primary"
                maxLength={500}
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {comment.length}/500
              </p>
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
                    Enviando...
                  </span>
                ) : (
                  "Publicar reseña"
                )}
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
