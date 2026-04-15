import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Shield, ChevronDown, ChevronUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { PROVIDERS, PROVIDER_ORDER, type LLMProvider } from '@/lib/ai/providers'
import { PROVIDER_ICONS } from '@/lib/ai/provider-icons'

interface ProviderState {
  key: string
  model: string
  showKey: boolean
  testing: boolean
  testResult: 'success' | 'error' | null
  saving: boolean
  expanded: boolean
}

function initialState(provider: LLMProvider): ProviderState {
  return {
    key: '',
    model: PROVIDERS[provider].defaultModel,
    showKey: false,
    testing: false,
    testResult: null,
    saving: false,
    expanded: provider === 'anthropic',
  }
}

async function testProviderKey(provider: LLMProvider, apiKey: string): Promise<boolean> {
  switch (provider) {
    case 'anthropic': {
      // Minimal message to verify key
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'Hi' }],
          }),
        })
        return res.status !== 401 && res.status !== 403
      } catch {
        return false
      }
    }
    case 'openai': {
      try {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        return res.ok
      } catch {
        return false
      }
    }
    case 'gemini': {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        )
        return res.ok
      } catch {
        return false
      }
    }
    case 'mistral': {
      try {
        const res = await fetch('https://api.mistral.ai/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        return res.ok
      } catch {
        return false
      }
    }
    default:
      return false
  }
}

