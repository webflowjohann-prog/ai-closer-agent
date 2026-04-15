import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { Skeleton } from '@/components/ui/skeleton'
import { useMessages } from '@/hooks/useMessages'
import { useInboxStore } from '@/stores/inboxStore'
import { useOrgStore } from '@/stores/orgStore'
import type { Conversation } from '@/types/database'
import { formatDate } from '@/lib/utils'

interface ChatWindowProps {
  conversation: Conversation | null
  onBotToggle: (active: boolean) => void
}

function groupMessagesByDate(messages: ReturnType<typeof useMessages>['messages']) {
  const groups: Record<string, typeof messages> = {}
  for (const msg of messages) {
    const date = formatDate(msg.created_at)
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
  }
  return groups
}

export function ChatWindow({ conversation, onBotToggle }: ChatWindowProps) {
  const { activeConversationId } = useInboxStore()
  const { activeSubAccount } = useOrgStore()
  const { messages, loading, sendMessage } = useMessages(activeConversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--surface-secondary)]">
        <div className="text-center">
          <div className="w-14 h-14 bg-[var(--surface-tertiary)] rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-7 h-7 text-[var(--text-tertiary)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Sélectionnez une conversation
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            ou attendez un nouveau message
          </p>
        </div>
      </div>
    )
  }

  const handleSend = async (text: string) => {
    if (!activeSubAccount) return
    await sendMessage(text, activeSubAccount.id, conversation.channel_type)
  }

  const grouped = groupMessagesByDate(messages)

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--surface-secondary)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex gap-2 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <Skeleton className="w-6 h-6 rounded-full" />
                <Skeleton className={`h-8 ${i % 2 === 0 ? 'w-48' : 'w-36'} rounded-2xl`} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-[var(--text-tertiary)]">
              Aucun message. La conversation commence ici.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {Object.entries(grouped).map(([date, msgs]) => (
              <div key={date}>
                <div className="flex items-center gap-2 my-4">
                  <div className="flex-1 h-px bg-[var(--border-default)]" />
                  <span className="text-[10px] font-medium text-[var(--text-tertiary)] px-2">
                    {date}
                  </span>
                  <div className="flex-1 h-px bg-[var(--border-default)]" />
                </div>
                {msgs.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                  >
                    <MessageBubble message={msg} />
                  </motion.div>
                ))}
              </div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onToggleBot={onBotToggle}
        botActive={conversation.status === 'bot_active'}
      />
    </div>
  )
}
