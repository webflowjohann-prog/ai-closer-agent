import { useState } from 'react'
import { QrCode } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useQRCodes } from '@/hooks/useQRCodes'
import { useOrgStore } from '@/stores/orgStore'

interface QRCodeGeneratorProps {
  open: boolean
  onClose: () => void
}

const CHANNEL_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp', desc: 'Ouvre une conversation WhatsApp' },
  { value: 'webchat', label: 'WebChat', desc: 'Ouvre le widget sur votre site' },
]

export function QRCodeGenerator({ open, onClose }: QRCodeGeneratorProps) {
  const { createQR } = useQRCodes()
  const { activeSubAccount } = useOrgStore()
  const [name, setName] = useState('')
  const [channel, setChannel] = useState<'whatsapp' | 'webchat'>('whatsapp')
  const [welcome, setWelcome] = useState('Bonjour, je suis intéressé par vos services.')

  const buildTargetUrl = () => {
    const phone = activeSubAccount?.phone || '+33600000000'
    const msg = encodeURIComponent(welcome)
    if (channel === 'whatsapp') return `https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`
    return `https://widget.ikonik-ac.com/${activeSubAccount?.id || 'demo'}`
  }

  const handleCreate = async () => {
    await createQR.mutateAsync({
      name,
      channel_type: channel as any,
      target_url: buildTargetUrl(),
      welcome_message: welcome,
    })
    setName('')
    setWelcome('Bonjour, je suis intéressé par vos services.')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-brand-500" />
            Nouveau QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="qrName" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Nom</Label>
            <Input id="qrName" placeholder="ex: Vitrine boutique, Flyer campagne A..." value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-2 block">Canal de destination</Label>
            <div className="grid grid-cols-2 gap-2">
              {CHANNEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setChannel(opt.value as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    channel === opt.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-[var(--border-default)] hover:border-brand-300'
                  }`}
                >
                  <p className={`text-sm font-medium ${channel === opt.value ? 'text-brand-700' : 'text-[var(--text-primary)]'}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="welcome" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
              Message d'accueil pré-rempli
            </Label>
            <Textarea
              id="welcome"
              rows={2}
              value={welcome}
              onChange={(e) => setWelcome(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button className="flex-1" onClick={handleCreate} disabled={!name || createQR.isPending}>
              {createQR.isPending ? 'Génération...' : 'Générer le QR'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
