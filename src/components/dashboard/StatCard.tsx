import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  trend?: number
  icon: React.ComponentType<{ className?: string }>
  color?: string
  delay?: number
}

export function StatCard({ label, value, trend, icon: Icon, color = 'text-brand-500 bg-brand-50', delay = 0 }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-5 bg-[var(--surface-primary)] rounded-xl border border-[var(--border-default)] hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color)}>
          <Icon className="w-4 h-4" />
        </div>
        {trend !== undefined && (
          <div className={cn(
            'flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full',
            isPositive ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--text-primary)] font-display">
          {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
        </p>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
