import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

interface ActivityDataPoint {
  date: string
  envoyes: number
  reponses: number
  rdv: number
}

interface ActivityChartProps {
  data: ActivityDataPoint[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface-elevated)] border border-[var(--border-default)] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-[var(--text-primary)] mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-[var(--text-secondary)]">{p.name}</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)] font-mono">{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ActivityChart({ data }: ActivityChartProps) {
  // Show last 14 days for readability
  const displayData = data.slice(-14)

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={displayData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id="envoyesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="reponsesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#40c057" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#40c057" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="envoyes"
            name="Envoyés"
            stroke="#5c7cfa"
            strokeWidth={2}
            fill="url(#envoyesGrad)"
          />
          <Area
            type="monotone"
            dataKey="reponses"
            name="Réponses"
            stroke="#40c057"
            strokeWidth={2}
            fill="url(#reponsesGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
