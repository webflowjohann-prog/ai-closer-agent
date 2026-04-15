export type SiteType = 'personal' | 'network' | 'multi_profile' | 'marketplace' | 'generic'

export interface SiteAnalysis {
  siteType: SiteType
  ownerName?: string
  networkName?: string
  confidence: number
  signals: string[]
}

const CORS_PROXY = 'https://api.allorigins.win/get?url='

const NETWORK_KEYWORDS = [
  'rejoindre le réseau', 'rejoindre notre réseau', 'devenir conseiller',
  'nos conseillers', 'nos agents', 'nos praticiens', 'nos experts',
  'trouver un conseiller', 'trouver un agent', 'trouver un praticien',
  'nos coachs', 'nos avocats', 'nos notaires', 'nos architectes',
  'réseau de', 'franchise', 'nos médecins', 'nos thérapeutes',
  'annuaire', 'trouver un professionnel',
]

const TEAM_PAGE_PATTERNS = [
  '/team/', '/equipe/', '/conseillers/', '/praticiens/',
  '/membres/', '/agents/', '/nos-experts/', '/notre-equipe/',
  '/annuaire/', '/find-a-', '/trouver-',
]

const KNOWN_NETWORKS = [
  'iad', 'safti', 'optimhome', 'capifrance', 'century21', 'orpi',
  'laforet', 'era immobilier', 'proprietes-privees', 'megagence',
  'sextant', 'keller williams', 'coldwell', 'remax', 'stéphane plaza',
  'guy hoquet', 'laforêt',
]

const MARKETPLACE_KEYWORDS = [
  'prendre rendez-vous', 'réserver en ligne', 'choisissez votre praticien',
  'disponibilités', 'doctolib', 'superprof', 'malt', 'fiverr',
  'notre réseau de professionnels',
]

export async function analyzeSiteStructure(url: string): Promise<SiteAnalysis> {
  const signals: string[] = []
  let siteType: SiteType = 'generic'
  let confidence = 40
  let ownerName: string | undefined
  let networkName: string | undefined

  try {
    const fetchUrl = `${CORS_PROXY}${encodeURIComponent(url)}`
    const resp = await fetch(fetchUrl, { signal: AbortSignal.timeout(10000) })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const json = await resp.json()
    const html: string = json.contents || ''

    if (!html) throw new Error('Empty response')

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const title = doc.title || ''
    const fullText = doc.body?.textContent?.toLowerCase() || ''
    const bodySlice = fullText.slice(0, 5000)
    const allLinks = Array.from(doc.querySelectorAll('a[href]'))
      .map((a) => (a as HTMLAnchorElement).getAttribute('href') || '')
      .filter(Boolean)
    const navText = Array.from(doc.querySelectorAll('nav, header, .nav, .menu, .navigation'))
      .map((el) => el.textContent?.toLowerCase() || '')
      .join(' ')
    const metaDesc = (doc.querySelector('meta[name="description"]')?.getAttribute('content') || '').toLowerCase()

    // --- Known networks in domain or title ---
    for (const network of KNOWN_NETWORKS) {
      if (
        url.toLowerCase().includes(network.replace(' ', '-')) ||
        url.toLowerCase().includes(network.replace(' ', '')) ||
        title.toLowerCase().includes(network)
      ) {
        networkName = network
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
        signals.push(`Réseau connu: ${networkName}`)
        siteType = 'network'
        confidence = 92
        break
      }
    }

    // --- Team/directory links ---
    for (const pattern of TEAM_PAGE_PATTERNS) {
      if (allLinks.some((l) => l.toLowerCase().includes(pattern))) {
        signals.push(`Lien équipe/annuaire: ${pattern}`)
        if (siteType === 'generic') siteType = 'multi_profile'
        confidence = Math.max(confidence, 75)
        break
      }
    }

    // --- Network keywords in nav ---
    for (const keyword of NETWORK_KEYWORDS) {
      if (navText.includes(keyword) || bodySlice.includes(keyword)) {
        signals.push(`Mot-clé réseau: "${keyword}"`)
        if (siteType === 'generic') siteType = 'network'
        confidence = Math.max(confidence, 72)
        break
      }
    }

    // --- Marketplace patterns ---
    for (const kw of MARKETPLACE_KEYWORDS) {
      if (bodySlice.includes(kw)) {
        signals.push(`Marketplace: "${kw}"`)
        siteType = 'marketplace'
        confidence = 82
        break
      }
    }

    // --- Count distinct phone numbers ---
    const phones = html.match(/(?:0|\+33)[1-9][\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}/g) || []
    const uniquePhones = new Set(phones.map((p) => p.replace(/[\s.\-]/g, '')))
    if (uniquePhones.size >= 3) {
      signals.push(`${uniquePhones.size} numéros distincts`)
      if (siteType === 'generic') siteType = 'multi_profile'
      confidence = Math.max(confidence, 68)
    }

    // --- Count emails ---
    const emails = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || []
    const uniqueEmails = new Set(emails.filter((e) => !e.includes('example') && !e.includes('test')))
    if (uniqueEmails.size >= 3) {
      signals.push(`${uniqueEmails.size} emails distincts`)
      if (siteType === 'generic') siteType = 'multi_profile'
      confidence = Math.max(confidence, 62)
    }

    // --- Personal site heuristics ---
    if (siteType === 'generic') {
      const noTeamNav = !navText.includes('équipe') && !navText.includes('conseiller')
      const singlePhone = uniquePhones.size <= 1
      const singleEmail = uniqueEmails.size <= 2
      const shortTitle = title.split(/[\s|-]+/).length <= 6

      if (noTeamNav && singlePhone && singleEmail) {
        siteType = 'personal'
        confidence = shortTitle ? 70 : 58
        signals.push('Signaux site personnel (téléphone/email unique, pas de nav équipe)')
      }
    }

    // --- Extract owner name for personal sites ---
    if (siteType === 'personal') {
      const h1 = doc.querySelector('h1')?.textContent?.trim()
      const aboutSection = doc.querySelector('[class*="about"], [class*="bio"], [id*="about"]')
      if (h1 && h1.split(' ').length <= 4 && /[A-ZÀÂÉÈ]/.test(h1)) {
        ownerName = h1
      } else if (aboutSection) {
        const nameMatch = aboutSection.textContent?.match(/([A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][a-zàâéèêëîïôùûüç]+ [A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][a-zàâéèêëîïôùûüç]+)/)
        if (nameMatch) ownerName = nameMatch[1]
      }
      if (!ownerName) {
        const nameFromTitle = title.match(/^([A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][a-zàâéèêëîïôùûüç]+ [A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][a-zàâéèêëîïôùûüç]+)/)
        if (nameFromTitle) ownerName = nameFromTitle[1]
      }
    }

    // --- Extract network name if not found ---
    if ((siteType === 'network' || siteType === 'multi_profile') && !networkName) {
      const logoAlt = (doc.querySelector('header img, .logo img, #logo img, [class*="logo"] img') as HTMLImageElement)?.alt
      if (logoAlt && logoAlt.length > 2 && logoAlt.length < 30) {
        networkName = logoAlt.trim()
      } else {
        const fromTitle = title.split(/[\s—|]+/)[0]?.trim()
        if (fromTitle && fromTitle.length < 30) networkName = fromTitle
      }
    }

  } catch {
    signals.push('Analyse partielle — site inaccessible ou CORS')
    confidence = 25
    siteType = 'generic'
  }

  return { siteType, ownerName, networkName, confidence, signals }
}
