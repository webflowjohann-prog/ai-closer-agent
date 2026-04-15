import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { Deal, DealStage } from '@/types/database'
import { toast } from 'sonner'

const STAGE_PROBABILITIES: Record<DealStage, number> = {
  lead: 10,
  qualified: 25,
  meeting: 40,
  proposal: 60,
  negotiation: 80,
  closed_won: 100,
  closed_lost: 0,
}

export function useDeals() {
  const { activeSubAccount } = useOrgStore()
  const queryClient = useQueryClient()

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return []
      const { data, error } = await supabase
        .from('deals')
        .select('*, contact:contacts(id, first_name, last_name, full_name, email, phone, avatar_url, status, score, tags)')
        .eq('sub_account_id', activeSubAccount.id)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data as Deal[]
    },
    enabled: !!activeSubAccount,
    staleTime: 30_000,
  })

  const createDeal = useMutation({
    mutationFn: async (input: { contact_id: string; title: string; value?: number; stage?: DealStage }) => {
      if (!activeSubAccount) throw new Error('No active sub-account')
      const stage = input.stage || 'lead'
      const { data, error } = await supabase
        .from('deals')
        .insert({
          sub_account_id: activeSubAccount.id,
          contact_id: input.contact_id,
          title: input.title,
          value: input.value,
          stage,
          probability: STAGE_PROBABILITIES[stage],
          currency: 'EUR',
        })
        .select('*, contact:contacts(id, first_name, last_name, full_name, email, phone, avatar_url, status, score, tags)')
        .single()
      if (error) throw error
      return data as Deal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', activeSubAccount?.id] })
      toast.success('Deal créé')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateDealStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: DealStage }) => {
      const { error } = await supabase
        .from('deals')
        .update({
          stage,
          probability: STAGE_PROBABILITIES[stage],
          stage_changed_at: new Date().toISOString(),
          won_at: stage === 'closed_won' ? new Date().toISOString() : null,
          lost_at: stage === 'closed_lost' ? new Date().toISOString() : null,
        })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', activeSubAccount?.id] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateDeal = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Deal> & { id: string }) => {
      const { error } = await supabase.from('deals').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', activeSubAccount?.id] })
      toast.success('Deal mis à jour')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteDeal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('deals')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals', activeSubAccount?.id] })
      toast.success('Deal supprimé')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const dealsByStage = (stage: DealStage) => deals.filter((d) => d.stage === stage)
  const stageTotal = (stage: DealStage) =>
    deals.filter((d) => d.stage === stage).reduce((sum, d) => sum + (d.value || 0), 0)

  return { deals, isLoading, createDeal, updateDealStage, updateDeal, deleteDeal, dealsByStage, stageTotal }
}
