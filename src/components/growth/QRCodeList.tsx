import { useState } from 'react'
import { Plus, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QRCodeCard } from './QRCodeCard'
import { QRCodeGenerator } from './QRCodeGenerator'
import { useQRCodes } from '@/hooks/useQRCodes'

export function QRCodeList() {
  const [showGen, setShowGen] = useState(false)
  const { qrCodes, isLoading, deleteQR } = useQRCodes()

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">QR Codes</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Générez des QR codes pour démarrer une conversation WhatsApp ou WebChat instantanément
          </p>
        </div>
        <Button size="sm" onClick={() => setShowGen(true)}>
          <Plus className="w-3.5 h-3.5" />
          Nouveau QR
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="h-36 bg-[var(--surface-secondary)] rounded-xl animate-pulse" />)}
        </div>
      ) : qrCodes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--border-default)] rounded-xl">
          <QrCode className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">Aucun QR code créé</p>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">
            Créez un QR code à imprimer sur vos supports marketing
          </p>
          <Button size="sm" onClick={() => setShowGen(true)}>
            <Plus className="w-3.5 h-3.5" />
            Créer un QR code
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {qrCodes.map((qr) => (
            <QRCodeCard
              key={qr.id}
              qr={qr}
              onDelete={(id) => deleteQR.mutate(id)}
            />
          ))}
        </div>
      )}

      <QRCodeGenerator open={showGen} onClose={() => setShowGen(false)} />
    </div>
  )
}
