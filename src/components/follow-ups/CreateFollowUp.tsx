import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useFollowUps } from '@/hooks/useFollowUps'
import type { ChannelType } from '@/types/database'
import { addHours, format } from 'date-fns'

interface CreateFollowUpProps {
  open: boolean
  onClose: () => void
  contactId: string
  conversationId?: string
  defaultChannel?: ChannelType
}

const DELAY_OPTIONS = [
  { label: '1 heure', hours: 1 },
  { label: '3 heures', hours: 3 },
  { label: '24 heures', hours: 24 },
  { label: '48 heures', hours: 48 },
  { label: '72 heures', hours: 72 },
  { label: 'Personnalisé', hours: 0 },
]

export function CreateFollowUp({ open, onClose, contactId, conversationId, defaultChannel = 'whatsapp' }: CreateFollowUpProps) {
  const { createFollowUp } = useFollowUps()
  const [message, setMessage] = useState('')
  const [channelType, setChannelType] = useState<ChannelType>(defaultChannel)
  const [delayHours, setDelayHours] = useState(24)
  const [customDate, setCustomDate] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [cancelIfReplied, setCancelIfReplied] = useState(true)
  const [cancelIfBooked, setCancelIfBooked] = useState(true)

  const scheduledAt = isCustom && customDate
    ? new Date(customDate).toISOString()
    : addHours(new Date(), delayHours).toISOString()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message) return
    createFollowUp.mutate(
      {
        contact_id: contactId,
        conversation_id: conversationId,
        message,
        channel_type: channelType,
        scheduled_at: scheduledAt,
        cancel_if_replied: cancelIfReplied,
        cancel_if_booked: cancelIfBooked,
      },
      { onSuccess: () => { setMessage(''); onClose() } }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programmer une relance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Message *</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bonjour {{first_name}}, je reviens vers vous..."
              className="min-h-[80px] resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Canal</Label>
              <Select value={channelType} onValueChange={(v) => setChannelType(v as ChannelType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="webchat">WebChat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Délai</Label>
              <Select
                value={isCustom ? '0' : delayHours.toString()}
                onValueChange={(v) => {
                  if (v === '0') { setIsCustom(true) } else {
                    setIsCustom(false)
                    setDelayHours(parseInt(v))
                  }
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DELAY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.hours} value={opt.hours.toString()}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isCustom && (
            <div className="space-y-1.5">
              <Label>Date et heure</Label>
              <Input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
            </div>
          )}

          {!isCustom && (
            <p className="text-xs text-[var(--text-tertiary)]">
              Envoi prévu le {format(addHours(new Date(), delayHours), "d MMM 'à' HH:mm", { locale: undefined })}
            </p>
          )}

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

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1" disabled={createFollowUp.isPending || !message}>
              {createFollowUp.isPending ? 'Programmation...' : 'Programmer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
