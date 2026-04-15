import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Users, Calendar, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const mobileNavItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Home', exact: true },
  { to: '/app/inbox', icon: MessageSquare, label: 'Inbox' },
  { to: '/app/contacts', icon: Users, label: 'Contacts' },
  { to: '/app/booking', icon: Calendar, label: 'Booking' },
  { to: '/app/settings', icon: Settings, label: 'Réglages' },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-primary)] border-t border-[var(--border-default)] px-2 pb-safe">
      <div className="flex items-center justify-around h-14">
        {mobileNavItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to)

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
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
      </div>
    </nav>
  )
}
