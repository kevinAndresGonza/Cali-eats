"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useUserStore } from "@/lib/store"

export function AuthSync() {
  const { data: session, status } = useSession()
  const { login, logout, isLoggedIn } = useUserStore()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Solo hacer login si no estamos ya logueados o si cambió el usuario
      const userData = {
        name: session.user.name || "Usuario",
        email: session.user.email || "",
        avatar: session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
      }
      login(userData)
    } else if (status === "unauthenticated" && isLoggedIn) {
      // Si NextAuth dice que no hay sesión pero nuestro store dice que sí,
      // hacemos logout para sincronizar
      logout()
    }
  }, [session, status, login, logout, isLoggedIn])

  return null // Este componente no renderiza nada
}
