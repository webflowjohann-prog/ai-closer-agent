import { Send, CheckCheck, Eye, MessageSquare, Calendar, TrendingUp } from 'lucide-react'
import type { Campaign } from '@/types/database'

interface CampaignStatsProps {
  campaign: Campaign
}

export function CampaignStats({ campaign }: CampaignStatsProps) {
  const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0)

  const stats = [
    { icon: Send, label: 'Envoyés', value: campaign.sent_count, total: campaign.total_contacts, color: '#748ffc' },
    { icon: CheckCheck, label: 'Livrés', value: campaign.delivered_count, total: campaign.sent_count, color: '#40c057' },
    { icon: Eye, label: 'Lus', value: campaign.read_count, total: campaign.delivered_count, color: '#339af0' },
    { icon: MessageSquare, label: 'Réponses', value: campaign.replied_count, total: campaign.sent_count, color: '#fab005' },
    { icon: Calendar, label: 'RDV', value: campaign.booked_count, total: campaign.replied_count, color: '#9775fa' },
  ]

  return (
    <div className="space-y-4">
      {/* Funnel bars */}
      <div className="bg-[var(--surface-secondary)] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-brand-500" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Entonnoir de conversion</h4>
        </div>
        {stats.map(({ icon: Icon, label, value, total, color }) => (
          <div key={label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Icon className="w-3.5 h-3.5" style={{ color }} />
                {label}
              </span>
              <span className="font-semibold text-[var(--text-primary)]">
                {value} <span className="font-normal text-[var(--text-tertiary)]">({pct(value, total)}%)</span>
              </span>
            </div>
            <div className="h-2 bg-[var(--surface-primary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct(value, total)}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Grid stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Taux de réponse', value: `${pct(campaign.replied_count, campaign.sent_count)}%` },
          { label: 'Taux de RDV', value: `${pct(campaign.booked_count, campaign.sent_count)}%` },
          { label: 'Contacts actifs', value: campaign.total_contacts },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[var(--surface-secondary)] rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
