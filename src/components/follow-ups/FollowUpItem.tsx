import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { X, Clock, CheckCircle2, XCircle, AlertCircle, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useFollowUps } from '@/hooks/useFollowUps'
import type { FollowUp } from '@/types/database'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  scheduled: { label: 'Programmée', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
  sent: { label: 'Envoyée', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
  cancelled: { label: 'Annulée', icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-50' },
  failed: { label: 'Échouée', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
}

interface FollowUpItemProps {
  followUp: FollowUp
}

export function FollowUpItem({ followUp }: FollowUpItemProps) {
  const { cancelFollowUp } = useFollowUps()
  const cfg = STATUS_CONFIG[followUp.status]
  const StatusIcon = cfg.icon
  const contact = followUp.contact
  const initials = contact?.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??'

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-xl border transition-colors',
      followUp.status === 'cancelled' ? 'opacity-50 border-[var(--border-default)]' : 'border-[var(--border-default)] hover:border-brand-200'
    )}>
      {/* Status indicator */}
      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', cfg.bg)}>
        <StatusIcon className={cn('w-3.5 h-3.5', cfg.color)} />
      </div>

      <div className="flex-1 min-w-0">
        {contact && (
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="w-5 h-5">
              <AvatarFallback className="text-[9px] bg-brand-100 text-brand-700">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-[var(--text-primary)] truncate">{contact.full_name || contact.email}</span>
          </div>
        )}
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{followUp.message}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
            <Clock className="w-3 h-3" />
            {format(new Date(followUp.scheduled_at), "d MMM 'à' HH:mm", { locale: fr })}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
            <MessageSquare className="w-3 h-3" />
            {followUp.channel_type}
          </span>
          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', cfg.bg, cfg.color)}>
            {cfg.label}
          </span>
        </div>
      </div>

      {followUp.status === 'scheduled' && (
        <button
          onClick={() => cancelFollowUp.mutate(followUp.id)}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
