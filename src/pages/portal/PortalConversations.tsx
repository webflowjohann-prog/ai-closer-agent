import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useConversations } from '@/hooks/useConversations'
import { ConversationItem } from '@/components/inbox/ConversationItem'

export default function PortalConversations() {
  const { conversations, loading } = useConversations()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">Conversations</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Toutes les conversations gérées par votre agent IA</p>
      </div>

      <Card>
        {loading ? (
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-[var(--surface-secondary)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">Aucune conversation</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={false}
                onClick={() => {}}
              />
            ))}
          </motion.div>
        )}
      </Card>
    </div>
  )
}
