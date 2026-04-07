"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Drawer } from "vaul"
import { X, Mail, Eye, EyeOff, User } from "lucide-react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: { name: string; email: string; avatar: string }) => void
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (mode === "register" && !formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    onLogin({
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
    })
    
    setIsLoading(false)
    setFormData({ name: "", email: "", password: "" })
    onClose()
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    try {
      await signIn("google", { 
        callbackUrl: "/",
        redirect: false 
      })
      // NextAuth manejará el redirect, cerramos el modal
      onClose()
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" })
    setErrors({})
  }

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login")
    resetForm()
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Drawer.Content 
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-background outline-none"
          aria-describedby={undefined}
        >
          <Drawer.Title className="sr-only">
            {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
          </Drawer.Title>
          {/* Drag Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
          
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="text-xl font-bold text-foreground">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary touch-manipulation"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-6">
              {mode === "login"
                ? "Accede a tu cuenta para guardar favoritos y escribir reseñas"
                : "Únete a Cali Eats y descubre los mejores restaurantes"}
            </p>
            
            {/* Google Button */}
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-14 rounded-xl border-border bg-secondary text-foreground font-medium mb-4"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  o con email
                </span>
              </div>
            </div>
            
            {/* Form */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="text-sm font-medium text-foreground">
                      Nombre
                    </label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={cn(
                          "h-14 rounded-xl border-border bg-secondary pl-11 text-foreground placeholder:text-muted-foreground",
                          errors.name && "border-destructive"
                        )}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div>
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={cn(
                      "h-14 rounded-xl border-border bg-secondary pl-11 text-foreground placeholder:text-muted-foreground",
                      errors.email && "border-destructive"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <div className="relative mt-1.5">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={cn(
                      "h-14 rounded-xl border-border bg-secondary pr-11 text-foreground placeholder:text-muted-foreground",
                      errors.password && "border-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 touch-manipulation"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password}</p>
                )}
              </div>
            </div>
            
            {/* Switch mode */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
              <button
                onClick={switchMode}
                className="font-medium text-primary touch-manipulation"
              >
                {mode === "login" ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          </div>
          
          {/* Fixed Submit Button */}
          <div className="glass safe-bottom">
            <div className="px-4 py-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-semibold disabled:opacity-50"
                size="lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                    />
                    Procesando...
                  </span>
                ) : mode === "login" ? (
                  "Iniciar sesión"
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
