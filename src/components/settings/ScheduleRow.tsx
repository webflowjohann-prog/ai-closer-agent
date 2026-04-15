import { motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DAY_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const TIME_OPTIONS: string[] = []
for (let h = 0; h < 24; h++) {
  for (const m of ['00', '30']) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${m}`)
  }
}

export interface ScheduleRowData {
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

interface ScheduleRowProps {
  data: ScheduleRowData
  onChange: (patch: Partial<ScheduleRowData>) => void
}

export function ScheduleRow({ data, onChange }: ScheduleRowProps) {
  return (
    <motion.div
      layout
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        data.is_active
          ? 'border-brand-200 bg-brand-50/30'
          : 'border-[var(--border-default)] bg-[var(--surface-secondary)] opacity-60'
      }`}
    >
      {/* Day toggle */}
      <Switch
        checked={data.is_active}
        onCheckedChange={(v) => onChange({ is_active: v })}
      />

      {/* Day label */}
      <span
        className={`w-20 text-sm font-medium flex-shrink-0 ${
          data.is_active ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
        }`}
      >
        {DAY_LABELS[data.day_of_week]}
      </span>

      {/* Time selectors */}
      <div className={`flex items-center gap-2 flex-1 ${!data.is_active ? 'pointer-events-none' : ''}`}>
        <Select value={data.start_time} onValueChange={(v) => onChange({ start_time: v })}>
          <SelectTrigger className="h-8 text-xs w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-52">
            {TIME_OPTIONS.map((t) => (
              <SelectItem key={`start-${t}`} value={t} className="text-xs">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-xs text-[var(--text-tertiary)]">–</span>

        <Select value={data.end_time} onValueChange={(v) => onChange({ end_time: v })}>
          <SelectTrigger className="h-8 text-xs w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-52">
            {TIME_OPTIONS.filter((t) => t > data.start_time).map((t) => (
              <SelectItem key={`end-${t}`} value={t} className="text-xs">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {data.is_active && (
          <span className="text-[10px] text-[var(--text-tertiary)] hidden sm:block">
            {(() => {
              const [sh, sm] = data.start_time.split(':').map(Number)
              const [eh, em] = data.end_time.split(':').map(Number)
              const diff = (eh * 60 + em) - (sh * 60 + sm)
              return diff > 0 ? `${diff / 60}h` : ''
            })()}
          </span>
        )}
      </div>
    </motion.div>
  )
}
