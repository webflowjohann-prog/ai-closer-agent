import { useState } from 'react'
import { Copy, Check, Code } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useOrgStore } from '@/stores/orgStore'

interface WebhookURLProps {
  webhookUrl?: string
  webhookSecret?: string
}

export function WebhookURL({ webhookUrl, webhookSecret }: WebhookURLProps) {
  const { activeSubAccount } = useOrgStore()
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)
  const url = webhookUrl || `https://api.ikonik-ac.com/webhooks/forms/${activeSubAccount?.id || 'YOUR_ID'}`

  const copy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const examplePayload = `{
  "first_name": "Sophie",
  "last_name": "Martin",
  "email": "sophie@email.fr",
  "phone": "+33612345678",
  "message": "Je suis intéressée"
}`

  return (
    <div className="space-y-3">
      {/* URL */}
      <div>
        <p className="text-xs text-[var(--text-tertiary)] mb-1.5">URL Webhook</p>
        <div className="flex items-center gap-2 p-2.5 bg-[var(--surface-secondary)] rounded-lg border border-[var(--border-default)]">
          <p className="text-xs font-mono text-[var(--text-secondary)] flex-1 truncate">{url}</p>
          <button onClick={() => copy(url, setCopiedUrl)} className="flex-shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Secret */}
      {webhookSecret && (
        <div>
          <p className="text-xs text-[var(--text-tertiary)] mb-1.5">Secret HMAC</p>
          <div className="flex items-center gap-2 p-2.5 bg-[var(--surface-secondary)] rounded-lg border border-[var(--border-default)]">
            <p className="text-xs font-mono text-[var(--text-secondary)] flex-1 truncate">{'•'.repeat(32)}</p>
            <button onClick={() => copy(webhookSecret, setCopiedSecret)} className="flex-shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
              {copiedSecret ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Payload example */}
      <Card className="p-3 bg-[var(--surface-secondary)]">
        <div className="flex items-center gap-1.5 mb-2">
          <Code className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <p className="text-xs font-medium text-[var(--text-secondary)]">Format du payload attendu</p>
        </div>
        <pre className="text-[10px] text-[var(--text-secondary)] font-mono overflow-x-auto leading-relaxed">
          {examplePayload}
        </pre>
      </Card>
    </div>
  )
}
