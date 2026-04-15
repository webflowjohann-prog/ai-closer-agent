import { MessageSquare, Instagram, Globe, Phone, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { ChannelType } from '@/types/database'

interface ChannelSettingsProps {
  channels?: Array<{ type: ChannelType; status: string }>
}

const channelConfig = [
  { type: 'whatsapp' as ChannelType, name: 'WhatsApp Business', desc: 'Via 360dialog', icon: MessageSquare, iconColor: 'text-green-600 bg-green-50 border-green-200', docsUrl: '#' },
  { type: 'instagram' as ChannelType, name: 'Instagram DM', desc: 'Via Meta Graph API', icon: Instagram, iconColor: 'text-pink-600 bg-pink-50 border-pink-200', docsUrl: '#' },
  { type: 'messenger' as ChannelType, name: 'Facebook Messenger', desc: 'Via Meta Graph API', icon: MessageSquare, iconColor: 'text-blue-600 bg-blue-50 border-blue-200', docsUrl: '#' },
  { type: 'webchat' as ChannelType, name: 'Chat Web', desc: 'Widget embarquable', icon: Globe, iconColor: 'text-brand-600 bg-brand-50 border-brand-200', docsUrl: '#' },
  { type: 'sms' as ChannelType, name: 'SMS / RCS', desc: 'Via Twilio', icon: Phone, iconColor: 'text-violet-600 bg-violet-50 border-violet-200', docsUrl: '#' },
]

export function ChannelSettings({ channels = [] }: ChannelSettingsProps) {
  return (
    <div className="space-y-3">
      {channelConfig.map((ch) => {
        const existingChannel = channels.find((c) => c.type === ch.type)
        const isConnected = existingChannel?.status === 'connected'

        return (
          <div
            key={ch.type}
            className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)]"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${ch.iconColor}`}>
              <ch.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">{ch.name}</p>
                {isConnected ? (
                  <Badge variant="success" className="text-[10px]">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                    Connecté
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
                    Déconnecté
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">{ch.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" asChild>
                <a href={ch.docsUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                  Configurer
                </a>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
