import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, User as UserIcon, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBookings } from '@/hooks/useBookings'
import { formatDateTime, cn } from '@/lib/utils'
import type { Booking } from '@/types/database'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 border-yellow-200 text-yellow-700',
  confirmed: 'bg-green-100 border-green-200 text-green-700',
  cancelled: 'bg-red-100 border-red-200 text-red-600',
  completed: 'bg-[var(--surface-tertiary)] border-[var(--border-default)] text-[var(--text-tertiary)]',
  no_show: 'bg-red-50 border-red-100 text-red-400',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  completed: 'Terminé',
  no_show: 'Absent',
}

export function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { bookings, loading, updateBooking } = useBookings(currentMonth)

  const prevMonth = () => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1))
  const nextMonth = () => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1))

  const monthLabel = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] capitalize">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bookings list */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--surface-tertiary)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <Calendar className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">Aucun rendez-vous ce mois</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map((booking, i) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              delay={i * 0.05}
              onConfirm={() => updateBooking(booking.id, { status: 'confirmed' })}
              onCancel={() => updateBooking(booking.id, { status: 'cancelled' })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BookingCard({ booking, delay, onConfirm, onCancel }: {
  booking: Booking
  delay: number
  onConfirm: () => void
  onCancel: () => void
}) {
  const contact = booking.contact
  const name = contact?.full_name?.trim() || 'Contact inconnu'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'p-3 rounded-xl border flex items-start gap-3',
        STATUS_COLORS[booking.status] || STATUS_COLORS.pending
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold truncate">{booking.title}</p>
          <Badge variant="secondary" className="text-[10px] flex-shrink-0">
            {STATUS_LABELS[booking.status]}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs opacity-80">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDateTime(booking.starts_at)}
          </span>
          <span className="flex items-center gap-1">
            <UserIcon className="w-3 h-3" />
            {name}
          </span>
        </div>
      </div>
      {booking.status === 'pending' && (
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={onConfirm} className="p-1.5 rounded-lg bg-white/60 hover:bg-white transition-colors">
            <Check className="w-3.5 h-3.5 text-success" />
          </button>
          <button onClick={onCancel} className="p-1.5 rounded-lg bg-white/60 hover:bg-white transition-colors">
            <X className="w-3.5 h-3.5 text-danger" />
          </button>
        </div>
      )}
    </motion.div>
  )
}
