import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-brand-100 text-brand-700',
        secondary:
          'bg-[var(--surface-tertiary)] text-[var(--text-secondary)]',
        destructive:
          'bg-red-100 text-red-700',
        success:
          'bg-green-100 text-green-700',
        warning:
          'bg-yellow-100 text-yellow-700',
        outline:
          'border border-[var(--border-default)] text-[var(--text-secondary)]',
        new: 'bg-[rgba(116,143,252,0.12)] text-[#748ffc]',
        qualified: 'bg-[rgba(250,176,5,0.12)] text-[#fab005]',
        meeting: 'bg-[rgba(51,154,240,0.12)] text-[#339af0]',
        proposal: 'bg-[rgba(151,117,250,0.12)] text-[#9775fa]',
        won: 'bg-[rgba(64,192,87,0.12)] text-[#40c057]',
        lost: 'bg-[rgba(250,82,82,0.12)] text-[#fa5252]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
