import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Euro, Calendar, GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Deal } from '@/types/database'

interface DealCardProps {
  deal: Deal
  compact?: boolean
  onClick: () => void
  onDragStart: () => void
}

export function DealCard({ deal, compact = false, onClick, onDragStart }: DealCardProps) {
  const contact = deal.contact
  const initials = contact?.full_name
    ? contact.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ scale: 1.01, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
      draggable
      onDragStart={(e) => {
        e.stopPropagation()
        onDragStart()
      }}
      onClick={onClick}
      className="bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-xl p-3 cursor-pointer select-none group"
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 opacity-0 group-hover:opacity-40 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate leading-tight">{deal.title}</p>
          {!compact && contact && (
            <div className="flex items-center gap-1.5 mt-1">
              <Avatar className="w-4 h-4">
                <AvatarFallback className="text-[8px] bg-brand-100 text-brand-700">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-[var(--text-tertiary)] truncate">{contact.full_name || contact.email}</span>
            </div>
          )}
          {!compact && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {deal.value != null && (
                <span className="flex items-center gap-0.5 text-xs font-semibold text-[var(--text-primary)]">
                  <Euro className="w-3 h-3" />
                  {deal.value.toLocaleString('fr-FR')}
                </span>
              )}
              <span className="flex items-center gap-0.5 text-xs text-[var(--text-tertiary)]">
                <Calendar className="w-3 h-3" />
                {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true, locale: fr })}
              </span>
            </div>
          )}
          {!compact && deal.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {deal.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
              {deal.tags.length > 2 && (
                <span className="text-[10px] text-[var(--text-tertiary)]">+{deal.tags.length - 2}</span>
              )}
            </div>
          )}
          {compact && deal.value != null && (
            <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">
              {deal.value.toLocaleString('fr-FR')} €
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
