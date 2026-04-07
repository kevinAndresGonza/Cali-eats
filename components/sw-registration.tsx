"use client"

import { useEffect, useState } from "react"

export function ServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const registerSW = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js")
          console.log("Service Worker registered:", registration)
          setIsRegistered(true)

          // Opcional: Escuchar actualizaciones
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // Nueva versión disponible
                  console.log("New version available, reload to update")
                }
              })
            }
          })
        } catch (error) {
          console.error("Service Worker registration failed:", error)
        }
      }
    }

    registerSW()
  }, [])

  return null
}
