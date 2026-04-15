import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Organization {
  id: string
  name: string
  slug: string
  plan: 'starter' | 'pro' | 'agency'
  logo_url?: string
  brand_color?: string
  brand_name?: string
  custom_domain?: string
  // Sprint 3 white-label
  font_family?: string
  seo_title?: string
  seo_description?: string
  terms_url?: string
  privacy_url?: string
  favicon_url?: string
  login_bg_url?: string
  accent_color?: string
}

interface SubAccount {
  id: string
  name: string
  slug: string
  vertical: string
  bot_active: boolean
  website_url?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  bot_instructions?: string
  bot_personality?: string
  bot_language?: string
  response_delay_min?: number
  response_delay_max?: number
  response_length_min?: number
  response_length_max?: number
  max_message_chunks?: number
  typing_speed?: number
  booking_duration_minutes?: number
  booking_buffer_minutes?: number
  booking_link_external?: string
  chat_memory_tokens?: number
  claude_api_key_encrypted?: string
  // Sprint 3
  last_optimized_at?: string
  optimization_score?: number
  // JSONB config — stores channel-specific settings (stripe, reviews, video, social proof...)
  config?: Record<string, any>
  // Switchy
  switchy_api_key_encrypted?: string
  switchy_custom_domain?: string
}

interface OrgState {
  organization: Organization | null
  subAccounts: SubAccount[]
  activeSubAccount: SubAccount | null
  setOrganization: (org: Organization | null) => void
  setSubAccounts: (accounts: SubAccount[]) => void
  setActiveSubAccount: (account: SubAccount | null) => void
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      organization: null,
      subAccounts: [],
      activeSubAccount: null,
      setOrganization: (organization) => set({ organization }),
      setSubAccounts: (subAccounts) => set({ subAccounts }),
      setActiveSubAccount: (activeSubAccount) => set({ activeSubAccount }),
    }),
    {
      name: 'org-store',
      partialize: (s) => ({ activeSubAccount: s.activeSubAccount }),
    }
  )
)
