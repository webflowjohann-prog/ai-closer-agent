import { Mail, Phone, Tag, Bot, User as UserIcon, Calendar, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LeadScoreIndicator } from '@/components/contacts/LeadScoreIndicator'
import { ReviewRequestButton } from '@/components/contacts/ReviewRequestButton'
import { formatDate, getInitials } from '@/lib/utils'
import type { Conversation } from '@/types/database'

interface ContactPanelProps {
  conversation: Conversation | null
  onHumanTakeover: () => void
}

const statusVariant: Record<string, string> = {
  new: 'new',
  qualified: 'qualified',
  meeting_booked: 'meeting',
  proposal: 'proposal',
  closed_won: 'won',
  closed_lost: 'lost',
  unresponsive: 'secondary',
}

const statusLabel: Record<string, string> = {
  new: 'Nouveau',
  qualified: 'Qualifié',
  meeting_booked: 'RDV pris',
  proposal: 'Proposition',
  closed_won: 'Gagné',
  closed_lost: 'Perdu',
  unresponsive: 'Sans réponse',
}

export function ContactPanel({ conversation, onHumanTakeover }: ContactPanelProps) {
  if (!conversation?.contact) {
    return (
      <div className="w-72 flex-shrink-0 bg-[var(--surface-primary)] border-l border-[var(--border-default)] hidden lg:flex items-center justify-center">
        <p className="text-xs text-[var(--text-tertiary)]">Sélectionnez une conversation</p>
      </div>
    )
  }

  const contact = conversation.contact
  const name = contact.full_name?.trim() || contact.phone || contact.email || 'Inconnu'

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-72 flex-shrink-0 bg-[var(--surface-primary)] border-l border-[var(--border-default)] hidden lg:flex flex-col overflow-y-auto"
    >
      {/* Contact Header */}
      <div className="p-4 text-center border-b border-[var(--border-default)]">
        <Avatar className="w-14 h-14 mx-auto mb-3">
          <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
        </Avatar>
        <p className="font-semibold text-[var(--text-primary)] text-sm">{name}</p>
        <div className="flex justify-center mt-2">
          <Badge variant={statusVariant[contact.status] as any}>
            {statusLabel[contact.status] || contact.status}
          </Badge>
        </div>

        {/* Lead score */}
        {contact.score > 0 && (
          <div className="mt-3 flex justify-center">
            <LeadScoreIndicator score={contact.score} size="sm" showLabel={true} />
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="p-4 space-y-2">
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Contact</p>
        {contact.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-secondary)] truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-secondary)]">{contact.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <span className="text-[var(--text-tertiary)]">Depuis le {formatDate(contact.created_at)}</span>
        </div>
      </div>

      <Separator />

      {/* Qualification data */}
      {Object.keys(contact.qualification_data || {}).length > 0 && (
        <>
          <div className="p-4">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Qualification</p>
            <div className="space-y-2">
              {Object.entries(contact.qualification_data).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-[var(--text-tertiary)] capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-xs font-medium text-[var(--text-primary)] text-right">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Tags */}
      {(contact.tags?.length || 0) > 0 && (
        <>
          <div className="p-4">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Tags</p>
            <div className="flex flex-wrap gap-1">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 bg-[var(--surface-tertiary)] text-[var(--text-secondary)] rounded-full flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Bot stats */}
      <div className="p-4">
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Agent IA</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-[var(--surface-secondary)] rounded-lg text-center">
            <p className="text-lg font-bold text-[var(--text-primary)] font-mono">{contact.bot_messages_count || 0}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Messages bot</p>
          </div>
          <div className="p-2 bg-[var(--surface-secondary)] rounded-lg text-center">
            <p className="text-lg font-bold text-[var(--text-primary)] font-mono">{conversation.message_count || 0}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Total msgs</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="p-4 space-y-2">
        {conversation.status === 'bot_active' && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
            onClick={onHumanTakeover}
          >
            <UserIcon className="w-3.5 h-3.5" />
            Prendre la main
          </Button>
        )}

        {/* Review request button — only when won */}
        {contact.status === 'closed_won' && (
          <ReviewRequestButton
            contactId={contact.id}
            conversationId={conversation.id}
          />
        )}

        <Button variant="ghost" size="sm" className="w-full" asChild>
          <a href={`/app/contacts`}>
            <ExternalLink className="w-3.5 h-3.5" />
            Voir la fiche contact
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
