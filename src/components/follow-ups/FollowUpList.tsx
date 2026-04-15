import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { FollowUpItem } from './FollowUpItem'
import { useFollowUps } from '@/hooks/useFollowUps'
import { TableLoadingState } from '@/components/shared/LoadingState'

interface FollowUpListProps {
  contactId?: string
  maxItems?: number
}

export function FollowUpList({ contactId, maxItems }: FollowUpListProps) {
  const { followUps, isLoading } = useFollowUps(contactId)

  if (isLoading) return <TableLoadingState rows={3} />

  const items = maxItems ? followUps.slice(0, maxItems) : followUps

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
        <p className="text-sm text-[var(--text-secondary)]">Aucune relance programmée</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Les relances automatiques apparaîtront ici</p>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-2"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      {items.map((fu) => (
        <motion.div
          key={fu.id}
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
        >
          <FollowUpItem followUp={fu} />
        </motion.div>
      ))}
    </motion.div>
  )
}
