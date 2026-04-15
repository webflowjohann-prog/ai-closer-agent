import { useState } from 'react'
import { Star, ExternalLink, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'

export function ReviewSettings() {
  const { activeSubAccount } = useOrgStore()
  const [googleUrl, setGoogleUrl] = useState('')
  const [trustpilotUrl, setTrustpilotUrl] = useState('')
  const [message, setMessage] = useState(
    'Bonjour {{first_name}} ! Nous espérons que vous êtes satisfait de nos services 😊 Nous serions ravis si vous pouviez partager votre expérience en nous laissant un avis — cela nous aide beaucoup. Merci !'
  )
  const [autoSend, setAutoSend] = useState(false)
  const [delayDays, setDelayDays] = useState('2')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!activeSubAccount) { toast.error("Aucun compte actif", { description: "Rechargez la page ou reconnectez-vous." }); return }
    try {
      const existingConfig = (activeSubAccount as any).config || {}
      const { error } = await supabase.from('sub_accounts').update({
        config: {
          ...existingConfig,
          review_google_url: googleUrl,
          review_trustpilot_url: trustpilotUrl,
          review_message: message,
          review_auto_send: autoSend,
          review_delay_days: parseInt(delayDays),
        },
      }).eq('id', activeSubAccount.id)
      if (error) throw error
      setSaved(true)
      toast.success('Configuration enregistrée')
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      toast.error('Erreur', { description: e.message })
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500" />
          Automatisation des avis
        </h2>
        <p className="text-sm text-[var(--text-tertiary)]">
          Demandez automatiquement un avis à vos clients après un deal gagné
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="gUrl" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
            URL Google Business Reviews
          </Label>
          <Input id="gUrl" placeholder="https://g.page/r/..." value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="tpUrl" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
            URL TrustPilot
          </Label>
          <Input id="tpUrl" placeholder="https://fr.trustpilot.com/review/..." value={trustpilotUrl} onChange={(e) => setTrustpilotUrl(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="reviewMsg" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
            Message de demande d'avis
          </Label>
          <Textarea
            id="reviewMsg"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
            Variable disponible : <code className="bg-[var(--surface-secondary)] px-1 rounded">{'{{first_name}}'}</code>
          </p>
        </div>

        <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-lg">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Envoi automatique</p>
            <p className="text-xs text-[var(--text-tertiary)]">Après chaque deal gagné</p>
          </div>
          <Switch checked={autoSend} onCheckedChange={setAutoSend} />
        </div>

        {autoSend && (
          <div>
            <Label htmlFor="delay" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
              Délai après le deal gagné (jours)
            </Label>
            <Input
              id="delay"
              type="number"
              min="0"
              max="30"
              value={delayDays}
              onChange={(e) => setDelayDays(e.target.value)}
              className="w-28"
            />
          </div>
        )}

        <Button type="button" onClick={handleSave}>
          {saved ? <><Check className="w-3.5 h-3.5" /> Enregistré</> : 'Enregistrer'}
        </Button>
      </div>
    </div>
  )
}
