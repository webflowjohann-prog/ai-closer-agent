import { Bot, User as UserIcon, CheckCheck } from 'lucide-react'
import { formatDateTime, cn } from '@/lib/utils'
import type { Message } from '@/types/database'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutbound = message.direction === 'outbound'
  const isBot = message.sender_type === 'bot'

  return (
    <div className={cn('flex items-end gap-2 group', isOutbound ? 'flex-row-reverse' : '')}>
      {/* Avatar */}
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-4',
        isBot ? 'bg-brand-100' : isOutbound ? 'bg-[var(--color-gray-700)]' : 'bg-[var(--color-gray-200)]'
      )}>
        {isBot ? (
          <Bot className="w-3 h-3 text-brand-600" />
        ) : (
          <UserIcon className={cn('w-3 h-3', isOutbound ? 'text-white' : 'text-[var(--text-secondary)]')} />
        )}
      </div>

      <div className={cn('max-w-[72%] space-y-1', isOutbound ? 'items-end' : 'items-start')}>
        {/* Bubble */}
        <div
          className={cn(
            'px-3 py-2 rounded-2xl text-sm leading-relaxed',
            isOutbound
              ? isBot
                ? 'bg-brand-500 text-white rounded-br-sm'
                : 'bg-[var(--color-gray-700)] text-white rounded-br-sm'
              : 'bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-bl-sm border border-[var(--border-default)]'
          )}
        >
          {message.content || (
            <span className="italic opacity-60">Message média</span>
          )}
        </div>

        {/* Meta */}
        <div className={cn(
          'flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity',
          isOutbound ? 'flex-row-reverse' : ''
        )}>
          <span className="text-[10px] text-[var(--text-tertiary)]">
            {formatDateTime(message.created_at)}
          </span>
          {isOutbound && (
            <CheckCheck className={cn(
              'w-3 h-3',
              message.status === 'read' ? 'text-brand-400' : 'text-[var(--text-tertiary)]'
            )} />
          )}
          {isBot && (
            <span className="text-[10px] bg-brand-50 text-brand-600 px-1 rounded">AI</span>
          )}
        </div>
      </div>
    </div>
  )
}
