import { useState } from 'react'
import { Video, Sparkles, Mic, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface VideoAIDialogProps {
  open: boolean
  onClose: () => void
  onSendToChat?: (script: string) => void
  contactName?: string
}

const VOICES = [
  { id: 'fr-m', label: 'Masculine FR', flag: '🇫🇷' },
  { id: 'fr-f', label: 'Féminine FR', flag: '🇫🇷' },
  { id: 'en-m', label: 'Masculine EN', flag: '🇬🇧' },
]

const STYLES = [
  { id: 'pro', label: 'Professionnel', desc: 'Sobre et efficace' },
  { id: 'dynamic', label: 'Dynamique', desc: 'Énergique et moderne' },
  { id: 'luxury', label: 'Luxe', desc: 'Élégant et premium' },
]

export function VideoAIDialog({ open, onClose, onSendToChat, contactName }: VideoAIDialogProps) {
  const [script, setScript] = useState(
    contactName
      ? `Bonjour ${contactName}, merci de votre intérêt ! Je souhaitais vous présenter personnellement notre offre en quelques secondes...`
      : 'Bonjour ! Je souhaitais vous présenter personnellement notre offre en quelques secondes...'
  )
  const [voice, setVoice] = useState('fr-f')
  const [style, setStyle] = useState('pro')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    // Mock: simulate 3 second generation
    await new Promise((r) => setTimeout(r, 3000))
    setGenerating(false)
    setGenerated(true)
  }

  const handleSend = () => {
    if (onSendToChat) {
      onSendToChat(script)
      handleClose()
    }
  }

  const handleClose = () => {
    setGenerated(false)
    setGenerating(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-500" />
            Micro-vidéo IA personnalisée
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!generated ? (
            <>
              <div>
                <Label htmlFor="script" className="text-xs text-[var(--text-tertiary)] mb-1.5 block">
                  Script de la vidéo
                </Label>
                <Textarea id="script" rows={3} value={script} onChange={(e) => setScript(e.target.value)} />
                <p className="text-[10px] text-[var(--text-tertiary)] mt-1">{script.length} caractères · ~{Math.round(script.length / 15)}s</p>
              </div>

              <div>
                <Label className="text-xs text-[var(--text-tertiary)] mb-2 block flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Voix
                </Label>
                <div className="flex gap-2">
                  {VOICES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={`flex-1 px-2 py-1.5 rounded-lg border text-xs transition-all ${
                        voice === v.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-[var(--border-default)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {v.flag} {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-[var(--text-tertiary)] mb-2 block flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Style visuel
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        style === s.id ? 'border-brand-500 bg-brand-50' : 'border-[var(--border-default)] hover:border-brand-300'
                      }`}
                    >
                      <p className={`text-xs font-medium ${style === s.id ? 'text-brand-700' : 'text-[var(--text-primary)]'}`}>{s.label}</p>
                      <p className="text-[9px] text-[var(--text-tertiary)]">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-[10px] text-amber-700">
                  <strong>MVP :</strong> Génération mockée. L'intégration ElevenLabs + Kling sera disponible prochainement.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>Annuler</Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleGenerate} disabled={!script || generating}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {generating ? 'Génération...' : 'Générer'}
                </Button>
              </div>

              {generating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>Génération en cours...</span>
                    <span>~30s</span>
                  </div>
                  <div className="h-1.5 bg-[var(--surface-tertiary)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'linear' }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {/* Mock video thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-purple-600 to-brand-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <span className="text-white text-[10px] opacity-80">Vidéo personnalisée</span>
                  <span className="text-white text-[10px] opacity-80">~{Math.round(script.length / 15)}s</span>
                </div>
              </div>

              <p className="text-sm text-center text-[var(--text-secondary)]">
                ✅ Vidéo générée avec succès
              </p>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>Fermer</Button>
                {onSendToChat && (
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleSend}>
                    <Video className="w-3.5 h-3.5" />
                    Envoyer
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
