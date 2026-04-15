import { useState } from 'react'
import {
  Building2, MessageSquare, Bot, Key, Users, CreditCard,
  Palette, Code2, BarChart3, Star, CreditCard as StripeIcon,
  GitBranch, Video, Target, Link2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileSettings } from './ProfileSettings'
import { ChannelSettings } from './ChannelSettings'
import { BotSettings } from './BotSettings'
import { ApiKeySettings } from './ApiKeySettings'
import { WhiteLabelSettings } from './WhiteLabelSettings'
import { ApiAccessSettings } from './ApiAccessSettings'
import { BotScheduleSettings } from './BotScheduleSettings'
import { OptimizeBot } from './OptimizeBot'
import { ReportSettings } from './ReportSettings'
import { ReviewSettings } from './ReviewSettings'
import { StripeSettings } from './StripeSettings'
import { RoutingRules } from './RoutingRules'
import { VideoAISettings } from './VideoAISettings'
import { PixelSettings } from './PixelSettings'
import { SwitchySettings } from './SwitchySettings'
import { Separator } from '@/components/ui/separator'

const sections = [
  { id: 'profile', label: 'Profil entreprise', icon: Building2 },
  { id: 'channels', label: 'Canaux', icon: MessageSquare },
  { id: 'bot', label: 'Instructions bot', icon: Bot },
  { id: 'apikey', label: 'Clé API (BYOK)', icon: Key },
  { id: 'pixels', label: 'Pixels', icon: Target },
  { id: 'switchy', label: 'Liens trackés', icon: Link2 },
  { id: 'whitelabel', label: 'White-Label', icon: Palette },
  { id: 'api', label: 'API & Webhooks', icon: Code2 },
  { id: 'reports', label: 'Rapports', icon: BarChart3 },
  { id: 'reviews', label: 'Avis clients', icon: Star },
  { id: 'payments', label: 'Paiements', icon: StripeIcon },
  { id: 'routing', label: 'Routing', icon: GitBranch },
  { id: 'video', label: 'Vidéo IA', icon: Video },
  { id: 'team', label: 'Équipe', icon: Users },
  { id: 'billing', label: 'Facturation', icon: CreditCard },
]

export function SettingsLayout() {
  const [active, setActive] = useState('profile')

  return (
    <div className="flex h-full gap-0">
      {/* Sidebar nav */}
      <div className="w-52 flex-shrink-0 border-r border-[var(--border-default)] bg-[var(--surface-primary)] p-3 overflow-y-auto">
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
        {active === 'bot' && (
          <div className="space-y-8">
            <BotSettings />
            <Separator />
            <BotScheduleSettings />
            <Separator />
            <OptimizeBot />
          </div>
        )}
        {active === 'apikey' && <ApiKeySettings />}
        {active === 'pixels' && <PixelSettings />}
        {active === 'switchy' && <SwitchySettings />}
        {active === 'whitelabel' && <WhiteLabelSettings />}
        {active === 'api' && <ApiAccessSettings />}
        {active === 'reports' && <ReportSettings />}
        {active === 'reviews' && <ReviewSettings />}
        {active === 'payments' && <StripeSettings />}
        {active === 'routing' && <RoutingRules />}
        {active === 'video' && <VideoAISettings />}
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
