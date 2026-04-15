import { getPlaybook } from './playbooks'
import type { VerticalType } from '@/types/database'
import type { SiteType } from './site-analyzer'

export interface AutoPlaybookOptions {
  scrapedContent: string
  siteType: SiteType
  vertical: VerticalType
  companyName: string
  personName?: string
  networkName?: string
  apiKey?: string
}

export interface AutoPlaybookResult {
  systemPrompt: string
  generatedFromContent: boolean
}

export async function generateCustomPlaybook(
  options: AutoPlaybookOptions
): Promise<AutoPlaybookResult> {
  const { scrapedContent, siteType, vertical, companyName, personName, networkName, apiKey } = options
  const basePlaybook = getPlaybook(vertical)
  const fallback = basePlaybook.system_prompt.replace(/\{\{company_name\}\}/g, companyName)

  if (!apiKey || !scrapedContent || scrapedContent.length < 100) {
    return { systemPrompt: fallback, generatedFromContent: false }
  }

  const networkInstruction =
    networkName && personName
      ? `\n\nIMPORTANT — RÉSEAU: ${personName} fait partie du réseau ${networkName}. Utilise UNIQUEMENT les informations spécifiques à ${personName}. Ne mentionne le réseau ${networkName} que si ${personName} le fait explicitement sur sa page. Ne parle pas des autres membres du réseau.`
      : ''

  const multiProfileInstruction =
    siteType === 'multi_profile' && personName
      ? `\n\nIMPORTANT — CABINET/ÉQUIPE: Tu représentes uniquement ${personName}. Il peut y avoir plusieurs professionnels dans la structure, mais tu parles au nom de ${personName} uniquement.`
      : ''

  const prompt = `Tu vas générer les instructions personnalisées pour un agent IA commercial.

CONTEXTE:
- Entreprise/professionnel : ${companyName}${personName ? ` (${personName})` : ''}${networkName ? ` — réseau ${networkName}` : ''}
- Secteur : ${vertical.replace(/_/g, ' ')}
- Type de site : ${siteType}
${networkInstruction}${multiProfileInstruction}

CONTENU SCRAPÉ DU SITE :
---
${scrapedContent.slice(0, 3500)}
---

TEMPLATE DE BASE (adapte-le avec les infos du contenu ci-dessus) :
${fallback.slice(0, 600)}

INSTRUCTIONS DE GÉNÉRATION :
1. Reprends la structure du template mais personnalise avec les vraies informations du site
2. Intègre les services spécifiques, spécialités, tarifs ou offres trouvés
3. Utilise le ton et les mots-clés de la marque
4. Si des horaires, une adresse ou un numéro de téléphone sont trouvés, intègre-les
5. Maximum 400 mots
6. Réponds UNIQUEMENT avec les instructions du bot, sans intro ni explication`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 900,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) throw new Error(`Claude API ${res.status}`)
    const data = await res.json()
    const generated: string = data.content?.[0]?.text?.trim() || ''

    if (generated.length < 100) throw new Error('Response too short')
    return { systemPrompt: generated, generatedFromContent: true }
  } catch {
    return { systemPrompt: fallback, generatedFromContent: false }
  }
}
