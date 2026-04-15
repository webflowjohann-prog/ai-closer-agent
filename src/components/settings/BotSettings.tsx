import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import { toast } from 'sonner'

export function BotSettings() {
  const { activeSubAccount, setActiveSubAccount } = useOrgStore()
  const [instructions, setInstructions] = useState(activeSubAccount?.bot_instructions || '')
  const [personality, setPersonality] = useState(activeSubAccount?.bot_personality || 'professionnel')
  const [delayMin, setDelayMin] = useState([activeSubAccount?.response_delay_min || 3])
  const [delayMax, setDelayMax] = useState([activeSubAccount?.response_delay_max || 12])
  const [maxChunks, setMaxChunks] = useState([activeSubAccount?.max_message_chunks || 3])
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!activeSubAccount) return
    setSaving(true)

    const { data, error } = await supabase
      .from('sub_accounts')
      .update({
        bot_instructions: instructions,
        bot_personality: personality,
        response_delay_min: delayMin[0],
        response_delay_max: delayMax[0],
        max_message_chunks: maxChunks[0],
      })
      .eq('id', activeSubAccount.id)
      .select()
      .single()

    if (error) {
      toast.error('Erreur de sauvegarde')
    } else {
      setActiveSubAccount({ ...activeSubAccount, ...data })
      toast.success('Configuration sauvegardée')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label>Personnalité du bot</Label>
        <Select value={personality} onValueChange={setPersonality}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professionnel">Professionnel</SelectItem>
            <SelectItem value="amical">Amical & décontracté</SelectItem>
            <SelectItem value="luxe">Luxe & élégant</SelectItem>
            <SelectItem value="expert">Expert & autoritaire</SelectItem>
            <SelectItem value="empathique">Empathique & chaleureux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Instructions personnalisées</Label>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
            <Sparkles className="w-3 h-3" />
            Générer depuis le site
          </Button>
        </div>
        <Textarea
          placeholder={`Décrivez le comportement de votre agent IA...

Ex: "Tu es l'assistant de [Nom], spécialisé dans [domaine]. Ton rôle est de qualifier les prospects et de prendre des RDV. Mets en avant nos points forts : [liste]..."`}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={8}
          className="font-mono text-xs"
        />
        <p className="text-xs text-[var(--text-tertiary)]">
          Ces instructions s'ajoutent au playbook de votre verticale
        </p>
      </div>

      <div className="space-y-4 p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)]">
        <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          Comportement de réponse
        </p>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs">Délai avant réponse</Label>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {delayMin[0]}s – {delayMax[0]}s
            </span>
          </div>
          <div className="space-y-2">
            <Slider value={delayMin} onValueChange={setDelayMin} min={1} max={30} step={1} />
            <Slider value={delayMax} onValueChange={setDelayMax} min={5} max={60} step={5} />
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            Simule un temps de frappe naturel (3–12s recommandé)
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs">Bulles par réponse max</Label>
            <span className="text-xs font-mono text-[var(--text-secondary)]">{maxChunks[0]}</span>
          </div>
          <Slider value={maxChunks} onValueChange={setMaxChunks} min={1} max={5} step={1} />
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            L'agent découpe ses réponses en plusieurs bulles (comme un humain)
          </p>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {saving ? 'Sauvegarde...' : 'Enregistrer'}
      </Button>
    </div>
  )
}
