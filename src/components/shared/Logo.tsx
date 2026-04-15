import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const iconSizes = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' }
  const iconInner = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' }
  const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('bg-brand-500 rounded-xl flex items-center justify-center', iconSizes[size])}>
        <Zap className={cn('text-white', iconInner[size])} />
      </div>
      {showText && (
        <span className={cn('font-bold text-[var(--text-primary)] font-display', textSizes[size])}>
          AI Closer
        </span>
      )}
    </div>
  )
}
