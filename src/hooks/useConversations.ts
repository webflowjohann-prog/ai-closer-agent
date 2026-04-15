import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { Conversation } from '@/types/database'

export function useConversations() {
  const { activeSubAccount } = useOrgStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeSubAccount) {
      setLoading(false)
      return
    }

    const fetchConversations = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('conversations')
        .select('*, contact:contacts(*)')
        .eq('sub_account_id', activeSubAccount.id)
        .order('last_message_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setConversations(data as Conversation[])
      }
      setLoading(false)
    }

    fetchConversations()

    // Realtime subscription
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `sub_account_id=eq.${activeSubAccount.id}`,
        },
        () => {
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeSubAccount])

  return { conversations, loading }
}
