import { useState } from 'react'
import { Calendar, Link, Loader2, CheckCircle2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export function BookingSettings() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [duration, setDuration] = useState([30])
  const [buffer, setBuffer] = useState([15])
  const [calendarLink, setCalendarLink] = useState('')
  const [useExternal, setUseExternal] = useState(false)

  const handleGoogleConnect = async () => {
    setConnecting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setConnecting(false)
    setConnected(true)
    toast.success('Google Calendar connecté', {
      description: 'Les rendez-vous seront synchronisés automatiquement.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Google Calendar */}
      <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Google Calendar</p>
              <p className="text-xs text-[var(--text-tertiary)]">Synchronisation des disponibilités</p>
            </div>
          </div>
          {connected ? (
            <div className="flex items-center gap-1.5 text-xs text-success bg-green-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connecté
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={handleGoogleConnect} disabled={connecting}>
              {connecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : null}
              {connecting ? 'Connexion...' : 'Connecter'}
            </Button>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Durée des RDV</Label>
              <span className="text-xs font-semibold text-[var(--text-primary)] font-mono">{duration[0]} min</span>
            </div>
            <Slider
              value={duration}
              onValueChange={setDuration}
              min={15}
              max={120}
              step={15}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Temps tampon entre RDV</Label>
              <span className="text-xs font-semibold text-[var(--text-primary)] font-mono">{buffer[0]} min</span>
            </div>
            <Slider
              value={buffer}
              onValueChange={setBuffer}
              min={0}
              max={60}
              step={5}
            />
          </div>
        </div>
      </div>

      {/* External link */}
      <div className="p-4 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-50 border border-brand-100 rounded-lg flex items-center justify-center">
              <Link className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Lien externe</p>
              <p className="text-xs text-[var(--text-tertiary)]">Calendly, Acuity, etc.</p>
            </div>
          </div>
          <Switch checked={useExternal} onCheckedChange={setUseExternal} />
        </div>

        {useExternal && (
          <div className="space-y-1.5">
            <Label htmlFor="calLink">URL de prise de RDV</Label>
            <div className="flex gap-2">
              <Input
                id="calLink"
                placeholder="https://calendly.com/votre-nom"
                value={calendarLink}
                onChange={(e) => setCalendarLink(e.target.value)}
              />
              {calendarLink && (
                <Button variant="outline" size="icon" asChild>
                  <a href={calendarLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <Button className="w-full">
        Enregistrer
      </Button>
    </div>
  )
}
