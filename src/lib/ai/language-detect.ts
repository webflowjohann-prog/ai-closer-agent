// Lightweight language detection by keyword frequency
// For production, use a proper library like franc or langdetect

const LANGUAGE_PATTERNS: Record<string, string[]> = {
  fr: ['je', 'vous', 'est', 'les', 'une', 'pour', 'avec', 'que', 'pas', 'mais', 'bonjour', 'merci', 'oui', 'non', 'ça', 'très', 'aussi', 'plus', 'bien', 'nous', 'votre', 'mon', 'votre', 'suis', 'avoir', 'faire', 'comme'],
  en: ['the', 'is', 'are', 'you', 'and', 'for', 'with', 'that', 'not', 'but', 'hello', 'thank', 'yes', 'no', 'very', 'also', 'more', 'well', 'have', 'do', 'your', 'what', 'how', 'when', 'where'],
  ar: ['في', 'من', 'إلى', 'على', 'هذا', 'هل', 'أنا', 'أنت', 'نعم', 'لا', 'مرحبا', 'شكرا', 'كيف', 'ما', 'لكن'],
  es: ['el', 'la', 'los', 'las', 'que', 'con', 'por', 'para', 'hola', 'gracias', 'sí', 'no', 'muy', 'también', 'más', 'bien', 'tengo', 'quiero'],
  de: ['ich', 'du', 'ist', 'das', 'die', 'der', 'und', 'mit', 'hallo', 'danke', 'ja', 'nein', 'sehr', 'auch', 'mehr', 'gut', 'haben'],
  it: ['io', 'tu', 'è', 'il', 'la', 'che', 'con', 'per', 'ciao', 'grazie', 'sì', 'no', 'molto', 'anche', 'più', 'bene'],
  pt: ['eu', 'você', 'é', 'o', 'a', 'que', 'com', 'por', 'olá', 'obrigado', 'sim', 'não', 'muito', 'também', 'mais'],
  tr: ['ben', 'sen', 'bu', 'bir', 've', 'ile', 'için', 'merhaba', 'teşekkür', 'evet', 'hayır', 'çok', 'da', 'daha'],
  nl: ['ik', 'je', 'het', 'de', 'een', 'met', 'voor', 'dat', 'hallo', 'dank', 'ja', 'nee', 'ook', 'meer'],
  zh: ['我', '你', '是', '的', '了', '在', '不', '有', '这', '他', '她', '好', '谢谢', '你好'],
}

export interface LanguageDetectionResult {
  language: string
  confidence: number
  label: string
}

const LANGUAGE_LABELS: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  tr: 'Türkçe',
  nl: 'Nederlands',
  zh: '中文',
}

export function detectLanguage(text: string): LanguageDetectionResult {
  if (!text || text.trim().length < 5) {
    return { language: 'fr', confidence: 0.5, label: 'Français' }
  }

  const words = text.toLowerCase().split(/\s+/)
  const scores: Record<string, number> = {}

  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    scores[lang] = words.filter((w) => patterns.includes(w)).length
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const top = sorted[0]

  if (!top || top[1] === 0) {
    return { language: 'fr', confidence: 0.5, label: 'Français' }
  }

  const totalMatches = sorted.reduce((sum, [, v]) => sum + v, 0)
  const confidence = totalMatches > 0 ? top[1] / totalMatches : 0.5

  return {
    language: top[0],
    confidence: Math.min(confidence, 0.99),
    label: LANGUAGE_LABELS[top[0]] || top[0],
  }
}
