import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDeals } from '@/hooks/useDeals'
import { useContacts } from '@/hooks/useContacts'
import { DealColumn } from './DealColumn'
import { DealDetail } from './DealDetail'
import { CreateDealDialog } from './CreateDealDialog'
import { TableLoadingState } from '@/components/shared/LoadingState'
import type { Deal, DealStage } from '@/types/database'

const STAGES: DealStage[] = ['lead', 'qualified', 'meeting', 'proposal', 'negotiation', 'closed_won', 'closed_lost']

export function DealsKanban() {
  const { deals, isLoading, updateDealStage, dealsByStage, stageTotal } = useDeals()
  const { contacts } = useContacts()
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createStage, setCreateStage] = useState<DealStage>('lead')
  const [compact, setCompact] = useState(false)
  const [search, setSearch] = useState('')
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null)
  const draggingDeal = useRef<Deal | null>(null)

  const filterDeals = (stageDeals: Deal[]) => {
    if (!search) return stageDeals
    const q = search.toLowerCase()
    return stageDeals.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.contact?.full_name?.toLowerCase().includes(q) ||
        d.contact?.email?.toLowerCase().includes(q)
    )
  }

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault()
    setDragOverStage(stage)
  }

  const handleDrop = (stage: DealStage) => {
    if (draggingDeal.current && draggingDeal.current.stage !== stage) {
      updateDealStage.mutate({ id: draggingDeal.current.id, stage })
    }
    setDragOverStage(null)
    draggingDeal.current = null
  }

  const totalPipeline = deals
    .filter((d) => d.stage !== 'closed_lost')
    .reduce((sum, d) => sum + (d.value || 0), 0)

  if (isLoading) return <TableLoadingState />

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-default)] flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un deal..."
            className="pl-9 h-8 text-sm"
          />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setCompact(false)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${!compact ? 'bg-brand-50 text-brand-500' : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-secondary)]'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCompact(true)}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${compact ? 'bg-brand-50 text-brand-500' : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-secondary)]'}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
        <Button size="sm" onClick={() => { setCreateStage('lead'); setCreateOpen(true) }}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nouveau deal
        </Button>
      </div>

      {/* Pipeline summary */}
      {totalPipeline > 0 && (
        <div className="px-6 py-2 border-b border-[var(--border-default)] bg-[var(--surface-secondary)]">
          <p className="text-xs text-[var(--text-tertiary)]">
            Pipeline total :{' '}
            <span className="font-semibold text-[var(--text-primary)]">
              {totalPipeline.toLocaleString('fr-FR')} €
            </span>
            {' · '}
            <span className="font-medium">{deals.filter((d) => d.stage !== 'closed_lost' && d.stage !== 'closed_won').length} deals actifs</span>
          </p>
        </div>
      )}

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 p-4 h-full" style={{ minWidth: STAGES.length * (compact ? 200 : 240) }}>
          {STAGES.map((stage) => (
            <div key={stage} className="flex-1">
              <DealColumn
                stage={stage}
                deals={filterDeals(dealsByStage(stage))}
                total={stageTotal(stage)}
                compact={compact}
                isDragOver={dragOverStage === stage}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={() => handleDrop(stage)}
                onDragStart={(deal) => { draggingDeal.current = deal }}
                onCardClick={(deal) => setSelectedDeal(deal)}
                onAddDeal={(s) => { setCreateStage(s); setCreateOpen(true) }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-stretch justify-end"
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedDeal(null) }}
          >
            <div className="w-80 h-full bg-[var(--surface-primary)] border-l border-[var(--border-default)] shadow-xl">
              <DealDetail deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateDealDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultStage={createStage}
        contacts={contacts}
      />
    </div>
  )
}
