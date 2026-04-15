import { useState } from 'react'
import { Bell, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { SocialProofPreview } from './SocialProofPreview'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'

type Position = 'bottom-left' | 'bottom-right'

export function SocialProofSettings() {
  const { activeSubAccount } = useOrgStore()
  const [enabled, setEnabled] = useState(false)
  const [template, setTemplate] = useState('{{first_name}} de {{city}} vient de {{action}}')
  const [interval, setInterval] = useState([8])
  const [position, setPosition] = useState<Position>('bottom-left')
  const [copied, setCopied] = useState(false)

  const embedCode = `<script src="https://cdn.ikonik-ac.com/proof.js" data-id="${activeSubAccount?.id || 'YOUR_ID'}"></script>`

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    toast.success('Code copié !')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-500" />
            Social Proof Widget
          </h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Affichez des notifications d'activité récente sur votre site pour augmenter les conversions
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="tmpl" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
              Template de notification
            </Label>
            <Input
              id="tmpl"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
              Variables : <code className="bg-[var(--surface-secondary)] px-1 rounded">{'{{first_name}}'}</code>{' '}
              <code className="bg-[var(--surface-secondary)] px-1 rounded">{'{{city}}'}</code>{' '}
              <code className="bg-[var(--surface-secondary)] px-1 rounded">{'{{action}}'}</code>
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-xs text-[var(--text-tertiary)]">Intervalle entre notifications</Label>
              <span className="text-xs font-semibold text-[var(--text-primary)]">{interval[0]}s</span>
            </div>
            <Slider value={interval} onValueChange={setInterval} min={5} max={30} step={1} />
          </div>

          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-2 block">Position</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['bottom-left', 'bottom-right'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    position === pos ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-[var(--border-default)] text-[var(--text-secondary)]'
                  }`}
                >
                  {pos === 'bottom-left' ? '↙ Bas gauche' : '↘ Bas droite'}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Embed code */}
          <div>
            <Label className="text-xs text-[var(--text-tertiary)] mb-1.5 block">Code d'intégration</Label>
            <div className="flex items-start gap-2 p-3 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)]">
              <code className="text-[10px] text-[var(--text-secondary)] font-mono flex-1 break-all leading-relaxed">
                {embedCode}
              </code>
              <button onClick={copyEmbed} className="flex-shrink-0 mt-0.5">
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />}
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
              Collez ce code avant la balise &lt;/body&gt; de votre site
            </p>
          </div>
        </div>

        <div>
          <Label className="text-xs text-[var(--text-tertiary)] mb-2 block">Aperçu en direct</Label>
          <SocialProofPreview template={template} position={position} />
        </div>
      </div>
    </div>
  )
}
