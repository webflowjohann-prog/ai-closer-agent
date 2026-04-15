import type { SubAccount, RetargetingPixel } from '@/types/database'
import { supabase } from '@/lib/supabase'

const SWITCHY_API_BASE = 'https://api.switchy.io/v1'

// Simple in-memory rate limiter
const rateLimiter = {
  hourlyCount: 0,
  dailyCount: 0,
  hourResetAt: Date.now() + 3600_000,
  dayResetAt: Date.now() + 86400_000,

  check(): boolean {
    const now = Date.now()
    if (now > this.hourResetAt) {
      this.hourlyCount = 0
      this.hourResetAt = now + 3600_000
    }
    if (now > this.dayResetAt) {
      this.dailyCount = 0
      this.dayResetAt = now + 86400_000
    }
    return this.hourlyCount < 100 && this.dailyCount < 1500
  },

  increment() {
    this.hourlyCount++
    this.dailyCount++
  },
}

export interface CreateTrackedLinkParams {
  url: string
  title?: string
  description?: string
  image?: string
  pixels?: { platform: string; value: string }[]
  tags?: string[]
  deepLinking?: boolean
  utmCampaign?: string
  utmSource?: string
  utmMedium?: string
  customDomain?: string
}

export interface SwitchyLinkResult {
  id: string
  short_url: string
  original_url: string
  clicks: number
}

export interface SwitchyClickStats {
  total_clicks: number
  unique_clicks: number
  clicks_by_day: { date: string; count: number }[]
  top_countries: { country: string; count: number }[]
  top_referrers: { referrer: string; count: number }[]
}

/**
 * Create a tracked short link via Switchy API.
 */
export async function createTrackedLink(
  apiKey: string,
  params: CreateTrackedLinkParams
): Promise<SwitchyLinkResult> {
  if (!rateLimiter.check()) {
    throw new Error('Rate limit atteint (100/h ou 1500/j). Réessayez plus tard.')
  }

  const body: Record<string, unknown> = {
    original_url: params.url,
  }

  if (params.title) body.title = params.title
  if (params.description) body.description = params.description
  if (params.image) body.og_image = params.image
  if (params.tags?.length) body.tags = params.tags
  if (params.deepLinking) body.deep_linking = true
  if (params.customDomain) body.domain = params.customDomain

  if (params.utmCampaign || params.utmSource || params.utmMedium) {
    body.utm = {
      ...(params.utmCampaign ? { utm_campaign: params.utmCampaign } : {}),
      ...(params.utmSource ? { utm_source: params.utmSource } : {}),
      ...(params.utmMedium ? { utm_medium: params.utmMedium } : {}),
    }
  }

  if (params.pixels?.length) {
    body.pixels = params.pixels.map((p) => ({
      type: p.platform,
      pixel_id: p.value,
    }))
  }

  const res = await fetch(`${SWITCHY_API_BASE}/links/create`, {
    method: 'POST',
    headers: {
      'Api-Authorization': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Switchy API error ${res.status}: ${text}`)
  }

  rateLimiter.increment()

  const data = await res.json()
  return {
    id: data.id ?? data.data?.id ?? '',
    short_url: data.short_url ?? data.data?.short_url ?? data.url ?? '',
    original_url: params.url,
    clicks: 0,
  }
}

/**
 * Fetch click stats for a link.
 */
export async function getClickStats(
  apiKey: string,
  linkId: string
): Promise<SwitchyClickStats> {
  const res = await fetch(`${SWITCHY_API_BASE}/links/${linkId}/stats`, {
    headers: { 'Api-Authorization': apiKey },
  })
  if (!res.ok) throw new Error(`Switchy stats error ${res.status}`)
  const data = await res.json()
  return {
    total_clicks: data.total_clicks ?? data.clicks ?? 0,
    unique_clicks: data.unique_clicks ?? 0,
    clicks_by_day: data.clicks_by_day ?? [],
    top_countries: data.top_countries ?? [],
    top_referrers: data.top_referrers ?? [],
  }
}

/**
 * Verify that a Switchy API key is valid by calling /account.
 */
export async function testSwitchyConnection(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`${SWITCHY_API_BASE}/account`, {
      headers: { 'Api-Authorization': apiKey },
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Main function used by the AI agent.
 * Wraps a URL with a Switchy tracked link, injecting active pixels and UTMs.
 * Falls back to the original URL if Switchy is not configured.
 */
export async function wrapBotLink(
  originalUrl: string,
  subAccount: SubAccount,
  context?: {
    conversationId?: string
    contactId?: string
    channel?: string
  }
): Promise<string> {
  const apiKey = import.meta.env.VITE_SWITCHY_API_KEY as string | undefined
  if (!apiKey) return originalUrl

  try {
    // Fetch active pixels for this sub_account
    const { data: pixelRows } = await supabase
      .from('retargeting_pixels')
      .select('*')
      .eq('sub_account_id', subAccount.id)
      .eq('active', true)

    const pixels = ((pixelRows ?? []) as RetargetingPixel[]).map((p) => ({
      platform: p.platform,
      value: p.pixel_id,
    }))

    const result = await createTrackedLink(apiKey, {
      url: originalUrl,
      pixels,
      utmSource: 'ai-closer',
      utmMedium: context?.channel ?? 'bot',
      utmCampaign: 'bot-conversation',
      customDomain: subAccount.switchy_custom_domain ?? undefined,
    })

    // Persist to tracked_links table
    await supabase.from('tracked_links').insert({
      sub_account_id: subAccount.id,
      original_url: originalUrl,
      switchy_url: result.short_url,
      custom_domain: subAccount.switchy_custom_domain ?? null,
      pixels_applied: pixels.map((p) => p.platform),
      utm_campaign: 'bot-conversation',
      utm_source: 'ai-closer',
      utm_medium: context?.channel ?? 'bot',
      deep_linking: false,
      clicks: 0,
      conversation_id: context?.conversationId ?? null,
      contact_id: context?.contactId ?? null,
    })

    return result.short_url
  } catch (err) {
    console.error('[Switchy] wrapBotLink failed, falling back to original URL:', err)
    return originalUrl
  }
}
