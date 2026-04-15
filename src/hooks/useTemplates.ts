import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { MessageTemplate } from '@/types/database'
import { toast } from 'sonner'

export function useTemplates() {
  const { activeSubAccount } = useOrgStore()
  const queryClient = useQueryClient()

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return []
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('sub_account_id', activeSubAccount.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as MessageTemplate[]
    },
    enabled: !!activeSubAccount,
    staleTime: 60_000,
  })

  const createTemplate = useMutation({
    mutationFn: async (input: Partial<MessageTemplate>) => {
      if (!activeSubAccount) throw new Error('No active sub-account')
      // Extract variables from content
      const matches = (input.content || '').match(/\{\{(\w+)\}\}/g) || []
      const variables = [...new Set(matches)]
      const { data, error } = await supabase
        .from('message_templates')
        .insert({ ...input, sub_account_id: activeSubAccount.id, variables })
        .select()
        .single()
      if (error) throw error
      return data as MessageTemplate
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', activeSubAccount?.id] })
      toast.success('Template créé')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MessageTemplate> & { id: string }) => {
      if (updates.content) {
        const matches = updates.content.match(/\{\{(\w+)\}\}/g) || []
        updates.variables = [...new Set(matches)]
      }
      const { error } = await supabase.from('message_templates').update(updates).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', activeSubAccount?.id] })
      toast.success('Template mis à jour')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('message_templates')
        .update({ is_active: false })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', activeSubAccount?.id] })
      toast.success('Template supprimé')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const incrementUsage = async (id: string) => {
    await supabase
      .from('message_templates')
      .update({ times_used: (templates.find((t) => t.id === id)?.times_used || 0) + 1, last_used_at: new Date().toISOString() })
      .eq('id', id)
  }

  return { templates, isLoading, createTemplate, updateTemplate, deleteTemplate, incrementUsage }
}
