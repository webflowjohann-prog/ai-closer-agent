import { Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useBookings } from '@/hooks/useBookings'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function PortalBookings() {
  const { bookings, loading } = useBookings()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-display">Rendez-vous</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Vos prochains rendez-vous planifiés</p>
      </div>

      <Card>
        {loading ? (
          <div className="p-4 space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-[var(--surface-secondary)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-secondary)]">Aucun rendez-vous planifié</p>
          </div>
        ) : (
          <div>
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-4 border-b border-[var(--border-subtle)] last:border-0"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{booking.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{formatDate(booking.starts_at)}</p>
                </div>
                <Badge variant={booking.status === 'confirmed' ? 'won' : 'secondary'}>
                  {booking.status === 'confirmed' ? 'Confirmé' : booking.status === 'pending' ? 'En attente' : booking.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
