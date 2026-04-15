import { useMemo } from 'react'
import type { ConversationInsight } from '@/types/database'

export type InsightPeriod = '7d' | '30d' | '90d'

// Mock data — production would aggregate from conversations + messages tables
function generateMockInsights(period: InsightPeriod): ConversationInsight {
  const now = new Date()
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90

  return {
    id: 'mock-1',
    sub_account_id: 'mock',
    period_start: new Date(now.getTime() - days * 86400000).toISOString(),
    period_end: now.toISOString(),
    top_questions: [
      { question: 'Quels sont vos tarifs ?', count: 47 },
      { question: 'Êtes-vous disponible ce week-end ?', count: 32 },
      { question: 'Est-ce que vous intervenez sur Rouen ?', count: 28 },
      { question: 'Combien de temps ça prend ?', count: 21 },
      { question: 'Avez-vous des références ?', count: 18 },
    ],
    top_objections: [
      { objection: 'C\'est trop cher', count: 23 },
      { objection: 'Je dois en parler à mon conjoint', count: 19 },
      { objection: 'Je vais y réfléchir', count: 16 },
      { objection: 'Je compare plusieurs prestataires', count: 12 },
    ],
    best_scripts: [
      { script: 'Je comprends que le prix est important. Permettez-moi de vous expliquer ce qui justifie notre tarif...', conversion_rate: 0.68 },
      { script: 'Bien sûr, prenez le temps qu\'il faut. Puis-je vous envoyer notre brochure en attendant ?', conversion_rate: 0.54 },
    ],
    avg_response_time_seconds: 145,
    avg_messages_to_qualify: 6.3,
    avg_messages_to_book: 11.2,
    busiest_hours: [
      { hour: 9, count: 34 },
      { hour: 10, count: 48 },
      { hour: 11, count: 52 },
      { hour: 14, count: 61 },
      { hour: 15, count: 58 },
      { hour: 18, count: 45 },
      { hour: 19, count: 38 },
      { hour: 20, count: 29 },
    ],
    best_converting_hours: [
      { hour: 10, rate: 0.31 },
      { hour: 14, rate: 0.28 },
      { hour: 15, rate: 0.26 },
      { hour: 11, rate: 0.24 },
    ],
    language_distribution: { fr: 0.87, en: 0.08, ar: 0.03, es: 0.02 },
    sentiment_distribution: { positive: 0.58, neutral: 0.31, negative: 0.11 },
    created_at: now.toISOString(),
  }
}

export function useConversationInsights(period: InsightPeriod = '30d') {
  return useMemo(() => ({
    insights: generateMockInsights(period),
    isMock: true,
  }), [period])
}
