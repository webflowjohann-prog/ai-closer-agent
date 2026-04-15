import { useState } from 'react'
import { Video, Eye, EyeOff, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'

export function VideoAISettings() {
  const { activeSubAccount } = useOrgStore()
  const [elevenLabsKey, setElevenLabsKey] = useState('')
  const [klingKey, setKlingKey] = useState('')
  const [showKeys, setShowKeys] = useState(false)
  const [defaultVoice, setDefaultVoice] = useState('fr-f')
  const [defaultStyle, setDefaultStyle] = useState('pro')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    if (!activeSubAccount) { toast.error('Aucun compte actif', { description: 'Rechargez la page ou reconnectez-vous.' }); return }
    try {
      const existingConfig = (activeSubAccount as any).config || {}
      const { error } = await supabase.from('sub_accounts').update({
        config: {
          ...existingConfig,
          ...(elevenLabsKey && { elevenlabs_key: elevenLabsKey }),
          ...(klingKey && { kling_key: klingKey }),
          video_default_voice: defaultVoice,
          video_default_style: defaultStyle,
        },
      }).eq('id', activeSubAccount.id)
      if (error) { toast.error('Erreur', { description: error.message }); return }
      setSaved(true)
      toast.success('Configuration vidéo enregistrée')
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      toast.error('Erreur inattendue', { description: e?.message ?? 'Vérifiez votre connexion.' })
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-1">
          <Video className="w-4 h-4 text-purple-500" />
          Micro-vidéos IA
        </h2>
        <p className="text-sm text-[var(--text-tertiary)]">
          Envoyez des vidéos personnalisées générées par IA directement dans vos conversations
        </p>
      </div>

      <Card className="p-4 bg-purple-50 border-purple-200">
        <p className="text-xs font-semibold text-purple-700 mb-2">Fonctionnalité en beta</p>
        <p className="text-xs text-purple-600">
          Les vidéos sont actuellement mockées. L'intégration ElevenLabs (voix) + Kling (vidéo) est en cours de développement. Renseignez vos clés pour être parmi les premiers à tester.
        </p>
      </Card>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs text-[var(--text-tertiary)]">
              Clé ElevenLabs <span className="text-[var(--text-tertiary)]">(synthèse vocale)</span>
            </Label>
            <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-500 hover:underline flex items-center gap-0.5">
              Dashboard <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <div className="relative">
            <Input
              type={showKeys ? 'text' : 'password'}
              placeholder="sk_..."
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              className="font-mono text-xs pr-10"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" onClick={() => setShowKeys(!showKeys)}>
              {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs text-[var(--text-tertiary)]">
              Clé Kling <span className="text-[var(--text-tertiary)]">(génération vidéo)</span>
            </Label>
            <a href="https://klingai.com" target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-500 hover:underline flex items-center gap-0.5">
              Dashboard <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
          <Input
            type={showKeys ? 'text' : 'password'}
            placeholder="kling_..."
            value={klingKey}
            onChange={(e) => setKlingKey(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Voix par défaut</Label>
            <select
              value={defaultVoice}
              onChange={(e) => setDefaultVoice(e.target.value)}
              className="w-full text-sm border border-[var(--border-default)] rounded-lg px-3 py-2 bg-[var(--surface-primary)] text-[var(--text-primary)]"
            >
              <option value="fr-f">Féminine FR</option>
              <option value="fr-m">Masculine FR</option>
              <option value="en-m">Masculine EN</option>
            </select>
          </div>
          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Style par défaut</Label>
            <select
              value={defaultStyle}
              onChange={(e) => setDefaultStyle(e.target.value)}
              className="w-full text-sm border border-[var(--border-default)] rounded-lg px-3 py-2 bg-[var(--surface-primary)] text-[var(--text-primary)]"
            >
              <option value="pro">Professionnel</option>
              <option value="dynamic">Dynamique</option>
              <option value="luxury">Luxe</option>
            </select>
          </div>
        </div>

        <Button type="button" onClick={handleSave}>
          {saved ? <><Check className="w-3.5 h-3.5" /> Enregistré</> : 'Enregistrer'}
        </Button>
      </div>
    </div>
  )
}
