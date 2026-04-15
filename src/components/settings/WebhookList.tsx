import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, CheckCircle2, XCircle, Trash2, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'
import { useWebhooks } from '@/hooks/useWebhooks'
import { WebhookLogs } from './WebhookLogs'
import type { Webhook } from '@/types/database'

const EVENT_SHORT: Record<string, string> = {
  'message.received': 'Msg reçu',
  'message.sent': 'Msg envoyé',
  'conversation.created': 'Conv. créée',
  'conversation.closed': 'Conv. fermée',
  'contact.created': 'Contact créé',
  'contact.updated': 'Contact modifié',
  'booking.created': 'RDV créé',
  'booking.cancelled': 'RDV annulé',
  'deal.stage_changed': 'Deal étape',
  'deal.won': 'Deal gagné',
  'deal.lost': 'Deal perdu',
}

interface WebhookRowProps {
  webhook: Webhook
  onToggle: (id: string, active: boolean) => void
  onDelete: (id: string) => void
  onViewLogs: (id: string) => void
}

function WebhookRow({ webhook, onToggle, onDelete, onViewLogs }: WebhookRowProps) {
  const successRate =
    webhook.total_sent > 0
      ? Math.round(((webhook.total_sent - webhook.total_failed) / webhook.total_sent) * 100)
      : null

  const urlDisplay =
    webhook.url.length > 40 ? webhook.url.slice(0, 40) + '...' : webhook.url

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="p-4 border border-[var(--border-default)] rounded-xl bg-[var(--surface-primary)] space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
              webhook.is_active ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
          <div className="min-w-0">
            <p className="text-sm font-mono text-[var(--text-primary)] truncate">{urlDisplay}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {webhook.events.slice(0, 3).map((e) => (
                <span key={e} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--text-tertiary)]">
                  {EVENT_SHORT[e] || e}
                </span>
              ))}
              {webhook.events.length > 3 && (
                <span className="text-[9px] text-[var(--text-tertiary)]">
                  +{webhook.events.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onToggle(webhook.id, !webhook.is_active)}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            title={webhook.is_active ? 'Désactiver' : 'Activer'}
          >
            {webhook.is_active ? (
              <ToggleRight className="w-5 h-5 text-green-500" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </button>
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7"
            onClick={() => onViewLogs(webhook.id)}
            title="Voir les logs"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(webhook.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {successRate !== null && (
          <span className={`flex items-center gap-1 text-xs ${successRate >= 90 ? 'text-green-600' : successRate >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
            {successRate >= 90 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {successRate}% succès
          </span>
        )}
        <span className="text-[10px] text-[var(--text-tertiary)]">
          {webhook.total_sent} envoyés · {webhook.total_failed} échecs
        </span>
        {webhook.last_sent_at && (
          <span className="text-[10px] text-[var(--text-tertiary)]">
            Dernier: {formatDistanceToNow(new Date(webhook.last_sent_at), { addSuffix: true, locale: fr })}
          </span>
        )}
      </div>

      {webhook.last_error && (
        <p className="text-[10px] text-red-500 font-mono bg-red-50 px-2 py-1 rounded-md truncate">
          {webhook.last_error}
        </p>
      )}
    </motion.div>
  )
}

interface WebhookListProps {
  onNewWebhook: () => void
}

export function WebhookList({ onNewWebhook }: WebhookListProps) {
  const { webhooks, isLoading, updateWebhook, deleteWebhook } = useWebhooks()
  const [logsWebhookId, setLogsWebhookId] = useState<string | null>(null)

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await updateWebhook.mutateAsync({ id, is_active: active })
      toast.success(active ? 'Webhook activé' : 'Webhook désactivé')
    } catch {
      toast.error('Erreur')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteWebhook.mutateAsync(id)
      toast.success('Webhook supprimé')
    } catch {
      toast.error('Erreur')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-[var(--surface-secondary)] animate-pulse" />
        ))}
      </div>
    )
  }

  if (webhooks.length === 0) {
    return (
      <div className="text-center py-10 space-y-3">
        <Globe className="w-8 h-8 mx-auto text-[var(--text-tertiary)]" />
        <p className="text-sm text-[var(--text-secondary)]">Aucun webhook configuré</p>
        <Button size="sm" onClick={onNewWebhook}>Créer un webhook</Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {webhooks.map((wh) => (
          <WebhookRow
            key={wh.id}
            webhook={wh}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onViewLogs={setLogsWebhookId}
          />
        ))}
      </AnimatePresence>

      {logsWebhookId && (
        <WebhookLogs
          webhookId={logsWebhookId}
          onClose={() => setLogsWebhookId(null)}
        />
      )}
    </div>
  )
}
