"use client"

import { useState, useRef, ChangeEvent } from "react"
import { motion } from "framer-motion"
import { Camera, User, Mail, Save, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/lib/store"

interface EditProfileProps {
  onClose: () => void
  onSuccess: () => void
}

export function EditProfile({ onClose, onSuccess }: EditProfileProps) {
  const { user, login } = useUserStore()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        setAvatar(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    
    // Simular API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Actualizar usuario en store
    login({
      ...user,
      name: name.trim(),
      email: email.trim(),
      avatar: avatar,
    })

    setIsSaving(false)
    onSuccess()
    onClose()
  }

  const hasChanges = 
    name !== user?.name || 
    email !== user?.email || 
    avatar !== user?.avatar

  const isValid = name.trim().length > 0 && email.trim().includes("@")

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary touch-manipulation"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
          <h2 className="text-xl font-bold text-foreground">Editar Perfil</h2>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || !isValid || isSaving}
          className="rounded-xl"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
            />
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer"
          >
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-primary/20">
              <img
                src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground">
              <Camera className="h-5 w-5" />
            </div>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Toca para cambiar foto
          </p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-accent" />
            Nombre
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="h-14 rounded-xl"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-accent" />
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="h-14 rounded-xl"
          />
          <p className="text-xs text-muted-foreground">
            Este email se usará para notificaciones y recuperación de cuenta
          </p>
        </div>

        {/* Preview */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-accent/10"
          >
            <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Vista previa
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                alt="Preview"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-foreground">{name || "Sin nombre"}</p>
                <p className="text-sm text-muted-foreground">{email || "Sin email"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
