import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)
    setSent(true)
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
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)] font-display mb-2">
                Email envoyé
              </h2>
              <p className="text-sm text-[var(--text-tertiary)] mb-6">
                Vérifiez votre boîte mail. Le lien expire dans 1 heure.
              </p>
              <Link to="/auth/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Button>
              </Link>
            </motion.div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-[var(--text-primary)] font-display mb-1">
                Réinitialiser
              </h1>
              <p className="text-sm text-[var(--text-tertiary)] mb-6">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le lien'
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
