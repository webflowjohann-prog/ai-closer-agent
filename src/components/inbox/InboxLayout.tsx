import { useConversations } from '@/hooks/useConversations'
import { useInboxStore } from '@/stores/inboxStore'
import { ConversationList } from './ConversationList'
import { ChatWindow } from './ChatWindow'
import { ContactPanel } from './ContactPanel'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function InboxLayout() {
  const { conversations, loading } = useConversations()
  const { activeConversationId } = useInboxStore()

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null

  const handleBotToggle = async (active: boolean) => {
    if (!activeConversationId) return
    const status = active ? 'bot_active' : 'human_takeover'
    const { error } = await supabase
      .from('conversations')
      .update({ status })
      .eq('id', activeConversationId)

    if (error) {
      toast.error('Erreur lors du changement de mode')
    } else {
      toast.success(active ? 'Agent IA réactivé' : 'Mode humain activé', {
        description: active
          ? "L'agent IA reprend les réponses automatiquement"
          : 'Vous pouvez maintenant répondre manuellement',
      })
    }
  }

  const handleHumanTakeover = () => handleBotToggle(false)

  return (
    <div className="flex h-full overflow-hidden">
      <ConversationList conversations={conversations} loading={loading} />
      <ChatWindow conversation={activeConversation} onBotToggle={handleBotToggle} />
      <ContactPanel conversation={activeConversation} onHumanTakeover={handleHumanTakeover} />
    </div>
  )
}
