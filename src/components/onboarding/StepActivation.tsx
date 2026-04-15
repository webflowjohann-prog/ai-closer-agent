import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Loader2, MessageSquare, User, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'

const demoMessages = [
  { from: 'user', text: 'Bonjour, je suis intéressé par un appartement à Rouen' },
  { from: 'bot', text: 'Bonjour ! Je suis ravi de vous aider. Quel type de bien recherchez-vous ? Appartement ou maison ?' },
  { from: 'user', text: 'Un appartement, 3 pièces environ' },
  { from: 'bot', text: "Parfait ! Pour mieux cibler nos biens pour vous, puis-je vous demander votre budget et le quartier souhaité ?" },
]

interface StepActivationProps {
  businessName: string
  onActivate: () => void
  onBack: () => void
  loading: boolean
}

export function StepActivation({ businessName, onActivate, onBack, loading }: StepActivationProps) {
  const [visibleMessages, setVisibleMessages] = useState(0)

  const startDemo = () => {
    let count = 0
    const interval = setInterval(() => {
      count++
      setVisibleMessages(count)
      if (count >= demoMessages.length) clearInterval(interval)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--border-default)] overflow-hidden bg-[var(--surface-secondary)]">
        {/* Preview header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--surface-primary)] border-b border-[var(--border-default)]">
          <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)]">{businessName || 'Votre Assistant'}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-success">
            <span className="w-1.5 h-1.5 bg-success rounded-full" />
            En ligne
          </span>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 min-h-[200px]">
          {visibleMessages === 0 ? (
            <div className="flex items-center justify-center h-32 text-center">
              <div>
                <p className="text-sm text-[var(--text-tertiary)] mb-3">Testez votre agent avant l'activation</p>
                <Button variant="outline" size="sm" onClick={startDemo}>
                  Lancer la démo
                </Button>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {demoMessages.slice(0, visibleMessages).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.from === 'bot' ? 'bg-brand-100' : 'bg-[var(--color-gray-200)]'}`}>
                    {msg.from === 'bot' ? (
                      <Bot className="w-3 h-3 text-brand-600" />
                    ) : (
                      <User className="w-3 h-3 text-[var(--text-secondary)]" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      msg.from === 'bot'
                        ? 'bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-bl-sm border border-[var(--border-default)]'
                        : 'bg-brand-500 text-white rounded-br-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800 font-medium mb-1">Prêt à lancer ?</p>
        <p className="text-xs text-amber-700">
          L'agent sera actif sur tous les canaux connectés. Vous pouvez le mettre en pause à tout moment.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onActivate} disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Activation...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Activer l'agent
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
