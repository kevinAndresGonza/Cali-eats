"use client"

import { motion } from "framer-motion"
import { 
  User, 
  Settings, 
  Bell, 
  MapPin, 
  Star, 
  MessageSquare,
  ChevronRight,
  LogOut,
  HelpCircle
} from "lucide-react"

const menuItems = [
  { icon: Bell, label: "Notificaciones", badge: 3 },
  { icon: MapPin, label: "Mis direcciones" },
  { icon: Star, label: "Mis reseñas", count: 12 },
  { icon: MessageSquare, label: "Soporte" },
  { icon: Settings, label: "Configuración" },
  { icon: HelpCircle, label: "Ayuda" },
]

export function ProfileView() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
              <User className="h-10 w-10 text-background" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-background bg-green-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Juan Pérez</h1>
            <p className="text-sm text-muted-foreground">juan@email.com</p>
            <p className="mt-1 text-xs text-accent">
              Miembro desde 2024
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-6 grid grid-cols-3 gap-3">
        {[
          { value: "12", label: "Reseñas" },
          { value: "5", label: "Favoritos" },
          { value: "28", label: "Visitas" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center rounded-xl bg-secondary p-4"
          >
            <span className="text-2xl font-bold text-primary">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-32">
        <div className="rounded-xl bg-secondary">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex w-full items-center gap-4 border-b border-border/50 p-4 text-left last:border-0 touch-manipulation"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="flex-1 font-medium text-foreground">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-sm text-muted-foreground">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </motion.button>
            )
          })}
        </div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex w-full items-center gap-4 rounded-xl bg-destructive/10 p-4 text-left touch-manipulation"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
            <LogOut className="h-5 w-5 text-destructive" />
          </div>
          <span className="flex-1 font-medium text-destructive">
            Cerrar sesión
          </span>
        </motion.button>

        {/* Version */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Cali Eats v1.0.0
        </p>
      </div>
    </div>
  )
}
