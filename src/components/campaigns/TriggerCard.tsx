import { Instagram, Facebook, Trash2, ExternalLink, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import type { CommentTrigger } from '@/types/database'

interface TriggerCardProps {
  trigger: CommentTrigger
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}

export function TriggerCard({ trigger, onToggle, onDelete }: TriggerCardProps) {
  const isInstagram = trigger.platform === 'instagram'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Platform badge */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isInstagram ? 'bg-pink-100' : 'bg-blue-100'
            }`}>
              {isInstagram
                ? <Instagram className="w-4 h-4 text-pink-600" />
                : <Facebook className="w-4 h-4 text-blue-600" />
              }
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isInstagram ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {trigger.platform.charAt(0).toUpperCase() + trigger.platform.slice(1)}
                </span>
                {trigger.is_active
                  ? <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Actif</span>
                  : <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">Inactif</span>
                }
              </div>

              {trigger.post_url && (
                <a href={trigger.post_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand-500 hover:underline flex items-center gap-1 mb-1"
                  onClick={(e) => e.stopPropagation()}>
                  <ExternalLink className="w-3 h-3" />
                  Voir le post
                </a>
              )}

              {trigger.trigger_keyword ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  Mot-clé : <span className="font-medium text-[var(--text-primary)]">"{trigger.trigger_keyword}"</span>
                </p>
              ) : (
                <p className="text-xs text-[var(--text-tertiary)]">Tous les commentaires</p>
              )}

              <div className="mt-2 p-2 bg-[var(--surface-secondary)] rounded-lg">
                <p className="text-[10px] text-[var(--text-tertiary)] mb-0.5">Message DM :</p>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{trigger.dm_template}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                  <span className="font-semibold text-[var(--text-primary)]">{trigger.triggers_count}</span> déclenchements
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                  <MessageCircle className="w-3 h-3" />
                  <span className="font-semibold text-[var(--text-primary)]">{trigger.dms_sent}</span> DMs envoyés
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Switch
              checked={trigger.is_active}
              onCheckedChange={(v) => onToggle(trigger.id, v)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-[var(--text-tertiary)] hover:text-red-500"
              onClick={() => onDelete(trigger.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
