const CORS_PROXY = 'https://api.allorigins.win/get?url='
const MAX_PAGES_FULL = 10
const MAX_PAGES_SCOPED = 5

export type ScrapeMode = 'full' | 'scoped'

export interface ScrapeOptions {
  mode: ScrapeMode
  personName?: string
  pathPrefix?: string
}

export interface ScrapeResult {
  content: string
  pages: string[]
  success: boolean
  error?: string
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const resp = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(9000),
    })
    if (!resp.ok) return null
    const json = await resp.json()
    return json.contents || null
  } catch {
    return null
  }
}

const REMOVE_SELECTORS = [
  'header', 'footer', 'nav', '.nav', '.navbar', '.menu', '.navigation',
  '.sidebar', '.widget', '.widget-area', 'aside',
  'script', 'style', 'noscript', 'iframe', 'form',
  '[class*="cookie"]', '[class*="gdpr"]', '[class*="banner"]',
  '[class*="popup"]', '[class*="modal"]', '[class*="overlay"]',
  '[class*="recruitment"]', '[class*="recrutement"]', '[class*="join"]',
  '[class*="footer"]', '[class*="header"]',
  '.breadcrumb', '.pagination', '.social-links', '.share',
]

const EXCLUDE_PATH_PATTERNS = [
  '/tag/', '/category/', '/tags/', '/categories/',
  '/wp-admin/', '/wp-login', '/feed/', '/sitemap',
  '/robots', '/cgi-bin/', '/mentions-legales', '/legal',
  '/politique-de-confidentialite', '/privacy', '/confidentialite',
  '/cgv', '/cgu', '/recrutement', '/recruitment', '/nos-agences',
  '/trouver-', '/find-', '/search', '/recherche',
  '/login', '/connexion', '/register', '/inscription',
  '/panier', '/cart', '/checkout', '/commande',
  '.pdf', '.jpg', '.png', '.zip', '.xml',
]

function extractTextFromHtml(
  html: string,
  options: { personName?: string } = {}
): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove noise elements
  REMOVE_SELECTORS.forEach((sel) => {
    doc.querySelectorAll(sel).forEach((el) => el.remove())
  })

  // If person name given, remove team/staff blocks that don't mention the person
  if (options.personName) {
    const nameParts = options.personName
      .toLowerCase()
      .split(' ')
      .filter((p) => p.length > 2)

    const teamSelectors = [
      '[class*="team"]', '[class*="equipe"]', '[class*="member"]',
      '[class*="staff"]', '[class*="agent"]', '[class*="consultant"]',
      '[class*="praticien"]', '[class*="conseiller"]',
    ]
    teamSelectors.forEach((sel) => {
      doc.querySelectorAll(sel).forEach((block) => {
        const text = block.textContent?.toLowerCase() || ''
        const isAboutPerson = nameParts.some((part) => text.includes(part))
        // Remove only if it looks like a team card for someone else (has a name, short block)
        if (!isAboutPerson && text.length > 30 && text.length < 800) {
          block.remove()
        }
      })
    })
  }

  // Prefer main content area
  const mainEl =
    doc.querySelector('main') ||
    doc.querySelector('article') ||
    doc.querySelector('[role="main"]') ||
    doc.querySelector('#main') ||
    doc.querySelector('.main') ||
    doc.querySelector('#content') ||
    doc.querySelector('.content') ||
    doc.querySelector('.page-content') ||
    doc.querySelector('.entry-content') ||
    doc.querySelector('.post-content') ||
    doc.body

  const text = (mainEl?.textContent || '')
    .replace(/\t/g, ' ')
    .replace(/[ \t]{3,}/g, '  ')
    .replace(/\n{4,}/g, '\n\n')
    .trim()

  return text
}

function getInternalLinks(
  html: string,
  baseUrl: string,
  options: { personName?: string; pathPrefix?: string; mode: ScrapeMode }
): string[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  let base: URL
  try {
    base = new URL(baseUrl)
  } catch {
    return []
  }

  const seen = new Set<string>()

  return Array.from(doc.querySelectorAll('a[href]'))
    .map((a) => {
      try {
        const href = (a as HTMLAnchorElement).getAttribute('href') || ''
        const link = new URL(href, baseUrl)
        return link.hostname === base.hostname
          ? link.origin + link.pathname
          : null
      } catch {
        return null
      }
    })
    .filter((link): link is string => {
      if (!link) return false
      if (link === baseUrl) return false
      if (seen.has(link)) return false
      seen.add(link)

      const pathLower = link.toLowerCase().replace(base.origin, '')

      // Exclude bad paths
      if (EXCLUDE_PATH_PATTERNS.some((p) => pathLower.includes(p))) return false
      // Exclude file extensions
      if (/\.(pdf|jpg|jpeg|png|gif|svg|zip|rar|xml|json)$/i.test(pathLower)) return false

      if (options.mode === 'full') return true

      // Scoped: only follow links under the same path prefix OR mentioning the person
      if (options.pathPrefix) {
        const matchesPrefix = pathLower.startsWith(options.pathPrefix.toLowerCase())
        const matchesPerson =
          options.personName
            ? pathLower.includes(
                options.personName
                  .toLowerCase()
                  .split(' ')
                  .join('-')
              ) ||
              pathLower.includes(
                options.personName
                  .toLowerCase()
                  .split(' ')
                  .reverse()
                  .join('-')
              )
            : false
        return matchesPrefix || matchesPerson
      }

      return true
    })
}

export async function scrapeWebsite(
  url: string,
  options: ScrapeOptions = { mode: 'full' }
): Promise<ScrapeResult> {
  const maxPages = options.mode === 'full' ? MAX_PAGES_FULL : MAX_PAGES_SCOPED
  const visited: string[] = []
  const texts: string[] = []
  const queue: string[] = [url]

  let pathPrefix: string | undefined
  if (options.mode === 'scoped' && !options.pathPrefix) {
    try {
      pathPrefix = new URL(url).pathname
    } catch {
      //
    }
  }

  while (queue.length > 0 && visited.length < maxPages) {
    const current = queue.shift()!
    if (visited.includes(current)) continue
    visited.push(current)

    const html = await fetchPage(current)
    if (!html) continue

    const text = extractTextFromHtml(html, { personName: options.personName })
    if (text.length > 80) {
      try {
        const pageLabel = new URL(current).pathname || '/'
        texts.push(`--- ${pageLabel} ---\n${text}`)
      } catch {
        texts.push(text)
      }
    }

    const links = getInternalLinks(html, current, {
      ...options,
      pathPrefix: options.pathPrefix || pathPrefix,
    })
    for (const link of links) {
      if (!visited.includes(link) && !queue.includes(link)) {
        queue.push(link)
      }
    }
  }

  if (texts.length === 0) {
    return {
      content: '',
      pages: visited,
      success: false,
      error: 'Aucun contenu extrait — le site est peut-être protégé ou inaccessible.',
    }
  }

  return {
    content: texts.join('\n\n').slice(0, 20000), // Cap at 20k chars
    pages: visited,
    success: true,
  }
}
