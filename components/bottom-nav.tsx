"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Compass, Search, Heart, User, MapPin, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  favoritesCount?: number
}

const tabs = [
  { id: "explore", icon: Home, label: "Inicio" },
  { id: "map", icon: MapPin, label: "Mapa" },
  { id: "search", icon: Search, label: "Buscar" },
  { id: "favorites", icon: Heart, label: "Favoritos" },
  { id: "profile", icon: User, label: "Perfil" },
]

export function BottomNav({ activeTab, onTabChange, favoritesCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass mx-4 mb-4 rounded-2xl">
        <div className="flex items-center justify-around px-2 py-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            const showBadge = tab.id === "favorites" && favoritesCount > 0
            
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center gap-1 px-4 py-2 touch-manipulation"
                aria-label={tab.label}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-colors duration-200",
                      isActive 
                        ? tab.id === "favorites" 
                          ? "text-red-500 fill-red-500" 
                          : "text-primary" 
                        : "text-muted-foreground"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Badge for favorites */}
                  <AnimatePresence>
                    {showBadge && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1"
                      >
                        <span className="text-[9px] font-bold text-primary-foreground">
                          {favoritesCount > 99 ? "99+" : favoritesCount}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={cn(
                        "absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                        tab.id === "favorites" && isActive ? "bg-red-500" : "bg-primary"
                      )}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    isActive 
                      ? tab.id === "favorites" 
                        ? "text-red-500" 
                        : "text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
