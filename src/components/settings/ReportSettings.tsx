import { useState, useEffect } from 'react'
import { BarChart3, Plus, X, Check, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ReportPreview } from './ReportPreview'
import { useReportSchedules } from '@/hooks/useReportSchedules'

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Quotidien', sub: 'Chaque matin à 7h' },
  { value: 'weekly', label: 'Hebdomadaire', sub: 'Chaque lundi matin' },
  { value: 'monthly', label: 'Mensuel', sub: 'Le 1er du mois' },
]

const SECTIONS = [
  { id: 'kpis', label: 'Métriques clés' },
  { id: 'funnel', label: 'Entonnoir' },
  { id: 'deals', label: 'Top deals' },
  { id: 'messages', label: 'Activité messages' },
  { id: 'recommendations', label: 'Recommandations IA' },
]

export function ReportSettings() {
  const { schedule, upsertSchedule } = useReportSchedules()
  const [frequency, setFrequency] = useState('weekly')
  const [isActive, setIsActive] = useState(true)
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [sections, setSections] = useState(['kpis', 'funnel', 'deals'])

  useEffect(() => {
    if (schedule) {
      setFrequency(schedule.frequency)
      setIsActive(schedule.is_active)
      setEmails(schedule.send_to || [])
      setSections(schedule.include_sections || [])
    }
  }, [schedule])

  const addEmail = () => {
    if (emailInput && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput])
      setEmailInput('')
    }
  }

  const toggleSection = (id: string) => {
    setSections((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  const handleSave = () => {
    upsertSchedule.mutate({ frequency: frequency as any, send_to: emails, include_sections: sections, is_active: isActive })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-500" />
          Rapports automatiques
        </h2>
        <p className="text-sm text-[var(--text-tertiary)]">
          Recevez un rapport de performance par email à la fréquence de votre choix
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          {/* Active toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Activer les rapports</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <Separator />

          {/* Frequency */}
          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-2 block">Fréquence</Label>
            <div className="space-y-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all ${
                    frequency === opt.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-[var(--border-default)] hover:border-brand-300'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${frequency === opt.value ? 'text-brand-700' : 'text-[var(--text-primary)]'}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">{opt.sub}</p>
                  </div>
                  {frequency === opt.value && <Check className="w-4 h-4 text-brand-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-2 block">Sections incluses</Label>
            <div className="space-y-1.5">
              {SECTIONS.map((s) => (
                <label key={s.id} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.includes(s.id)}
                    onChange={() => toggleSection(s.id)}
                    className="w-3.5 h-3.5 rounded border-[var(--border-default)] accent-[#5c7cfa]"
                  />
                  <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Emails */}
          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-2 block">Destinataires</Label>
            <div className="flex gap-2 mb-2">
              <Input
                type="email"
                placeholder="email@exemple.fr"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                className="flex-1 text-sm"
              />
              <Button type="button" variant="outline" size="icon" onClick={addEmail}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {emails.map((email) => (
                <span key={email} className="flex items-center gap-1 text-xs bg-[var(--surface-secondary)] px-2 py-1 rounded-full">
                  <Mail className="w-3 h-3 text-[var(--text-tertiary)]" />
                  {email}
                  <button onClick={() => setEmails(emails.filter((e) => e !== email))}>
                    <X className="w-3 h-3 text-[var(--text-tertiary)] hover:text-red-500" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Button type="button" onClick={handleSave} disabled={upsertSchedule.isPending}>
            {upsertSchedule.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>

        {/* Preview */}
        <div>
          <Label className="text-xs text-[var(--text-tertiary)] mb-2 block">Aperçu du rapport</Label>
          <ReportPreview sections={sections} />
        </div>
      </div>
    </div>
  )
}
