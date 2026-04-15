import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle, Bot, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DealTimeline } from './DealTimeline'
import type { DealWithAttribution } from '@/types/database'
import { formatDate } from '@/lib/utils'

interface AttributionTableProps {
  deals: DealWithAttribution[]
}

const channelColors: Record<string, string> = {
  whatsapp: 'bg-green-100 text-green-700',
  instagram: 'bg-pink-100 text-pink-700',
  webchat: 'bg-blue-100 text-blue-700',
  sms: 'bg-yellow-100 text-yellow-700',
  messenger: 'bg-purple-100 text-purple-700',
}

const stageLabel: Record<string, string> = {
  lead: 'Lead',
  qualified: 'Qualifié',
  meeting: 'RDV',
  proposal: 'Proposition',
  negotiation: 'Négociation',
  closed_won: 'Gagné',
  closed_lost: 'Perdu',
}

export function AttributionTable({ deals }: AttributionTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const closed = deals.filter((d) => d.stage === 'closed_won')

  if (closed.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Deals closés</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-tertiary)] text-center py-8">
            Aucun deal gagné sur la période sélectionnée
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals closés — Attribution bot</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--surface-secondary)]">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Deal</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider hidden sm:table-cell">Contact</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Canal</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Valeur</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider hidden md:table-cell">
                  <div className="flex items-center justify-end gap-1"><Bot className="w-3 h-3" /> Msgs bot</div>
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider hidden md:table-cell">Durée</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {closed.map((deal) => {
                const isExpanded = expandedId === deal.id
                const daysToClose = deal.won_at && deal.created_at
                  ? Math.round((new Date(deal.won_at).getTime() - new Date(deal.created_at).getTime()) / 86400000)
                  : null

                return (
                  <>
                    <motion.tr
                      key={deal.id}
                      className="border-b border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)] cursor-pointer transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : deal.id)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--text-primary)] text-xs leading-tight">{deal.title}</p>
                        <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{formatDate(deal.created_at)}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-xs text-[var(--text-secondary)]">{deal.contact?.full_name || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${channelColors[deal.attribution_channel || 'webchat'] || 'bg-gray-100 text-gray-700'}`}>
                          {deal.attribution_channel || 'webchat'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-[var(--text-primary)] text-xs">
                        {(deal.value || 0).toLocaleString('fr-FR')} €
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <div className="flex items-center justify-end gap-1 text-xs text-[var(--text-secondary)]">
                          <Bot className="w-3 h-3 text-brand-400" />
                          {deal.bot_messages_before_human || 0}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span className="text-xs text-[var(--text-secondary)]">{daysToClose != null ? `${daysToClose}j` : '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-tertiary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          key={`${deal.id}-expand`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <td colSpan={7} className="px-6 py-4 bg-[var(--surface-secondary)] border-b border-[var(--border-default)]">
                            <DealTimeline deal={deal} />
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
