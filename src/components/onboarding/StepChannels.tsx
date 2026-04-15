import { useState } from 'react'
import { MessageSquare, Instagram, Phone, Globe, Check, ChevronRight, QrCode } from 'lucide-react'
import { motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChannelConfig {
  whatsapp: boolean
  instagram: boolean
  webchat: boolean
  sms: boolean
}

interface StepChannelsProps {
  data: ChannelConfig
  onChange: (data: ChannelConfig) => void
  onNext: () => void
  onBack: () => void
}

const channels = [
  {
    id: 'whatsapp' as keyof ChannelConfig,
    name: 'WhatsApp Business',
    description: 'Scanner le QR code pour connecter',
    icon: MessageSquare,
    color: 'bg-green-50 border-green-200 text-green-600',
    badge: 'Recommandé',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'instagram' as keyof ChannelConfig,
    name: 'Instagram / Messenger',
    description: 'Connexion via Meta Business',
    icon: Instagram,
    color: 'bg-pink-50 border-pink-200 text-pink-600',
  },
  {
    id: 'webchat' as keyof ChannelConfig,
    name: 'Chat Web',
    description: 'Widget embarquable sur votre site',
    icon: Globe,
    color: 'bg-brand-50 border-brand-200 text-brand-600',
    badge: 'Inclus',
    badgeColor: 'bg-brand-100 text-brand-700',
  },
  {
    id: 'sms' as keyof ChannelConfig,
    name: 'SMS / RCS',
    description: 'Via Twilio (numéro requis)',
    icon: Phone,
    color: 'bg-violet-50 border-violet-200 text-violet-600',
  },
]

export function StepChannels({ data, onChange, onNext, onBack }: StepChannelsProps) {
  const [showQR, setShowQR] = useState(false)
  const activeCount = Object.values(data).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {channels.map((channel, i) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border transition-all duration-150',
              data[channel.id]
                ? 'border-brand-200 bg-brand-50'
                : 'border-[var(--border-default)] bg-[var(--surface-primary)]'
            )}
          >
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0', channel.color)}>
              <channel.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--text-primary)]">{channel.name}</p>
                {channel.badge && (
                  <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', channel.badgeColor)}>
                    {channel.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">{channel.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {data[channel.id] && channel.id === 'whatsapp' && (
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--surface-tertiary)] transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              )}
              <Switch
                checked={data[channel.id]}
                onCheckedChange={(checked) => onChange({ ...data, [channel.id]: checked })}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {showQR && data.whatsapp && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-default)] text-center"
        >
          <div className="w-32 h-32 bg-[var(--color-gray-200)] rounded-lg mx-auto mb-2 flex items-center justify-center">
            <QrCode className="w-12 h-12 text-[var(--text-tertiary)]" />
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            Scannez ce code avec WhatsApp Business → Appareils connectés
          </p>
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Retour
        </Button>
        <Button onClick={onNext} disabled={activeCount === 0} className="flex-2">
          {activeCount === 0 ? 'Choisir au moins 1 canal' : `Continuer (${activeCount} canal${activeCount > 1 ? 'x' : ''})`}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
