import Anthropic from '@anthropic-ai/sdk'
import type { SubAccount, FAQ, Message } from '@/types/database'
import { buildSystemPrompt } from './prompts'
import { formatAsSMS, splitIntoChunks } from './humanize'

interface AgentResponse {
  chunks: string[]
  qualificationUpdate?: Record<string, string>
  bookingIntent?: boolean
}

interface AgentOptions {
  apiKey: string
  subAccount: SubAccount
  faqs?: FAQ[]
  history?: Message[]
  userMessage: string
}

export async function runAgent(options: AgentOptions): Promise<AgentResponse> {
  const { apiKey, subAccount, faqs = [], history = [], userMessage } = options

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const systemPrompt = buildSystemPrompt({
    subAccount,
    faqs,
    conversationHistory: history,
  })

  // Build conversation history for API
  const messages: Anthropic.MessageParam[] = [
    ...history
      .filter((m) => m.content)
      .map((m) => ({
        role: m.sender_type === 'contact' ? ('user' as const) : ('assistant' as const),
        content: m.content!,
      })),
    { role: 'user' as const, content: userMessage },
  ]

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: systemPrompt,
    messages,
  })

  const rawText = response.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as Anthropic.TextBlock).text)
    .join('')

  const formattedText = formatAsSMS(rawText)
  const chunks = splitIntoChunks(formattedText, subAccount.max_message_chunks)

  // Detect booking intent in response
  const bookingKeywords = ['rendez-vous', 'créneau', 'disponible', 'agenda', 'appel']
  const bookingIntent = bookingKeywords.some((kw) =>
    formattedText.toLowerCase().includes(kw)
  )

  return {
    chunks,
    bookingIntent,
  }
}
