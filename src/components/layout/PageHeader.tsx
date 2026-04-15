import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between px-6 py-5 border-b border-[var(--border-default)] bg-[var(--surface-primary)]', className)}>
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-primary)] font-display">{title}</h1>
        {description && (
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
