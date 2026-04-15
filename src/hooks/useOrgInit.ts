import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useOrgStore } from '@/stores/orgStore'

export function useOrgInit() {
  const { user } = useAuthStore()
  const { activeSubAccount, setOrganization, setSubAccounts, setActiveSubAccount } = useOrgStore()
  const navigate = useNavigate()
  const location = useLocation()
  const loadedFor = useRef<string | null>(null)

  useEffect(() => {
    if (!user || loadedFor.current === user.id) return

    const load = async () => {
      loadedFor.current = user.id

      // Get user's organization_id
      const { data: userData } = await supabase
        .from('users')
        .select('organization_id')
        .eq('id', user.id)
        .maybeSingle()

      if (!userData?.organization_id) {
        // No onboarding completed — redirect unless already there
        if (!location.pathname.startsWith('/onboarding')) {
          navigate('/onboarding', { replace: true })
        }
        return
      }

      // Load org
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', userData.organization_id)
        .single()

      if (org) setOrganization(org)

      // Load sub-accounts
      const { data: accounts } = await supabase
        .from('sub_accounts')
        .select('*')
        .eq('organization_id', userData.organization_id)
        .is('deleted_at', null)
        .order('created_at')

      if (accounts && accounts.length > 0) {
        setSubAccounts(accounts)
        // Set active if not set or no longer valid
        const stillValid = activeSubAccount && accounts.some(a => a.id === activeSubAccount.id)
        if (!stillValid) setActiveSubAccount(accounts[0])
      }
    }

    load()
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps
}
