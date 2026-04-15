import { motion } from 'framer-motion'

interface FunnelStep {
  label: string
  value: number
  color: string
}

interface FunnelChartProps {
  data: FunnelStep[]
}

export function FunnelChart({ data }: FunnelChartProps) {
  const max = data[0]?.value || 1

  return (
    <div className="space-y-2">
      {data.map((step, i) => {
        const pct = (step.value / max) * 100
        const conversionFromPrev = i > 0 && data[i - 1].value > 0
          ? Math.round((step.value / data[i - 1].value) * 100)
          : null

        return (
          <div key={step.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: step.color }} />
                <span className="text-[var(--text-secondary)] font-medium">{step.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {conversionFromPrev !== null && (
                  <span className="text-[var(--text-tertiary)]">{conversionFromPrev}% →</span>
                )}
                <span className="font-semibold text-[var(--text-primary)] font-mono w-10 text-right">
                  {step.value.toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
            <div className="h-6 bg-[var(--surface-tertiary)] rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                className="h-full rounded-lg"
                style={{ background: step.color, opacity: 0.85 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
