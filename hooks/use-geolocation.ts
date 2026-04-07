"use client"

import { useState, useEffect, useCallback } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  loading: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: true,
  })

  const requestLocation = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocalización no está soportada en este navegador",
        loading: false,
      }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        })
      },
      (error) => {
        let errorMessage = "Error desconocido al obtener la ubicación"
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado. Por favor habilita el acceso a tu ubicación."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Información de ubicación no disponible."
            break
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado al obtener la ubicación."
            break
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      }
    )
  }, [])

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371 // Radio de la Tierra en km
      const dLat = (lat2 - lat1) * (Math.PI / 180)
      const dLon = (lon2 - lon1) * (Math.PI / 180)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    },
    []
  )

  // Formatear distancia para mostrar
  const formatDistance = useCallback((distanceKm: number): string => {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`
    }
    return `${distanceKm.toFixed(1)} km`
  }, [])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return {
    ...state,
    requestLocation,
    calculateDistance,
    formatDistance,
  }
}
