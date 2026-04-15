import { useState } from 'react'
import { Euro, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePaymentLinks } from '@/hooks/usePaymentLinks'
import type { Conversation } from '@/types/database'

interface SendPaymentDialogProps {
  open: boolean
  onClose: () => void
  conversation: Conversation | null
  onSendToChat?: (url: string, title: string, amount: number) => void
}

export function SendPaymentDialog({ open, onClose, conversation, onSendToChat }: SendPaymentDialogProps) {
  const { createLink } = usePaymentLinks(conversation?.id)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [created, setCreated] = useState<{ url: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreate = async () => {
    if (!title || !amount) return
    const link = await createLink.mutateAsync({
      title,
      amount: parseFloat(amount),
      currency: 'EUR',
      contact_id: conversation?.contact_id,
      conversation_id: conversation?.id,
    })
    setCreated({ url: link.stripe_payment_link_url || '' })
  }

  const handleCopy = () => {
    if (created?.url) {
      navigator.clipboard.writeText(created.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSendToChat = () => {
    if (created?.url && onSendToChat) {
      onSendToChat(created.url, title, parseFloat(amount))
      handleClose()
    }
  }

  const handleClose = () => {
    setCreated(null)
    setTitle('')
    setAmount('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Euro className="w-4 h-4 text-green-600" />
            Demande de paiement
          </DialogTitle>
        </DialogHeader>

        {!created ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="payTitle" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
                Intitulé
              </Label>
              <Input
                id="payTitle"
                placeholder="ex: Acompte consultation, Devis n°123..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payAmount" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
                Montant (EUR)
              </Label>
              <div className="relative">
                <Input
                  id="payAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="500.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-tertiary)]">€</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Annuler</Button>
              <Button
                className="flex-1"
                onClick={handleCreate}
                disabled={!title || !amount || createLink.isPending}
              >
                {createLink.isPending ? 'Génération...' : 'Créer le lien'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-sm font-semibold text-green-800">Lien créé !</p>
              </div>
              <p className="text-xs text-green-700 font-medium mb-1">{title}</p>
              <p className="text-xl font-bold text-green-800 font-mono">{parseFloat(amount).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
            </div>

            <div className="flex items-center gap-2 p-2 bg-[var(--surface-secondary)] rounded-lg">
              <p className="text-[11px] text-[var(--text-tertiary)] flex-1 truncate">{created.url}</p>
              <Button variant="ghost" size="icon" className="w-7 h-7 flex-shrink-0" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Fermer</Button>
              {onSendToChat && (
                <Button className="flex-1" onClick={handleSendToChat}>
                  Envoyer dans le chat
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
