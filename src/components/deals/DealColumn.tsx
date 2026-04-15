import { AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { DealCard } from './DealCard'
import type { Deal, DealStage } from '@/types/database'
import { cn } from '@/lib/utils'

const STAGE_CONFIG: Record<DealStage, { label: string; color: string; bg: string }> = {
  lead: { label: 'Lead', color: '#748ffc', bg: 'rgba(116,143,252,0.08)' },
  qualified: { label: 'Qualifié', color: '#fab005', bg: 'rgba(250,176,5,0.08)' },
  meeting: { label: 'RDV', color: '#339af0', bg: 'rgba(51,154,240,0.08)' },
  proposal: { label: 'Proposition', color: '#9775fa', bg: 'rgba(151,117,250,0.08)' },
  negotiation: { label: 'Négociation', color: '#ff922b', bg: 'rgba(255,146,43,0.08)' },
  closed_won: { label: 'Gagné', color: '#40c057', bg: 'rgba(64,192,87,0.08)' },
  closed_lost: { label: 'Perdu', color: '#fa5252', bg: 'rgba(250,82,82,0.08)' },
}

interface DealColumnProps {
  stage: DealStage
  deals: Deal[]
  total: number
  compact: boolean
  isDragOver: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: () => void
  onDragStart: (deal: Deal) => void
  onCardClick: (deal: Deal) => void
  onAddDeal: (stage: DealStage) => void
}

export function DealColumn({
  stage,
  deals,
  total,
  compact,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onCardClick,
  onAddDeal,
}: DealColumnProps) {
  const cfg = STAGE_CONFIG[stage]

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border transition-all duration-200 min-h-[400px]',
        'bg-[var(--surface-secondary)]',
        isDragOver
          ? 'border-brand-400 bg-brand-50/30 shadow-md scale-[1.01]'
          : 'border-[var(--border-default)]'
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{ minWidth: compact ? 180 : 220 }}
    >
      {/* Column header */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: cfg.color }}
            />
            <span className="text-xs font-semibold text-[var(--text-primary)]">{cfg.label}</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: cfg.bg, color: cfg.color }}
            >
              {deals.length}
            </span>
          </div>
          <button
            onClick={() => onAddDeal(stage)}
            className="w-5 h-5 rounded-md flex items-center justify-center text-[var(--text-tertiary)] hover:text-brand-500 hover:bg-brand-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        {total > 0 && (
          <p className="text-xs font-medium text-[var(--text-tertiary)]">
            {total.toLocaleString('fr-FR')} €
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto">
        <AnimatePresence>
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              compact={compact}
              onClick={() => onCardClick(deal)}
              onDragStart={() => onDragStart(deal)}
            />
          ))}
        </AnimatePresence>
        {deals.length === 0 && (
          <div
            className={cn(
              'flex items-center justify-center h-16 rounded-lg border-2 border-dashed transition-colors',
              isDragOver ? 'border-brand-400 bg-brand-50/20' : 'border-[var(--border-default)]'
            )}
          >
            <p className="text-[11px] text-[var(--text-tertiary)]">Déposer ici</p>
          </div>
        )}
      </div>
    </div>
  )
}

export { STAGE_CONFIG }
