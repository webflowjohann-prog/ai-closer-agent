import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const DELAY_OPTIONS = ['24', '48', '72']
const MAX_FOLLOWUPS = ['1', '2', '3', '5']

export function FollowUpSettings() {
  const [defaultDelay, setDefaultDelay] = useState('24')
  const [maxFollowUps, setMaxFollowUps] = useState('3')
  const [autoCreate, setAutoCreate] = useState(true)
  const [cancelIfReplied, setCancelIfReplied] = useState(true)
  const [cancelIfBooked, setCancelIfBooked] = useState(true)

  const handleSave = () => {
    // In production, save to sub_account config
    toast.success('Configuration sauvegardée')
  }

  return (
    <div className="space-y-4 p-4 border border-[var(--border-default)] rounded-xl">
      <h4 className="text-sm font-semibold text-[var(--text-primary)]">Relances automatiques</h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm">Créer automatiquement</Label>
            <p className="text-xs text-[var(--text-tertiary)]">Planifier une relance si pas de réponse après X heures</p>
          </div>
          <Switch checked={autoCreate} onCheckedChange={setAutoCreate} />
        </div>

        {autoCreate && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Délai par défaut</Label>
                <Select value={defaultDelay} onValueChange={setDefaultDelay}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DELAY_OPTIONS.map((d) => (
                      <SelectItem key={d} value={d} className="text-xs">{d} heures</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Relances max</Label>
                <Select value={maxFollowUps} onValueChange={setMaxFollowUps}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MAX_FOLLOWUPS.map((n) => (
                      <SelectItem key={n} value={n} className="text-xs">{n} relance{parseInt(n) > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Annuler si réponse reçue</Label>
                <Switch checked={cancelIfReplied} onCheckedChange={setCancelIfReplied} className="scale-75" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Annuler si RDV pris</Label>
                <Switch checked={cancelIfBooked} onCheckedChange={setCancelIfBooked} className="scale-75" />
              </div>
            </div>
          </>
        )}
      </div>

      <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
    </div>
  )
}
