import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'
import type { PaymentLink } from '@/types/database'

export function usePaymentLinks(conversationId?: string) {
  const { activeSubAccount } = useOrgStore()
  const qc = useQueryClient()

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['payment_links', activeSubAccount?.id, conversationId],
    queryFn: async () => {
      if (!activeSubAccount) return []
      let query = supabase
        .from('payment_links')
        .select('*, contact:contacts(full_name, email, phone)')
        .eq('sub_account_id', activeSubAccount.id)
        .order('created_at', { ascending: false })
      if (conversationId) query = query.eq('conversation_id', conversationId)
      const { data } = await query
      return (data || []) as PaymentLink[]
    },
    enabled: !!activeSubAccount,
    staleTime: 15_000,
  })

  const createLink = useMutation({
    mutationFn: async (input: {
      title: string
      amount: number
      currency: string
      contact_id?: string
      conversation_id?: string
    }) => {
      if (!activeSubAccount) throw new Error('No sub-account')
      // Mock: generate a fictional Stripe URL
      const mockId = `pl_${Math.random().toString(36).slice(2, 12)}`
      const mockUrl = `https://checkout.stripe.com/pay/${mockId}`

      const { data, error } = await supabase
        .from('payment_links')
        .insert({
          sub_account_id: activeSubAccount.id,
          title: input.title,
          amount: input.amount,
          currency: input.currency,
          contact_id: input.contact_id,
          conversation_id: input.conversation_id,
          stripe_payment_link_id: mockId,
          stripe_payment_link_url: mockUrl,
          status: 'pending',
        })
        .select()
        .single()
      if (error) throw error
      return data as PaymentLink
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment_links', activeSubAccount?.id] })
      toast.success('Lien de paiement créé')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  return { links, isLoading, createLink }
}
