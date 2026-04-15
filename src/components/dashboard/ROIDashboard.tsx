import { useState } from 'react'
import { motion } from 'framer-motion'
import { useROI, type ROIPeriod } from '@/hooks/useROI'
import { ROIHeroCards } from './ROIHeroCards'
import { AttributionFunnel } from './AttributionFunnel'
import { AttributionTable } from './AttributionTable'
import { ROIInsights } from './ROIInsights'

const periods: { value: ROIPeriod; label: string }[] = [
  { value: '7d', label: '7 jours' },
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '90 jours' },
  { value: '12m', label: '12 mois' },
]

export function ROIDashboard() {
  const [period, setPeriod] = useState<ROIPeriod>('30d')
  const roi = useROI(period)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Performance de votre agent IA sur la période
          </p>
          {roi.isMock && (
            <p className="text-xs text-amber-600 mt-0.5">
              Données de démonstration — Connectez votre CRM pour des métriques réelles
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface-secondary)] p-0.5 rounded-lg">
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

      {/* Hero metrics */}
      <ROIHeroCards
        pipeline={roi.pipeline}
        closedRevenue={roi.closedRevenue}
        roiMultiplier={roi.roiMultiplier}
        isMock={roi.isMock}
      />

      {/* Insights */}
      <ROIInsights
        byChannel={roi.byChannel}
        avgDaysToClose={roi.avgDaysToClose}
        totalDeals={roi.totalDeals}
        period={period}
      />

      {/* Funnel */}
      <AttributionFunnel data={roi.funnelData} />

      {/* Deals table */}
      <AttributionTable deals={roi.deals} />
    </motion.div>
  )
}
