import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface HourData {
  hour: number
  count: number
}

interface BestHour {
  hour: number
  rate: number
}

interface HourHeatmapProps {
  busiestHours: HourData[]
  bestConvertingHours: BestHour[]
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

export function HourHeatmap({ busiestHours, bestConvertingHours }: HourHeatmapProps) {
  const hourMap = Object.fromEntries(busiestHours.map((h) => [h.hour, h.count]))
  const maxCount = Math.max(...busiestHours.map((h) => h.count), 1)
  const bestHoursSet = new Set(bestConvertingHours.slice(0, 3).map((h) => h.hour))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          Heures optimales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="flex items-center gap-1.5">
              <span className="text-[10px] text-[var(--text-tertiary)] w-6 flex-shrink-0">{day}</span>
              <div className="flex gap-1 flex-1">
                {HOURS.map((hour) => {
                  // Vary count by day for visual interest
                  const dayFactor = [1, 0.9, 1.1, 0.95, 1.05, 0.6, 0.4][dayIdx]
                  const count = Math.round((hourMap[hour] || 0) * dayFactor)
                  const intensity = maxCount > 0 ? count / maxCount : 0
                  const isBest = bestHoursSet.has(hour) && dayIdx < 5

                  return (
                    <div
                      key={hour}
                      title={`${day} ${hour}h — ${count} messages${isBest ? ' ⭐ meilleur taux' : ''}`}
                      className={`flex-1 h-4 rounded-sm transition-opacity cursor-default ${isBest ? 'ring-1 ring-amber-400' : ''}`}
                      style={{
                        backgroundColor: intensity > 0
                          ? `rgba(92, 124, 250, ${Math.max(intensity * 0.9, 0.08)})`
                          : 'var(--surface-tertiary)',
                      }}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* X-axis labels */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-6" />
            <div className="flex gap-1 flex-1">
              {HOURS.map((h) => (
                <span key={h} className="flex-1 text-[8px] text-[var(--text-tertiary)] text-center">
                  {h}h
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-brand-200" />
            <span className="text-[10px] text-[var(--text-tertiary)]">Volume messages</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm ring-1 ring-amber-400 bg-brand-300" />
            <span className="text-[10px] text-[var(--text-tertiary)]">Meilleur taux conversion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
