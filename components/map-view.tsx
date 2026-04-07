"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { motion } from "framer-motion"
import { Icon } from "leaflet"
import { restaurants } from "@/lib/data"
import type { Restaurant } from "@/lib/types"
import "leaflet/dist/leaflet.css"

// Fix for default markers in Next.js
import L from "leaflet"

// Custom icon for restaurants
const restaurantIcon = new Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f97316' stroke='white' stroke-width='2'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})

// Center of Cali
const CALI_CENTER: [number, number] = [3.4516, -76.532]

interface MapViewProps {
  onSelectRestaurant: (restaurant: Restaurant) => void
  filteredRestaurants?: Restaurant[]
}

// Component to recenter map when needed
function MapController({ restaurants }: { restaurants: Restaurant[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (restaurants.length > 0) {
      // Calculate bounds to fit all markers
      const validRestaurants = restaurants.filter(r => r.lat && r.lng)
      if (validRestaurants.length > 0) {
        const bounds = L.latLngBounds(validRestaurants.map(r => [r.lat, r.lng]))
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [map, restaurants])
  
  return null
}

export function MapView({ onSelectRestaurant, filteredRestaurants }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false)
  const displayRestaurants = filteredRestaurants || restaurants

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          <span className="text-sm text-muted-foreground">Cargando mapa...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={CALI_CENTER}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController restaurants={displayRestaurants} />
        
        {displayRestaurants.map((restaurant) => {
          // Skip if no coordinates
          if (!restaurant.lat || !restaurant.lng) return null
          
          return (
            <Marker
              key={restaurant.id}
              position={[restaurant.lat, restaurant.lng]}
              icon={restaurantIcon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-bold text-sm">{restaurant.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    {restaurant.category} • {restaurant.priceRange}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({restaurant.reviewCount} reseñas)
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectRestaurant(restaurant)}
                    className="w-full bg-primary text-primary-foreground text-xs py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                  >
                    Ver detalles
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Overlay info */}
      <div className="absolute top-4 left-4 right-4 z-[400] bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {displayRestaurants.length} restaurantes en el mapa
            </p>
            <p className="text-xs text-muted-foreground">
              Toca un marcador para ver detalles
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary"></span>
            <span className="text-xs text-muted-foreground">Abierto</span>
          </div>
        </div>
      </div>
    </div>
  )
}
