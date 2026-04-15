import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('Erreur de connexion', { description: error.message })
      setLoading(false)
      return
    }

    // Check if onboarding was completed (users record exists)
    const { data: userRecord } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', authData.user?.id ?? '')
      .maybeSingle()

    navigate(userRecord?.organization_id ? '/app' : '/onboarding')
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-[var(--text-primary)] font-display">AI Closer</span>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-default)] p-6 shadow-md">
          <h1 className="text-xl font-semibold text-[var(--text-primary)] font-display mb-1">
            Bon retour 👋
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mb-6">
            Connectez-vous à votre espace IKONIK
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-brand-500 hover:text-brand-600 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-tertiary)] mt-6">
          Pas encore de compte ?{' '}
          <Link to="/auth/register" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
            S'inscrire
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
