"use client"

import { motion } from "framer-motion"
import { Bell, Volume2, Mail, Smartphone, Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { usePushNotifications } from "@/hooks/use-push-notifications"

interface NotificationSettingsProps {
  onClose: () => void
}

export function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
  } = usePushNotifications()

  const settings = [
    {
      id: "push",
      icon: Smartphone,
      title: "Notificaciones Push",
      description: isSupported
        ? permission === "granted"
          ? isSubscribed
            ? "Activadas"
            : "Permiso concedido, pero no suscrito"
          : "Recibe alertas en tu dispositivo"
        : "No soportado en este dispositivo",
      enabled: permission === "granted" && isSubscribed,
      onToggle: async () => {
        if (!isSupported) return
        if (isSubscribed) {
          await unsubscribe()
        } else {
          if (permission !== "granted") {
            await requestPermission()
          }
          await subscribe()
        }
      },
      disabled: !isSupported,
    },
    {
      id: "email",
      icon: Mail,
      title: "Notificaciones por Email",
      description: "Recibe resumen semanal y promociones",
      enabled: true, // TODO: Guardar en store
      onToggle: () => {},
    },
    {
      id: "sound",
      icon: Volume2,
      title: "Sonido",
      description: "Reproducir sonido al recibir notificación",
      enabled: true, // TODO: Guardar en store
      onToggle: () => {},
    },
    {
      id: "restaurant",
      icon: Bell,
      title: "Nuevos restaurantes",
      description: "Notificarme cuando hay nuevos lugares cerca",
      enabled: false, // TODO: Guardar en store
      onToggle: () => {},
    },
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Notificaciones
          </h2>
          <p className="text-xs text-muted-foreground">
            Personaliza tus alertas
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-accent/10 flex items-start gap-3">
        <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/80">
          Las notificaciones te mantendrán informado sobre nuevos restaurantes, 
          promociones especiales y actualizaciones de tus favoritos.
        </p>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {settings.map((setting, index) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background flex-shrink-0">
              <setting.icon className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-foreground">
                  {setting.title}
                </h3>
                <Switch
                  checked={setting.enabled}
                  onCheckedChange={setting.onToggle}
                  disabled={setting.disabled}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {setting.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Test Notification Button */}
      <div className="px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Cali Eats", {
                body: "¡Esta es una notificación de prueba!",
                icon: "/icon-dark-32x32.png",
              })
            } else {
              requestPermission()
            }
          }}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium touch-manipulation"
        >
          Probar notificación
        </motion.button>
      </div>
    </div>
  )
}
