import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { Booking } from '@/types/database'

export function useBookings(month?: Date) {
  const { activeSubAccount } = useOrgStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!activeSubAccount) {
      setLoading(false)
      return
    }

    const fetchBookings = async () => {
      setLoading(true)
      const startDate = month
        ? new Date(month.getFullYear(), month.getMonth(), 1).toISOString()
        : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const endDate = month
        ? new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      const { data, error } = await supabase
        .from('bookings')
        .select('*, contact:contacts(*)')
        .eq('sub_account_id', activeSubAccount.id)
        .gte('starts_at', startDate)
        .lte('starts_at', endDate)
        .order('starts_at', { ascending: true })

      if (!error && data) {
        setBookings(data as Booking[])
      }
      setLoading(false)
    }

    fetchBookings()
  }, [activeSubAccount, month])

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    const { error } = await supabase.from('bookings').update(updates).eq('id', id)
    if (!error) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)))
    }
    return !error
  }

  return { bookings, loading, updateBooking }
}
