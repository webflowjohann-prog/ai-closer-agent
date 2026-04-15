import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Pause, BarChart2, List, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignStats } from '@/components/campaigns/CampaignStats'
import { SequenceEditor } from '@/components/campaigns/SequenceEditor'
import { ABResults } from '@/components/campaigns/ABResults'
import { useCampaignDetail } from '@/hooks/useCampaigns'
import { useCampaigns } from '@/hooks/useCampaigns'
import { PageLoadingState } from '@/components/shared/LoadingState'

const STATUS_CONFIG = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  paused: { label: 'En pause', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Terminée', color: 'bg-blue-100 text-blue-700' },
  archived: { label: 'Archivée', color: 'bg-gray-50 text-gray-400' },
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { campaign, sequences, isLoading, saveSequences } = useCampaignDetail(id!)
  const { updateStatus } = useCampaigns()

  if (isLoading) return <PageLoadingState />
  if (!campaign) return null

  const statusCfg = STATUS_CONFIG[campaign.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-6 space-y-6 max-w-4xl"
    >
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate(-1)} className="mt-0.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">{campaign.name}</h1>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
          {campaign.description && (
            <p className="text-sm text-[var(--text-tertiary)]">{campaign.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === 'active' ? (
            <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: campaign.id, status: 'paused' })}>
              <Pause className="w-3.5 h-3.5 mr-1.5" /> Pause
            </Button>
          ) : campaign.status !== 'completed' && campaign.status !== 'archived' ? (
            <Button size="sm" onClick={() => updateStatus.mutate({ id: campaign.id, status: 'active' })}>
              <Play className="w-3.5 h-3.5 mr-1.5" /> Lancer
            </Button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats" className="text-xs gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" /> Statistiques
          </TabsTrigger>
          <TabsTrigger value="sequences" className="text-xs gap-1.5">
            <List className="w-3.5 h-3.5" /> Séquences
          </TabsTrigger>
          <TabsTrigger value="ab" className="text-xs gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" /> A/B Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-4">
          <CampaignStats campaign={campaign} />
        </TabsContent>

        <TabsContent value="sequences" className="mt-4 space-y-4">
          <SequenceEditor
            initial={sequences}
            onChange={() => {}}
          />
          <Button size="sm" onClick={() => saveSequences.mutate(sequences)} disabled={saveSequences.isPending}>
            {saveSequences.isPending ? 'Sauvegarde...' : 'Sauvegarder les séquences'}
          </Button>
        </TabsContent>

        <TabsContent value="ab" className="mt-4 space-y-3">
          {sequences.filter((s) => s.template_b).length === 0 ? (
            <div className="text-center py-8 text-[var(--text-tertiary)] text-sm">
              Aucune séquence avec A/B testing activé.
            </div>
          ) : (
            sequences.filter((s) => s.template_b).map((s) => (
              <ABResults key={s.id} sequence={s} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
