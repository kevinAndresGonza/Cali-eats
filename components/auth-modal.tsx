"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Drawer } from "vaul"
import { X, Mail, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: { name: string; email: string; avatar: string }) => void
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<"google" | "email" | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async () => {
    if (!formData.email.trim()) return
    
    setIsLoading(true)
    setLoadingType("email")
    
    // Simulate API call with visible loading
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    onLogin({
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
    })
    
    setIsLoading(false)
    setLoadingType(null)
    setFormData({ name: "", email: "", password: "" })
    onClose()
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setLoadingType("google")
    
    // Simulate Google OAuth with visible loading
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    onLogin({
      name: "Usuario Google",
      email: "usuario@gmail.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
    })
    
    setIsLoading(false)
    setLoadingType(null)
    onClose()
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" })
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
          <Drawer.Description className="sr-only">
            Formulario de autenticacion para acceder a Cali Eats
          </Drawer.Description>
          
          {/* Drag Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="text-xl font-bold text-foreground">
              {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary touch-manipulation disabled:opacity-50"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-6">
              {mode === "login"
                ? "Accede para guardar favoritos y escribir resenas"
                : "Unete a Cali Eats y descubre los mejores restaurantes"}
            </p>
            
            {/* Google Button with Loading Animation */}
            <motion.div
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-14 rounded-xl border-border bg-secondary text-foreground font-medium mb-4 relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {loadingType === "google" ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3"
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>Conectando con Google...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            
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
            
            {/* Simple Form without complex validations */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isLoading}
                        className="h-14 rounded-xl border-border bg-secondary pl-11 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
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
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                    className="h-14 rounded-xl border-border bg-secondary pl-11 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground">
                  Contrasena
                </label>
                <div className="relative mt-1.5">
                  <Input
                    type="password"
                    placeholder="Tu contrasena"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading}
                    className="h-14 rounded-xl border-border bg-secondary text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
            
            {/* Switch mode */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "No tienes cuenta?" : "Ya tienes cuenta?"}{" "}
              <button
                onClick={switchMode}
                disabled={isLoading}
                className="font-medium text-primary touch-manipulation disabled:opacity-50"
              >
                {mode === "login" ? "Registrate" : "Inicia sesion"}
              </button>
            </p>
          </div>
          
          {/* Fixed Submit Button with Loading Animation */}
          <div className="glass safe-bottom">
            <div className="px-4 py-4">
              <motion.div whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.email.trim()}
                  className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-base font-semibold disabled:opacity-50 relative overflow-hidden"
                  size="lg"
                >
                  <AnimatePresence mode="wait">
                    {loadingType === "email" ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                        />
                        <span>Iniciando sesion...</span>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {mode === "login" ? "Iniciar sesion" : "Crear cuenta"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
