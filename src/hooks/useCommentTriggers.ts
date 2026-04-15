import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'
import type { CommentTrigger } from '@/types/database'

export function useCommentTriggers() {
  const { activeSubAccount } = useOrgStore()
  const qc = useQueryClient()

  const { data: triggers = [], isLoading } = useQuery({
    queryKey: ['comment_triggers', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return []
      const { data } = await supabase
        .from('comment_triggers')
        .select('*')
        .eq('sub_account_id', activeSubAccount.id)
        .order('created_at', { ascending: false })
      return (data || []) as CommentTrigger[]
    },
    enabled: !!activeSubAccount,
    staleTime: 30_000,
  })

  const createTrigger = useMutation({
    mutationFn: async (input: Omit<CommentTrigger, 'id' | 'created_at' | 'updated_at' | 'triggers_count' | 'dms_sent' | 'sub_account_id'>) => {
      if (!activeSubAccount) throw new Error('No sub-account')
      const { data, error } = await supabase
        .from('comment_triggers')
        .insert({ ...input, sub_account_id: activeSubAccount.id, triggers_count: 0, dms_sent: 0 })
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comment_triggers', activeSubAccount?.id] })
      toast.success('Trigger créé')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  const toggleTrigger = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('comment_triggers').update({ is_active }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comment_triggers', activeSubAccount?.id] }),
  })

  const deleteTrigger = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('comment_triggers').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comment_triggers', activeSubAccount?.id] })
      toast.success('Trigger supprimé')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  return { triggers, isLoading, createTrigger, toggleTrigger, deleteTrigger }
}
