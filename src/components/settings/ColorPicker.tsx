import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const PRESETS = [
  { name: 'Bleu', value: '#5c7cfa' },
  { name: 'Violet', value: '#9775fa' },
  { name: 'Vert', value: '#40c057' },
  { name: 'Rouge', value: '#fa5252' },
  { name: 'Orange', value: '#ff922b' },
  { name: 'Rose', value: '#f06595' },
  { name: 'Teal', value: '#20c997' },
  { name: 'Indigo', value: '#4263eb' },
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [custom, setCustom] = useState(value)

  const handleCustom = (hex: string) => {
    setCustom(hex)
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) onChange(hex)
  }

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs">{label}</Label>}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PRESETS.map((p) => (
          <motion.button
            key={p.value}
            type="button"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { onChange(p.value); setCustom(p.value) }}
            title={p.name}
            className={cn(
              'w-7 h-7 rounded-lg border-2 transition-all',
              value === p.value ? 'border-[var(--text-primary)] scale-110 shadow-md' : 'border-transparent hover:border-[var(--color-gray-300)]'
            )}
            style={{ backgroundColor: p.value }}
          />
        ))}
        {/* Custom color */}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => { onChange(e.target.value); setCustom(e.target.value) }}
            className="w-7 h-7 rounded-lg cursor-pointer border-2 border-[var(--border-default)] bg-transparent p-0.5"
            title="Couleur personnalisée"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md border border-[var(--border-default)]" style={{ backgroundColor: value }} />
        <Input
          value={custom}
          onChange={(e) => handleCustom(e.target.value)}
          placeholder="#5c7cfa"
          className="h-7 w-28 font-mono text-xs"
          maxLength={7}
        />
      </div>
    </div>
  )
}
