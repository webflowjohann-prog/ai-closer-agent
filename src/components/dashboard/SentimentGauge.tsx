import { motion } from 'framer-motion'
import { Smile, Meh, Frown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SentimentGaugeProps {
  distribution: Record<string, number>
}

export function SentimentGauge({ distribution }: SentimentGaugeProps) {
  const positive = Math.round((distribution.positive || 0) * 100)
  const neutral = Math.round((distribution.neutral || 0) * 100)
  const negative = Math.round((distribution.negative || 0) * 100)

  const segments = [
    { key: 'positive', label: 'Positif', pct: positive, color: '#40c057', icon: Smile, bg: 'bg-green-50', text: 'text-green-600' },
    { key: 'neutral', label: 'Neutre', pct: neutral, color: '#fab005', icon: Meh, bg: 'bg-amber-50', text: 'text-amber-600' },
    { key: 'negative', label: 'Négatif', pct: negative, color: '#fa5252', icon: Frown, bg: 'bg-red-50', text: 'text-red-600' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-green-500" />
          Sentiment des conversations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gauge bar */}
        <div className="flex h-5 rounded-full overflow-hidden gap-0.5">
          {segments.map((s, i) => (
            <motion.div
              key={s.key}
              className="h-full rounded-full"
              style={{ backgroundColor: s.color }}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {segments.map((s) => (
            <div key={s.key} className={`${s.bg} rounded-xl p-3 text-center`}>
              <s.icon className={`w-4 h-4 ${s.text} mx-auto mb-1`} />
              <p className={`text-lg font-bold ${s.text} font-mono`}>{s.pct}%</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">{s.label}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[var(--text-tertiary)] text-center">
          Basé sur l'analyse des conversations IA
        </p>
      </CardContent>
    </Card>
  )
}
