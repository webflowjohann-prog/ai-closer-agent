import { FlaskConical, Trophy } from 'lucide-react'
import type { CampaignSequence } from '@/types/database'

interface ABResultsProps {
  sequence: CampaignSequence
}

export function ABResults({ sequence }: ABResultsProps) {
  if (!sequence.template_b || (sequence.sent_a === 0 && sequence.sent_b === 0)) {
    return null
  }

  const rateA = sequence.sent_a > 0 ? Math.round((sequence.replied_a / sequence.sent_a) * 100) : 0
  const rateB = sequence.sent_b > 0 ? Math.round((sequence.replied_b / sequence.sent_b) * 100) : 0
  const winner = rateA > rateB ? 'A' : rateB > rateA ? 'B' : null

  return (
    <div className="border border-[var(--border-default)] rounded-xl p-4 bg-[var(--surface-secondary)]">
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical className="w-4 h-4 text-brand-500" />
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">A/B Testing — Étape {sequence.step_number}</h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(['A', 'B'] as const).map((variant) => {
          const sent = variant === 'A' ? sequence.sent_a : sequence.sent_b
          const replied = variant === 'A' ? sequence.replied_a : sequence.replied_b
          const rate = variant === 'A' ? rateA : rateB
          const isWinner = winner === variant
          const color = variant === 'A' ? 'brand-500' : 'purple-500'

          return (
            <div
              key={variant}
              className={`p-3 rounded-lg border-2 transition-colors ${
                isWinner
                  ? variant === 'A'
                    ? 'border-brand-400 bg-brand-50/40'
                    : 'border-purple-400 bg-purple-50/40'
                  : 'border-[var(--border-default)] bg-[var(--surface-primary)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${variant === 'A' ? 'text-brand-500' : 'text-purple-500'}`}>
                  Variante {variant}
                </span>
                {isWinner && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-yellow-600">
                    <Trophy className="w-3 h-3" /> Gagnant
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">Envoyés</span>
                  <span className="font-medium text-[var(--text-primary)]">{sent}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-tertiary)]">Réponses</span>
                  <span className="font-medium text-[var(--text-primary)]">{replied}</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-tertiary)]">Taux</span>
                    <span className={`font-bold ${variant === 'A' ? 'text-brand-500' : 'text-purple-500'}`}>{rate}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${variant === 'A' ? 'bg-brand-500' : 'bg-purple-500'}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
