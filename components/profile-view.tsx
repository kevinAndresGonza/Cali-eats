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
  HelpCircle,
  Heart,
  Bookmark,
  Edit3
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useUserStore } from "@/lib/store"

interface ProfileViewProps {
  onAuthRequired: () => void
  onShowNotification: (message: string, type: "success" | "error" | "info") => void
}

const menuItems = [
  { icon: Bell, label: "Notificaciones", badge: 3 },
  { icon: MapPin, label: "Mis direcciones" },
  { icon: Star, label: "Mis resenas", count: 12 },
  { icon: MessageSquare, label: "Soporte" },
  { icon: Settings, label: "Configuracion" },
  { icon: HelpCircle, label: "Ayuda" },
]

export function ProfileView({ onAuthRequired, onShowNotification }: ProfileViewProps) {
  const { user, isLoggedIn, logout, favorites, saved } = useUserStore()

  const handleLogout = async () => {
    // Logout from both NextAuth and Zustand store
    await signOut({ redirect: false })
    logout()
    onShowNotification("Has cerrado sesion correctamente", "success")
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <User className="h-12 w-12 text-background" />
          </div>
          <h3 className="text-xl font-bold text-foreground text-center">
            Bienvenido a Cali Eats
          </h3>
          <p className="mt-2 text-center text-sm text-muted-foreground max-w-xs">
            Inicia sesion para guardar favoritos, escribir resenas y mas
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onAuthRequired}
            className="mt-6 h-14 px-10 rounded-xl bg-primary text-primary-foreground font-semibold text-base touch-manipulation"
          >
            Iniciar sesion
          </motion.button>
          <button
            onClick={onAuthRequired}
            className="mt-3 text-sm text-muted-foreground touch-manipulation"
          >
            Crear cuenta nueva
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover border-2 border-primary"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <User className="h-10 w-10 text-background" />
              </div>
            )}
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary touch-manipulation">
              <Edit3 className="h-3.5 w-3.5 text-primary-foreground" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="mt-1 text-xs text-accent">
              Miembro desde 2024
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-6 grid grid-cols-3 gap-3">
        {[
          { value: "12", label: "Resenas", icon: Star },
          { value: String(favorites.length), label: "Favoritos", icon: Heart },
          { value: String(saved.length), label: "Guardados", icon: Bookmark },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center rounded-xl bg-secondary p-4"
            >
              <Icon className="h-5 w-5 text-primary mb-1" />
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </motion.div>
          )
        })}
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
                whileTap={{ scale: 0.98 }}
                onClick={() => onShowNotification(`${item.label} - Proximamente`, "info")}
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
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-4 rounded-xl bg-destructive/10 p-4 text-left touch-manipulation"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
            <LogOut className="h-5 w-5 text-destructive" />
          </div>
          <span className="flex-1 font-medium text-destructive">
            Cerrar sesion
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
