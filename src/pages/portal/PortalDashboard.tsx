import { motion } from 'framer-motion'
import { MessageSquare, Users, Calendar, Reply } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useConversations } from '@/hooks/useConversations'
import { ConversationItem } from '@/components/inbox/ConversationItem'
import { useNavigate } from 'react-router-dom'
import { useInboxStore } from '@/stores/inboxStore'

export default function PortalDashboard() {
  const { stats } = useDashboardStats()
  const { conversations } = useConversations()
  const navigate = useNavigate()
  const { setActiveConversation } = useInboxStore()

  const metrics = [
    { label: 'Conversations', value: stats.messagesSent, icon: MessageSquare, color: 'text-brand-500', bg: 'bg-brand-50' },
    { label: 'Leads qualifiés', value: stats.qualified, icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'RDV pris', value: stats.bookings, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    {
      label: 'Taux de réponse',
      value: `${stats.messagesSent > 0 ? Math.round((stats.replies / stats.messagesSent) * 100) : 0}%`,
      icon: Reply,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">Tableau de bord</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Aperçu de l'activité de votre agent IA</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="p-4">
              <div className={`w-8 h-8 ${m.bg} rounded-lg flex items-center justify-center mb-2`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">{m.value}</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{m.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <div className="p-4 border-b border-[var(--border-default)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Conversations récentes</h2>
        </div>
        {conversations.slice(0, 6).map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={false}
            onClick={() => {
              setActiveConversation(conv.id)
              navigate('/portal/conversations')
            }}
          />
        ))}
      </Card>
    </div>
  )
}
