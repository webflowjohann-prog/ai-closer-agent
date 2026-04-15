import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QRCodeList } from '@/components/growth/QRCodeList'
import { FormConnectionList } from '@/components/growth/FormConnectionList'
import { SocialProofSettings } from '@/components/growth/SocialProofSettings'
import { TrackedLinksWidget } from '@/components/dashboard/TrackedLinksWidget'

export default function GrowthPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">Acquisition</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
            Générez des leads et convertissez-les instantanément avec votre agent IA
          </p>
        </div>

        <Tabs defaultValue="qr">
          <TabsList className="mb-4">
            <TabsTrigger value="qr">QR Codes</TabsTrigger>
            <TabsTrigger value="forms">Formulaires</TabsTrigger>
            <TabsTrigger value="proof">Social Proof</TabsTrigger>
            <TabsTrigger value="links">Liens trackés</TabsTrigger>
          </TabsList>

          <TabsContent value="qr">
            <QRCodeList />
          </TabsContent>

          <TabsContent value="forms">
            <FormConnectionList />
          </TabsContent>

          <TabsContent value="proof">
            <SocialProofSettings />
          </TabsContent>

          <TabsContent value="links">
            <TrackedLinksWidget />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
