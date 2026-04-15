import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDeals } from '@/hooks/useDeals'
import type { DealStage } from '@/types/database'
import { STAGE_CONFIG } from './DealColumn'

const STAGES: DealStage[] = ['lead', 'qualified', 'meeting', 'proposal', 'negotiation', 'closed_won', 'closed_lost']

interface CreateDealDialogProps {
  open: boolean
  onClose: () => void
  defaultStage?: DealStage
  contacts: { id: string; full_name?: string; email?: string }[]
}

export function CreateDealDialog({ open, onClose, defaultStage = 'lead', contacts }: CreateDealDialogProps) {
  const { createDeal } = useDeals()
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [stage, setStage] = useState<DealStage>(defaultStage)
  const [contactId, setContactId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !contactId) return
    createDeal.mutate(
      { title, value: value ? parseFloat(value) : undefined, stage, contact_id: contactId },
      {
        onSuccess: () => {
          setTitle('')
          setValue('')
          setStage('lead')
          setContactId('')
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Appartement 3P Rouen Centre"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Contact *</Label>
            <Select value={contactId} onValueChange={setContactId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.full_name || c.email || c.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="value">Valeur (€)</Label>
              <Input
                id="value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Étape</Label>
              <Select value={stage} onValueChange={(v) => setStage(v as DealStage)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STAGE_CONFIG[s].color }} />
                        {STAGE_CONFIG[s].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={createDeal.isPending || !title || !contactId}>
              {createDeal.isPending ? 'Création...' : 'Créer le deal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
