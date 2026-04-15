export type LLMProvider = 'anthropic' | 'openai' | 'gemini' | 'mistral'

export interface ProviderConfig {
  id: LLMProvider
  name: string
  shortName: string
  models: { id: string; label: string }[]
  defaultModel: string
  keyPrefix: string
  keyPlaceholder: string
  color: string
  bgColor: string
  recommended?: boolean
  description: string
}

export const PROVIDERS: Record<LLMProvider, ProviderConfig> = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    shortName: 'Claude',
    models: [
      { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4 (Recommandé)' },
      { id: 'claude-opus-4-20250514', label: 'Claude Opus 4 (Premium)' },
    ],
    defaultModel: 'claude-sonnet-4-20250514',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-api03-...',
    color: '#D4A574',
    bgColor: 'rgba(212,165,116,0.08)',
    recommended: true,
    description: 'Meilleure qualité de conversation et compréhension du contexte.',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    shortName: 'GPT',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini (Économique)' },
      { id: 'o1', label: 'o1 (Raisonnement)' },
    ],
    defaultModel: 'gpt-4o',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-proj-...',
    color: '#10a37f',
    bgColor: 'rgba(16,163,127,0.08)',
    description: 'Modèles polyvalents avec excellent support multilingue.',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    shortName: 'Gemini',
    models: [
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Rapide)' },
    ],
    defaultModel: 'gemini-2.5-flash',
    keyPrefix: 'AIza',
    keyPlaceholder: 'AIzaSy...',
    color: '#4285F4',
    bgColor: 'rgba(66,133,244,0.08)',
    description: 'Modèles multimodaux avec large fenêtre de contexte.',
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    shortName: 'Mistral',
    models: [
      { id: 'mistral-large-latest', label: 'Mistral Large' },
      { id: 'mistral-medium-latest', label: 'Mistral Medium' },
    ],
    defaultModel: 'mistral-large-latest',
    keyPrefix: '',
    keyPlaceholder: 'Votre clé Mistral...',
    color: '#FF7000',
    bgColor: 'rgba(255,112,0,0.08)',
    description: "Provider européen RGPD-native, souveraineté des données.",
  },
}

export const PROVIDER_ORDER: LLMProvider[] = ['anthropic', 'openai', 'gemini', 'mistral']
