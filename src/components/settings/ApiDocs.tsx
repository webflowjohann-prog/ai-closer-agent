import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  description: string
  params?: { name: string; type: string; required: boolean; description: string }[]
  example: string
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700',
  POST: 'bg-green-100 text-green-700',
  PATCH: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/contacts',
    description: 'Récupérer la liste des contacts',
    params: [
      { name: 'limit', type: 'integer', required: false, description: 'Nombre de résultats (défaut: 50)' },
      { name: 'offset', type: 'integer', required: false, description: 'Décalage pour la pagination' },
      { name: 'status', type: 'string', required: false, description: 'Filtrer par statut (new, qualified, ...)' },
    ],
    example: `{
  "data": [
    {
      "id": "uuid",
      "first_name": "Marie",
      "last_name": "Dupont",
      "email": "marie@example.com",
      "phone": "+33612345678",
      "status": "qualified",
      "score": 72,
      "tags": ["prospect", "chaud"],
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 142,
  "has_more": true
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/conversations',
    description: 'Récupérer les conversations',
    params: [
      { name: 'contact_id', type: 'uuid', required: false, description: 'Filtrer par contact' },
      { name: 'status', type: 'string', required: false, description: 'active | bot_active | closed' },
    ],
    example: `{
  "data": [
    {
      "id": "uuid",
      "contact_id": "uuid",
      "channel_type": "whatsapp",
      "status": "bot_active",
      "message_count": 12,
      "last_message_at": "2024-01-15T14:22:00Z",
      "last_message_preview": "Bonjour, je suis intéressé par..."
    }
  ]
}`,
  },
  {
    method: 'POST',
    path: '/api/v1/messages',
    description: 'Envoyer un message à un contact',
    params: [
      { name: 'conversation_id', type: 'uuid', required: true, description: 'ID de la conversation' },
      { name: 'content', type: 'string', required: true, description: 'Texte du message' },
    ],
    example: `// Body
{
  "conversation_id": "uuid",
  "content": "Bonjour ! Avez-vous des questions ?"
}

// Response
{
  "id": "uuid",
  "status": "sent",
  "created_at": "2024-01-15T14:30:00Z"
}`,
  },
  {
    method: 'PATCH',
    path: '/api/v1/contacts/:id',
    description: 'Mettre à jour un contact',
    params: [
      { name: 'status', type: 'string', required: false, description: 'Nouveau statut de qualification' },
      { name: 'tags', type: 'string[]', required: false, description: 'Tableau de tags' },
      { name: 'custom_fields', type: 'object', required: false, description: 'Données personnalisées' },
    ],
    example: `// Body
{
  "status": "qualified",
  "tags": ["prospect", "budget-eleve"],
  "custom_fields": {
    "budget": "500K-1M",
    "localisation": "Paris 16e"
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/bookings',
    description: 'Récupérer les rendez-vous',
    params: [
      { name: 'from', type: 'ISO date', required: false, description: 'Date de début' },
      { name: 'to', type: 'ISO date', required: false, description: 'Date de fin' },
      { name: 'status', type: 'string', required: false, description: 'pending | confirmed | cancelled' },
    ],
    example: `{
  "data": [
    {
      "id": "uuid",
      "contact_id": "uuid",
      "title": "Découverte avec Marie D.",
      "starts_at": "2024-01-20T10:00:00Z",
      "ends_at": "2024-01-20T10:30:00Z",
      "status": "confirmed",
      "meeting_link": "https://meet.google.com/abc-def-ghi"
    }
  ]
}`,
  },
]

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copié')
  }

  return (
    <div className="border border-[var(--border-default)] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-secondary)] transition-colors text-left"
      >
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${METHOD_COLORS[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <span className="font-mono text-xs text-[var(--text-primary)]">{endpoint.path}</span>
        <span className="ml-auto text-xs text-[var(--text-tertiary)] hidden sm:block">{endpoint.description}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4 space-y-4 border-t border-[var(--border-default)]">
              {/* Auth header */}
              <div className="pt-3 space-y-1">
                <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                  Headers requis
                </p>
                <div className="font-mono text-[11px] bg-[var(--surface-secondary)] px-3 py-2 rounded-lg">
                  <span className="text-[var(--text-tertiary)]">Authorization: </span>
                  <span className="text-brand-500">Bearer ica_live_xxx...</span>
                </div>
              </div>

              {/* Params */}
              {endpoint.params && endpoint.params.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Paramètres
                  </p>
                  <div className="space-y-1.5">
                    {endpoint.params.map((p) => (
                      <div key={p.name} className="flex items-start gap-3">
                        <code className="text-[10px] font-mono text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                          {p.name}
                        </code>
                        <span className="text-[10px] text-[var(--text-tertiary)]">{p.type}</span>
                        {p.required && (
                          <Badge variant="destructive" className="text-[9px] h-4 px-1">requis</Badge>
                        )}
                        <span className="text-[10px] text-[var(--text-secondary)]">{p.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Example */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Exemple
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] gap-1"
                    onClick={() => handleCopy(endpoint.example)}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copier
                  </Button>
                </div>
                <pre className="text-[10px] font-mono bg-gray-900 text-green-400 p-3 rounded-xl overflow-x-auto">
                  {endpoint.example}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ApiDocs() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-2">
        <p className="text-sm font-semibold text-[var(--text-primary)]">API REST publique</p>
        <p className="text-xs text-[var(--text-secondary)]">
          Intégrez AI Closer Agent dans vos outils CRM, n8n, Zapier, ou applications personnalisées.
          Authentifiez vos requêtes avec votre clé API dans le header <code className="font-mono bg-[var(--surface-tertiary)] px-1 rounded">Authorization</code>.
        </p>
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-gray-900 text-green-400 px-3 py-1.5 rounded-lg">
            https://api.ikonik-ac.com/v1
          </code>
          <a
            href="#"
            className="flex items-center gap-1 text-xs text-brand-500 hover:underline"
          >
            Documentation complète <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
          Endpoints disponibles
        </p>
        {ENDPOINTS.map((ep) => (
          <EndpointCard key={`${ep.method}-${ep.path}`} endpoint={ep} />
        ))}
      </div>

      {/* Rate limit info */}
      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-xs text-amber-700">
          <strong>Limites :</strong> 60 requêtes/minute par clé API · 1 000 contacts/requête max · Réponses en JSON · TLS 1.2+ obligatoire
        </p>
      </div>
    </div>
  )
}
