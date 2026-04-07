"use client"

import { useState, useCallback, useEffect } from "react"

interface NotificationState {
  permission: NotificationPermission
  isSupported: boolean
  isSubscribed: boolean
}

export function usePushNotifications() {
  const [state, setState] = useState<NotificationState>({
    permission: "default",
    isSupported: false,
    isSubscribed: false,
  })

  // Verificar soporte y estado inicial
  useEffect(() => {
    const checkSupport = () => {
      const supported =
        typeof window !== "undefined" &&
        "Notification" in window &&
        "serviceWorker" in navigator &&
        "PushManager" in window

      if (supported) {
        setState((prev) => ({
          ...prev,
          isSupported: true,
          permission: Notification.permission,
        }))
        checkSubscription()
      }
    }

    checkSupport()
  }, [])

  // Verificar si ya está suscrito
  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setState((prev) => ({
        ...prev,
        isSubscribed: !!subscription,
      }))
    } catch (error) {
      console.error("Error checking subscription:", error)
    }
  }

  // Solicitar permiso
  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setState((prev) => ({ ...prev, permission }))
      return permission === "granted"
    } catch (error) {
      console.error("Error requesting permission:", error)
      return false
    }
  }, [state.isSupported])

  // Suscribirse a notificaciones push
  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      console.error("Push notifications not supported")
      return false
    }

    // Verificar permiso
    if (state.permission !== "granted") {
      const granted = await requestPermission()
      if (!granted) return false
    }

    try {
      const registration = await navigator.serviceWorker.ready

      // Obtener VAPID public key del servidor (deberías generar esto)
      // Por ahora simulamos la suscripción
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BEl62iTMfQ2S6xnwBESCzDzQC69E6a7Fuj0V0bXyYqPn5lKk5qweVq5qweVq5qweVq5qweVq5qweVq5qweVq5q" // Clave dummy, reemplazar con VAPID real
        ),
      })

      // Enviar suscripción al servidor
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      }).catch(() => {
        // Si el endpoint no existe, guardar en localStorage
        localStorage.setItem("push-subscription", JSON.stringify(subscription))
      })

      setState((prev) => ({ ...prev, isSubscribed: true }))
      return true
    } catch (error) {
      console.error("Error subscribing to push:", error)
      return false
    }
  }, [state.isSupported, state.permission, requestPermission])

  // Cancelar suscripción
  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        
        // Notificar al servidor
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        }).catch(() => {})

        localStorage.removeItem("push-subscription")
      }

      setState((prev) => ({ ...prev, isSubscribed: false }))
      return true
    } catch (error) {
      console.error("Error unsubscribing:", error)
      return false
    }
  }, [])

  // Enviar notificación local (para testing)
  const sendLocalNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (state.permission === "granted") {
        new Notification(title, {
          icon: "/icon-dark-32x32.png",
          badge: "/icon-dark-32x32.png",
          ...options,
        })
      }
    },
    [state.permission]
  )

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendLocalNotification,
  }
}

// Helper para convertir VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
