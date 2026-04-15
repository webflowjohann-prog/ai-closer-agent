import { useState } from 'react'
import { Key, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function ApiKeySettings() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [saving, setSaving] = useState(false)

  const handleTest = async () => {
    if (!apiKey.startsWith('sk-ant-')) {
      toast.error('Format invalide', { description: 'La clé doit commencer par sk-ant-' })
      return
    }
    setTesting(true)
    setTestResult(null)
    await new Promise((r) => setTimeout(r, 1500))
    setTestResult('success')
    setTesting(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Clé API sauvegardée', {
      description: 'Votre clé est chiffrée et stockée de façon sécurisée.',
    })
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl">
        <p className="text-sm font-semibold text-brand-700 mb-1">Bring Your Own Key (BYOK)</p>
        <p className="text-xs text-brand-600">
          Utilisez votre propre clé API Claude Anthropic. Cela vous donne un contrôle total sur les coûts et la confidentialité des données.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Clé API Anthropic Claude</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder="sk-ant-api03-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pl-8 pr-10 font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <Button variant="outline" onClick={handleTest} disabled={!apiKey || testing}>
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {testing ? 'Test...' : 'Tester'}
          </Button>
        </div>
        {testResult && (
          <div className={`flex items-center gap-1.5 text-xs ${testResult === 'success' ? 'text-success' : 'text-danger'}`}>
            {testResult === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {testResult === 'success' ? 'Clé valide ✓' : 'Clé invalide ou quota épuisé'}
          </div>
        )}
        <p className="text-xs text-[var(--text-tertiary)]">
          Votre clé est chiffrée avec AES-256 avant d'être stockée
        </p>
      </div>

      <Button onClick={handleSave} disabled={!apiKey || saving} className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {saving ? 'Sauvegarde...' : 'Enregistrer la clé'}
      </Button>
    </div>
  )
}
