import { MessageCircle, Bot, Calendar, Star, FileText, Handshake } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { DealWithAttribution } from '@/types/database'

interface TimelineEvent {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  date: string
  color: string
}

interface DealTimelineProps {
  deal: DealWithAttribution
}

export function DealTimeline({ deal }: DealTimelineProps) {
  const events: TimelineEvent[] = []

  if (deal.created_at) {
    events.push({
      icon: MessageCircle,
      label: '1er contact',
      description: `Via ${deal.attribution_channel || 'webchat'} — Bot initié la conversation`,
      date: deal.created_at,
      color: 'bg-brand-500',
    })
  }

  if (deal.bot_messages_before_human && deal.bot_messages_before_human > 0) {
    events.push({
      icon: Bot,
      label: 'Qualification IA',
      description: `${deal.bot_messages_before_human} messages échangés avec le bot avant prise en main humaine`,
      date: new Date(new Date(deal.created_at).getTime() + 2 * 86400000).toISOString(),
      color: 'bg-purple-500',
    })
  }

  if (deal.stage !== 'lead' && deal.stage !== 'qualified') {
    events.push({
      icon: Calendar,
      label: 'RDV planifié',
      description: 'Rendez-vous pris suite à la qualification du bot',
      date: new Date(new Date(deal.created_at).getTime() + 5 * 86400000).toISOString(),
      color: 'bg-blue-500',
    })
  }

  if (['proposal', 'negotiation', 'closed_won'].includes(deal.stage)) {
    events.push({
      icon: FileText,
      label: 'Proposition envoyée',
      description: `Proposition commerciale — ${(deal.value || 0).toLocaleString('fr-FR')} €`,
      date: new Date(new Date(deal.created_at).getTime() + 10 * 86400000).toISOString(),
      color: 'bg-amber-500',
    })
  }

  if (deal.stage === 'closed_won' && deal.won_at) {
    events.push({
      icon: Handshake,
      label: 'Deal gagné',
      description: `Contrat signé — ${(deal.value || 0).toLocaleString('fr-FR')} €`,
      date: deal.won_at,
      color: 'bg-green-500',
    })
  }

  return (
    <div>
      <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
        Parcours du deal
      </p>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-[var(--border-default)]" />
        <div className="space-y-4">
          {events.map((event, i) => (
            <div key={i} className="relative flex gap-4 pl-8">
              <div className={`absolute left-0 w-6 h-6 ${event.color} rounded-full flex items-center justify-center ring-2 ring-[var(--surface-secondary)]`}>
                <event.icon className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-[var(--text-primary)]">{event.label}</p>
                  <span className="text-[10px] text-[var(--text-tertiary)] whitespace-nowrap">{formatDate(event.date)}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
