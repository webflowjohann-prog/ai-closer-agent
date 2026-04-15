import { HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface TopQuestionsProps {
  questions: Array<{ question: string; count: number }>
}

export function TopQuestions({ questions }: TopQuestionsProps) {
  const max = questions[0]?.count || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-500" />
          Questions fréquentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-xs text-[var(--text-secondary)] leading-tight flex-1">{q.question}</p>
              <span className="text-xs font-bold text-[var(--text-primary)] font-mono flex-shrink-0">{q.count}×</span>
            </div>
            <div className="h-1.5 bg-[var(--surface-tertiary)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(q.count / max) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
