"use client"

import { motion } from "framer-motion"
import { MapPin, Crosshair, AlertCircle } from "lucide-react"
import { useGeolocation } from "@/hooks/use-geolocation"
import { cn } from "@/lib/utils"

interface LocationBadgeProps {
  variant?: "compact" | "full"
  className?: string
}

export function LocationBadge({ variant = "compact", className }: LocationBadgeProps) {
  const { latitude, longitude, accuracy, error, loading, requestLocation } = useGeolocation()

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
        />
        <span className="text-xs">Obteniendo ubicación...</span>
      </div>
    )
  }

  if (error) {
    return (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={requestLocation}
        className={cn(
          "flex items-center gap-2 text-destructive",
          className
        )}
      >
        <AlertCircle className="h-4 w-4" />
        <span className="text-xs">Ubicación no disponible</span>
      </motion.button>
    )
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 text-accent", className)}>
        <MapPin className="h-4 w-4" />
        <span className="text-xs font-medium">
          {latitude && longitude
            ? `Ubicación detectada${accuracy ? ` (±${Math.round(accuracy)}m)` : ""}`
            : "Ubicación no disponible"}
        </span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl bg-accent/10 p-3",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
          <Crosshair className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">Tu ubicación</p>
          {latitude && longitude && (
            <>
              <p className="text-xs text-muted-foreground mt-0.5">
                Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
              </p>
              {accuracy && (
                <p className="text-xs text-muted-foreground">
                  Precisión: ±{Math.round(accuracy)} metros
                </p>
              )}
            </>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={requestLocation}
          className="p-2 rounded-full bg-accent/20 touch-manipulation"
          aria-label="Actualizar ubicación"
        >
          <MapPin className="h-4 w-4 text-accent" />
        </motion.button>
      </div>
    </motion.div>
  )
}
