import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useWebhookLogs } from '@/hooks/useWebhooks'
import type { WebhookLog } from '@/types/database'

function statusColor(status?: number) {
  if (!status) return 'text-gray-400'
  if (status < 300) return 'text-green-600'
  if (status < 500) return 'text-amber-600'
  return 'text-red-500'
}

function LogRow({ log }: { log: WebhookLog }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      className="border border-[var(--border-default)] rounded-lg overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--surface-secondary)] transition-colors text-left"
      >
        {log.success ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
        )}

        <span className={`text-xs font-mono font-semibold ${statusColor(log.response_status)}`}>
          {log.response_status || '—'}
        </span>

        <span className="text-xs text-[var(--text-secondary)] font-mono">
          {log.event}
        </span>

        <span className="ml-auto flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
          <Clock className="w-3 h-3" />
          {log.duration_ms ? `${log.duration_ms}ms` : '—'}
        </span>

        <span className="text-[10px] text-[var(--text-tertiary)]">
          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: fr })}
        </span>

        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-3 pb-3 space-y-3 border-t border-[var(--border-default)]">
              <div className="space-y-1 pt-3">
                <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Payload envoyé
                </p>
                <pre className="text-[10px] font-mono bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto max-h-40">
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              </div>
              {log.response_body && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Réponse du serveur
                  </p>
                  <pre className="text-[10px] font-mono bg-[var(--surface-secondary)] text-[var(--text-secondary)] p-3 rounded-lg overflow-x-auto max-h-32">
                    {log.response_body}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface WebhookLogsProps {
  webhookId: string
  onClose: () => void
}

export function WebhookLogs({ webhookId, onClose }: WebhookLogsProps) {
  const { logs, isLoading } = useWebhookLogs(webhookId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border border-brand-200 rounded-xl bg-[var(--surface-primary)] space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Logs — 50 derniers appels</p>
        <Button size="icon" variant="ghost" className="w-7 h-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-[var(--surface-secondary)] animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)] text-center py-6">
          Aucun appel enregistré
        </p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
