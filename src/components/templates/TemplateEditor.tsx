import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { VariableInserter } from './VariableInserter'
import { TemplatePreview } from './TemplatePreview'
import { useTemplates } from '@/hooks/useTemplates'
import type { MessageTemplate, ChannelType } from '@/types/database'

const CATEGORIES = ['general', 'greeting', 'follow_up', 'closing', 'objection']
const CATEGORY_LABELS: Record<string, string> = {
  general: 'Général',
  greeting: 'Accueil',
  follow_up: 'Relance',
  closing: 'Closing',
  objection: 'Objection',
}

interface TemplateEditorProps {
  open: boolean
  onClose: () => void
  template?: MessageTemplate
}

export function TemplateEditor({ open, onClose, template }: TemplateEditorProps) {
  const { createTemplate, updateTemplate } = useTemplates()
  const [name, setName] = useState(template?.name || '')
  const [category, setCategory] = useState(template?.category || 'general')
  const [content, setContent] = useState(template?.content || '')
  const [channelType, setChannelType] = useState<ChannelType | undefined>(template?.channel_type)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isEdit = !!template

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.slice(0, start) + variable + content.slice(end)
      setContent(newContent)
      // Restore cursor position after variable
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + variable.length, start + variable.length)
      }, 0)
    } else {
      setContent((prev) => prev + variable)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !content) return
    const payload = { name, category, content, channel_type: channelType }
    if (isEdit) {
      updateTemplate.mutate({ id: template.id, ...payload }, { onSuccess: onClose })
    } else {
      createTemplate.mutate(payload, { onSuccess: () => { setName(''); setContent(''); onClose() } })
    }
  }

  const isPending = createTemplate.isPending || updateTemplate.isPending

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifier le template' : 'Nouveau template'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nom *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: Premier contact immobilier" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label>Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Canal</Label>
                <Select value={channelType || '_all'} onValueChange={(v) => setChannelType(v === '_all' ? undefined : v as ChannelType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">Tous</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="webchat">WebChat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Editor + Preview side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Message *</Label>
              <VariableInserter onInsert={insertVariable} />
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bonjour {{first_name}}, je me permets de vous contacter..."
                className="min-h-[160px] resize-none text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="h-[22px]" /> {/* Spacer to align with label */}
              <TemplatePreview content={content} channelType={channelType} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
            <Button type="submit" className="flex-1" disabled={isPending || !name || !content}>
              {isPending ? 'Sauvegarde...' : isEdit ? 'Sauvegarder' : 'Créer le template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
