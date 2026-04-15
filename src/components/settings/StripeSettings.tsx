import { useState } from 'react'
import { CreditCard, Eye, EyeOff, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'

export function StripeSettings() {
  const { activeSubAccount } = useOrgStore()
  const [stripeKey, setStripeKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!activeSubAccount) { toast.error("Aucun compte actif", { description: "Rechargez la page ou reconnectez-vous." }); return }
    setLoading(true)
    try {
      const existingConfig = (activeSubAccount as any).config || {}
      const { error } = await supabase
        .from('sub_accounts')
        .update({ config: { ...existingConfig, stripe_secret_key: stripeKey } })
        .eq('id', activeSubAccount.id)
      if (error) throw error
      setSaved(true)
      toast.success('Clé Stripe enregistrée')
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      toast.error('Erreur', { description: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Paiements Stripe</h2>
        <p className="text-sm text-[var(--text-tertiary)]">
          Acceptez des paiements directement dans vos conversations WhatsApp, Instagram et WebChat
        </p>
      </div>

      {/* How it works */}
      <Card className="p-4 bg-brand-50 border-brand-200">
        <p className="text-xs font-semibold text-brand-700 mb-2">Comment ça marche</p>
        <div className="space-y-1.5 text-xs text-brand-600">
          <p>1. Votre agent IA propose un lien de paiement dans la conversation</p>
          <p>2. Le prospect paie directement via Stripe Checkout</p>
          <p>3. Vous êtes notifié en temps réel du paiement</p>
        </div>
      </Card>

      <div>
        <Label htmlFor="stripeKey" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
          Clé secrète Stripe <span className="text-[var(--text-tertiary)]">(sk_live_... ou sk_test_...)</span>
        </Label>
        <div className="relative">
          <Input
            id="stripeKey"
            type={showKey ? 'text' : 'password'}
            placeholder="sk_live_..."
            value={stripeKey}
            onChange={(e) => setStripeKey(e.target.value)}
            className="pr-10 font-mono text-xs"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
          Trouvez votre clé dans le{' '}
          <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline inline-flex items-center gap-0.5">
            Dashboard Stripe <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </p>
      </div>

      <Button
        onClick={handleSave}
        disabled={!stripeKey || loading}
        className="w-full sm:w-auto"
      >
        {saved ? <><Check className="w-3.5 h-3.5" /> Enregistré</> : loading ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </div>
  )
}
