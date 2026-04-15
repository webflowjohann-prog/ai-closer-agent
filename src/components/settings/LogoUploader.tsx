import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface LogoUploaderProps {
  value?: string
  onChange: (url: string | undefined) => void
  label?: string
  square?: boolean
  maxKB?: number
  accept?: string
}

export function LogoUploader({
  value,
  onChange,
  label,
  square = false,
  maxKB = 500,
  accept = 'image/svg+xml,image/png',
}: LogoUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    if (file.size > maxKB * 1024) {
      toast.error(`Fichier trop lourd (max ${maxKB} KB)`)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => onChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all cursor-pointer',
          square ? 'w-20 h-20' : 'h-20',
          dragging ? 'border-brand-400 bg-brand-50/30' : 'border-[var(--border-default)] hover:border-brand-300',
          value ? 'bg-[var(--surface-secondary)]' : ''
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }}
        />
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full p-3"
            >
              <img
                src={value}
                alt="Logo"
                className={cn('object-contain', square ? 'w-full h-full' : 'max-h-12 max-w-full')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full gap-1 p-2"
            >
              <Upload className="w-5 h-5 text-[var(--text-tertiary)]" />
              {!square && <p className="text-[10px] text-[var(--text-tertiary)] text-center">SVG, PNG · max {maxKB}KB</p>}
            </motion.div>
          )}
        </AnimatePresence>
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(undefined) }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {!square && (
        <p className="text-[10px] text-[var(--text-tertiary)]">
          Glissez-déposez ou cliquez pour sélectionner
        </p>
      )}
    </div>
  )
}
