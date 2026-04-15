import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Play, Pause, Archive, Trash2, MoreHorizontal, MessageSquare, Instagram, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCampaigns } from '@/hooks/useCampaigns'
import type { Campaign } from '@/types/database'

const STATUS_CONFIG = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  paused: { label: 'En pause', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Terminée', color: 'bg-blue-100 text-blue-700' },
  archived: { label: 'Archivée', color: 'bg-gray-50 text-gray-400' },
}

const CHANNEL_ICONS = {
  whatsapp: <MessageSquare className="w-3.5 h-3.5" />,
  instagram: <Instagram className="w-3.5 h-3.5" />,
  messenger: <MessageSquare className="w-3.5 h-3.5" />,
  sms: <Phone className="w-3.5 h-3.5" />,
  webchat: <MessageSquare className="w-3.5 h-3.5" />,
}

interface CampaignCardProps {
  campaign: Campaign
  onClick: () => void
}

export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
  const { updateStatus, deleteCampaign } = useCampaigns()
  const statusCfg = STATUS_CONFIG[campaign.status]

  const replyRate = campaign.sent_count > 0
    ? Math.round((campaign.replied_count / campaign.sent_count) * 100)
    : 0
  const bookRate = campaign.sent_count > 0
    ? Math.round((campaign.booked_count / campaign.sent_count) * 100)
    : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
      className="bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-xl p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
              {CHANNEL_ICONS[campaign.channel_type]}
              {campaign.channel_type}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">{campaign.name}</h3>
          {campaign.description && (
            <p className="text-xs text-[var(--text-tertiary)] truncate mt-0.5">{campaign.description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--surface-secondary)] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {campaign.status === 'draft' && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: campaign.id, status: 'active' }) }}>
                <Play className="w-3.5 h-3.5 mr-2" /> Lancer
              </DropdownMenuItem>
            )}
            {campaign.status === 'active' && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: campaign.id, status: 'paused' }) }}>
                <Pause className="w-3.5 h-3.5 mr-2" /> Mettre en pause
              </DropdownMenuItem>
            )}
            {campaign.status === 'paused' && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: campaign.id, status: 'active' }) }}>
                <Play className="w-3.5 h-3.5 mr-2" /> Reprendre
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: campaign.id, status: 'archived' }) }}>
              <Archive className="w-3.5 h-3.5 mr-2" /> Archiver
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={(e) => { e.stopPropagation(); deleteCampaign.mutate(campaign.id) }}
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mini funnel */}
      <div className="mt-3">
        <div className="flex items-center gap-0.5 h-1.5 rounded-full overflow-hidden bg-[var(--surface-secondary)]">
          {campaign.total_contacts > 0 && (
            <>
              <div
                className="h-full bg-brand-400 rounded-full transition-all"
                style={{ width: `${(campaign.sent_count / campaign.total_contacts) * 100}%` }}
              />
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--text-tertiary)]">
          <span><span className="font-semibold text-[var(--text-primary)]">{campaign.total_contacts}</span> contacts</span>
          <span><span className="font-semibold text-[var(--text-primary)]">{campaign.sent_count}</span> envoyés</span>
          <span className="text-green-600"><span className="font-semibold">{replyRate}%</span> réponses</span>
          <span className="text-brand-500"><span className="font-semibold">{bookRate}%</span> RDV</span>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-[var(--text-tertiary)]">
        Créée {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true, locale: fr })}
      </div>
    </motion.div>
  )
}
