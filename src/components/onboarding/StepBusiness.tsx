import { useState } from 'react'
import { Globe, Loader2, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { VerticalSelector } from './VerticalSelector'
import type { VerticalType } from '@/types/database'

interface StepBusinessProps {
  data: { url: string; vertical: VerticalType | null; businessName: string }
  onChange: (data: { url: string; vertical: VerticalType | null; businessName: string }) => void
  onNext: () => void
}

export function StepBusiness({ data, onChange, onNext }: StepBusinessProps) {
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!data.url) return
    setAnalyzing(true)
    await new Promise((r) => setTimeout(r, 1500))
    setAnalyzing(false)
  }

  const canContinue = data.url && data.vertical && data.businessName

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="businessName">Nom de votre entreprise</Label>
        <Input
          id="businessName"
          placeholder="Maison Berlioz Immobilier"
          value={data.businessName}
          onChange={(e) => onChange({ ...data, businessName: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">URL de votre site web</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <Input
              id="url"
              placeholder="https://monentreprise.fr"
              value={data.url}
              onChange={(e) => onChange({ ...data, url: e.target.value })}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={!data.url || analyzing}
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {analyzing ? 'Analyse...' : 'Analyser'}
          </Button>
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">
          On extrait automatiquement vos services, FAQ et tarifs
        </p>
      </div>

      <div className="space-y-2">
        <Label>Votre secteur d'activité</Label>
        <VerticalSelector
          value={data.vertical}
          onChange={(vertical) => onChange({ ...data, vertical })}
        />
      </div>

      <Button
        className="w-full"
        onClick={onNext}
        disabled={!canContinue}
      >
        Continuer
      </Button>
    </div>
  )
}
