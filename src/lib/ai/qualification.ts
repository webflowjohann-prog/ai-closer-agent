import type { Message, SubAccount, QualificationField } from '@/types/database'
import { getPlaybook } from './playbooks'

export function extractQualificationData(
  messages: Message[],
  subAccount: SubAccount
): Record<string, string> {
  const playbook = getPlaybook(subAccount.vertical)
  const fields = playbook.qualification_fields
  const data: Record<string, string> = {}

  const conversationText = messages
    .map((m) => `${m.sender_type}: ${m.content}`)
    .join('\n')

  // Simple keyword extraction (in production, use Claude to extract)
  fields.forEach((field: QualificationField) => {
    if (field.options) {
      for (const option of field.options) {
        if (conversationText.toLowerCase().includes(option.toLowerCase())) {
          data[field.key] = option
          break
        }
      }
    }
  })

  return data
}

export function calculateLeadScore(qualificationData: Record<string, unknown>): number {
  const filledFields = Object.values(qualificationData).filter(Boolean).length
  const totalWeight = filledFields * 20
  return Math.min(totalWeight, 100)
}

export function detectBookingIntent(message: string): boolean {
  const bookingKeywords = [
    'rendez-vous', 'rdv', 'appointment', 'disponible', 'créneaux',
    'réserver', 'réservation', 'quand', 'planning', 'agenda',
    'libre', 'disponibilité', 'mardi', 'mercredi', 'jeudi',
  ]
  return bookingKeywords.some((kw) => message.toLowerCase().includes(kw))
}
