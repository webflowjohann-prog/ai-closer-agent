import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { TrendingUp, DollarSign, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface AnimatedCounterProps {
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  format?: (n: number) => string
}

function AnimatedCounter({ to, duration = 1.5, prefix = '', suffix = '', format }: AnimatedCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) =>
    format ? format(v) : `${prefix}${Math.round(v).toLocaleString('fr-FR')}${suffix}`
  )

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: 'easeOut' })
    return controls.stop
  }, [to, duration])

  return <motion.span>{rounded}</motion.span>
}

interface ROIHeroCardsProps {
  pipeline: number
  closedRevenue: number
  roiMultiplier: number
  isMock?: boolean
}

export function ROIHeroCards({ pipeline, closedRevenue, roiMultiplier, isMock }: ROIHeroCardsProps) {
  const cards = [
    {
      label: 'Pipeline généré',
      value: pipeline,
      format: (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`,
      icon: TrendingUp,
      color: 'text-brand-500',
      bg: 'bg-brand-50',
      description: 'Valeur totale des deals en cours',
      delay: 0,
    },
    {
      label: 'Revenus closés',
      value: closedRevenue,
      format: (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      description: 'Deals gagnés sur la période',
      delay: 0.1,
    },
    {
      label: 'ROI',
      value: roiMultiplier,
      format: (n: number) => `x${Math.round(n)}`,
      icon: Zap,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      description: 'Revenus vs coût d\'acquisition',
      delay: 0.2,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay, duration: 0.4 }}
        >
          <Card className="p-5 relative overflow-hidden">
            {isMock && (
              <span className="absolute top-2 right-2 text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                Demo
              </span>
            )}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)] font-mono tabular-nums">
              <AnimatedCounter to={card.value} format={card.format} />
            </p>
            <p className="text-sm font-medium text-[var(--text-primary)] mt-1">{card.label}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{card.description}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
