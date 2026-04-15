import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'

interface WidgetProps {
  subAccountId: string
  brandColor?: string
  title?: string
}

interface ChatMessage {
  id: string
  from: 'user' | 'bot'
  text: string
}

export function Widget({ subAccountId: _subAccountId, brandColor = '#5c7cfa', title = 'Assistant' }: WidgetProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', from: 'bot', text: 'Bonjour ! Comment puis-je vous aider ?' },
  ])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = { id: Date.now().toString(), from: 'user', text: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 1200))

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      from: 'bot',
      text: "Merci pour votre message ! Un conseiller va vous répondre très rapidement.",
    }
    setMessages((prev) => [...prev, botMsg])
    setLoading(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            style={{ height: '440px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 p-3 text-white" style={{ background: brandColor }}>
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  En ligne
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="opacity-80 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                    }`}
                    style={msg.from === 'user' ? { background: brandColor } : {}}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 bg-white border border-gray-200 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 bg-white border-t border-gray-200">
              <input
                className="flex-1 text-sm outline-none placeholder-gray-400 text-gray-800"
                placeholder="Votre message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-40"
                style={{ background: brandColor }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ background: brandColor }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
