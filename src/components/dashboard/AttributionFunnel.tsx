import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FunnelStep {
  stage: string
  count: number
}

interface AttributionFunnelProps {
  data: FunnelStep[]
}

const stageLabels: Record<string, string> = {
  lead: 'Leads',
  qualified: 'Qualifiés',
  meeting: 'RDV',
  proposal: 'Propositions',
  negotiation: 'Négociation',
  closed_won: 'Gagnés',
}

const stageColors: Record<string, string> = {
  lead: '#748ffc',
  qualified: '#fab005',
  meeting: '#339af0',
  proposal: '#9775fa',
  negotiation: '#fd7e14',
  closed_won: '#40c057',
}

export function AttributionFunnel({ data }: AttributionFunnelProps) {
  const max = data[0]?.count || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entonnoir d'attribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.map((step, i) => {
          const pct = max > 0 ? (step.count / max) * 100 : 0
          const prevCount = i > 0 ? data[i - 1].count : step.count
          const convRate = prevCount > 0 ? Math.round((step.count / prevCount) * 100) : 100

          return (
            <div key={step.stage}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {stageLabels[step.stage] || step.stage}
                </span>
                <div className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {convRate}% conv.
                    </span>
                  )}
                  <span className="text-xs font-bold text-[var(--text-primary)] font-mono w-8 text-right">
                    {step.count}
                  </span>
                </div>
              </div>
              <div className="h-7 bg-[var(--surface-tertiary)] rounded-md overflow-hidden">
                <motion.div
                  className="h-full rounded-md flex items-center px-2"
                  style={{ backgroundColor: stageColors[step.stage] || '#748ffc' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(pct, step.count > 0 ? 8 : 0)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.07, ease: 'easeOut' }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
