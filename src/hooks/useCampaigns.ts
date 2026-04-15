import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { Campaign, CampaignSequence, CampaignStatus } from '@/types/database'
import { toast } from 'sonner'

export function useCampaigns() {
  const { activeSubAccount } = useOrgStore()
  const queryClient = useQueryClient()

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return []
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('sub_account_id', activeSubAccount.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Campaign[]
    },
    enabled: !!activeSubAccount,
    staleTime: 30_000,
  })

  const createCampaign = useMutation({
    mutationFn: async (input: Partial<Campaign>) => {
      if (!activeSubAccount) throw new Error('No active sub-account')
      const { data, error } = await supabase
        .from('campaigns')
        .insert({ ...input, sub_account_id: activeSubAccount.id })
        .select()
        .single()
      if (error) throw error
      return data as Campaign
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', activeSubAccount?.id] })
      toast.success('Campagne créée')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateCampaign = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Campaign> & { id: string }) => {
      const { error } = await supabase.from('campaigns').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', activeSubAccount?.id] })
      toast.success('Campagne mise à jour')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CampaignStatus }) => {
      const updates: Partial<Campaign> = { status }
      if (status === 'active') updates.started_at = new Date().toISOString()
      if (status === 'completed') updates.completed_at = new Date().toISOString()
      const { error } = await supabase.from('campaigns').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', activeSubAccount?.id] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteCampaign = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('campaigns').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', activeSubAccount?.id] })
      toast.success('Campagne supprimée')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return { campaigns, isLoading, createCampaign, updateCampaign, updateStatus, deleteCampaign }
}

export function useCampaignDetail(campaignId: string) {
  const queryClient = useQueryClient()

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()
      if (error) throw error
      return data as Campaign
    },
    staleTime: 30_000,
  })

  const { data: sequences = [], isLoading: seqLoading } = useQuery({
    queryKey: ['campaign-sequences', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_sequences')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('step_number', { ascending: true })
      if (error) throw error
      return data as CampaignSequence[]
    },
    staleTime: 30_000,
  })

  const saveSequences = useMutation({
    mutationFn: async (steps: Partial<CampaignSequence>[]) => {
      // Delete existing and reinsert
      await supabase.from('campaign_sequences').delete().eq('campaign_id', campaignId)
      if (steps.length > 0) {
        const { error } = await supabase.from('campaign_sequences').insert(
          steps.map((s, i) => ({ ...s, campaign_id: campaignId, step_number: i + 1, sort_order: i }))
        )
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-sequences', campaignId] })
      toast.success('Séquences sauvegardées')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return { campaign, sequences, isLoading: campaignLoading || seqLoading, saveSequences }
}
