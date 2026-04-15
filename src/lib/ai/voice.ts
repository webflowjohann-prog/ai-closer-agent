// Voice note transcription — MVP mock implementation
// Real implementation would use Gemini or Whisper API

export interface TranscriptionResult {
  text: string
  confidence: number
  language: string
  duration_seconds: number
}

/**
 * Transcribe a voice note audio URL
 * For MVP: returns a mock transcription
 * Production: send to Gemini multimodal API or OpenAI Whisper
 */
export async function transcribeVoiceNote(
  audioUrl: string,
  _apiKey?: string
): Promise<TranscriptionResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Mock transcription for MVP
  const mockTranscriptions = [
    'Bonjour, j\'ai vu votre annonce et je suis intéressé par le bien. Pouvez-vous me donner plus de détails sur les caractéristiques et le prix ?',
    'Oui bonjour je rappelle pour le rendez-vous de demain, est-ce que c\'est toujours possible à 14h ?',
    'Allô bonjour, j\'aurais voulu des informations sur vos tarifs et disponibilités pour le mois prochain.',
    'Bonjour c\'est Marc, je voulais vous dire que j\'ai bien reçu votre proposition et je suis très intéressé.',
  ]

  return {
    text: mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)],
    confidence: 0.92,
    language: 'fr',
    duration_seconds: Math.floor(Math.random() * 20) + 5,
  }
}
