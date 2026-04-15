import { useEffect, useRef, useState } from 'react'
import { Download, QrCode, Trash2, MessageSquare, Scan } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { QRCode } from '@/types/database'

// Dynamic import to avoid SSR issues
let QRLib: any = null

interface QRCodeCardProps {
  qr: QRCode
  onDelete: (id: string) => void
}

const channelColors: Record<string, string> = {
  whatsapp: 'bg-green-100 text-green-700',
  webchat: 'bg-blue-100 text-blue-700',
}

export function QRCodeCard({ qr, onDelete }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    const renderQR = async () => {
      try {
        if (!QRLib) {
          const mod = await import('qrcode')
          QRLib = mod.default || mod
        }
        if (canvasRef.current) {
          await QRLib.toCanvas(canvasRef.current, qr.target_url, {
            width: 120,
            margin: 1,
            color: { dark: '#212529', light: '#ffffff' },
          })
          setRendered(true)
        }
      } catch (e) {
        // fallback — just show placeholder
        setRendered(true)
      }
    }
    renderQR()
  }, [qr.target_url])

  const handleDownload = async () => {
    try {
      if (!QRLib) {
        const mod = await import('qrcode')
        QRLib = mod.default || mod
      }
      const dataUrl = await QRLib.toDataURL(qr.target_url, { width: 1024, margin: 2 })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `qr-${qr.name.replace(/\s+/g, '-').toLowerCase()}.png`
      a.click()
    } catch {}
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} layout>
      <Card className="p-4">
        <div className="flex gap-4">
          {/* QR preview */}
          <div className="w-28 h-28 bg-white border border-[var(--border-default)] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full" />
            {!rendered && <QrCode className="w-8 h-8 text-[var(--color-gray-300)]" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-sm text-[var(--text-primary)]">{qr.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${channelColors[qr.channel_type] || 'bg-gray-100 text-gray-600'}`}>
                  {qr.channel_type}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-[var(--text-tertiary)] hover:text-red-500"
                onClick={() => onDelete(qr.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <Scan className="w-3 h-3 text-[var(--text-tertiary)]" />
                <span className="font-semibold text-[var(--text-primary)]">{qr.scans_count}</span> scans
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <MessageSquare className="w-3 h-3 text-[var(--text-tertiary)]" />
                <span className="font-semibold text-[var(--text-primary)]">{qr.conversations_started}</span> convs
              </div>
            </div>

            <Button variant="outline" size="sm" className="text-xs h-7 w-full" onClick={handleDownload}>
              <Download className="w-3 h-3" />
              Télécharger PNG
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
