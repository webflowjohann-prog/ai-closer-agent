import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'
import type { ReportSchedule } from '@/types/database'

export function useReportSchedules() {
  const { activeSubAccount } = useOrgStore()
  const qc = useQueryClient()

  const { data: schedule, isLoading } = useQuery({
    queryKey: ['report_schedule', activeSubAccount?.id],
    queryFn: async () => {
      if (!activeSubAccount) return null
      const { data } = await supabase
        .from('report_schedules')
        .select('*')
        .eq('sub_account_id', activeSubAccount.id)
        .single()
      return data as ReportSchedule | null
    },
    enabled: !!activeSubAccount,
    staleTime: 60_000,
  })

  const upsertSchedule = useMutation({
    mutationFn: async (input: Partial<ReportSchedule>) => {
      if (!activeSubAccount) throw new Error('No sub-account')
      if (schedule?.id) {
        const { error } = await supabase.from('report_schedules').update(input).eq('id', schedule.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('report_schedules').insert({
          sub_account_id: activeSubAccount.id,
          frequency: 'weekly',
          day_of_week: 1,
          send_to: [],
          include_sections: ['kpis', 'funnel', 'deals'],
          is_active: true,
          ...input,
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['report_schedule', activeSubAccount?.id] })
      toast.success('Rapport configuré')
    },
    onError: (e: any) => toast.error('Erreur', { description: e.message }),
  })

  return { schedule, isLoading, upsertSchedule }
}
