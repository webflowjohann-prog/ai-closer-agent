import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { PlaygroundMessage } from '@/hooks/usePlayground'

interface PlaygroundChatProps {
  messages: PlaygroundMessage[]
  loading: boolean
  onSend: (text: string) => void
}

const QUICK_MESSAGES = [
  'Bonjour, je suis intéressé',
  'Quels sont vos tarifs ?',
  'Je souhaite prendre RDV',
  "C'est trop cher pour moi",
]

export function PlaygroundChat({ messages, loading, onSend }: PlaygroundChatProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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

  return (
    <div className="flex flex-col h-full bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--surface-primary)] border-b border-[var(--border-default)]">
        <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Assistant Demo</p>
          <p className="text-xs text-success flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full" />
            En ligne
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot className="w-6 h-6 text-brand-500" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Démarrez la conversation</p>
              <p className="text-xs text-[var(--text-tertiary)]">Testez votre agent IA avant de l'activer</p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn('flex items-end gap-2', msg.from === 'user' ? 'flex-row-reverse' : '')}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                  msg.from === 'bot' ? 'bg-brand-100' : 'bg-[var(--color-gray-200)]'
                )}>
                  {msg.from === 'bot' ? (
                    <Bot className="w-3 h-3 text-brand-600" />
                  ) : (
                    <User className="w-3 h-3 text-[var(--text-secondary)]" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed',
                    msg.from === 'bot'
                      ? 'bg-[var(--surface-primary)] text-[var(--text-primary)] rounded-bl-sm border border-[var(--border-default)]'
                      : 'bg-brand-500 text-white rounded-br-sm'
                  )}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
              <Bot className="w-3 h-3 text-brand-600" />
            </div>
            <div className="px-4 py-3 bg-[var(--surface-primary)] rounded-2xl rounded-bl-sm border border-[var(--border-default)]">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {messages.length === 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {QUICK_MESSAGES.map((msg) => (
            <button
              key={msg}
              onClick={() => onSend(msg)}
              className="text-xs px-2.5 py-1 rounded-full border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-secondary)] hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 transition-colors"
            >
              {msg}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 bg-[var(--surface-primary)] border-t border-[var(--border-default)]">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="resize-none min-h-[40px] max-h-[100px] py-2 text-sm"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
