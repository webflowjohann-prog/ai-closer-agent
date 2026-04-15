import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { FollowUp, FollowUpStatus } from '@/types/database'
import { toast } from 'sonner'

export function useFollowUps(contactId?: string) {
  const { activeSubAccount } = useOrgStore()
  const queryClient = useQueryClient()

  const { data: followUps = [], isLoading } = useQuery({
    queryKey: ['follow-ups', activeSubAccount?.id, contactId],
    queryFn: async () => {
      if (!activeSubAccount) return []
      let q = supabase
        .from('follow_ups')
        .select('*, contact:contacts(id, first_name, last_name, full_name, email)')
        .eq('sub_account_id', activeSubAccount.id)
        .order('scheduled_at', { ascending: true })
      if (contactId) q = q.eq('contact_id', contactId)
      const { data, error } = await q
      if (error) throw error
      return data as FollowUp[]
    },
    enabled: !!activeSubAccount,
    staleTime: 30_000,
  })

  const createFollowUp = useMutation({
    mutationFn: async (input: {
      contact_id: string
      conversation_id?: string
      message: string
      channel_type: FollowUp['channel_type']
      scheduled_at: string
      cancel_if_replied?: boolean
      cancel_if_booked?: boolean
    }) => {
      if (!activeSubAccount) throw new Error('No active sub-account')
      const { data, error } = await supabase
        .from('follow_ups')
        .insert({ ...input, sub_account_id: activeSubAccount.id, status: 'scheduled' })
        .select('*, contact:contacts(id, first_name, last_name, full_name, email)')
        .single()
      if (error) throw error
      return data as FollowUp
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups', activeSubAccount?.id] })
      toast.success('Relance programmée')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const cancelFollowUp = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('follow_ups')
        .update({ status: 'cancelled' as FollowUpStatus })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups', activeSubAccount?.id] })
      toast.success('Relance annulée')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const scheduled = followUps.filter((f) => f.status === 'scheduled')
  const sent = followUps.filter((f) => f.status === 'sent')

  return { followUps, scheduled, sent, isLoading, createFollowUp, cancelFollowUp }
}
