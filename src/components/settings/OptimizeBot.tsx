import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, CheckCircle2, TrendingUp, AlertTriangle, Lightbulb, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Suggestion {
  type: 'info' | 'warning' | 'success'
  text: string
  impact: 'high' | 'medium' | 'low'
}

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    type: 'info',
    text: 'Ajouter une FAQ sur les délais de livraison — demandée 12 fois cette semaine',
    impact: 'high',
  },
  {
    type: 'warning',
    text: 'Le taux de réponse chute après la 3ème relance — réduire à 2 relances maximum',
    impact: 'high',
  },
  {
    type: 'success',
    text: 'Les prospects qualifiés le soir (après 19h) convertissent 40% mieux',
    impact: 'medium',
  },
  {
    type: 'info',
    text: 'Le canal Instagram génère 3× plus de leads qualifiés que WhatsApp sur votre verticale',
    impact: 'medium',
  },
  {
    type: 'warning',
    text: 'Vos messages de relance J+3 ont un taux d\'ouverture de 12% — reformuler l\'accroche',
    impact: 'low',
  },
]

const IMPACT_COLORS = {
  high: 'text-red-500 bg-red-50 border-red-100',
  medium: 'text-amber-600 bg-amber-50 border-amber-100',
  low: 'text-blue-500 bg-blue-50 border-blue-100',
}

const IMPACT_LABELS = { high: 'Impact fort', medium: 'Impact moyen', low: 'Impact faible' }

const TYPE_ICONS = {
  info: Lightbulb,
  warning: AlertTriangle,
  success: TrendingUp,
}

const TYPE_COLORS = {
  info: 'text-brand-500',
  warning: 'text-amber-500',
  success: 'text-green-500',
}

export function OptimizeBot() {
  const { activeSubAccount, setActiveSubAccount } = useOrgStore()
  const [optimizing, setOptimizing] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const lastOptimized = activeSubAccount?.last_optimized_at

  const handleOptimize = async () => {
    setOptimizing(true)
    setSuggestions([])
    setScore(null)
    setApplied(false)

    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 2000))

    const newScore = 72 + Math.floor(Math.random() * 15)
    setScore(newScore)
    setSuggestions(MOCK_SUGGESTIONS)
    setOptimizing(false)

    // Update last_optimized_at
    if (activeSubAccount) {
      const { data } = await supabase
        .from('sub_accounts')
        .update({
          last_optimized_at: new Date().toISOString(),
          optimization_score: newScore,
        })
        .eq('id', activeSubAccount.id)
        .select()
        .single()
      if (data && setActiveSubAccount) {
        setActiveSubAccount({ ...activeSubAccount, ...data })
      }
    }
  }

  const handleApply = async () => {
    setApplying(true)
    await new Promise((r) => setTimeout(r, 1500))
    setApplying(false)
    setApplied(true)
    toast.success('Suggestions appliquées', {
      description: `${suggestions.filter((s) => s.impact === 'high').length} optimisations critiques intégrées à votre agent`,
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-500" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Optimisation IA</p>
      </div>

      {/* Last optimized */}
      {lastOptimized && (
        <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Dernière analyse {formatDistanceToNow(new Date(lastOptimized), { addSuffix: true, locale: fr })}
          {activeSubAccount?.optimization_score && (
            <span className="font-semibold text-brand-600 ml-1">
              · Score {activeSubAccount.optimization_score}/100
            </span>
          )}
        </p>
      )}

      {/* Optimize button */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleOptimize}
          disabled={optimizing}
          className="w-full gap-2"
          variant={score !== null ? 'outline' : 'default'}
        >
          {optimizing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {optimizing
            ? 'Analyse en cours...'
            : score !== null
            ? 'Relancer l\'analyse'
            : 'Optimiser mon agent'}
        </Button>
      </motion.div>

      <AnimatePresence>
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Score ring */}
            <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100 rounded-xl">
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e9ecef" strokeWidth="3" />
                  <motion.circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke="#5c7cfa"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="88"
                    initial={{ strokeDashoffset: 88 }}
                    animate={{ strokeDashoffset: 88 - (score / 100) * 88 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-brand-600">{score}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">Score global</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {score >= 80
                    ? 'Excellent — votre agent est bien optimisé'
                    : score >= 60
                    ? 'Bon — quelques améliorations possibles'
                    : 'Des ajustements importants sont recommandés'}
                </p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} détectée{suggestions.length !== 1 ? 's' : ''}
              </p>
              {suggestions.map((s, i) => {
                const Icon = TYPE_ICONS[s.type]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 p-3 border border-[var(--border-default)] rounded-xl bg-[var(--surface-primary)]"
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${TYPE_COLORS[s.type]}`} />
                    <p className="text-xs text-[var(--text-secondary)] flex-1">{s.text}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${IMPACT_COLORS[s.impact]}`}>
                      {IMPACT_LABELS[s.impact]}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Apply button */}
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleApply}
                disabled={applying || applied}
                className="w-full gap-2"
                variant={applied ? 'outline' : 'default'}
              >
                {applying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : applied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {applying
                  ? 'Application...'
                  : applied
                  ? 'Suggestions appliquées'
                  : 'Appliquer les suggestions'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
