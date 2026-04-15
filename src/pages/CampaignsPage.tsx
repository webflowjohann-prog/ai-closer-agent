import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CampaignList } from '@/components/campaigns/CampaignList'
import { CommentToDM } from '@/components/campaigns/CommentToDM'

export default function CampaignsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-6 space-y-6"
    >
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">Campagnes</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Automatisez votre prospection et vos interactions sociales</p>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="mb-4">
          <TabsTrigger value="campaigns">Campagnes outbound</TabsTrigger>
          <TabsTrigger value="comment-dm">Comment → DM</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <CampaignList />
        </TabsContent>

        <TabsContent value="comment-dm">
          <CommentToDM />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
