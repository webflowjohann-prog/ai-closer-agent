import { motion } from 'framer-motion'
import { DealsKanban } from '@/components/deals/DealsKanban'

export default function DealsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      <div className="px-6 pt-6 pb-0 flex-shrink-0">
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">Pipeline Deals</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Suivez vos opportunités de vente</p>
      </div>
      <div className="flex-1 overflow-hidden mt-4">
        <DealsKanban />
      </div>
    </motion.div>
  )
}
