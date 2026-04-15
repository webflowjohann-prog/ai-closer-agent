import { useMemo } from 'react'
import { useDeals } from './useDeals'
import { subDays, isAfter, differenceInDays } from 'date-fns'
import type { DealWithAttribution } from '@/types/database'

export type ROIPeriod = '7d' | '30d' | '90d' | '12m'

const BASE_CONTACT = { bot_active: true, custom_fields: {} }

const MOCK_DEALS: DealWithAttribution[] = [
  { id: '1', sub_account_id: 'x', contact_id: 'c1', title: 'Villa Prestige Rouen', stage: 'closed_won', value: 12000, currency: 'EUR', probability: 100, tags: [], sort_order: 0, stage_changed_at: new Date(Date.now()-5*86400000).toISOString(), won_at: new Date(Date.now()-5*86400000).toISOString(), created_at: new Date(Date.now()-30*86400000).toISOString(), updated_at: new Date().toISOString(), bot_initiated: true, bot_messages_before_human: 14, attribution_channel: 'whatsapp', contact: { ...BASE_CONTACT, id:'c1', sub_account_id:'x', status:'closed_won', score:85, tags:[], bot_messages_count:14, qualification_data:{}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), first_name:'Sophie', last_name:'Martin', full_name:'Sophie Martin', phone:'+33612345678' } },
  { id: '2', sub_account_id: 'x', contact_id: 'c2', title: 'Appartement T4 Caen', stage: 'closed_won', value: 8500, currency: 'EUR', probability: 100, tags: [], sort_order: 1, stage_changed_at: new Date(Date.now()-12*86400000).toISOString(), won_at: new Date(Date.now()-12*86400000).toISOString(), created_at: new Date(Date.now()-45*86400000).toISOString(), updated_at: new Date().toISOString(), bot_initiated: true, bot_messages_before_human: 9, attribution_channel: 'instagram', contact: { ...BASE_CONTACT, id:'c2', sub_account_id:'x', status:'closed_won', score:91, tags:[], bot_messages_count:9, qualification_data:{}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), first_name:'Marc', last_name:'Dubois', full_name:'Marc Dubois', phone:'+33687654321' } },
  { id: '3', sub_account_id: 'x', contact_id: 'c3', title: 'Clinique Paris 16e — Rhinoplastie', stage: 'closed_won', value: 4500, currency: 'EUR', probability: 100, tags: [], sort_order: 2, stage_changed_at: new Date(Date.now()-3*86400000).toISOString(), won_at: new Date(Date.now()-3*86400000).toISOString(), created_at: new Date(Date.now()-20*86400000).toISOString(), updated_at: new Date().toISOString(), bot_initiated: true, bot_messages_before_human: 6, attribution_channel: 'webchat', contact: { ...BASE_CONTACT, id:'c3', sub_account_id:'x', status:'closed_won', score:78, tags:[], bot_messages_count:6, qualification_data:{}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), first_name:'Camille', last_name:'Lefebvre', full_name:'Camille Lefebvre', email:'camille@email.com' } },
  { id: '4', sub_account_id: 'x', contact_id: 'c4', title: 'Maison + terrain Normandie', stage: 'proposal', value: 350000, currency: 'EUR', probability: 60, tags: [], sort_order: 3, stage_changed_at: new Date(Date.now()-2*86400000).toISOString(), created_at: new Date(Date.now()-15*86400000).toISOString(), updated_at: new Date().toISOString(), bot_initiated: true, bot_messages_before_human: 18, attribution_channel: 'whatsapp', contact: { ...BASE_CONTACT, id:'c4', sub_account_id:'x', status:'proposal', score:72, tags:[], bot_messages_count:18, qualification_data:{}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), first_name:'Jean', last_name:'Bernard', full_name:'Jean Bernard', phone:'+33698765432' } },
  { id: '5', sub_account_id: 'x', contact_id: 'c5', title: 'Coaching Business — 6 mois', stage: 'meeting', value: 6000, currency: 'EUR', probability: 40, tags: [], sort_order: 4, stage_changed_at: new Date(Date.now()-8*86400000).toISOString(), created_at: new Date(Date.now()-25*86400000).toISOString(), updated_at: new Date().toISOString(), bot_initiated: true, bot_messages_before_human: 11, attribution_channel: 'instagram', contact: { ...BASE_CONTACT, id:'c5', sub_account_id:'x', status:'meeting_booked', score:65, tags:[], bot_messages_count:11, qualification_data:{}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), first_name:'Emma', last_name:'Rousseau', full_name:'Emma Rousseau', email:'emma@startup.fr' } },
  { id: '6', sub_account_id: 'x', contact_id: 'c6', title: 'Hôtel Particulier Deauville', stage: 'qualified', value: 28000, currency: 'EUR', probability: 25, tags: [], sort_order: 5, stage_changed_at: new Date(Date.now()-1*86400000).toISOString(), created_at: new Date(Date.now()-7*86400000).toISOString(), updated_at: new Date().toISOString(), bot_initiated: true, bot_messages_before_human: 7, attribution_channel: 'whatsapp', contact: { ...BASE_CONTACT, id:'c6', sub_account_id:'x', status:'qualified', score:58, tags:[], bot_messages_count:7, qualification_data:{}, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), first_name:'Thomas', last_name:'Garnier', full_name:'Thomas Garnier', phone:'+33611223344' } },
]

