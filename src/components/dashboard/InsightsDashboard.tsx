import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MessageCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TopQuestions } from './TopQuestions'
import { TopObjections } from './TopObjections'
import { HourHeatmap } from './HourHeatmap'
import { SentimentGauge } from './SentimentGauge'
import { useConversationInsights, type InsightPeriod } from '@/hooks/useConversationInsights'

const periods: { value: InsightPeriod; label: string }[] = [
  { value: '7d', label: '7 jours' },
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '90 jours' },
]

export function InsightsDashboard() {
  const [period, setPeriod] = useState<InsightPeriod>('30d')
  const { insights, isMock } = useConversationInsights(period)

  const formatTime = (secs: number) => {
    if (secs < 60) return `${secs}s`
    return `${Math.round(secs / 60)} min`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">Analyse des patterns de conversation</p>
          {isMock && (
            <p className="text-xs text-amber-600 mt-0.5">Données de démonstration</p>
          )}
        </div>
        <div className="flex gap-1 bg-[var(--surface-secondary)] p-0.5 rounded-lg">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                period === p.value
                  ? 'bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Clock, label: 'Temps de réponse moyen', value: formatTime(insights.avg_response_time_seconds), color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: MessageCircle, label: 'Messages pour qualifier', value: insights.avg_messages_to_qualify.toFixed(1), color: 'text-amber-500', bg: 'bg-amber-50' },
          { icon: TrendingUp, label: 'Messages pour booker', value: insights.avg_messages_to_book.toFixed(1), color: 'text-green-500', bg: 'bg-green-50' },
        ].map((kpi, i) => (
          <Card key={i} className="p-4">
            <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center mb-2`}>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <p className="text-xl font-bold text-[var(--text-primary)] font-mono">{kpi.value}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{kpi.label}</p>
          </Card>
        ))}
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopQuestions questions={insights.top_questions} />
        <TopObjections objections={insights.top_objections} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HourHeatmap busiestHours={insights.busiest_hours} bestConvertingHours={insights.best_converting_hours} />
        <SentimentGauge distribution={insights.sentiment_distribution} />
      </div>
    </motion.div>
  )
}
