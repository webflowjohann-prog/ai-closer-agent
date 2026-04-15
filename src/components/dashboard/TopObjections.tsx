import { ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface TopObjectionsProps {
  objections: Array<{ objection: string; count: number }>
}

export function TopObjections({ objections }: TopObjectionsProps) {
  const max = objections[0]?.count || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          Objections fréquentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {objections.map((o, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-xs text-[var(--text-secondary)] leading-tight flex-1">{o.objection}</p>
              <span className="text-xs font-bold text-[var(--text-primary)] font-mono flex-shrink-0">{o.count}×</span>
            </div>
            <div className="h-1.5 bg-[var(--surface-tertiary)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(o.count / max) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
