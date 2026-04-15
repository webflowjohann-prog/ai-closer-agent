import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRoutingRules } from '@/hooks/useRoutingRules'

interface Condition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than'
  value: string
}

interface RoutingRuleEditorProps {
  open: boolean
  onClose: () => void
}

const FIELD_OPTIONS = [
  { value: 'budget', label: 'Budget' },
  { value: 'location', label: 'Localisation' },
  { value: 'score', label: 'Score lead' },
  { value: 'channel', label: 'Canal' },
  { value: 'tag', label: 'Tag' },
]

const OPERATOR_OPTIONS = [
  { value: 'equals', label: '=' },
  { value: 'contains', label: 'contient' },
  { value: 'greater_than', label: '>' },
  { value: 'less_than', label: '<' },
]

export function RoutingRuleEditor({ open, onClose }: RoutingRuleEditorProps) {
  const { createRule } = useRoutingRules()
  const [name, setName] = useState('')
  const [conditions, setConditions] = useState<Condition[]>([{ field: 'score', operator: 'greater_than', value: '70' }])
  const [assignTo, setAssignTo] = useState('')

  const addCondition = () => {
    setConditions([...conditions, { field: 'budget', operator: 'contains', value: '' }])
  }

  const updateCondition = (i: number, updates: Partial<Condition>) => {
    setConditions(conditions.map((c, idx) => idx === i ? { ...c, ...updates } : c))
  }

  const removeCondition = (i: number) => {
    setConditions(conditions.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createRule.mutateAsync({
      name,
      conditions,
      assign_to_user_id: assignTo,
      priority: 10,
      is_active: true,
    })
    onClose()
    setName('')
    setConditions([{ field: 'score', operator: 'greater_than', value: '70' }])
    setAssignTo('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle règle de routing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rname" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Nom de la règle</Label>
            <Input id="rname" placeholder="ex: Leads premium → Samy" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Conditions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-[var(--text-tertiary)]">Conditions (SI)</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addCondition} className="h-7 text-xs">
                <Plus className="w-3 h-3" /> Ajouter
              </Button>
            </div>
            <div className="space-y-2">
              {conditions.map((cond, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <select
                    value={cond.field}
                    onChange={(e) => updateCondition(i, { field: e.target.value })}
                    className="flex-1 text-xs border border-[var(--border-default)] rounded-md px-2 py-1.5 bg-[var(--surface-primary)] text-[var(--text-primary)]"
                  >
                    {FIELD_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                  <select
                    value={cond.operator}
                    onChange={(e) => updateCondition(i, { operator: e.target.value as any })}
                    className="w-24 text-xs border border-[var(--border-default)] rounded-md px-2 py-1.5 bg-[var(--surface-primary)] text-[var(--text-primary)]"
                  >
                    {OPERATOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <Input
                    className="flex-1 text-xs h-7"
                    placeholder="valeur"
                    value={cond.value}
                    onChange={(e) => updateCondition(i, { value: e.target.value })}
                  />
                  {conditions.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="w-7 h-7" onClick={() => removeCondition(i)}>
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assign to */}
          <div>
            <Label htmlFor="assignTo" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
              Assigner à (email du membre d'équipe)
            </Label>
            <Input id="assignTo" type="email" placeholder="samy@entreprise.fr" value={assignTo} onChange={(e) => setAssignTo(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1" disabled={!name || !assignTo || createRule.isPending}>
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
