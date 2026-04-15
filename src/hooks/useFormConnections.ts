import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'
import type { FormConnection } from '@/types/database'

export function useFormConnections() {
  const { activeSubAccount } = useOrgStore()
  const qc = useQueryClient()

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['form_connections', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return []
      const { data } = await supabase
        .from('form_connections')
        .select('*')
        .eq('sub_account_id', activeSubAccount.id)
        .order('created_at', { ascending: false })
      return (data || []) as FormConnection[]
    },
    enabled: !!activeSubAccount,
    staleTime: 30_000,
  })

  const createConnection = useMutation({
    mutationFn: async (input: Omit<FormConnection, 'id' | 'created_at' | 'updated_at' | 'sub_account_id' | 'leads_received' | 'leads_contacted'>) => {
      if (!activeSubAccount) throw new Error('No sub-account')
      const webhookSecret = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, '0')).join('')
      const { data, error } = await supabase
        .from('form_connections')
        .insert({
          ...input,
          sub_account_id: activeSubAccount.id,
          webhook_url: `https://api.ikonik-ac.com/webhooks/forms/${activeSubAccount.id}`,
          webhook_secret: webhookSecret,
          leads_received: 0,
          leads_contacted: 0,
        })
        .select()
        .single()
      if (error) throw error
      return data as FormConnection
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['form_connections', activeSubAccount?.id] })
      toast.success('Connexion créée')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  const toggleConnection = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('form_connections').update({ is_active }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['form_connections', activeSubAccount?.id] }),
  })

  const deleteConnection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('form_connections').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['form_connections', activeSubAccount?.id] })
      toast.success('Connexion supprimée')
    },
  })

  return { connections, isLoading, createConnection, toggleConnection, deleteConnection }
}
