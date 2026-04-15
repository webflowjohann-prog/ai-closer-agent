import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'
import type { RoutingRule } from '@/types/database'

export function useRoutingRules() {
  const { activeSubAccount } = useOrgStore()
  const qc = useQueryClient()

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['routing_rules', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return []
      const { data } = await supabase
        .from('routing_rules')
        .select('*')
        .eq('sub_account_id', activeSubAccount.id)
        .order('priority', { ascending: true })
      return (data || []) as RoutingRule[]
    },
    enabled: !!activeSubAccount,
    staleTime: 60_000,
  })

  const createRule = useMutation({
    mutationFn: async (input: Omit<RoutingRule, 'id' | 'created_at' | 'updated_at' | 'sub_account_id'>) => {
      if (!activeSubAccount) throw new Error('No sub-account')
      const { data, error } = await supabase
        .from('routing_rules')
        .insert({ ...input, sub_account_id: activeSubAccount.id })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routing_rules', activeSubAccount?.id] })
      toast.success('Règle créée')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  const updateRule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RoutingRule> & { id: string }) => {
      const { error } = await supabase.from('routing_rules').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routing_rules', activeSubAccount?.id] }),
  })

  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('routing_rules').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['routing_rules', activeSubAccount?.id] })
      toast.success('Règle supprimée')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  return { rules, isLoading, createRule, updateRule, deleteRule }
}
