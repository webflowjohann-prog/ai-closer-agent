import { useState } from 'react'
import { Plus, MessageSquarePlus, Instagram, Facebook } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { TriggerCard } from './TriggerCard'
import { CreateTriggerDialog } from './CreateTriggerDialog'
import { useCommentTriggers } from '@/hooks/useCommentTriggers'

export function CommentToDM() {
  const [showCreate, setShowCreate] = useState(false)
  const { triggers, isLoading, toggleTrigger, deleteTrigger } = useCommentTriggers()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Comment → DM</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Envoyez automatiquement un DM à chaque commentaire sur vos posts Instagram ou Facebook
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-3.5 h-3.5" />
          Nouveau trigger
        </Button>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: <Instagram className="w-4 h-4 text-pink-500 mx-auto" />, label: 'Post commenté', sub: 'par un utilisateur' },
          { icon: <MessageSquarePlus className="w-4 h-4 text-brand-500 mx-auto" />, label: 'Trigger activé', sub: 'selon le mot-clé' },
          { icon: <span className="text-lg mx-auto block">🤖</span>, label: 'DM envoyé', sub: 'en moins de 30 secondes' },
        ].map((step, i) => (
          <div key={i} className="bg-[var(--surface-secondary)] p-3 rounded-xl">
            {step.icon}
            <p className="text-xs font-medium text-[var(--text-primary)] mt-1">{step.label}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">{step.sub}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-[var(--surface-secondary)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : triggers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 border-2 border-dashed border-[var(--border-default)] rounded-xl"
        >
          <MessageSquarePlus className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">Aucun trigger configuré</p>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">
            Créez votre premier trigger pour automatiser vos DMs
          </p>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-3.5 h-3.5" />
            Créer un trigger
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {triggers.map((trigger) => (
            <TriggerCard
              key={trigger.id}
              trigger={trigger}
              onToggle={(id, active) => toggleTrigger.mutate({ id, is_active: active })}
              onDelete={(id) => deleteTrigger.mutate(id)}
            />
          ))}
        </div>
      )}

      <CreateTriggerDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
