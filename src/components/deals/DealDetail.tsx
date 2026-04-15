import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Euro, Calendar, Tag, Trash2, Edit3, Check } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDeals } from '@/hooks/useDeals'
import type { Deal, DealStage } from '@/types/database'
import { STAGE_CONFIG } from './DealColumn'

const STAGES: DealStage[] = ['lead', 'qualified', 'meeting', 'proposal', 'negotiation', 'closed_won', 'closed_lost']

interface DealDetailProps {
  deal: Deal
  onClose: () => void
}

export function DealDetail({ deal, onClose }: DealDetailProps) {
  const { updateDeal, deleteDeal } = useDeals()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(deal.title)
  const [value, setValue] = useState(deal.value?.toString() || '')
  const [notes, setNotes] = useState(deal.notes || '')
  const [stage, setStage] = useState<DealStage>(deal.stage)

  const contact = deal.contact
  const initials = contact?.full_name
    ? contact.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const handleSave = () => {
    updateDeal.mutate({
      id: deal.id,
      title,
      value: value ? parseFloat(value) : undefined,
      notes,
      stage,
    })
    setEditing(false)
  }

  const handleDelete = () => {
    deleteDeal.mutate(deal.id)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 flex-shrink-0 bg-[var(--surface-primary)] border-l border-[var(--border-default)] flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border-default)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate pr-2">{deal.title}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditing(!editing)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:text-brand-500 hover:bg-brand-50 transition-colors"
          >
            {editing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Contact */}
        {contact && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-secondary)]">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="text-xs bg-brand-100 text-brand-700">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{contact.full_name}</p>
              <p className="text-xs text-[var(--text-tertiary)] truncate">{contact.email}</p>
            </div>
          </div>
        )}

        {/* Stage */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Étape</label>
          {editing ? (
            <Select value={stage} onValueChange={(v) => setStage(v as DealStage)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_CONFIG[s].color }} />
                      {STAGE_CONFIG[s].label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: STAGE_CONFIG[deal.stage].bg, color: STAGE_CONFIG[deal.stage].color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STAGE_CONFIG[deal.stage].color }} />
              {STAGE_CONFIG[deal.stage].label}
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Titre</label>
          {editing ? (
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 text-sm" />
          ) : (
            <p className="text-sm text-[var(--text-primary)]">{deal.title}</p>
          )}
        </div>

        {/* Value */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1">
            <Euro className="w-3 h-3" /> Valeur
          </label>
          {editing ? (
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
              className="h-8 text-sm"
            />
          ) : (
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {deal.value != null ? `${deal.value.toLocaleString('fr-FR')} €` : '—'}
            </p>
          )}
        </div>

        {/* Probability */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Probabilité</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${deal.probability}%`,
                  backgroundColor: STAGE_CONFIG[deal.stage].color,
                }}
              />
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)] w-8 text-right">{deal.probability}%</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Notes</label>
          {editing ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes sur ce deal..."
              className="text-sm min-h-[80px] resize-none"
            />
          ) : (
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
              {deal.notes || <span className="text-[var(--text-tertiary)]">Aucune note</span>}
            </p>
          )}
        </div>

        {/* Tags */}
        {deal.tags.length > 0 && (
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags
            </label>
            <div className="flex flex-wrap gap-1">
              {deal.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)] mb-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Créé le
            </label>
            <p className="text-xs text-[var(--text-tertiary)]">
              {format(new Date(deal.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
          {deal.expected_close_date && (
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-0.5 block">Clôture prévue</label>
              <p className="text-xs text-[var(--text-tertiary)]">
                {format(new Date(deal.expected_close_date), 'd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border-default)] space-y-2">
        {editing && (
          <Button onClick={handleSave} size="sm" className="w-full">
            Sauvegarder
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[var(--color-danger)] hover:bg-red-50 hover:text-red-600"
          onClick={handleDelete}
        >
          <Trash2 className="w-3.5 h-3.5 mr-2" />
          Supprimer
        </Button>
      </div>
    </motion.div>
  )
}
