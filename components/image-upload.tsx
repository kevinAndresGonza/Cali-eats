"use client"

import { useState, useRef, ChangeEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, ImageIcon, Upload, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    processFiles(Array.from(files))
    
    // Reset input para permitir seleccionar los mismos archivos de nuevo
    event.target.value = ''
  }

  const processFiles = (files: File[]) => {
    const remainingSlots = maxImages - images.length
    const filesToProcess = files.slice(0, remainingSlots)

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          onImagesChange([...images, result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Fotos ({images.length}/{maxImages})
      </label>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img
                src={image}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Buttons */}
      {canAddMore && (
        <div className="flex gap-3">
          {/* Camera Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => cameraInputRef.current?.click()}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-colors touch-manipulation",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary hover:bg-secondary/80"
            )}
          >
            <Camera className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Cámara</span>
          </motion.button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Gallery Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-colors touch-manipulation",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary hover:bg-secondary/80"
            )}
          >
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Galería</span>
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Drag & Drop Hint */}
      {canAddMore && images.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          También puedes arrastrar y soltar fotos aquí
        </p>
      )}
    </div>
  )
}
