import { motion } from 'framer-motion'
import { MessageCircle, Clock, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ROIPeriod } from '@/hooks/useROI'

interface ROIInsightsProps {
  byChannel: Record<string, { count: number; revenue: number }>
  avgDaysToClose: number
  totalDeals: number
  period: ROIPeriod
}

export function ROIInsights({ byChannel, avgDaysToClose, totalDeals, period }: ROIInsightsProps) {
  const avgCostPerLead = 35
  const totalCost = avgCostPerLead * totalDeals

  const topChannel = Object.entries(byChannel).sort((a, b) => b[1].revenue - a[1].revenue)[0]

  const insights = [
    {
      icon: MessageCircle,
      title: 'Canal le plus rentable',
      value: topChannel ? topChannel[0].charAt(0).toUpperCase() + topChannel[0].slice(1) : '—',
      detail: topChannel ? `${(topChannel[1].revenue).toLocaleString('fr-FR')} € de revenus générés` : 'Pas de données',
      color: 'text-brand-500',
      bg: 'bg-brand-50',
    },
    {
      icon: Clock,
      title: 'Temps moyen de close',
      value: avgDaysToClose > 0 ? `${avgDaysToClose} jours` : '—',
      detail: 'Du 1er message au deal gagné',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: TrendingDown,
      title: 'Coût par lead (ads)',
      value: `${avgCostPerLead} €`,
      detail: `Estimation — Budget total : ${totalCost.toLocaleString('fr-FR')} €`,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {insights.map((insight, i) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          <Card className="p-4">
            <div className={`w-8 h-8 ${insight.bg} rounded-lg flex items-center justify-center mb-3`}>
              <insight.icon className={`w-4 h-4 ${insight.color}`} />
            </div>
            <p className="text-xs font-medium text-[var(--text-tertiary)] mb-1">{insight.title}</p>
            <p className="text-lg font-bold text-[var(--text-primary)] font-mono">{insight.value}</p>
            <p className="text-[11px] text-[var(--text-tertiary)] mt-1">{insight.detail}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
