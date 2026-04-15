import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'
import type { ReviewRequest } from '@/types/database'

export function useReviewRequests() {
  const { activeSubAccount } = useOrgStore()
  const qc = useQueryClient()

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['review_requests', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return []
      const { data } = await supabase
        .from('review_requests')
        .select('*, contact:contacts(full_name, phone, email)')
        .eq('sub_account_id', activeSubAccount.id)
        .order('created_at', { ascending: false })
        .limit(50)
      return (data || []) as ReviewRequest[]
    },
    enabled: !!activeSubAccount,
    staleTime: 30_000,
  })

  const sendRequest = useMutation({
    mutationFn: async (input: {
      contact_id: string
      conversation_id?: string
      platform: 'google' | 'trustpilot' | 'facebook'
      review_url: string
    }) => {
      if (!activeSubAccount) throw new Error('No sub-account')
      const { data, error } = await supabase
        .from('review_requests')
        .insert({
          sub_account_id: activeSubAccount.id,
          ...input,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['review_requests', activeSubAccount?.id] })
      toast.success('Demande d\'avis envoyée')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  const stats = {
    total: requests.length,
    sent: requests.filter((r) => r.status === 'sent').length,
    clicked: requests.filter((r) => r.status === 'clicked').length,
    reviewed: requests.filter((r) => r.status === 'reviewed').length,
  }

  return { requests, isLoading, sendRequest, stats }
}
