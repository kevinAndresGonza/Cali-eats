"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Drawer } from "vaul"
import { X, Mail, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = "email" | "verify" | "success"

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendCode = async () => {
    if (!email.includes("@")) {
      setError("Ingresa un email válido")
      return
    }

    setIsLoading(true)
    setError("")

    // Simular envío de código
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // En producción: llamar a API para enviar email
    console.log(`Código enviado a ${email}: 123456`) // Simulación

    setIsLoading(false)
    setStep("verify")
  }

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setError("Ingresa el código de 6 dígitos")
      return
    }

    setIsLoading(true)
    setError("")

    // Simular verificación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (code === "123456") {
      setStep("success")
    } else {
      setError("Código incorrecto. Intenta con 123456 (demo)")
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    onClose()
    // Reset después de cerrar
    setTimeout(() => {
      setStep("email")
      setEmail("")
      setCode("")
      setError("")
    }, 300)
  }

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <>
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-foreground text-center mb-2">
              ¿Olvidaste tu contraseña?
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Ingresa tu email y te enviaremos un código para recuperar tu cuenta
            </p>

            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "h-14 rounded-xl",
                    error && "border-destructive"
                  )}
                />
                {error && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                onClick={handleSendCode}
                disabled={isLoading || !email}
                className="w-full h-14 rounded-xl"
              >
                {isLoading ? "Enviando..." : "Enviar código"}
              </Button>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo: Usa cualquier email y el código será 123456
            </p>
          </>
        )

      case "verify":
        return (
          <>
            <button
              onClick={() => setStep("email")}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-4 touch-manipulation"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              Verifica tu email
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Hemos enviado un código de 6 dígitos a {email}
            </p>

            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={cn(
                    "h-14 rounded-xl text-center text-2xl tracking-widest",
                    error && "border-destructive"
                  )}
                />
                {error && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </div>

              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
                className="w-full h-14 rounded-xl"
              >
                {isLoading ? "Verificando..." : "Verificar código"}
              </Button>

              <button
                onClick={() => setStep("email")}
                className="w-full text-center text-sm text-muted-foreground py-2 touch-manipulation"
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>
          </>
        )

      case "success":
        return (
          <>
            <div className="flex items-center justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <Check className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground text-center mb-2">
              ¡Código verificado!
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Tu contraseña ha sido restablecida. Te hemos enviado una nueva contraseña temporal a tu email.
            </p>

            <Button
              onClick={handleClose}
              className="w-full h-14 rounded-xl"
            >
              Entendido
            </Button>
          </>
        )
    }
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl bg-background outline-none"
          aria-describedby={undefined}
        >
          <Drawer.Title className="sr-only">Recuperar contraseña</Drawer.Title>
          
          {/* Handle */}
          <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="text-xl font-bold text-foreground">
              Recuperar contraseña
            </h2>
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary touch-manipulation"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
