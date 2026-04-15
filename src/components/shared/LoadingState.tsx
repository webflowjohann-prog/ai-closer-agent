import { Skeleton } from '@/components/ui/skeleton'

export function PageLoadingState() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 bg-[var(--surface-primary)] rounded-xl border border-[var(--border-default)] space-y-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div>
              <Skeleton className="h-7 w-20 mb-1" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[var(--surface-primary)] rounded-xl border border-[var(--border-default)] p-5">
        <Skeleton className="h-4 w-36 mb-4" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function TableLoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-2.5 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      ))}
    </div>
  )
}
