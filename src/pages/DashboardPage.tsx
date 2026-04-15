import { motion } from 'framer-motion'
import {
  MessageSquare, Reply, Calendar, Users, Bot, TrendingUp,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { FunnelChart } from '@/components/dashboard/FunnelChart'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { ROIDashboard } from '@/components/dashboard/ROIDashboard'
import { InsightsDashboard } from '@/components/dashboard/InsightsDashboard'
import { ReviewStats } from '@/components/dashboard/ReviewStats'
import { useDashboardStats, useActivityData } from '@/hooks/useDashboardStats'
import { useConversations } from '@/hooks/useConversations'
import { ConversationItem } from '@/components/inbox/ConversationItem'
import { useInboxStore } from '@/stores/inboxStore'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLoadingState } from '@/components/shared/LoadingState'

export default function DashboardPage() {
  const { stats, loading } = useDashboardStats()
  const activityData = useActivityData()
  const { conversations, loading: convsLoading } = useConversations()
  const { setActiveConversation } = useInboxStore()
  const navigate = useNavigate()

  if (loading) return <PageLoadingState />

  const funnelData = [
    { label: 'Messages envoyés', value: stats.messagesSent, color: '#5c7cfa' },
    { label: 'Livrés', value: stats.messagesDelivered, color: '#748ffc' },
    { label: 'Lus', value: stats.messagesRead, color: '#91a7ff' },
    { label: 'Réponses', value: stats.replies, color: '#40c057' },
    { label: 'Qualifiés', value: stats.qualified, color: '#fab005' },
    { label: 'RDV pris', value: stats.bookings, color: '#339af0' },
  ]

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        title="Dashboard"
        description="Aperçu de l'activité des 30 derniers jours"
      />

      <div className="p-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          </TabsList>

          {/* ── Vue d'ensemble ─────────────────────────── */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard label="Messages envoyés" value={stats.messagesSent} trend={stats.messagesSentTrend} icon={MessageSquare} delay={0} />
                <StatCard label="Taux de réponse" value={`${stats.messagesSent > 0 ? Math.round((stats.replies / stats.messagesSent) * 100) : 0}%`} icon={Reply} color="text-success bg-green-50" delay={0.05} />
                <StatCard label="Leads qualifiés" value={stats.qualified} icon={Users} color="text-warning bg-yellow-50" delay={0.1} />
                <StatCard label="RDV pris" value={stats.bookings} trend={stats.bookingsTrend} icon={Calendar} color="text-info bg-blue-50" delay={0.15} />
                <StatCard label="Messages bot" value={`${stats.messagesSent > 0 ? Math.round((stats.messagesSent / (stats.messagesSent + stats.replies || 1)) * 100) : 0}%`} icon={Bot} color="text-brand-500 bg-brand-50" delay={0.2} />
                <StatCard label="Taux conversion" value={`${stats.messagesSent > 0 ? Math.round((stats.bookings / (stats.replies || 1)) * 100) : 0}%`} icon={TrendingUp} color="text-violet-600 bg-violet-50" delay={0.25} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Activité (14 derniers jours)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityChart data={activityData} />
                  </CardContent>
                </Card>

                {/* Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Entonnoir</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FunnelChart data={funnelData} />
                  </CardContent>
                </Card>
              </div>

              {/* Recent conversations */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversations récentes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {convsLoading ? (
                    <div className="p-4 space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-14 bg-[var(--surface-tertiary)] rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : conversations.slice(0, 5).map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={false}
                      onClick={() => {
                        setActiveConversation(conv.id)
                        navigate('/app/inbox')
                      }}
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Review stats */}
              <ReviewStats />
            </div>
          </TabsContent>

          {/* ── ROI ────────────────────────────────────── */}
          <TabsContent value="roi">
            <ROIDashboard />
          </TabsContent>

          {/* ── Intelligence ───────────────────────────── */}
          <TabsContent value="intelligence">
            <InsightsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
