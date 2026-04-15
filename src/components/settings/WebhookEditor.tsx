import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Copy, Check, Zap } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useWebhooks } from '@/hooks/useWebhooks'
import type { WebhookEvent } from '@/types/database'

const EVENT_GROUPS: { label: string; events: { value: WebhookEvent; label: string }[] }[] = [
  {
    label: 'Messages',
    events: [
      { value: 'message.received', label: 'Message reçu' },
      { value: 'message.sent', label: 'Message envoyé' },
    ],
  },
  {
    label: 'Conversations',
    events: [
      { value: 'conversation.created', label: 'Conversation créée' },
      { value: 'conversation.closed', label: 'Conversation fermée' },
    ],
  },
  {
    label: 'Contacts',
    events: [
      { value: 'contact.created', label: 'Contact créé' },
      { value: 'contact.updated', label: 'Contact modifié' },
    ],
  },
  {
    label: 'Rendez-vous',
    events: [
      { value: 'booking.created', label: 'RDV créé' },
      { value: 'booking.cancelled', label: 'RDV annulé' },
    ],
  },
  {
    label: 'Deals',
    events: [
      { value: 'deal.stage_changed', label: 'Étape modifiée' },
      { value: 'deal.won', label: 'Deal gagné' },
      { value: 'deal.lost', label: 'Deal perdu' },
    ],
  },
]

interface WebhookEditorProps {
  open: boolean
  onClose: () => void
}

export function WebhookEditor({ open, onClose }: WebhookEditorProps) {
  const { createWebhook } = useWebhooks()
  const [url, setUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>(['message.received'])
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [copiedSecret, setCopiedSecret] = useState(false)

  const toggleEvent = (event: WebhookEvent) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    )
  }

  const toggleGroup = (events: WebhookEvent[]) => {
    const allSelected = events.every((e) => selectedEvents.includes(e))
    if (allSelected) {
      setSelectedEvents((prev) => prev.filter((e) => !events.includes(e)))
    } else {
      setSelectedEvents((prev) => [...new Set([...prev, ...events])])
    }
  }

  const handleTest = async () => {
    if (!url) return
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-IKONIK-Event': 'test' },
        body: JSON.stringify({ event: 'test', data: { message: 'Webhook de test IKONIK' }, timestamp: new Date().toISOString() }),
      })
      setTestResult(res.ok ? 'success' : 'error')
      toast[res.ok ? 'success' : 'error'](
        res.ok ? 'Test réussi' : 'Test échoué',
        { description: `Statut HTTP: ${res.status}` }
      )
    } catch {
      setTestResult('error')
      toast.error('Impossible d\'atteindre l\'URL')
    }
    setTesting(false)
  }

  const handleCreate = async () => {
    if (!url.trim()) {
      toast.error('Saisissez une URL')
      return
    }
    if (selectedEvents.length === 0) {
      toast.error('Sélectionnez au moins un événement')
      return
    }
    try {
      await createWebhook.mutateAsync({ url: url.trim(), events: selectedEvents })
      toast.success('Webhook créé')
      handleClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      toast.error('Erreur', { description: message })
    }
  }

  const handleClose = () => {
    setUrl('')
    setSelectedEvents(['message.received'])
    setTestResult(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau webhook</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* URL */}
          <div className="space-y-1.5">
            <Label className="text-xs">URL de destination</Label>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => { setUrl(e.target.value); setTestResult(null) }}
                placeholder="https://votre-serveur.com/webhooks/ikonik"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={!url || testing}
                className="shrink-0 gap-1"
              >
                {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                Tester
              </Button>
            </div>
            {testResult && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs font-medium ${testResult === 'success' ? 'text-green-600' : 'text-red-500'}`}
              >
                {testResult === 'success' ? '✓ URL accessible' : '✗ URL inaccessible'}
              </motion.p>
            )}
          </div>

          {/* Events */}
          <div className="space-y-3">
            <Label className="text-xs">Événements à écouter</Label>
            <div className="space-y-4">
              {EVENT_GROUPS.map((group) => {
                const groupEvents = group.events.map((e) => e.value)
                const allSelected = groupEvents.every((e) => selectedEvents.includes(e))
                const someSelected = groupEvents.some((e) => selectedEvents.includes(e))

                return (
                  <div key={group.label} className="space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleGroup(groupEvents)}
                      className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors"
                    >
                      <span
                        className={`w-3 h-3 rounded border flex items-center justify-center transition-colors ${
                          allSelected
                            ? 'bg-brand-500 border-brand-500'
                            : someSelected
                            ? 'bg-brand-200 border-brand-300'
                            : 'border-[var(--border-default)]'
                        }`}
                      >
                        {(allSelected || someSelected) && (
                          <span className="w-1.5 h-1.5 bg-white rounded-sm" />
                        )}
                      </span>
                      {group.label}
                    </button>
                    <div className="pl-5 space-y-1.5">
                      {group.events.map((event) => (
                        <label
                          key={event.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.value)}
                            onChange={() => toggleEvent(event.value)}
                            className="accent-brand-500"
                          />
                          <span className="text-xs text-[var(--text-secondary)]">{event.label}</span>
                          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{event.value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info signing */}
          <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)] space-y-2">
            <p className="text-xs font-medium text-[var(--text-secondary)]">Signature HMAC</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">
              Chaque requête sera signée avec un secret HMAC-SHA256 généré automatiquement. Le secret sera affiché une fois après création.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreate}
              disabled={createWebhook.isPending}
            >
              {createWebhook.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer le webhook'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
