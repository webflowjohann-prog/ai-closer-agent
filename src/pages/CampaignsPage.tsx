import { motion } from 'framer-motion'
import { CampaignList } from '@/components/campaigns/CampaignList'

export default function CampaignsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-6 space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">Campagnes Outbound</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Contactez vos prospects en masse avec des séquences automatisées</p>
      </div>
      <CampaignList />
    </motion.div>
  )
}
