import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Mot de passe trop court', { description: 'Minimum 8 caractères requis.' })
      return
    }
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      toast.error("Erreur d'inscription", { description: error.message })
      setLoading(false)
      return
    }

    toast.success('Compte créé !', {
      description: "Vérifiez votre email pour confirmer votre compte.",
    })
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-[var(--text-primary)] font-display">AI Closer</span>
        </div>

        <div className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-default)] p-6 shadow-md">
          <h1 className="text-xl font-semibold text-[var(--text-primary)] font-display mb-1">
            Créer un compte
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mb-6">
            Commencez à automatiser vos ventes en 3 minutes
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jean Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 3
                          ? password.length >= 12 ? 'bg-success' : 'bg-brand-400'
                          : 'bg-[var(--color-gray-200)]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Création du compte...
                </>
              ) : (
                'Créer mon compte'
              )}
            </Button>

            <p className="text-xs text-[var(--text-tertiary)] text-center">
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="text-brand-500 hover:underline">CGU</a>
              {' '}et notre{' '}
              <a href="#" className="text-brand-500 hover:underline">Politique de confidentialité</a>
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-tertiary)] mt-6">
          Déjà un compte ?{' '}
          <Link to="/auth/login" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
