"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { restaurants } from "@/lib/data"
import type { Restaurant } from "@/lib/types"

interface SearchViewProps {
  onSelectRestaurant: (restaurant: Restaurant) => void
}

const recentSearches = ["Hamburguesas", "Sushi", "Valle del Lili"]
const trending = ["Pizza", "Tacos", "Café", "Brunch"]

export function SearchView({ onSelectRestaurant }: SearchViewProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Restaurant[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (query.trim().length > 0) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const filtered = restaurants.filter(
          (r) =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.category.toLowerCase().includes(query.toLowerCase()) ||
            r.neighborhood.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
        setIsSearching(false)
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [query])

  const handleQuickSearch = (term: string) => {
    setQuery(term)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar restaurantes, categorías..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 rounded-xl border-border bg-secondary pl-12 pr-10 text-foreground placeholder:text-muted-foreground focus:ring-primary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-muted touch-manipulation"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4">
        {query.trim().length === 0 ? (
          <>
            {/* Recent Searches */}
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Búsquedas recientes
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <motion.button
                    key={term}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickSearch(term)}
                    className="rounded-full bg-secondary px-4 py-2 text-sm text-foreground touch-manipulation"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Tendencias en Cali
              </h3>
              <div className="flex flex-wrap gap-2">
                {trending.map((term) => (
                  <motion.button
                    key={term}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickSearch(term)}
                    className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary touch-manipulation"
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
                />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-3 pb-32">
                <p className="text-sm text-muted-foreground">
                  {results.length} resultado{results.length !== 1 && "s"}
                </p>
                {results.map((restaurant) => (
                  <motion.button
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectRestaurant(restaurant)}
                    className="flex w-full items-center gap-3 rounded-xl bg-secondary p-3 text-left touch-manipulation"
                  >
                    <img
                      src={restaurant.images[0]}
                      alt={restaurant.name}
                      className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {restaurant.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {restaurant.category} · {restaurant.neighborhood}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-primary">
                        <span>★</span>
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No encontramos resultados para &quot;{query}&quot;
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
