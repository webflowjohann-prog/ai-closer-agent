import { motion } from 'framer-motion'
import { Bot, User as UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChannelBadge } from './ChannelBadge'
import { formatRelativeDate, getInitials, cn } from '@/lib/utils'
import type { Conversation } from '@/types/database'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const contact = conversation.contact
  const name = contact?.full_name?.trim() || contact?.phone || contact?.email || 'Inconnu'
  const hasUnread = conversation.unread_count > 0

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-[var(--border-subtle)]',
        isActive
          ? 'bg-brand-50 border-l-2 border-l-brand-500'
          : 'hover:bg-[var(--surface-secondary)]'
      )}
      whileTap={{ scale: 0.99 }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-9 h-9">
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        {/* Bot/Human indicator */}
        <div className={cn(
          'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white',
          conversation.status === 'bot_active' ? 'bg-brand-500' : 'bg-orange-400'
        )}>
          {conversation.status === 'bot_active' ? (
            <Bot className="w-2 h-2 text-white" />
          ) : (
            <UserIcon className="w-2 h-2 text-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <p className={cn(
            'text-sm truncate',
            hasUnread ? 'font-semibold text-[var(--text-primary)]' : 'font-medium text-[var(--text-primary)]'
          )}>
            {name}
          </p>
          <span className="text-[10px] text-[var(--text-tertiary)] flex-shrink-0 ml-1">
            {conversation.last_message_at && formatRelativeDate(conversation.last_message_at)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ChannelBadge type={conversation.channel_type} />
          {conversation.last_message_preview && (
            <p className={cn(
              'text-xs truncate flex-1',
              hasUnread ? 'text-[var(--text-secondary)] font-medium' : 'text-[var(--text-tertiary)]'
            )}>
              {conversation.last_message_preview}
            </p>
          )}
          {hasUnread && (
            <span className="flex-shrink-0 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}
