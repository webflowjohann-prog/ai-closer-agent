import Anthropic from '@anthropic-ai/sdk'
import type { SubAccount, FAQ, Message } from '@/types/database'
import { buildSystemPrompt } from './prompts'
import { formatAsSMS, splitIntoChunks } from './humanize'
import type { LLMProvider } from './providers'

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
  provider?: LLMProvider
  model?: string
}

// ─── Provider implementations ────────────────────────────────────────────────

async function runAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  const response = await client.messages.create({
    model,
    max_tokens: 500,
    system: systemPrompt,
    messages,
  })
  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as Anthropic.TextBlock).text)
    .join('')
}

async function runOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI error ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function runGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  // Map to Gemini format (user/model roles)
  const geminiMessages = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages,
        generationConfig: { maxOutputTokens: 500 },
      }),
    }
  )
  if (!res.ok) throw new Error(`Gemini error ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function runMistral(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  })
  if (!res.ok) throw new Error(`Mistral error ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export async function runAgent(options: AgentOptions): Promise<AgentResponse> {
  const {
    apiKey,
    subAccount,
    faqs = [],
    history = [],
    userMessage,
    provider = 'anthropic',
    model,
  } = options

  const systemPrompt = buildSystemPrompt({
    subAccount,
    faqs,
    conversationHistory: history,
  })

  // Build shared message format
  const messages = [
    ...history
      .filter((m) => m.content)
      .map((m) => ({
        role: m.sender_type === 'contact' ? ('user' as const) : ('assistant' as const),
        content: m.content!,
      })),
    { role: 'user' as const, content: userMessage },
  ]

  // Default models per provider
  const defaultModels: Record<LLMProvider, string> = {
    anthropic: 'claude-sonnet-4-20250514',
    openai: 'gpt-4o',
    gemini: 'gemini-2.5-flash',
    mistral: 'mistral-large-latest',
  }

  const resolvedModel = model || defaultModels[provider]

  let rawText: string

  switch (provider) {
    case 'openai':
      rawText = await runOpenAI(apiKey, resolvedModel, systemPrompt, messages)
      break
    case 'gemini':
      rawText = await runGemini(apiKey, resolvedModel, systemPrompt, messages)
      break
    case 'mistral':
      rawText = await runMistral(apiKey, resolvedModel, systemPrompt, messages)
      break
    case 'anthropic':
    default:
      rawText = await runAnthropic(apiKey, resolvedModel, systemPrompt, messages)
      break
  }

  const formattedText = formatAsSMS(rawText)
  const chunks = splitIntoChunks(formattedText, subAccount.max_message_chunks)

  // Detect booking intent
  const bookingKeywords = ['rendez-vous', 'créneau', 'disponible', 'agenda', 'appel']
  const bookingIntent = bookingKeywords.some((kw) =>
    formattedText.toLowerCase().includes(kw)
  )

  return { chunks, bookingIntent }
}
