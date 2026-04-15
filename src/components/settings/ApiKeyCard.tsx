import { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { ApiKey } from '@/types/database'

const PERMISSION_LABELS: Record<string, string> = {
  read: 'Lecture',
  write: 'Écriture',
  contacts: 'Contacts',
  conversations: 'Conversations',
  campaigns: 'Campagnes',
}

interface ApiKeyCardProps {
  apiKey: ApiKey
  onRevoke: (id: string) => void
}

export function ApiKeyCard({ apiKey, onRevoke }: ApiKeyCardProps) {
  const [confirming, setConfirming] = useState(false)

  const handleRevoke = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    onRevoke(apiKey.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="p-4 border border-[var(--border-default)] rounded-xl bg-[var(--surface-primary)] space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
            <Key className="w-4 h-4 text-brand-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{apiKey.name}</p>
            <p className="text-xs font-mono text-[var(--text-tertiary)] mt-0.5">{apiKey.key_prefix}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {apiKey.is_active ? (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <XCircle className="w-3.5 h-3.5" />
              Révoquée
            </span>
          )}
        </div>
      </div>

      {/* Permissions */}
      <div className="flex flex-wrap gap-1.5">
        {apiKey.permissions.map((perm) => (
          <Badge key={perm} variant="secondary" className="text-[10px] h-5">
            {PERMISSION_LABELS[perm] || perm}
          </Badge>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {apiKey.last_used_at ? (
            <span className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
              <Clock className="w-3 h-3" />
              Dernière utilisation {formatDistanceToNow(new Date(apiKey.last_used_at), { addSuffix: true, locale: fr })}
            </span>
          ) : (
            <span className="text-[10px] text-[var(--text-tertiary)]">Jamais utilisée</span>
          )}
          {apiKey.expires_at && (
            <span className="text-[10px] text-[var(--text-tertiary)]">
              Expire {formatDistanceToNow(new Date(apiKey.expires_at), { addSuffix: true, locale: fr })}
            </span>
          )}
        </div>

        {apiKey.is_active && (
          <motion.div animate={confirming ? { scale: [1, 1.05, 1] } : {}}>
            <Button
              size="sm"
              variant={confirming ? 'destructive' : 'ghost'}
              className="h-7 text-xs gap-1"
              onClick={handleRevoke}
              onBlur={() => setConfirming(false)}
            >
              <Trash2 className="w-3 h-3" />
              {confirming ? 'Confirmer' : 'Révoquer'}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
