import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { useFormConnections } from '@/hooks/useFormConnections'

interface FormConnectionEditorProps {
  open: boolean
  onClose: () => void
}

const SOURCES = [
  { value: 'webhook', label: 'Webhook personnalisé' },
  { value: 'meta_lead_ads', label: 'Meta Lead Ads' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'typeform', label: 'Typeform' },
  { value: 'custom', label: 'Autre' },
]

const CHANNELS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'webchat', label: 'WebChat' },
]

export function FormConnectionEditor({ open, onClose }: FormConnectionEditorProps) {
  const { createConnection } = useFormConnections()
  const [name, setName] = useState('')
  const [source, setSource] = useState('webhook')
  const [channel, setChannel] = useState('whatsapp')
  const [template, setTemplate] = useState(
    'Bonjour {{first_name}} ! Merci pour votre demande. Je suis votre conseiller AI Closer — pouvez-vous me donner plus d\'infos sur votre projet ?'
  )
  const [delay, setDelay] = useState([10])

  const handleCreate = async () => {
    await createConnection.mutateAsync({
      name,
      source: source as any,
      response_channel: channel as any,
      response_template: template,
      response_delay_seconds: delay[0],
      is_active: true,
    })
    onClose()
    setName('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle connexion formulaire</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fcName" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Nom</Label>
            <Input id="fcName" placeholder="ex: Meta Lead Ads — Campagne Été" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Source</Label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full text-sm border border-[var(--border-default)] rounded-lg px-3 py-2 bg-[var(--surface-primary)] text-[var(--text-primary)]"
              >
                {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Canal de réponse</Label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full text-sm border border-[var(--border-default)] rounded-lg px-3 py-2 bg-[var(--surface-primary)] text-[var(--text-primary)]"
              >
                {CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="template" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Message de réponse</Label>
            <Textarea id="template" rows={3} value={template} onChange={(e) => setTemplate(e.target.value)} />
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
              Variables : <code className="bg-[var(--surface-secondary)] px-1 rounded">{'{{first_name}}'}</code>{' '}
              <code className="bg-[var(--surface-secondary)] px-1 rounded">{'{{last_name}}'}</code>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-[var(--text-tertiary)]">Délai avant envoi</Label>
              <span className="text-xs font-semibold text-[var(--text-primary)]">{delay[0]} secondes</span>
            </div>
            <Slider value={delay} onValueChange={setDelay} min={5} max={60} step={5} className="w-full" />
            <div className="flex justify-between text-[10px] text-[var(--text-tertiary)] mt-1">
              <span>5s</span><span>60s</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button className="flex-1" onClick={handleCreate} disabled={!name || createConnection.isPending}>
              Créer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
