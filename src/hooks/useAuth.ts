import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  return useAuthStore()
}

export function useAuthInit() {
  const { setSession, setLoading, setInitialized } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      setInitialized(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setLoading, setInitialized])
}

export function useRequireAuth() {
  const { user, loading, initialized } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate('/auth/login', { replace: true })
    }
  }, [user, loading, initialized, navigate])

  return { user, loading }
}
