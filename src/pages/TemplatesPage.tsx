import { motion } from 'framer-motion'
import { TemplateList } from '@/components/templates/TemplateList'

export default function TemplatesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-6 space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">Templates de messages</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Réutilisez vos meilleurs messages avec des variables dynamiques</p>
      </div>
      <TemplateList />
    </motion.div>
  )
}
