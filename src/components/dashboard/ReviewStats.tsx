import { Star, Send, MousePointer, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useReviewRequests } from '@/hooks/useReviewRequests'

export function ReviewStats() {
  const { stats, isLoading } = useReviewRequests()

  const items = [
    { icon: Star, label: 'Demandés', value: stats.total, color: 'text-amber-500' },
    { icon: Send, label: 'Envoyés', value: stats.sent, color: 'text-blue-500' },
    { icon: MousePointer, label: 'Cliqués', value: stats.clicked, color: 'text-purple-500' },
    { icon: CheckCircle, label: 'Rédigés', value: stats.reviewed, color: 'text-green-500' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Avis clients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <item.icon className={`w-4 h-4 ${item.color} mx-auto mb-1`} />
              <p className="text-xl font-bold text-[var(--text-primary)] font-mono">
                {isLoading ? '—' : item.value}
              </p>
              <p className="text-[10px] text-[var(--text-tertiary)]">{item.label}</p>
            </div>
          ))}
        </div>
        {!isLoading && stats.total > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
              <span>Taux de conversion</span>
              <span className="font-semibold text-green-600">
                {stats.total > 0 ? Math.round((stats.reviewed / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
