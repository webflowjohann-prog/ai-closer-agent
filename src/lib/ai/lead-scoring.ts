import type { Contact, Message } from '@/types/database'

export interface BehaviorScoreBreakdown {
  score: number
  responseTimeScore: number
  messageLengthScore: number
  engagementScore: number
  questionScore: number
  budgetScore: number
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high'
}

const BUDGET_KEYWORDS = ['budget', 'prix', 'tarif', 'combien', '€', 'euro', 'coût', 'investissement', 'financement']
const QUESTION_INDICATORS = ['?', 'comment', 'quand', 'où', 'quoi', 'quel', 'pourquoi', 'est-ce']

/**
 * Calculate a behavioral lead score (0-100) based on conversation patterns
 */
export function calculateBehaviorScore(
  contact: Pick<Contact, 'bot_messages_count' | 'score'>,
  messages: Pick<Message, 'direction' | 'content' | 'created_at' | 'sender_type'>[]
): BehaviorScoreBreakdown {
  const inbound = messages.filter((m) => m.direction === 'inbound' && m.sender_type === 'contact')
  const outbound = messages.filter((m) => m.direction === 'outbound')

  // 1. Response time score (max 30 pts)
  let responseTimeScore = 0
  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1]
    const curr = messages[i]
    if (prev.direction === 'outbound' && curr.direction === 'inbound') {
      const diff = new Date(curr.created_at).getTime() - new Date(prev.created_at).getTime()
      const minutes = diff / 60000
      if (minutes < 2) responseTimeScore = Math.max(responseTimeScore, 30)
      else if (minutes < 10) responseTimeScore = Math.max(responseTimeScore, 20)
      else if (minutes < 60) responseTimeScore = Math.max(responseTimeScore, 10)
    }
  }

  // 2. Message length score (max 15 pts)
  const avgLength = inbound.length > 0
    ? inbound.reduce((sum, m) => sum + (m.content?.length || 0), 0) / inbound.length
    : 0
  const messageLengthScore = avgLength > 50 ? 15 : avgLength > 20 ? 10 : avgLength > 5 ? 5 : 0

  // 3. Engagement (number of exchanges) (max 20 pts)
  const exchanges = Math.min(inbound.length, 20)
  const engagementScore = exchanges >= 10 ? 20 : exchanges >= 5 ? 15 : exchanges >= 3 ? 10 : 5

  // 4. Question asking (max 10 pts)
  const askedQuestions = inbound.some((m) =>
    QUESTION_INDICATORS.some((q) => m.content?.toLowerCase().includes(q))
  )
  const questionScore = askedQuestions ? 10 : 0

  // 5. Budget mention (max 15 pts)
  const mentionedBudget = inbound.some((m) =>
    BUDGET_KEYWORDS.some((kw) => m.content?.toLowerCase().includes(kw))
  )
  const budgetScore = mentionedBudget ? 15 : 0

  const total = responseTimeScore + messageLengthScore + engagementScore + questionScore + budgetScore

  const engagementLevel: BehaviorScoreBreakdown['engagementLevel'] =
    total >= 70 ? 'very_high' :
    total >= 50 ? 'high' :
    total >= 30 ? 'medium' : 'low'

  return {
    score: Math.min(total, 100),
    responseTimeScore,
    messageLengthScore,
    engagementScore,
    questionScore,
    budgetScore,
    engagementLevel,
  }
}
