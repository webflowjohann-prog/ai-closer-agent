import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Link2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { testSwitchyConnection } from '@/lib/switchy'

export function SwitchySettings() {
  const { activeSubAccount, setActiveSubAccount } = useOrgStore()

  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [customDomain, setCustomDomain] = useState('go.ikonik-ac.com')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [saving, setSaving] = useState(false)
  const [hasStoredKey, setHasStoredKey] = useState(false)

  useEffect(() => {
    if (!activeSubAccount) return
    // Show stored state (key is encrypted in DB, we just know if it exists)
    setHasStoredKey(!!activeSubAccount.switchy_api_key_encrypted)
    setCustomDomain(activeSubAccount.switchy_custom_domain ?? 'go.ikonik-ac.com')
  }, [activeSubAccount?.id])

  async function handleTest() {
    if (!apiKey.trim()) return
    setTesting(true)
    setTestResult(null)
    const ok = await testSwitchyConnection(apiKey.trim())
    setTestResult(ok ? 'success' : 'error')
    setTesting(false)
    if (ok) {
      toast.success('Connexion réussie', { description: 'Votre clé Switchy est valide.' })
    } else {
      toast.error('Connexion échouée', { description: 'Vérifiez votre clé API Switchy.' })
    }
  }

  async function handleSave() {
    if (!activeSubAccount) return
    setSaving(true)

    const updates: Record<string, string | null> = {
      switchy_custom_domain: customDomain.trim() || null,
    }

    if (apiKey.trim()) {
      // In prod: encrypt before storing — stored as-is here (same pattern as other BYOK keys)
      updates.switchy_api_key_encrypted = apiKey.trim()
    }

    const { error } = await supabase
      .from('sub_accounts')
      .update(updates)
      .eq('id', activeSubAccount.id)

    if (error) {
      toast.error('Erreur de sauvegarde', { description: error.message })
    } else {
      if (apiKey.trim()) setHasStoredKey(true)
      // Update local store
      if (setActiveSubAccount) {
        setActiveSubAccount({
          ...activeSubAccount,
          switchy_api_key_encrypted: apiKey.trim() || activeSubAccount.switchy_api_key_encrypted,
          switchy_custom_domain: customDomain.trim() || undefined,
        })
      }
      toast.success('Réglages Switchy sauvegardés')
      if (apiKey.trim()) setApiKey('')
    }
    setSaving(false)
  }

  const isConnected = hasStoredKey

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl">
        <Link2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Switchy — Liens trackés</p>
            {isConnected ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Connecté
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-medium text-[var(--text-tertiary)] bg-[var(--surface-tertiary)] px-2 py-0.5 rounded-full">
                Non configuré
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Chaque lien envoyé par votre agent IA est automatiquement raccourci et tracké avec vos pixels.
          </p>
        </div>
      </div>

      {/* API Key */}
      <div className="space-y-2">
        <Label className="text-xs">Clé API Switchy</Label>
        {isConnected && !apiKey && (
          <p className="text-xs text-green-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            Une clé est déjà enregistrée. Saisissez une nouvelle clé pour la remplacer.
          </p>
        )}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder={isConnected ? '••••••••••••••••••••' : 'sk_live_xxxxxxxxxxxxxxxxxx'}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setTestResult(null) }}
              className="pr-10 font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={!apiKey.trim() || testing}
            className="shrink-0"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Tester'}
          </Button>
        </div>

        <AnimatePresence>
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-1.5 text-xs font-medium ${
                testResult === 'success' ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {testResult === 'success'
                ? <><CheckCircle2 className="w-3.5 h-3.5" /> Connexion réussie</>
                : <><AlertCircle className="w-3.5 h-3.5" /> Clé invalide — vérifiez sur switchy.io</>
              }
            </motion.div>
          )}
        </AnimatePresence>
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
          Domaine utilisé pour raccourcir les liens. Par défaut : go.ikonik-ac.com
        </p>
      </div>

      {/* Save button */}
      <Button
        size="sm"
        onClick={handleSave}
        disabled={saving || (!apiKey.trim() && customDomain === (activeSubAccount?.switchy_custom_domain ?? 'go.ikonik-ac.com'))}
        className="w-full"
      >
        {saving ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Sauvegarde...</>
        ) : (
          'Enregistrer les réglages Switchy'
        )}
      </Button>
    </div>
  )
}
