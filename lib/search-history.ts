"use client"

import { useState, useCallback, useEffect } from "react"
import { persist, createJSONStorage } from "zustand/middleware"
import { create } from "zustand"

interface SearchHistoryItem {
  id: string
  query: string
  timestamp: number
  category?: string
  resultsCount: number
}

interface SearchHistoryState {
  history: SearchHistoryItem[]
  addToHistory: (query: string, category: string | undefined, resultsCount: number) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
  getRecentSearches: (limit?: number) => SearchHistoryItem[]
  getTrendingQueries: () => string[]
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addToHistory: (query, category, resultsCount) => {
        if (!query.trim()) return

        const newItem: SearchHistoryItem = {
          id: Date.now().toString(),
          query: query.trim(),
          timestamp: Date.now(),
          category,
          resultsCount,
        }

        set((state) => {
          // Evitar duplicados consecutivos
          const filtered = state.history.filter(
            (item) => item.query.toLowerCase() !== query.toLowerCase()
          )
          // Mantener solo los últimos 50
          const newHistory = [newItem, ...filtered].slice(0, 50)
          return { history: newHistory }
        })
      },

      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }))
      },

      clearHistory: () => {
        set({ history: [] })
      },

      getRecentSearches: (limit = 10) => {
        return get().history.slice(0, limit)
      },

      getTrendingQueries: () => {
        const now = Date.now()
        const oneDay = 24 * 60 * 60 * 1000

        // Contar búsquedas en las últimas 24 horas
        const counts: Record<string, number> = {}
        get().history
          .filter((item) => now - item.timestamp < oneDay)
          .forEach((item) => {
            const query = item.query.toLowerCase()
            counts[query] = (counts[query] || 0) + 1
          })

        // Ordenar por frecuencia
        return Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([query]) => query)
      },
    }),
    {
      name: "cali-eats-search-history",
    }
  )
)
