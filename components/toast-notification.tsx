"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Heart, Bookmark, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "like" | "save" | "info"

interface ToastNotificationProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
}

const icons = {
  success: Check,
  error: X,
  like: Heart,
  save: Bookmark,
  info: AlertCircle,
}

const iconColors = {
  success: "text-green-500 bg-green-500/20",
  error: "text-red-500 bg-red-500/20",
  like: "text-red-500 bg-red-500/20 fill-red-500",
  save: "text-primary bg-primary/20 fill-primary",
  info: "text-accent bg-accent/20",
}

export function ToastNotification({
  message,
  type,
  isVisible,
  onClose,
}: ToastNotificationProps) {
  const Icon = icons[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed left-4 right-4 top-12 z-[100] safe-top"
        >
          <div className="mx-auto max-w-sm overflow-hidden rounded-2xl glass border border-border/50 shadow-xl">
            <div className="flex items-center gap-3 p-4">
              <div
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                  iconColors[type]
                )}
              >
                <Icon className={cn("h-5 w-5", type === "like" || type === "save" ? "fill-current" : "")} />
              </div>
              <p className="flex-1 text-sm font-medium text-foreground">
                {message}
              </p>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary touch-manipulation"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
