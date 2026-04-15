import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Message } from '@/types/database'

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setMessages(data as Message[])
    }
    setLoading(false)
  }, [conversationId])

  useEffect(() => {
    fetchMessages()

    if (!conversationId) return

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === payload.new.id ? { ...m, ...(payload.new as Message) } : m))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, fetchMessages])

  const sendMessage = useCallback(
    async (content: string, subAccountId: string, channelType: string) => {
      if (!conversationId) return

      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sub_account_id: subAccountId,
        direction: 'outbound',
        sender_type: 'human',
        content_type: 'text',
        content,
        status: 'sent',
        channel_type: channelType,
      })

      if (error) throw error
    },
    [conversationId]
  )

  return { messages, loading, sendMessage, refetch: fetchMessages }
}
