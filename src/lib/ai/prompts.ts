import type { SubAccount, FAQ, Message } from '@/types/database'
import { getPlaybook } from './playbooks'

interface BuildPromptOptions {
  subAccount: SubAccount
  faqs?: FAQ[]
  conversationHistory?: Message[]
}

export function buildSystemPrompt({ subAccount, faqs = [], conversationHistory: _ }: BuildPromptOptions): string {
  const playbook = getPlaybook(subAccount.vertical)

  const basePrompt = playbook.system_prompt
    .replace(/{{company_name}}/g, subAccount.name)
    .replace(/{{website}}/g, subAccount.website_url || '')

  const faqSection = faqs.length > 0
    ? `\n\n## BASE DE CONNAISSANCE\n${faqs
        .filter((f) => f.is_active)
        .map((f) => `Q: ${f.question}\nR: ${f.answer}`)
        .join('\n\n')}`
    : ''

  const customInstructions = subAccount.bot_instructions
    ? `\n\n## INSTRUCTIONS PERSONNALISÉES\n${subAccount.bot_instructions}`
    : ''

  const responseRules = `

## RÈGLES DE RÉPONSE
- Longueur : entre ${subAccount.response_length_min} et ${subAccount.response_length_max} mots par message
- Langue : ${subAccount.bot_language === 'fr' ? 'Français exclusivement' : subAccount.bot_language}
- Jamais de liens ou d'URLs sauf si explicitement demandé
- Jamais de listes à puces, répondre comme dans un SMS
- Ne jamais mentionner que tu es une IA sauf si directement demandé

## OBJECTIFS DE QUALIFICATION
${playbook.conversation_goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

## GESTION DES OBJECTIONS
${playbook.objection_handlers.map((o) => `Objection: "${o.objection}" → ${o.response}`).join('\n')}`

  return basePrompt + faqSection + customInstructions + responseRules
}

export function buildBookingPrompt(subAccount: SubAccount): string {
  const playbook = getPlaybook(subAccount.vertical)
  return playbook.booking_prompt || "Souhaitez-vous prendre rendez-vous avec l'un de nos conseillers ?"
}
