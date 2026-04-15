export interface ContentFilterResult {
  personalContent: string
  genericContent: string
  otherPeopleContent: string[]
  confidence: number
}

const NAME_PATTERN = /\b([A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][a-zàâéèêëîïôùûüç]{1,20}\s+[A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][a-zàâéèêëîïôùûüç]{1,20})\b/g

const GENERIC_NOISE_PATTERNS = [
  /rejoindre\s+(le\s+)?réseau/i,
  /devenez?\s+conseiller/i,
  /recrutement/i,
  /mentions\s+légales/i,
  /politique\s+de\s+confidentialité/i,
  /conditions\s+générales/i,
  /tous\s+droits\s+réservés/i,
  /copyright/i,
  /plan\s+du\s+site/i,
  /nos\s+agences/i,
  /trouver\s+un\s+/i,
  /annuaire\s+des/i,
]

export function extractPersonalContent(
  rawContent: string,
  personName: string,
  networkName?: string
): ContentFilterResult {
  if (!personName.trim()) {
    return {
      personalContent: rawContent,
      genericContent: '',
      otherPeopleContent: [],
      confidence: 50,
    }
  }

  const nameParts = personName
    .toLowerCase()
    .split(/\s+/)
    .filter((p) => p.length > 2)

  // Split into paragraphs (or sections by --- separators)
  const sections = rawContent
    .split(/(?:^---\s*.+\s*---$|\n{2,})/m)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)

  const personalSections: string[] = []
  const genericSections: string[] = []
  const otherPeopleBlocks: string[] = []

  for (const section of sections) {
    const lower = section.toLowerCase()

    // Skip generic noise
    if (GENERIC_NOISE_PATTERNS.some((r) => r.test(section))) {
      genericSections.push(section)
      continue
    }

    // Skip network-specific generic content
    if (networkName && lower.includes(networkName.toLowerCase()) && section.length < 300) {
      genericSections.push(section)
      continue
    }

    const hasPersonName = nameParts.some((part) => lower.includes(part))

    // Detect other names in the section
    const detectedNames = [...section.matchAll(NAME_PATTERN)]
      .map((m) => m[1])
      .filter((name) => {
        const nl = name.toLowerCase()
        return !nameParts.some((part) => nl.includes(part))
      })

    if (hasPersonName) {
      personalSections.push(section)
    } else if (detectedNames.length > 0 && !hasPersonName) {
      // Section about other people
      otherPeopleBlocks.push(section)
    } else {
      // Neutral/generic: include in personal if no other names
      if (detectedNames.length === 0) {
        personalSections.push(section)
      } else {
        genericSections.push(section)
      }
    }
  }

  // Confidence: based on how much personal content we extracted
  const totalSections = Math.max(sections.length, 1)
  const filteredOthers = otherPeopleBlocks.length
  const baseConfidence = Math.round((personalSections.length / totalSections) * 80)
  const filterBonus = filteredOthers > 0 ? 15 : 0 // We actually had something to filter
  const confidence = Math.min(95, baseConfidence + filterBonus)

  return {
    personalContent: personalSections.join('\n\n'),
    genericContent: genericSections.join('\n\n'),
    otherPeopleContent: otherPeopleBlocks,
    confidence,
  }
}
