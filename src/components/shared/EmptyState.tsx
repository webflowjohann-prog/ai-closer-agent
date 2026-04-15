import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="w-14 h-14 bg-[var(--surface-tertiary)] rounded-2xl flex items-center justify-center mb-4 text-[var(--text-tertiary)]">
        {icon}
      </div>
      <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">{title}</p>
      {description && (
        <p className="text-xs text-[var(--text-tertiary)] max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  )
}
