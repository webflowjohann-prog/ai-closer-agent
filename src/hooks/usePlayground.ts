import { useState, useCallback } from 'react'
import { runAgent } from '@/lib/ai/agent'
import { humanizeDelay } from '@/lib/ai/humanize'
import type { VerticalType } from '@/types/database'
import { getPlaybook } from '@/lib/ai/playbooks'

export interface PlaygroundMessage {
  id: string
  from: 'user' | 'bot'
  text: string
  timestamp: Date
}

const DEFAULT_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

export function usePlayground() {
  const [messages, setMessages] = useState<PlaygroundMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [vertical, setVertical] = useState<VerticalType>('immobilier_luxe')
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY)

  const addMessage = useCallback((from: 'user' | 'bot', text: string) => {
    const msg: PlaygroundMessage = {
      id: crypto.randomUUID(),
      from,
      text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, msg])
    return msg
  }, [])

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || loading) return

      addMessage('user', userText)
      setLoading(true)

      try {
        const playbook = getPlaybook(vertical)
        const fakeSubAccount = {
          id: 'playground',
          organization_id: '',
          name: 'Demo Company',
          slug: 'demo',
          vertical,
          bot_language: 'fr',
          bot_active: true,
          response_delay_min: 2,
          response_delay_max: 5,
          response_length_min: 20,
          response_length_max: 80,
          max_message_chunks: 2,
          typing_speed: 40,
          booking_duration_minutes: 30,
          booking_buffer_minutes: 15,
          chat_memory_tokens: 50000,
          bot_instructions: playbook.system_prompt,
          created_at: '',
          updated_at: '',
        }

        const historyMessages = messages.map((m) => ({
          id: m.id,
          conversation_id: 'playground',
          sub_account_id: 'playground',
          direction: (m.from === 'user' ? 'inbound' : 'outbound') as any,
          sender_type: (m.from === 'user' ? 'contact' : 'bot') as any,
          content_type: 'text' as const,
          content: m.text,
          status: 'sent' as const,
          channel_type: 'webchat' as const,
          metadata: {},
          created_at: m.timestamp.toISOString(),
        }))

        const result = await runAgent({
          apiKey: apiKey || 'demo-mode',
          subAccount: fakeSubAccount as any,
          history: historyMessages,
          userMessage: userText,
        })

        for (const chunk of result.chunks) {
          await humanizeDelay(chunk, { minDelay: 500, maxDelay: 1500 })
          addMessage('bot', chunk)
        }
      } catch {
        addMessage('bot', "Désolé, je rencontre un problème technique. Réessayez dans un instant.")
      } finally {
        setLoading(false)
      }
    },
    [messages, loading, vertical, apiKey, addMessage]
  )

  const reset = useCallback(() => {
    setMessages([])
    setLoading(false)
  }, [])

  return { messages, loading, vertical, setVertical, apiKey, setApiKey, sendMessage, reset }
}
