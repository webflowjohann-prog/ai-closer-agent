import { delay, randomBetween } from '@/lib/utils'

interface HumanizeOptions {
  minDelay?: number
  maxDelay?: number
  maxChunks?: number
  typingSpeed?: number
}

export function splitIntoChunks(text: string, maxChunks: number = 3): string[] {
  // Split on sentence endings and keep max chunks
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

  if (sentences.length <= maxChunks) {
    // Group short sentences
    return sentences.map((s) => s.trim()).filter(Boolean)
  }

  // Merge into maxChunks groups
  const chunkSize = Math.ceil(sentences.length / maxChunks)
  const chunks: string[] = []

  for (let i = 0; i < sentences.length; i += chunkSize) {
    chunks.push(sentences.slice(i, i + chunkSize).join(' ').trim())
  }

  return chunks.slice(0, maxChunks)
}

export function calculateTypingDelay(text: string, typingSpeed: number = 40): number {
  // typingSpeed = chars per second
  const chars = text.length
  const seconds = chars / typingSpeed
  return Math.min(Math.max(seconds * 1000, 500), 4000) // Between 0.5s and 4s
}

export async function humanizeDelay(
  text: string,
  options: HumanizeOptions = {}
): Promise<void> {
  const {
    minDelay = 1000,
    maxDelay = 5000,
    typingSpeed = 40,
  } = options

  const typingTime = calculateTypingDelay(text, typingSpeed)
  const naturalDelay = randomBetween(minDelay, maxDelay)
  const totalDelay = Math.min(typingTime + naturalDelay * 0.3, maxDelay)

  await delay(totalDelay)
}

export function addTypos(text: string, rate: number = 0): string {
  if (rate === 0) return text
  // Very light touch — only for casual verticals
  return text
}

export function formatAsSMS(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1')      // Remove italic markdown
    .replace(/#{1,6}\s/g, '')         // Remove headings
    .replace(/\n{3,}/g, '\n\n')       // Max 2 newlines
    .trim()
}
