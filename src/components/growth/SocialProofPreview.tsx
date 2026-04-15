import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface SocialProofPreviewProps {
  template: string
  position: 'bottom-left' | 'bottom-right'
}

const MOCK_EVENTS = [
  { first_name: 'Sophie', city: 'Rouen', action: 'demander un devis' },
  { first_name: 'Marc', city: 'Paris', action: 'réserver un rendez-vous' },
  { first_name: 'Emma', city: 'Lyon', action: 'contacter l\'équipe' },
  { first_name: 'Thomas', city: 'Bordeaux', action: 'obtenir des infos' },
]

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`)
}

export function SocialProofPreview({ template, position }: SocialProofPreviewProps) {
  const [visible, setVisible] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(show)
  }, [])

  useEffect(() => {
    if (!visible) return
    const cycle = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrentIdx((i) => (i + 1) % MOCK_EVENTS.length)
        setVisible(true)
      }, 600)
    }, 3500)
    return () => clearInterval(cycle)
  }, [visible])

  const event = MOCK_EVENTS[currentIdx]
  const message = interpolate(template, {
    first_name: event.first_name,
    city: event.city,
    action: event.action,
  })

  const posClass = position === 'bottom-left' ? 'left-3 bottom-3' : 'right-3 bottom-3'

  return (
    <div className="relative bg-[var(--surface-secondary)] rounded-xl overflow-hidden border border-[var(--border-default)]" style={{ minHeight: 160 }}>
      <div className="p-3 text-xs text-[var(--text-tertiary)] border-b border-[var(--border-subtle)]">
        Aperçu — Votre site web
      </div>
      <div className="p-4 h-28 relative">
        {/* Fake website content */}
        <div className="space-y-2 opacity-30">
          <div className="h-3 bg-[var(--color-gray-300)] rounded w-3/4" />
          <div className="h-3 bg-[var(--color-gray-300)] rounded w-1/2" />
          <div className="h-3 bg-[var(--color-gray-300)] rounded w-2/3" />
        </div>

        {/* Notification */}
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ x: position === 'bottom-left' ? -200 : 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: position === 'bottom-left' ? -200 : 200, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`absolute ${posClass} max-w-52`}
            >
              <div className="flex items-start gap-2 bg-white border border-gray-200 shadow-lg rounded-xl px-3 py-2.5">
                <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">
                  {event.first_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-700 leading-snug">{message}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Il y a quelques instants</p>
                </div>
                <button className="text-gray-300 hover:text-gray-500 mt-0.5">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