function getPeriodDays(period: ROIPeriod): number {
  if (period === '7d') return 7
  if (period === '30d') return 30
  if (period === '90d') return 90
  return 365
}

export function useROI(period: ROIPeriod = '30d') {
  const { deals: realDeals } = useDeals()

  return useMemo(() => {
    const days = getPeriodDays(period)
    const since = subDays(new Date(), days)

    // Use mock if no real deals
    const dealsToUse: DealWithAttribution[] = realDeals.length > 0
      ? realDeals.map(d => ({ ...d, bot_initiated: true, bot_messages_before_human: 8 }))
      : MOCK_DEALS

    const recent = dealsToUse.filter(d => isAfter(new Date(d.created_at), since))

    const closedWon = recent.filter(d => d.stage === 'closed_won')
    const closedRevenue = closedWon.reduce((sum, d) => sum + (d.value || 0), 0)

    const pipeline = recent
      .filter(d => d.stage !== 'closed_lost')
      .reduce((sum, d) => sum + ((d.value || 0) * (d.probability / 100)), 0)

    const avgCostPerLead = 35 // assumed ad cost
    const botMessages = recent.reduce((sum, d) => sum + (d.bot_messages_before_human || 0), 0)
    const roi = closedRevenue > 0 ? Math.round(closedRevenue / Math.max(avgCostPerLead * recent.length, 1)) : 0

    // Attribution by channel
    const byChannel = recent.reduce<Record<string, { count: number; revenue: number }>>((acc, d) => {
      const ch = d.attribution_channel || 'webchat'
      if (!acc[ch]) acc[ch] = { count: 0, revenue: 0 }
      acc[ch].count++
      acc[ch].revenue += d.value || 0
      return acc
    }, {})

    // Funnel
    const stages = ['lead', 'qualified', 'meeting', 'proposal', 'negotiation', 'closed_won']
    const funnelData = stages.map(stage => ({
      stage,
      count: recent.filter(d => {
        const stageOrder = stages.indexOf(d.stage)
        const thisOrder = stages.indexOf(stage)
        return stageOrder >= thisOrder
      }).length,
    }))

    // Average time to close
    const closedWithDates = closedWon.filter(d => d.created_at && d.won_at)
    const avgDaysToClose = closedWithDates.length > 0
      ? Math.round(closedWithDates.reduce((sum, d) => sum + differenceInDays(new Date(d.won_at!), new Date(d.created_at)), 0) / closedWithDates.length)
      : 0

    return {
      pipeline: Math.round(pipeline),
      closedRevenue,
      roiMultiplier: roi,
      totalDeals: recent.length,
      wonDeals: closedWon.length,
      avgDaysToClose,
      botMessages,
      byChannel,
      funnelData,
      deals: recent,
      isMock: realDeals.length === 0,
    }
  }, [realDeals, period])
}
