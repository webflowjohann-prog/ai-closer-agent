import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'
import type { QRCode } from '@/types/database'

export function useQRCodes() {
  const { activeSubAccount } = useOrgStore()
  const qc = useQueryClient()

  const { data: qrCodes = [], isLoading } = useQuery({
    queryKey: ['qr_codes', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return []
      const { data } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('sub_account_id', activeSubAccount.id)
        .order('created_at', { ascending: false })
      return (data || []) as QRCode[]
    },
    enabled: !!activeSubAccount,
    staleTime: 30_000,
  })

  const createQR = useMutation({
    mutationFn: async (input: Omit<QRCode, 'id' | 'created_at' | 'updated_at' | 'sub_account_id' | 'scans_count' | 'conversations_started'>) => {
      if (!activeSubAccount) throw new Error('No sub-account')
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({ ...input, sub_account_id: activeSubAccount.id, scans_count: 0, conversations_started: 0 })
        .select()
        .single()
      if (error) throw error
      return data as QRCode
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['qr_codes', activeSubAccount?.id] })
      toast.success('QR Code créé')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  const deleteQR = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('qr_codes').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['qr_codes', activeSubAccount?.id] })
      toast.success('QR Code supprimé')
    },
  })

  return { qrCodes, isLoading, createQR, deleteQR }
}
