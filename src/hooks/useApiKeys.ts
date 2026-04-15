import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { ApiKey } from '@/types/database'

export function useApiKeys() {
  const { organization } = useOrgStore()
  const qc = useQueryClient()

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['api-keys', organization?.id],
    queryFn: async () => {
      if (!organization) return []
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as ApiKey[]
    },
    enabled: !!organization,
    staleTime: 30_000,
  })

  const createApiKey = useMutation({
    mutationFn: async (params: {
      name: string
      permissions: string[]
      expiresAt?: string
    }) => {
      if (!organization) throw new Error('No organization')

      // Generate key client-side (in production, use Edge Function)
      const rawKey = 'ica_live_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
      const prefix = rawKey.slice(0, 16) + '...'

      // Simple hash (in production, use bcrypt via Edge Function)
      const encoder = new TextEncoder()
      const data = encoder.encode(rawKey)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const keyHash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      const { data: row, error } = await supabase
        .from('api_keys')
        .insert({
          organization_id: organization.id,
          name: params.name,
          key_hash: keyHash,
          key_prefix: prefix,
          permissions: params.permissions,
          expires_at: params.expiresAt || null,
        })
        .select()
        .single()

      if (error) throw error
      // Return both the row AND the raw key (only shown once)
      return { apiKey: row as ApiKey, rawKey }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['api-keys', organization?.id] })
    },
  })

  const revokeApiKey = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['api-keys', organization?.id] })
    },
  })

  return { apiKeys, isLoading, createApiKey, revokeApiKey }
}
