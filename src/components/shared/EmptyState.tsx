import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="w-14 h-14 bg-[var(--surface-tertiary)] rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-[var(--text-tertiary)]" />
      </div>
      <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">{title}</p>
      {description && (
        <p className="text-xs text-[var(--text-tertiary)] max-w-xs">{description}</p>
      )}
      {action && (
        <Button variant="outline" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}
