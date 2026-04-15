import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, AlertCircle, Link2, Globe, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { testSwitchyConnection } from '@/lib/switchy'

export function SwitchySettings() {
  const { activeSubAccount, setActiveSubAccount } = useOrgStore()

  const [customDomain, setCustomDomain] = useState('go.ikonik-ac.com')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | 'idle'>('idle')
  const [saving, setSaving] = useState(false)

  const platformKeyConfigured = !!import.meta.env.VITE_SWITCHY_API_KEY

  useEffect(() => {
    if (!activeSubAccount) return
    setCustomDomain(activeSubAccount.switchy_custom_domain ?? 'go.ikonik-ac.com')
  }, [activeSubAccount?.id])

  async function handleTestConnection() {
    const apiKey = import.meta.env.VITE_SWITCHY_API_KEY as string
    if (!apiKey) {
      setTestResult('error')
      toast.error('Clé Switchy non configurée', {
        description: 'La variable VITE_SWITCHY_API_KEY est absente de l\'environnement.',
      })
      return
    }
    setTesting(true)
    setTestResult('idle')
    const ok = await testSwitchyConnection(apiKey)
    setTestResult(ok ? 'success' : 'error')
    setTesting(false)
    if (ok) {
      toast.success('Connexion réussie', { description: 'La clé Switchy plateforme est valide.' })
    } else {
      toast.error('Connexion échouée', { description: 'Vérifiez la clé VITE_SWITCHY_API_KEY sur Netlify.' })
    }
  }

  async function handleSave() {
    if (!activeSubAccount) return
    setSaving(true)

    const { error } = await supabase
      .from('sub_accounts')
      .update({ switchy_custom_domain: customDomain.trim() || null })
      .eq('id', activeSubAccount.id)

    if (error) {
      toast.error('Erreur de sauvegarde', { description: error.message })
    } else {
      if (setActiveSubAccount) {
        setActiveSubAccount({
          ...activeSubAccount,
          switchy_custom_domain: customDomain.trim() || undefined,
        })
      }
      toast.success('Domaine Switchy sauvegardé')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      {/* Header + platform status */}
      <div className="flex items-start gap-3 p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl">
        <Link2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Switchy — Liens trackés</p>
            {platformKeyConfigured ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Clé plateforme configurée
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Clé plateforme manquante
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Chaque lien envoyé par l'agent IA est automatiquement raccourci et tracké avec vos pixels.
            La clé API Switchy est gérée au niveau de la plateforme.
          </p>
        </div>
      </div>

      {/* Connection test */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Statut de la connexion</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={testing || !platformKeyConfigured}
            className="h-7 text-xs gap-1.5"
          >
            {testing
              ? <><Loader2 className="w-3 h-3 animate-spin" /> Test en cours...</>
              : <><RefreshCw className="w-3 h-3" /> Tester la connexion</>
            }
          </Button>
        </div>

        {testResult === 'success' && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            API Switchy opérationnelle
          </div>
        )}
        {testResult === 'error' && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
            <AlertCircle className="w-3.5 h-3.5" />
            {platformKeyConfigured
              ? 'Clé invalide — vérifiez sur switchy.io'
              : 'Variable VITE_SWITCHY_API_KEY absente de l\'environnement'
            }
          </div>
        )}
        {testResult === 'idle' && (
          <p className="text-xs text-[var(--text-tertiary)]">
            Cliquez sur "Tester la connexion" pour vérifier que la clé Switchy plateforme est valide.
          </p>
        )}
      </div>

      {/* Custom domain */}
      <div className="space-y-2">
        <Label className="text-xs">Domaine personnalisé</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <Input
            className="h-8 text-xs pl-8"
            placeholder="go.ikonik-ac.com"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
          />
        </div>
        <p className="text-xs text-[var(--text-tertiary)]">
          Domaine utilisé pour raccourcir les liens de ce compte. Par défaut : go.ikonik-ac.com
        </p>
      </div>

      {/* Save button */}
      <Button
        size="sm"
        onClick={handleSave}
        disabled={saving || customDomain === (activeSubAccount?.switchy_custom_domain ?? 'go.ikonik-ac.com')}
        className="w-full"
      >
        {saving ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Sauvegarde...</>
        ) : (
          'Enregistrer le domaine'
        )}
      </Button>
    </div>
  )
}
