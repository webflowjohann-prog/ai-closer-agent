import { Trash2, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { CampaignSequence } from '@/types/database'

interface SequenceStepProps {
  step: Partial<CampaignSequence> & { _localId: string }
  index: number
  total: number
  onChange: (updates: Partial<CampaignSequence>) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

const VARIABLES = ['{{first_name}}', '{{last_name}}', '{{company_name}}', '{{personal_context}}', '{{agent_name}}']

export function SequenceStep({ step, index, total, onChange, onDelete, onMoveUp, onMoveDown }: SequenceStepProps) {
  const insertVariable = (field: 'template_a' | 'template_b', variable: string) => {
    const current = (step[field] as string) || ''
    onChange({ [field]: current + variable })
  }

  return (
    <div className="border border-[var(--border-default)] rounded-xl bg-[var(--surface-primary)] overflow-hidden">
      {/* Step header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-secondary)] border-b border-[var(--border-default)]">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>
          <Input
            value={step.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder={`Étape ${index + 1}`}
            className="h-7 text-sm border-0 bg-transparent p-0 font-medium focus-visible:ring-0 w-40"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-tertiary)] hover:bg-[var(--surface-primary)] disabled:opacity-30 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-tertiary)] hover:bg-[var(--surface-primary)] disabled:opacity-30 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Delay */}
        <div className="flex items-center gap-3">
          <Label className="text-xs w-32 flex-shrink-0">Délai avant envoi</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={step.delay_hours || 24}
              onChange={(e) => onChange({ delay_hours: parseInt(e.target.value) || 24 })}
              className="h-7 w-20 text-sm"
            />
            <span className="text-xs text-[var(--text-tertiary)]">heures</span>
          </div>
        </div>

        {/* Template A */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs font-medium">Message — Variante A *</Label>
            <div className="flex items-center gap-1">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVariable('template_a', v)}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors font-mono"
                >
                  {v.replace('{{', '').replace('}}', '')}
                </button>
              ))}
            </div>
          </div>
          <Textarea
            value={step.template_a || ''}
            onChange={(e) => onChange({ template_a: e.target.value })}
            placeholder="Bonjour {{first_name}}, je me permets de vous contacter..."
            className="text-sm min-h-[80px] resize-none"
            required
          />
          <p className="text-[10px] text-[var(--text-tertiary)] mt-1">{(step.template_a || '').length} caractères</p>
        </div>

        {/* A/B Toggle + Template B */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">A/B Testing</span>
            <Switch
              checked={!!step.template_b}
              onCheckedChange={(checked) => onChange({ template_b: checked ? '' : undefined })}
              className="scale-75"
            />
          </div>
          {step.template_b !== undefined && (
            <>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs font-medium">Message — Variante B</Label>
                <div className="flex items-center gap-1">
                  {VARIABLES.map((v) => (
                    <button
                      key={v}
                      onClick={() => insertVariable('template_b', v)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors font-mono"
                    >
                      {v.replace('{{', '').replace('}}', '')}
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                value={step.template_b || ''}
                onChange={(e) => onChange({ template_b: e.target.value })}
                placeholder="Version alternative du message..."
                className="text-sm min-h-[80px] resize-none"
              />
            </>
          )}
        </div>

        {/* Conditions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'send_if_no_reply', label: 'Si pas de réponse seulement' },
            { key: 'stop_if_replied', label: 'Stopper si réponse reçue' },
            { key: 'stop_if_booked', label: 'Stopper si RDV pris' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <Switch
                checked={(step as Record<string, unknown>)[key] as boolean ?? true}
                onCheckedChange={(checked) => onChange({ [key]: checked })}
                className="scale-75"
              />
              <span className="text-[11px] text-[var(--text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
