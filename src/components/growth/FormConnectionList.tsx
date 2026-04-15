import { useState } from 'react'
import { Plus, Zap, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { FormConnectionEditor } from './FormConnectionEditor'
import { WebhookURL } from './WebhookURL'
import { useFormConnections } from '@/hooks/useFormConnections'

const sourceIcons: Record<string, string> = {
  webhook: '🔗',
  meta_lead_ads: '📘',
  google_ads: '🔍',
  typeform: '📋',
  custom: '⚡',
}

const sourceLabels: Record<string, string> = {
  webhook: 'Webhook',
  meta_lead_ads: 'Meta Lead Ads',
  google_ads: 'Google Ads',
  typeform: 'Typeform',
  custom: 'Personnalisé',
}

export function FormConnectionList() {
  const [showEditor, setShowEditor] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { connections, isLoading, toggleConnection, deleteConnection } = useFormConnections()

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Speed-to-Lead</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Contactez vos leads en moins de 10 secondes après la soumission d'un formulaire
          </p>
        </div>
        <Button size="sm" onClick={() => setShowEditor(true)}>
          <Plus className="w-3.5 h-3.5" />
          Connecter
        </Button>
      </div>

      {/* Speed stat banner */}
      <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl">
        <div className="text-2xl">⚡</div>
        <div>
          <p className="text-sm font-semibold text-brand-700">Les leads contactés en moins de 5 min</p>
          <p className="text-xs text-brand-600">ont 21× plus de chances de se convertir (Harvard Business Review)</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-20 bg-[var(--surface-secondary)] rounded-xl animate-pulse" />)}
        </div>
      ) : connections.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--border-default)] rounded-xl">
          <Zap className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">Aucune connexion formulaire</p>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">Connectez vos formulaires pour contacter les leads instantanément</p>
          <Button size="sm" onClick={() => setShowEditor(true)}>
            <Plus className="w-3.5 h-3.5" /> Connecter un formulaire
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          {connections.map((conn) => {
            const isExpanded = expandedId === conn.id
            return (
              <motion.div key={conn.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} layout>
                <Card className="overflow-hidden">
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0">{sourceIcons[conn.source] || '🔗'}</span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{conn.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--text-tertiary)]">
                          <span>{sourceLabels[conn.source]}</span>
                          <span>→</span>
                          <span>{conn.response_channel}</span>
                          <span>•</span>
                          <span>{conn.response_delay_seconds}s</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-[var(--text-tertiary)] mt-1">
                          <span><strong className="text-[var(--text-primary)]">{conn.leads_received}</strong> leads reçus</span>
                          <span><strong className="text-[var(--text-primary)]">{conn.leads_contacted}</strong> contactés</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={conn.is_active}
                        onCheckedChange={(v) => toggleConnection.mutate({ id: conn.id, is_active: v })}
                      />
                      <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setExpandedId(isExpanded ? null : conn.id)}>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-[var(--text-tertiary)] hover:text-red-500" onClick={() => deleteConnection.mutate(conn.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-[var(--border-subtle)] pt-3">
                          <WebhookURL webhookUrl={conn.webhook_url} webhookSecret={conn.webhook_secret} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}

      <FormConnectionEditor open={showEditor} onClose={() => setShowEditor(false)} />
    </div>
  )
}
