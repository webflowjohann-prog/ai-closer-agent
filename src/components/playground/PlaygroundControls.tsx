import { RefreshCw, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { VerticalType } from '@/types/database'

const verticals: Array<{ value: VerticalType; label: string }> = [
  { value: 'immobilier_luxe', label: 'Immobilier Luxe' },
  { value: 'clinique_esthetique', label: 'Clinique Esthétique' },
  { value: 'coach_formateur', label: 'Coach / Formateur' },
  { value: 'restaurant_hotel', label: 'Restaurant / Hôtel' },
  { value: 'concession_auto', label: 'Concession Auto' },
  { value: 'autre', label: 'Autre secteur' },
]

interface PlaygroundControlsProps {
  vertical: VerticalType
  onVerticalChange: (v: VerticalType) => void
  apiKey: string
  onApiKeyChange: (key: string) => void
  onReset: () => void
}

export function PlaygroundControls({
  vertical,
  onVerticalChange,
  apiKey,
  onApiKeyChange,
  onReset,
}: PlaygroundControlsProps) {
  return (
    <div className="space-y-4 p-4 bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-xl">
      <div className="space-y-1.5">
        <Label>Verticale</Label>
        <Select value={vertical} onValueChange={onVerticalChange as (v: string) => void}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {verticals.map((v) => (
              <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Clé API Claude (BYOK)</Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <Input
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="pl-8 font-mono text-xs"
          />
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">
          Laissez vide pour utiliser la clé de démo
        </p>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={onReset}>
        <RefreshCw className="w-3.5 h-3.5" />
        Réinitialiser la conversation
      </Button>
    </div>
  )
}
