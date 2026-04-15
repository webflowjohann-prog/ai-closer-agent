import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { Webhook, WebhookLog, WebhookEvent } from '@/types/database'

export function useWebhooks() {
  const { organization } = useOrgStore()
  const qc = useQueryClient()

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks', organization?.id],
    queryFn: async () => {
      if (!organization) return []
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Webhook[]
    },
    enabled: !!organization,
    staleTime: 30_000,
  })

  const createWebhook = useMutation({
    mutationFn: async (params: { url: string; events: WebhookEvent[] }) => {
      if (!organization) throw new Error('No organization')

      // Generate signing secret
      const secret = 'whsec_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      const { data, error } = await supabase
        .from('webhooks')
        .insert({
          organization_id: organization.id,
          url: params.url,
          events: params.events,
          secret,
        })
        .select()
        .single()

      if (error) throw error
      return data as Webhook
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['webhooks', organization?.id] })
    },
  })

  const updateWebhook = useMutation({
    mutationFn: async (params: {
      id: string
      url?: string
      events?: WebhookEvent[]
      is_active?: boolean
    }) => {
      const { id, ...updates } = params
      const { data, error } = await supabase
        .from('webhooks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Webhook
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['webhooks', organization?.id] })
    },
  })

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('webhooks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['webhooks', organization?.id] })
    },
  })

  return { webhooks, isLoading, createWebhook, updateWebhook, deleteWebhook }
}

export function useWebhookLogs(webhookId: string | null) {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['webhook-logs', webhookId],
    queryFn: async () => {
      if (!webhookId) return []
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('webhook_id', webhookId)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data as WebhookLog[]
    },
    enabled: !!webhookId,
    staleTime: 10_000,
  })
  return { logs, isLoading }
}
