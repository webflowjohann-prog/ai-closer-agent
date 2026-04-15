import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useCommentTriggers } from '@/hooks/useCommentTriggers'

interface CreateTriggerDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateTriggerDialog({ open, onClose }: CreateTriggerDialogProps) {
  const { createTrigger } = useCommentTriggers()
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram')
  const [postUrl, setPostUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [template, setTemplate] = useState(
    'Bonjour {{first_name}} ! Merci pour ton commentaire 😊 Je t\'envoie plus d\'infos par ici...'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createTrigger.mutateAsync({
      platform,
      post_url: postUrl || undefined,
      trigger_keyword: keyword || undefined,
      dm_template: template,
      is_active: true,
    })
    setPostUrl('')
    setKeyword('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau trigger Comment → DM</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Platform */}
          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-2 block">Plateforme</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['instagram', 'facebook'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    platform === p
                      ? 'border-brand-500 bg-brand-50 text-brand-600'
                      : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-brand-300'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Post URL */}
          <div>
            <Label htmlFor="postUrl" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
              URL du post (optionnel)
            </Label>
            <Input
              id="postUrl"
              placeholder="https://www.instagram.com/p/..."
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
            />
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
              Si vide, le trigger s'applique à tous vos posts
            </p>
          </div>

          {/* Keyword */}
          <div>
            <Label htmlFor="keyword" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
              Mot-clé déclencheur (optionnel)
            </Label>
            <Input
              id="keyword"
              placeholder="ex: info, prix, dispo..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
              Si vide, tous les commentaires déclenchent le DM
            </p>
          </div>

          {/* Template */}
          <div>
            <Label htmlFor="template" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
              Message DM
            </Label>
            <Textarea
              id="template"
              rows={3}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Bonjour {{first_name}}..."
            />
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
              Variables : <code className="bg-[var(--surface-secondary)] px-1 rounded">{'{{first_name}}'}</code>{' '}
              <code className="bg-[var(--surface-secondary)] px-1 rounded">{'{{comment_text}}'}</code>
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={!template.trim() || createTrigger.isPending}>
              {createTrigger.isPending ? 'Création...' : 'Créer le trigger'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
