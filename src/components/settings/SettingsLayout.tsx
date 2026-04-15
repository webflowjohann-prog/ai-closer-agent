import { useState } from 'react'
import { Building2, MessageSquare, Bot, Key, Users, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileSettings } from './ProfileSettings'
import { ChannelSettings } from './ChannelSettings'
import { BotSettings } from './BotSettings'
import { ApiKeySettings } from './ApiKeySettings'

const sections = [
  { id: 'profile', label: 'Profil entreprise', icon: Building2 },
  { id: 'channels', label: 'Canaux', icon: MessageSquare },
  { id: 'bot', label: 'Instructions bot', icon: Bot },
  { id: 'apikey', label: 'Clé API (BYOK)', icon: Key },
  { id: 'team', label: 'Équipe', icon: Users },
  { id: 'billing', label: 'Facturation', icon: CreditCard },
]

export function SettingsLayout() {
  const [active, setActive] = useState('profile')

  return (
    <div className="flex h-full gap-0">
      {/* Sidebar nav */}
      <div className="w-52 flex-shrink-0 border-r border-[var(--border-default)] bg-[var(--surface-primary)] p-3">
        <nav className="space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-left',
                active === s.id
                  ? 'bg-brand-50 text-brand-600 font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]'
              )}
            >
              <s.icon className="w-3.5 h-3.5 flex-shrink-0" />
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {active === 'profile' && <ProfileSettings />}
        {active === 'channels' && <ChannelSettings />}
        {active === 'bot' && <BotSettings />}
        {active === 'apikey' && <ApiKeySettings />}
        {active === 'team' && (
          <div className="text-center py-12 text-[var(--text-tertiary)]">
            <Users className="w-8 h-8 mx-auto mb-3" />
            <p className="text-sm">Gestion d'équipe — Bientôt disponible</p>
          </div>
        )}
        {active === 'billing' && (
          <div className="text-center py-12 text-[var(--text-tertiary)]">
            <CreditCard className="w-8 h-8 mx-auto mb-3" />
            <p className="text-sm">Facturation — Bientôt disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}
