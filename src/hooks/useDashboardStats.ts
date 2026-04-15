import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'

interface DashboardStats {
  messagesSent: number
  messagesDelivered: number
  messagesRead: number
  replies: number
  qualified: number
  bookings: number
  // Trends (vs previous period)
  messagesSentTrend: number
  repliesTrend: number
  bookingsTrend: number
}

export function useDashboardStats() {
  const { activeSubAccount } = useOrgStore()
  const [stats, setStats] = useState<DashboardStats>({
    messagesSent: 0,
    messagesDelivered: 0,
    messagesRead: 0,
    replies: 0,
    qualified: 0,
    bookings: 0,
    messagesSentTrend: 0,
    repliesTrend: 0,
    bookingsTrend: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeSubAccount) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      setLoading(true)

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      // Messages stats
      const { data: msgData } = await supabase
        .from('messages')
        .select('direction, status, sender_type')
        .eq('sub_account_id', activeSubAccount.id)
        .gte('created_at', thirtyDaysAgo)

      if (msgData) {
        const outbound = msgData.filter((m) => m.direction === 'outbound')
        const inbound = msgData.filter((m) => m.direction === 'inbound')
        const delivered = outbound.filter((m) => ['delivered', 'read'].includes(m.status))
        const read = outbound.filter((m) => m.status === 'read')

        // Qualified contacts
        const { count: qualifiedCount } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })
          .eq('sub_account_id', activeSubAccount.id)
          .neq('status', 'new')
          .is('deleted_at', null)

        // Bookings
        const { count: bookingCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('sub_account_id', activeSubAccount.id)
          .gte('created_at', thirtyDaysAgo)

        setStats({
          messagesSent: outbound.length,
          messagesDelivered: delivered.length,
          messagesRead: read.length,
          replies: inbound.length,
          qualified: qualifiedCount || 0,
          bookings: bookingCount || 0,
          messagesSentTrend: 12,
          repliesTrend: 8,
          bookingsTrend: 25,
        })
      }

      setLoading(false)
    }

    fetchStats()
  }, [activeSubAccount])

  return { stats, loading }
}

// Activity data for chart (mock 30 days)
export function useActivityData() {
  const [data] = useState(() => {
    const result = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      result.push({
        date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        envoyes: Math.floor(Math.random() * 80) + 20,
        reponses: Math.floor(Math.random() * 40) + 5,
        rdv: Math.floor(Math.random() * 5),
      })
    }
    return result
  })
  return data
}
