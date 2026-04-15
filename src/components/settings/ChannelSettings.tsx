import { useState } from 'react'
import { MessageSquare, Instagram, Globe, Phone, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Loader2, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'
import type { ChannelType } from '@/types/database'

interface ChannelDef {
  type: ChannelType
  name: string
  desc: string
  icon: React.ElementType
  iconColor: string
  fields: Array<{ key: string; label: string; placeholder: string; type?: string }>
}

const channelConfig: ChannelDef[] = [
  {
    type: 'whatsapp',
    name: 'WhatsApp Business',
    desc: 'Via 360dialog',
    icon: MessageSquare,
    iconColor: 'text-green-600 bg-green-50 border-green-200',
    fields: [
      { key: 'api_key', label: 'Clé API 360dialog', placeholder: 'wha_...', type: 'password' },
      { key: 'phone_number_id', label: 'Phone Number ID', placeholder: '1234567890' },
      { key: 'waba_id', label: 'WhatsApp Business Account ID', placeholder: '9876543210' },
    ],
  },
  {
    type: 'instagram',
    name: 'Instagram DM',
    desc: 'Via Meta Graph API',
    icon: Instagram,
    iconColor: 'text-pink-600 bg-pink-50 border-pink-200',
    fields: [
      { key: 'page_access_token', label: 'Page Access Token', placeholder: 'EAABsbCS...', type: 'password' },
      { key: 'ig_user_id', label: 'Instagram User ID', placeholder: '17841400...' },
    ],
  },
  {
    type: 'messenger',
    name: 'Facebook Messenger',
    desc: 'Via Meta Graph API',
    icon: MessageSquare,
    iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
    fields: [
      { key: 'page_access_token', label: 'Page Access Token', placeholder: 'EAABsbCS...', type: 'password' },
      { key: 'page_id', label: 'Page ID', placeholder: '123456789' },
    ],
  },
  {
    type: 'webchat',
    name: 'Chat Web',
    desc: 'Widget embarquable',
    icon: Globe,
    iconColor: 'text-brand-600 bg-brand-50 border-brand-200',
    fields: [
      { key: 'allowed_origins', label: 'Domaines autorisés', placeholder: 'https://votresite.com' },
      { key: 'widget_title', label: 'Titre du widget', placeholder: 'Bonjour 👋 Comment puis-je vous aider ?' },
    ],
  },
  {
    type: 'sms',
    name: 'SMS / RCS',
    desc: 'Via Twilio',
    icon: Phone,
    iconColor: 'text-violet-600 bg-violet-50 border-violet-200',
    fields: [
      { key: 'account_sid', label: 'Twilio Account SID', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      { key: 'auth_token', label: 'Auth Token', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'password' },
      { key: 'phone_number', label: 'Numéro Twilio', placeholder: '+33700000000' },
    ],
  },
]

function ChannelCard({ ch }: { ch: ChannelDef }) {
  const { activeSubAccount } = useOrgStore()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const handleSave = async () => {
    if (!activeSubAccount) { toast.error('Aucun compte actif'); return }
    setSaving(true)
    try {
      // Upsert the channel record with config
      const { error } = await supabase.from('channels').upsert(
        {
          sub_account_id: activeSubAccount.id,
          type: ch.type,
          status: enabled ? 'connected' : 'disconnected',
          config: values,
          external_name: ch.name,
        },
        { onConflict: 'sub_account_id,type' }
      )
      if (error) { toast.error('Erreur', { description: error.message }); return }
      setSaved(true)
      toast.success(`${ch.name} configuré`)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      toast.error('Erreur inattendue', { description: e?.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)] overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${ch.iconColor}`}>
          <ch.icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[var(--text-primary)]">{ch.name}</p>
            {saved ? (
              <Badge variant="success" className="text-[10px]">
                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                Configuré
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">
                <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
                Non configuré
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">{ch.desc}</p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </Button>
      </div>

      {/* Expanded config form */}
      {open && (
        <div className="border-t border-[var(--border-default)] p-4 space-y-3 bg-[var(--surface-secondary)]">
          {ch.fields.map((f) => (
            <div key={f.key} className="space-y-1">
              <Label className="text-xs text-[var(--text-tertiary)]">{f.label}</Label>
              <Input
                type={f.type || 'text'}
                placeholder={f.placeholder}
                value={values[f.key] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                className="text-sm font-mono"
              />
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="mt-1"
          >
            {saving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Enregistrement...</>
            ) : saved ? (
              <><Check className="w-3.5 h-3.5" /> Enregistré</>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export function ChannelSettings() {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs text-amber-800">
          <strong>Info :</strong> Les webhooks entrants (réception des messages) sont gérés par les Edge Functions Supabase.
          Configurez ici vos identifiants API pour l'envoi de messages sortants.
        </p>
      </div>
      {channelConfig.map((ch) => (
        <ChannelCard key={ch.type} ch={ch} />
      ))}
    </div>
  )
}
