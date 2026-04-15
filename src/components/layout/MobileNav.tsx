import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Users, TrendingUp, MoreHorizontal, Megaphone, FileText, Calendar, FlaskConical, Settings, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const primaryItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Home', exact: true },
  { to: '/app/inbox', icon: MessageSquare, label: 'Inbox' },
  { to: '/app/contacts', icon: Users, label: 'Contacts' },
  { to: '/app/deals', icon: TrendingUp, label: 'Deals' },
]

const moreItems = [
  { to: '/app/campaigns', icon: Megaphone, label: 'Campagnes' },
  { to: '/app/templates', icon: FileText, label: 'Templates' },
  { to: '/app/booking', icon: Calendar, label: 'Booking' },
  { to: '/app/playground', icon: FlaskConical, label: 'Playground' },
  { to: '/app/settings', icon: Settings, label: 'Réglages' },
]

export function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-primary)] border-t border-[var(--border-default)] px-2 pb-safe">
        <div className="flex items-center justify-around h-14">
          {primaryItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
                onClick={() => setShowMore(false)}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveNav"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-500 rounded-full"
                  />
                )}
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-brand-500' : 'text-[var(--text-tertiary)]'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-brand-500' : 'text-[var(--text-tertiary)]'
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex flex-col items-center gap-0.5 px-3 py-1"
          >
            <MoreHorizontal className={cn('w-5 h-5 transition-colors', showMore ? 'text-brand-500' : 'text-[var(--text-tertiary)]')} />
            <span className={cn('text-[10px] font-medium transition-colors', showMore ? 'text-brand-500' : 'text-[var(--text-tertiary)]')}>
              Plus
            </span>
          </button>
        </div>
      </nav>

      {/* More drawer */}
      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/20"
              onClick={() => setShowMore(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed bottom-14 left-0 right-0 z-50 bg-[var(--surface-primary)] border-t border-[var(--border-default)] rounded-t-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Navigation</p>
                <button onClick={() => setShowMore(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--surface-secondary)]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {moreItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.to)
                  return (
                    <button
                      key={item.to}
                      onClick={() => { navigate(item.to); setShowMore(false) }}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors',
                        isActive ? 'bg-brand-50' : 'hover:bg-[var(--surface-secondary)]'
                      )}
                    >
                      <item.icon className={cn('w-5 h-5', isActive ? 'text-brand-500' : 'text-[var(--text-secondary)]')} />
                      <span className={cn('text-xs font-medium', isActive ? 'text-brand-500' : 'text-[var(--text-secondary)]')}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
