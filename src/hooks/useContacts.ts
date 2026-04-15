import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { Contact, ContactStatus } from '@/types/database'

interface ContactFilters {
  search?: string
  status?: ContactStatus | 'all'
  tags?: string[]
  page?: number
  pageSize?: number
}

export function useContacts(filters: ContactFilters = {}) {
  const { activeSubAccount } = useOrgStore()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const { search, status, tags, page = 1, pageSize = 25 } = filters

  const fetchContacts = useCallback(async () => {
    if (!activeSubAccount) {
      setLoading(false)
      return
    }

    setLoading(true)
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('sub_account_id', activeSubAccount.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (search) {
      query = query.ilike('full_name', `%${search}%`)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    const { data, error, count } = await query

    if (!error && data) {
      setContacts(data as Contact[])
      setTotal(count || 0)
    }
    setLoading(false)
  }, [activeSubAccount, search, status, tags, page, pageSize])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const { error } = await supabase.from('contacts').update(updates).eq('id', id)
    if (!error) fetchContacts()
    return !error
  }

  const deleteContact = async (id: string) => {
    const { error } = await supabase
      .from('contacts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) fetchContacts()
    return !error
  }

  return { contacts, total, loading, refetch: fetchContacts, updateContact, deleteContact }
}
