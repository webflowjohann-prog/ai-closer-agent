import { useState } from 'react'
import { Send, Paperclip, Bot, User as UserIcon, Euro, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { SendPaymentDialog } from './SendPaymentDialog'
import { VideoAIDialog } from './VideoAIDialog'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/database'

interface ChatInputProps {
  onSend: (text: string) => void
  onToggleBot: (active: boolean) => void
  botActive: boolean
  disabled?: boolean
  conversation?: Conversation | null
}

export function ChatInput({ onSend, onToggleBot, botActive, disabled, conversation }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handlePaymentSend = (url: string, title: string, amount: number) => {
    onSend(`💳 Lien de paiement : ${title} — ${amount.toLocaleString('fr-FR')} € → ${url}`)
  }

  const handleVideoSend = (script: string) => {
    onSend(`🎬 Message vidéo personnalisé : ${script.slice(0, 80)}...`)
  }

  return (
    <div className="border-t border-[var(--border-default)] bg-[var(--surface-primary)]">
      {/* Bot toggle bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Bot className={cn('w-3.5 h-3.5', botActive ? 'text-brand-500' : 'text-[var(--text-tertiary)]')} />
          <span className="text-xs text-[var(--text-secondary)]">Agent IA</span>
          <Switch
            checked={botActive}
            onCheckedChange={onToggleBot}
            className="scale-75"
          />
        </div>
        {!botActive && (
          <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
            <UserIcon className="w-3 h-3" />
            Mode humain
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex items-end gap-2 p-3">
        <Button variant="ghost" size="icon" className="flex-shrink-0 h-9 w-9" disabled={disabled}>
          <Paperclip className="w-4 h-4" />
        </Button>

        {/* Payment button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-9 w-9 text-green-600 hover:bg-green-50"
          disabled={disabled || botActive}
          onClick={() => setShowPayment(true)}
          title="Demande de paiement"
        >
          <Euro className="w-4 h-4" />
        </Button>

        {/* Video AI button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-9 w-9 text-purple-500 hover:bg-purple-50"
          disabled={disabled || botActive}
          onClick={() => setShowVideo(true)}
          title="Vidéo IA personnalisée"
        >
          <Video className="w-4 h-4" />
        </Button>

        <Textarea
          placeholder="Répondre..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled || botActive}
          className={cn(
            'resize-none min-h-[40px] max-h-[120px] py-2 text-sm flex-1',
            botActive && 'opacity-50 cursor-not-allowed'
          )}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || disabled || botActive}
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {botActive && (
        <p className="text-center text-[10px] text-[var(--text-tertiary)] pb-2">
          L'agent IA répond automatiquement. Désactivez-le pour prendre la main.
        </p>
      )}

      {/* Dialogs */}
      <SendPaymentDialog
        open={showPayment}
        onClose={() => setShowPayment(false)}
        conversation={conversation || null}
        onSendToChat={handlePaymentSend}
      />
      <VideoAIDialog
        open={showVideo}
        onClose={() => setShowVideo(false)}
        onSendToChat={handleVideoSend}
        contactName={conversation?.contact?.full_name}
      />
    </div>
  )
}
