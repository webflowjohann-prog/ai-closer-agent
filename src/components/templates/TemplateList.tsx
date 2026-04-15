import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, Clock, FileText, MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TemplateEditor } from './TemplateEditor'
import { useTemplates } from '@/hooks/useTemplates'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableLoadingState } from '@/components/shared/LoadingState'
import type { MessageTemplate } from '@/types/database'

const CATEGORIES = ['all', 'greeting', 'follow_up', 'closing', 'objection', 'general']
const CATEGORY_LABELS: Record<string, string> = {
  all: 'Tous',
  general: 'Général',
  greeting: 'Accueil',
  follow_up: 'Relance',
  closing: 'Closing',
  objection: 'Objection',
}
const CATEGORY_COLORS: Record<string, string> = {
  general: 'secondary',
  greeting: 'bg-green-100 text-green-700',
  follow_up: 'bg-blue-100 text-blue-700',
  closing: 'bg-purple-100 text-purple-700',
  objection: 'bg-yellow-100 text-yellow-700',
}

export function TemplateList() {
  const { templates, isLoading, deleteTemplate } = useTemplates()
  const [category, setCategory] = useState('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | undefined>()

  const filtered = category === 'all' ? templates : templates.filter((t) => t.category === category)

  const openCreate = () => { setEditingTemplate(undefined); setEditorOpen(true) }
  const openEdit = (t: MessageTemplate) => { setEditingTemplate(t); setEditorOpen(true) }

  if (isLoading) return <TableLoadingState />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="h-8">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs px-3 h-6">
                {CATEGORY_LABELS[c]}
                {c !== 'all' && (
                  <span className="ml-1 text-[10px] opacity-60">
                    ({templates.filter((t) => t.category === c).length})
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button size="sm" onClick={openCreate}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nouveau template
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="Aucun template"
          description="Créez des templates pour réutiliser vos meilleurs messages."
          action={<Button size="sm" onClick={openCreate}><Plus className="w-3.5 h-3.5 mr-1.5" />Créer un template</Button>}
        />
      ) : (
        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {filtered.map((t) => (
            <motion.div
              key={t.id}
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
              className="bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-xl p-4 group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{t.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[t.category] || 'bg-gray-100 text-gray-600'}`}>
                      {CATEGORY_LABELS[t.category] || t.category}
                    </span>
                    {t.channel_type && (
                      <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-tertiary)]">
                        <MessageSquare className="w-2.5 h-2.5" /> {t.channel_type}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(t)}
                    className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-tertiary)] hover:text-brand-500 hover:bg-brand-50 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTemplate.mutate(t.id)}
                    className="w-6 h-6 flex items-center justify-center rounded text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">{t.content}</p>

              {t.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.variables.slice(0, 3).map((v) => (
                    <Badge key={v} variant="secondary" className="text-[9px] px-1 py-0 font-mono">
                      {v.replace(/\{|\}/g, '')}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 text-[10px] text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t.times_used} utilisation{t.times_used > 1 ? 's' : ''}
                </span>
                <span>{formatDistanceToNow(new Date(t.created_at), { addSuffix: true, locale: fr })}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <TemplateEditor open={editorOpen} onClose={() => setEditorOpen(false)} template={editingTemplate} />
    </div>
  )
}
