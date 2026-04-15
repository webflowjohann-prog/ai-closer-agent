import { motion } from 'framer-motion'
import { Plus, Megaphone } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { CampaignCard } from './CampaignCard'
import { CampaignBuilder } from './CampaignBuilder'
import { useCampaigns } from '@/hooks/useCampaigns'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableLoadingState } from '@/components/shared/LoadingState'

const STATUS_FILTERS = ['Toutes', 'draft', 'active', 'paused', 'completed', 'archived']
const STATUS_LABELS: Record<string, string> = {
  Toutes: 'Toutes',
  draft: 'Brouillons',
  active: 'Actives',
  paused: 'En pause',
  completed: 'Terminées',
  archived: 'Archivées',
}

export function CampaignList() {
  const { campaigns, isLoading } = useCampaigns()
  const navigate = useNavigate()
  const [builderOpen, setBuilderOpen] = useState(false)
  const [filter, setFilter] = useState('Toutes')
  const [search, setSearch] = useState('')

  const filtered = campaigns.filter((c) => {
    if (filter !== 'Toutes' && c.status !== filter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (isLoading) return <TableLoadingState />

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="pl-9 h-8 text-sm" />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f ? 'bg-brand-500 text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]'
              }`}
            >
              {STATUS_LABELS[f]}
            </button>
          ))}
        </div>
        <Button size="sm" className="ml-auto" onClick={() => setBuilderOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nouvelle campagne
        </Button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-8 h-8" />}
          title="Aucune campagne"
          description="Créez votre première campagne outbound pour contacter vos prospects en masse."
          action={
            <Button size="sm" onClick={() => setBuilderOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Créer une campagne
            </Button>
          }
        />
      ) : (
        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} onClick={() => navigate(`/app/campaigns/${c.id}`)} />
          ))}
        </motion.div>
      )}

      <CampaignBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} />
    </div>
  )
}
