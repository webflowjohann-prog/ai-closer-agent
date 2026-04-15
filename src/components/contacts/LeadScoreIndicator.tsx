import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LeadScoreIndicatorProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const levelConfig = {
  low: { label: 'Faible', color: '#fa5252', bg: 'bg-red-50', textColor: 'text-red-600' },
  medium: { label: 'Moyen', color: '#fab005', bg: 'bg-amber-50', textColor: 'text-amber-600' },
  high: { label: 'Élevé', color: '#40c057', bg: 'bg-green-50', textColor: 'text-green-600' },
  very_high: { label: 'Très élevé', color: '#5c7cfa', bg: 'bg-brand-50', textColor: 'text-brand-600' },
}

function getLevel(score: number): keyof typeof levelConfig {
  if (score >= 70) return 'very_high'
  if (score >= 50) return 'high'
  if (score >= 30) return 'medium'
  return 'low'
}

const sizeConfig = {
  sm: { ring: 28, stroke: 3, fontSize: '8px', cx: 14 },
  md: { ring: 40, stroke: 4, fontSize: '10px', cx: 20 },
  lg: { ring: 52, stroke: 5, fontSize: '12px', cx: 26 },
}

export function LeadScoreIndicator({ score, size = 'md', showLabel = true }: LeadScoreIndicatorProps) {
  const level = getLevel(score)
  const config = levelConfig[level]
  const dims = sizeConfig[size]
  const radius = dims.cx - dims.stroke / 2
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference * (1 - score / 100)

  return (
    <div className="flex items-center gap-2">
      {/* Ring */}
      <div className="relative flex-shrink-0" style={{ width: dims.ring, height: dims.ring }}>
        <svg width={dims.ring} height={dims.ring} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={dims.cx}
            cy={dims.cx}
            r={radius}
            fill="none"
            stroke="var(--color-gray-200)"
            strokeWidth={dims.stroke}
          />
          <motion.circle
            cx={dims.cx}
            cy={dims.cx}
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={dims.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold font-mono text-[var(--text-primary)]" style={{ fontSize: dims.fontSize }}>
            {score}
          </span>
        </div>
      </div>

      {showLabel && (
        <div>
          <p className={cn('text-xs font-medium', config.textColor)}>{config.label}</p>
          <p className="text-[10px] text-[var(--text-tertiary)]">Score engagement</p>
        </div>
      )}
    </div>
  )
}
