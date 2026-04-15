import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { ScheduleRow, type ScheduleRowData } from './ScheduleRow'

const DEFAULT_SCHEDULE: ScheduleRowData[] = [
  { day_of_week: 0, start_time: '09:00', end_time: '18:00', is_active: true },
  { day_of_week: 1, start_time: '09:00', end_time: '18:00', is_active: true },
  { day_of_week: 2, start_time: '09:00', end_time: '18:00', is_active: true },
  { day_of_week: 3, start_time: '09:00', end_time: '18:00', is_active: true },
  { day_of_week: 4, start_time: '09:00', end_time: '18:00', is_active: true },
  { day_of_week: 5, start_time: '10:00', end_time: '14:00', is_active: false },
  { day_of_week: 6, start_time: '10:00', end_time: '14:00', is_active: false },
]

const PRESETS = [
  {
    label: 'Bureau',
    description: 'Lun–Ven 9h–18h',
    schedule: DEFAULT_SCHEDULE.map((d) => ({
      ...d,
      start_time: '09:00',
      end_time: '18:00',
      is_active: d.day_of_week <= 4,
    })),
  },
  {
    label: 'Étendu',
    description: 'Lun–Sam 8h–21h',
    schedule: DEFAULT_SCHEDULE.map((d) => ({
      ...d,
      start_time: '08:00',
      end_time: '21:00',
      is_active: d.day_of_week <= 5,
    })),
  },
  {
    label: '24/7',
    description: 'Toujours actif',
    schedule: DEFAULT_SCHEDULE.map((d) => ({
      ...d,
      start_time: '00:00',
      end_time: '23:30',
      is_active: true,
    })),
  },
]

export function BotScheduleSettings() {
  const { activeSubAccount } = useOrgStore()
  const [schedule, setSchedule] = useState<ScheduleRowData[]>(DEFAULT_SCHEDULE)
  const [offMessage, setOffMessage] = useState(
    activeSubAccount?.bot_instructions?.includes('hors horaires')
      ? ''
      : 'Nous sommes actuellement fermés. Nous reviendrons vers vous dès l\'ouverture ! 🕐'
  )
  const [saving, setSaving] = useState(false)

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setSchedule(preset.schedule)
    toast.success(`Preset "${preset.label}" appliqué`)
  }

  const updateRow = (dayOfWeek: number, patch: Partial<ScheduleRowData>) => {
    setSchedule((prev) =>
      prev.map((row) =>
        row.day_of_week === dayOfWeek ? { ...row, ...patch } : row
      )
    )
  }

  const activeDays = schedule.filter((d) => d.is_active).length

  const handleSave = async () => {
    if (!activeSubAccount) { toast.error("Aucun compte actif", { description: "Rechargez la page ou reconnectez-vous." }); return }
    setSaving(true)

    try {
      // Delete existing and re-insert
      await supabase
        .from('bot_schedules')
        .delete()
        .eq('sub_account_id', activeSubAccount.id)

      const rows = schedule
        .filter((d) => d.is_active)
        .map((d) => ({
          sub_account_id: activeSubAccount.id,
          day_of_week: d.day_of_week,
          start_time: d.start_time,
          end_time: d.end_time,
          is_active: true,
        }))

      if (rows.length > 0) {
        const { error } = await supabase.from('bot_schedules').insert(rows)
        if (error) throw error
      }

      toast.success('Horaires sauvegardés', {
        description: `${activeDays} jour${activeDays !== 1 ? 's' : ''} actif${activeDays !== 1 ? 's' : ''}`,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      toast.error('Erreur', { description: message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-brand-500" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Horaires d'activité du bot</p>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <Label className="text-xs">Présets rapides</Label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <motion.button
              key={preset.label}
              whileTap={{ scale: 0.97 }}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border-default)] bg-[var(--surface-secondary)] hover:border-brand-300 hover:bg-brand-50 text-[var(--text-secondary)] hover:text-brand-600 transition-all"
            >
              {preset.label}
              <span className="ml-1.5 text-[var(--text-tertiary)] font-normal">{preset.description}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Schedule grid */}
      <div className="space-y-2">
        {schedule.map((row) => (
          <ScheduleRow
            key={row.day_of_week}
            data={row}
            onChange={(patch) => updateRow(row.day_of_week, patch)}
          />
        ))}
      </div>

      <div className="text-xs text-[var(--text-tertiary)]">
        {activeDays === 0
          ? '⚠️ Le bot est désactivé tous les jours'
          : `Le bot sera actif ${activeDays} jour${activeDays !== 1 ? 's' : ''} par semaine`}
      </div>

      {/* Off-hours message */}
      <div className="space-y-1.5">
        <Label className="text-xs">Message hors horaires</Label>
        <Textarea
          value={offMessage}
          onChange={(e) => setOffMessage(e.target.value)}
          placeholder="Message envoyé automatiquement en dehors des horaires..."
          rows={3}
        />
        <p className="text-[10px] text-[var(--text-tertiary)]">
          Affiché quand un contact écrit en dehors des horaires actifs
        </p>
      </div>

      <Button type="button" onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {saving ? 'Sauvegarde...' : 'Enregistrer les horaires'}
      </Button>
    </div>
  )
}
