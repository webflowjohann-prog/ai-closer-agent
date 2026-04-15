import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link2, MousePointerClick, ExternalLink, TrendingUp, Loader2, Filter } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useOrgStore } from '@/stores/orgStore'
import type { TrackedLink } from '@/types/database'
import { format, subDays, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface DailyClick {
  date: string
  clicks: number
}

export function TrackedLinksWidget() {
  const { activeSubAccount } = useOrgStore()
  const [links, setLinks] = useState<TrackedLink[]>([])
  const [filtered, setFiltered] = useState<TrackedLink[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [chartData, setChartData] = useState<DailyClick[]>([])

  useEffect(() => {
    if (!activeSubAccount) return
    fetchLinks()
  }, [activeSubAccount?.id])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      q
        ? links.filter(
            (l) =>
              l.original_url.toLowerCase().includes(q) ||
              l.title?.toLowerCase().includes(q) ||
              l.conversation_id?.toLowerCase().includes(q) ||
              l.contact_id?.toLowerCase().includes(q)
          )
        : links
    )
  }, [search, links])

  async function fetchLinks() {
    if (!activeSubAccount) return
    setLoading(true)

    const { data } = await supabase
      .from('tracked_links')
      .select('*')
      .eq('sub_account_id', activeSubAccount.id)
      .order('created_at', { ascending: false })
      .limit(200)

    const rows = (data ?? []) as TrackedLink[]
    setLinks(rows)
    setFiltered(rows)
    buildChartData(rows)
    setLoading(false)
  }

  function buildChartData(rows: TrackedLink[]) {
    // Group clicks by created_at date (proxy — in prod, use a clicks_log table per day)
    const days: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd')
      days[d] = 0
    }

    for (const link of rows) {
      const d = link.created_at.slice(0, 10)
      if (d in days) days[d] += link.clicks
    }

    setChartData(
      Object.entries(days).map(([date, clicks]) => ({
        date: format(parseISO(date), 'd MMM', { locale: fr }),
        clicks,
      }))
    )
  }

  const totalLinks = links.length
  const totalClicks = links.reduce((sum, l) => sum + (l.clicks ?? 0), 0)
  const top5 = [...links].sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0)).slice(0, 5)

  function truncateUrl(url: string, max = 48) {
    return url.length > max ? url.slice(0, max) + '…' : url
  }

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)]"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-4 h-4 text-brand-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-[var(--text-primary)]">{totalLinks}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Liens créés</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center gap-3 p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)]"
        >
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
            <MousePointerClick className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-[var(--text-primary)]">{totalClicks}</p>
            <p className="text-xs text-[var(--text-tertiary)]">Clics totaux</p>
          </div>
        </motion.div>
      </div>

      {/* Chart — clicks 14 days */}
      <div className="p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border-default)]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[var(--text-tertiary)]" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Clics — 14 derniers jours</p>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--text-primary)',
              }}
              cursor={{ stroke: 'var(--border-default)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#5c7cfa"
              strokeWidth={2}
              fill="url(#clickGrad)"
              dot={false}
              activeDot={{ r: 3, fill: '#5c7cfa' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 */}
      {top5.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Top 5 liens</p>
          <div className="space-y-2">
            {top5.map((link, idx) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-primary)]"
              >
                <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {link.title && (
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{link.title}</p>
                  )}
                  <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                    {truncateUrl(link.original_url)}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a
                      href={link.switchy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-brand-500 hover:underline flex items-center gap-0.5"
                    >
                      {truncateUrl(link.switchy_url, 32)}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <MousePointerClick className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-sm font-bold text-[var(--text-primary)]">{link.clicks}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Full table */}
      <div>
        <div className="flex items-center justify-between mb-2 gap-3">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Tous les liens</p>
          <div className="relative w-52">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-tertiary)]" />
            <Input
              className="h-7 text-xs pl-7"
              placeholder="Filtrer par URL, contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--text-tertiary)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Link2 className="w-7 h-7 text-[var(--text-tertiary)] mb-2" />
            <p className="text-sm text-[var(--text-secondary)]">Aucun lien tracké</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Les liens seront créés automatiquement quand l'agent envoie des URLs.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--border-default)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--surface-secondary)]">
                  <th className="text-left px-3 py-2 text-[var(--text-tertiary)] font-medium">URL originale</th>
                  <th className="text-left px-3 py-2 text-[var(--text-tertiary)] font-medium">Lien court</th>
                  <th className="text-left px-3 py-2 text-[var(--text-tertiary)] font-medium">UTM</th>
                  <th className="text-right px-3 py-2 text-[var(--text-tertiary)] font-medium">Clics</th>
                  <th className="text-right px-3 py-2 text-[var(--text-tertiary)] font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((link) => (
                  <tr
                    key={link.id}
                    className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--surface-secondary)] transition-colors"
                  >
                    <td className="px-3 py-2 max-w-[180px]">
                      <p className="truncate text-[var(--text-primary)]">{truncateUrl(link.original_url, 40)}</p>
                    </td>
                    <td className="px-3 py-2 max-w-[140px]">
                      <a
                        href={link.switchy_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 hover:underline flex items-center gap-0.5 truncate"
                      >
                        {truncateUrl(link.switchy_url, 28)}
                        <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-3 py-2 text-[var(--text-tertiary)]">
                      {link.utm_campaign && (
                        <span className="inline-block bg-[var(--surface-secondary)] rounded px-1.5 py-0.5 text-[10px]">
                          {link.utm_campaign}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-[var(--text-primary)]">
                      {link.clicks}
                    </td>
                    <td className="px-3 py-2 text-right text-[var(--text-tertiary)]">
                      {format(parseISO(link.created_at), 'd MMM', { locale: fr })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
