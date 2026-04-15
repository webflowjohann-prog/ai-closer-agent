import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, AlertTriangle, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useApiKeys } from '@/hooks/useApiKeys'

const PERMISSIONS = [
  { id: 'read', label: 'Lecture', description: 'Lire les données (contacts, conversations)' },
  { id: 'contacts', label: 'Contacts', description: 'Créer et modifier des contacts' },
  { id: 'conversations', label: 'Conversations', description: 'Envoyer des messages' },
  { id: 'campaigns', label: 'Campagnes', description: 'Gérer les campagnes outbound' },
  { id: 'write', label: 'Écriture complète', description: 'Accès en écriture total' },
]

interface CreateApiKeyDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateApiKeyDialog({ open, onClose }: CreateApiKeyDialogProps) {
  const { createApiKey } = useApiKeys()
  const [step, setStep] = useState<'form' | 'reveal'>('form')
  const [name, setName] = useState('')
  const [selectedPerms, setSelectedPerms] = useState<string[]>(['read'])
  const [expiry, setExpiry] = useState('never')
  const [generatedKey, setGeneratedKey] = useState('')
  const [copied, setCopied] = useState(false)

  const togglePerm = (id: string) => {
    setSelectedPerms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Donnez un nom à cette clé')
      return
    }

    const expiryMap: Record<string, string | undefined> = {
      never: undefined,
      '30d': new Date(Date.now() + 30 * 86400000).toISOString(),
      '90d': new Date(Date.now() + 90 * 86400000).toISOString(),
      '1y': new Date(Date.now() + 365 * 86400000).toISOString(),
    }

    try {
      const result = await createApiKey.mutateAsync({
        name: name.trim(),
        permissions: selectedPerms,
        expiresAt: expiryMap[expiry],
      })
      setGeneratedKey(result.rawKey)
      setStep('reveal')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      toast.error('Erreur', { description: message })
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Clé copiée dans le presse-papiers')
  }

  const handleClose = () => {
    setStep('form')
    setName('')
    setSelectedPerms(['read'])
    setExpiry('never')
    setGeneratedKey('')
    setCopied(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'form' ? 'Créer une clé API' : 'Clé API créée'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <Label className="text-xs">Nom de la clé</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: Production webhook, CRM sync..."
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Permissions</Label>
                <div className="space-y-2">
                  {PERMISSIONS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedPerms.includes(p.id)
                          ? 'border-brand-300 bg-brand-50/50'
                          : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(p.id)}
                        onChange={() => togglePerm(p.id)}
                        className="mt-0.5 accent-brand-500"
                      />
                      <div>
                        <p className="text-xs font-medium text-[var(--text-primary)]">{p.label}</p>
                        <p className="text-[10px] text-[var(--text-tertiary)]">{p.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Expiration</Label>
                <Select value={expiry} onValueChange={setExpiry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Pas d'expiration</SelectItem>
                    <SelectItem value="30d">30 jours</SelectItem>
                    <SelectItem value="90d">90 jours</SelectItem>
                    <SelectItem value="1y">1 an</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Annuler
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreate}
                  disabled={createApiKey.isPending || selectedPerms.length === 0}
                >
                  {createApiKey.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Générer la clé'
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  <strong>Cette clé ne sera affichée qu'une seule fois.</strong> Copiez-la maintenant et stockez-la en lieu sûr. Vous ne pourrez plus la voir après fermeture de cette fenêtre.
                </p>
              </div>

              {/* Key display */}
              <div className="space-y-1.5">
                <Label className="text-xs">Votre clé API</Label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)] font-mono text-xs text-[var(--text-primary)] break-all select-all">
                    {generatedKey}
                  </div>
                  <Button
                    size="icon"
                    variant={copied ? 'default' : 'outline'}
                    onClick={handleCopy}
                    className="flex-shrink-0 h-auto"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Usage example */}
              <div className="space-y-1.5">
                <Label className="text-xs">Exemple d'utilisation</Label>
                <div className="p-3 bg-gray-900 rounded-xl font-mono text-[10px] text-green-400 overflow-x-auto">
                  <span className="text-gray-500">Authorization: </span>Bearer {generatedKey.slice(0, 20)}...
                </div>
              </div>

              <Button className="w-full" onClick={handleClose}>
                J'ai copié ma clé — Fermer
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
