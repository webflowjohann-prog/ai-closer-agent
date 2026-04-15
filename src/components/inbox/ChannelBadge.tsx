import { MessageSquare, Instagram, Globe, Phone, Facebook } from 'lucide-react'
import type { ChannelType } from '@/types/database'
import { cn } from '@/lib/utils'

const channelConfig: Record<ChannelType, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  whatsapp: { icon: MessageSquare, label: 'WhatsApp', color: 'text-green-600 bg-green-50' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'text-pink-600 bg-pink-50' },
  messenger: { icon: Facebook, label: 'Messenger', color: 'text-blue-600 bg-blue-50' },
  sms: { icon: Phone, label: 'SMS', color: 'text-violet-600 bg-violet-50' },
  webchat: { icon: Globe, label: 'WebChat', color: 'text-brand-600 bg-brand-50' },
}

interface ChannelBadgeProps {
  type: ChannelType
  className?: string
}

export function ChannelBadge({ type, className }: ChannelBadgeProps) {
  const config = channelConfig[type] || channelConfig.webchat
  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md',
      config.color,
      className
    )}>
      <config.icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  )
}
