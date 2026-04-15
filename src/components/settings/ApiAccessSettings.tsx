import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Key, Globe, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useApiKeys } from '@/hooks/useApiKeys'
import { ApiKeyCard } from './ApiKeyCard'
import { CreateApiKeyDialog } from './CreateApiKeyDialog'
import { WebhookList } from './WebhookList'
import { WebhookEditor } from './WebhookEditor'
import { ApiDocs } from './ApiDocs'

export function ApiAccessSettings() {
  const { apiKeys, isLoading, revokeApiKey } = useApiKeys()
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [showWebhookEditor, setShowWebhookEditor] = useState(false)

  const handleRevoke = async (id: string) => {
    try {
      await revokeApiKey.mutateAsync(id)
      toast.success('Clé révoquée')
    } catch {
      toast.error('Erreur lors de la révocation')
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="keys">
        <TabsList className="w-full">
          <TabsTrigger value="keys" className="flex-1 gap-1.5">
            <Key className="w-3.5 h-3.5" />
            Clés API
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex-1 gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex-1 gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Documentation
          </TabsTrigger>
        </TabsList>

        {/* API Keys */}
        <TabsContent value="keys" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Clés API</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {apiKeys.length} clé{apiKeys.length !== 1 ? 's' : ''} active{apiKeys.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button size="sm" onClick={() => setShowCreateKey(true)} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Nouvelle clé
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-[var(--surface-secondary)] animate-pulse" />
              ))}
            </div>
          ) : apiKeys.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 space-y-3"
            >
              <Key className="w-8 h-8 mx-auto text-[var(--text-tertiary)]" />
              <p className="text-sm text-[var(--text-secondary)]">Aucune clé API créée</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Créez une clé pour connecter vos outils externes (n8n, Zapier, CRM...)
              </p>
              <Button size="sm" onClick={() => setShowCreateKey(true)}>
                Créer ma première clé
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {apiKeys.map((key) => (
                <ApiKeyCard key={key.id} apiKey={key} onRevoke={handleRevoke} />
              ))}
            </AnimatePresence>
          )}

          <div className="p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)]">
            <p className="text-[10px] text-[var(--text-tertiary)]">
              Les clés API sont hashées avec SHA-256 et ne sont jamais stockées en clair. Une clé ne peut être lue qu'au moment de sa création.
            </p>
          </div>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Webhooks</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Recevez des notifications en temps réel sur vos serveurs
              </p>
            </div>
            <Button size="sm" onClick={() => setShowWebhookEditor(true)} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Nouveau webhook
            </Button>
          </div>

          <WebhookList onNewWebhook={() => setShowWebhookEditor(true)} />
        </TabsContent>

        {/* Docs */}
        <TabsContent value="docs" className="mt-4">
          <ApiDocs />
        </TabsContent>
      </Tabs>

      <CreateApiKeyDialog open={showCreateKey} onClose={() => setShowCreateKey(false)} />
      <WebhookEditor open={showWebhookEditor} onClose={() => setShowWebhookEditor(false)} />
    </div>
  )
}
