"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"

interface CategoryPillsProps {
  categories: Category[]
  activeCategory: string | null
  onCategoryChange: (categoryId: string | null) => void
}

export function CategoryPills({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryPillsProps) {
  return (
    <div className="relative">
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(null)}
          className={cn(
            "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            activeCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          Todos
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </div>
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}
