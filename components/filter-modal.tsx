"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, SlidersHorizontal, Star, DollarSign, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterState {
  priceRange: string[]
  minRating: number
  maxDistance: number | null
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onApplyFilters: (filters: FilterState) => void
  onClearFilters: () => void
}

const priceOptions = [
  { value: "$", label: "Económico ($)" },
  { value: "$$", label: "Moderado ($$)" },
  { value: "$$$", label: "Caro ($$$)" },
  { value: "$$$$", label: "Muy caro ($$$$)" },
]

const ratingOptions = [
  { value: 0, label: "Cualquier calificación" },
  { value: 3, label: "3+ estrellas" },
  { value: 4, label: "4+ estrellas" },
  { value: 4.5, label: "4.5+ estrellas" },
]

const distanceOptions = [
  { value: null, label: "Cualquier distancia" },
  { value: 1, label: "Menos de 1 km" },
  { value: 3, label: "Menos de 3 km" },
  { value: 5, label: "Menos de 5 km" },
  { value: 10, label: "Menos de 10 km" },
]

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  const togglePrice = (price: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange.includes(price)
        ? prev.priceRange.filter((p) => p !== price)
        : [...prev.priceRange, price],
    }))
  }

  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  const handleClear = () => {
    const cleared: FilterState = {
      priceRange: [],
      minRating: 0,
      maxDistance: null,
    }
    setLocalFilters(cleared)
    onClearFilters()
  }

  const hasActiveFilters =
    localFilters.priceRange.length > 0 ||
    localFilters.minRating > 0 ||
    localFilters.maxDistance !== null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-background max-h-[90vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Filtros
                  </h2>
                  {hasActiveFilters && (
                    <p className="text-xs text-primary">
                      Filtros activos
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary touch-manipulation"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>

            <div className="px-4 pb-4 space-y-6">
              {/* Price Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <h3 className="font-medium text-foreground">Rango de precio</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {priceOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => togglePrice(option.value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        localFilters.priceRange.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-accent" />
                  <h3 className="font-medium text-foreground">Calificación mínima</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ratingOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minRating: option.value as number,
                        }))
                      }
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                        localFilters.minRating === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      {option.value > 0 && (
                        <Star className="h-3.5 w-3.5 fill-current" />
                      )}
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-accent" />
                  <h3 className="font-medium text-foreground">Distancia máxima</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {distanceOptions.map((option) => (
                    <motion.button
                      key={String(option.value)}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          maxDistance: option.value as number | null,
                        }))
                      }
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        localFilters.maxDistance === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={!hasActiveFilters}
                  className="flex-1 h-12 rounded-xl"
                >
                  Limpiar
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
                >
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export type { FilterState }