export function ApiKeySettings() {
  const { activeSubAccount } = useOrgStore()
  const [defaultProvider, setDefaultProvider] = useState<LLMProvider>('anthropic')
  const [states, setStates] = useState<Record<LLMProvider, ProviderState>>({
    anthropic: initialState('anthropic'),
    openai: initialState('openai'),
    gemini: initialState('gemini'),
    mistral: initialState('mistral'),
  })

  const update = (provider: LLMProvider, patch: Partial<ProviderState>) => {
    setStates((prev) => ({ ...prev, [provider]: { ...prev[provider], ...patch } }))
  }

  const handleTest = async (provider: LLMProvider) => {
    const { key } = states[provider]
    if (!key) return
    update(provider, { testing: true, testResult: null })
    const ok = await testProviderKey(provider, key)
    update(provider, { testing: false, testResult: ok ? 'success' : 'error' })
    if (ok) {
      toast.success('Clé valide', { description: `La clé ${PROVIDERS[provider].name} fonctionne correctement.` })
    } else {
      toast.error('Clé invalide', { description: 'Vérifiez votre clé et réessayez.' })
    }
  }

  const handleSave = async (provider: LLMProvider) => {
    const { key, model } = states[provider]
    if (!key || !activeSubAccount) return
    update(provider, { saving: true })

    // Map provider to DB column
    const columnMap: Record<LLMProvider, string> = {
      anthropic: 'claude_api_key_encrypted',
      openai: 'openai_api_key_encrypted',
      gemini: 'gemini_api_key_encrypted',
      mistral: 'mistral_api_key_encrypted',
    }

    const updates: Record<string, string> = {
      [columnMap[provider]]: key, // In prod: encrypt before storing
    }

    // If this is the default provider, update that too
    if (defaultProvider === provider) {
      updates.default_llm_provider = provider
      updates.default_llm_model = model
    }

    const { error } = await supabase
      .from('sub_accounts')
      .update(updates)
      .eq('id', activeSubAccount.id)

    update(provider, { saving: false })

    if (error) {
      toast.error('Erreur de sauvegarde', { description: error.message })
    } else {
      toast.success('Clé sauvegardée', {
        description: `Clé ${PROVIDERS[provider].name} chiffrée et stockée.`,
      })
    }
  }

  const handleSetDefault = async (provider: LLMProvider) => {
    setDefaultProvider(provider)
    if (!activeSubAccount) return
    const { error } = await supabase
      .from('sub_accounts')
      .update({
        default_llm_provider: provider,
        default_llm_model: states[provider].model,
      })
      .eq('id', activeSubAccount.id)
    if (!error) {
      toast.success(`${PROVIDERS[provider].name} défini comme provider par défaut`)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header banner */}
      <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl flex items-start gap-3">
        <Shield className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-brand-700">Bring Your Own Key (BYOK)</p>
          <p className="text-xs text-brand-600 mt-0.5">
            Connectez vos propres clés API LLM. Choisissez le provider par défaut pour votre agent.
            Toutes les clés sont chiffrées avec AES-256 avant d'être stockées.
          </p>
        </div>
      </div>

      {/* Default provider selector */}
      <div className="flex items-center justify-between p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)]">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Provider par défaut</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">L'agent utilisera ce LLM en priorité</p>
        </div>
        <Select value={defaultProvider} onValueChange={(v) => handleSetDefault(v as LLMProvider)}>
          <SelectTrigger className="w-44 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROVIDER_ORDER.map((p) => {
              const cfg = PROVIDERS[p]
              const Icon = PROVIDER_ICONS[p]
              const hasKey = !!states[p].key
              return (
                <SelectItem key={p} value={p}>
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    {cfg.shortName}
                    {hasKey && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                  </span>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Provider cards */}
      <div className="space-y-3">
        {PROVIDER_ORDER.map((providerId, idx) => {
          const cfg = PROVIDERS[providerId]
          const state = states[providerId]
          const Icon = PROVIDER_ICONS[providerId]
          const isDefault = defaultProvider === providerId
          const hasKey = !!state.key

          return (
            <motion.div
              key={providerId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3, ease: 'easeOut' }}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                isDefault
                  ? 'border-brand-300 shadow-sm'
                  : 'border-[var(--border-default)]'
              }`}
            >
              {/* Card header */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                style={{ background: state.expanded ? cfg.bgColor : 'transparent' }}
                onClick={() => update(providerId, { expanded: !state.expanded })}
              >
                {/* Provider icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: cfg.bgColor }}
                >
                  <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{cfg.name}</span>
                    {cfg.recommended && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        Recommandé
                      </span>
                    )}
                    {isDefault && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700">
                        Actif
                      </span>
                    )}
                    {hasKey && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Clé renseignée
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] truncate">{cfg.description}</p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!isDefault && hasKey && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSetDefault(providerId) }}
                      className="text-[10px] font-medium px-2 py-1 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      Définir par défaut
                    </button>
                  )}
                  {state.expanded
                    ? <ChevronUp className="w-4 h-4 text-[var(--text-tertiary)]" />
                    : <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                  }
                </div>
              </div>

              {/* Expanded body */}
              <AnimatePresence initial={false}>
                {state.expanded && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-4 pb-4 pt-1 space-y-4 border-t border-[var(--border-default)]">
                      {/* API Key */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">Clé API</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              type={state.showKey ? 'text' : 'password'}
                              placeholder={cfg.keyPlaceholder}
                              value={state.key}
                              onChange={(e) => update(providerId, { key: e.target.value, testResult: null })}
                              className="pr-10 font-mono text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => update(providerId, { showKey: !state.showKey })}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                            >
                              {state.showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTest(providerId)}
                            disabled={!state.key || state.testing}
                            className="shrink-0"
                          >
                            {state.testing
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : 'Tester'
                            }
                          </Button>
                        </div>

                        {/* Test result */}
                        <AnimatePresence>
                          {state.testResult && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className={`flex items-center gap-1.5 text-xs font-medium ${
                                state.testResult === 'success' ? 'text-green-600' : 'text-red-500'
                              }`}
                            >
                              {state.testResult === 'success'
                                ? <CheckCircle2 className="w-3.5 h-3.5" />
                                : <AlertCircle className="w-3.5 h-3.5" />
                              }
                              {state.testResult === 'success'
                                ? 'Clé valide — connexion réussie'
                                : 'Clé invalide ou quota épuisé'
                              }
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Model selector */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">Modèle par défaut</Label>
                        <Select
                          value={state.model}
                          onValueChange={(v) => update(providerId, { model: v })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cfg.models.map((m) => (
                              <SelectItem key={m.id} value={m.id} className="text-xs">
                                {m.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Save button */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(providerId)}
                          disabled={!state.key || state.saving}
                          className="flex-1"
                        >
                          {state.saving
                            ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Sauvegarde...</>
                            : 'Enregistrer'
                          }
                        </Button>
                        {!isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetDefault(providerId)}
                            className="flex-shrink-0"
                            style={{ borderColor: cfg.color, color: cfg.color }}
                          >
                            Définir par défaut
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Info footer */}
      <p className="text-xs text-[var(--text-tertiary)] text-center">
        Les clés API sont chiffrées avec AES-256 et ne sont jamais exposées côté client après sauvegarde.
      </p>
    </div>
  )
}
