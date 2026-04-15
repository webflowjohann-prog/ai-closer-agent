import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  Megaphone,
  FileText,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useOrgStore } from '@/stores/orgStore'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/app/inbox', icon: MessageSquare, label: 'Inbox' },
  { to: '/app/contacts', icon: Users, label: 'Contacts' },
  { to: '/app/deals', icon: TrendingUp, label: 'Deals' },
  { to: '/app/campaigns', icon: Megaphone, label: 'Campagnes' },
  { to: '/app/templates', icon: FileText, label: 'Templates' },
  { to: '/app/booking', icon: Calendar, label: 'Booking' },
  { to: '/app/playground', icon: FlaskConical, label: 'Playground' },
  { to: '/app/settings', icon: Settings, label: 'Réglages' },
]

const sidebarVariants = {
  open: { width: 260, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  closed: { width: 64, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore()
  const { organization } = useOrgStore()
  const location = useLocation()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={sidebarCollapsed ? 'closed' : 'open'}
        variants={sidebarVariants}
        className="hidden md:flex flex-col h-screen bg-[var(--surface-primary)] border-r border-[var(--border-default)] overflow-hidden flex-shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-[60px] border-b border-[var(--border-default)]">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-semibold text-[var(--text-primary)] font-display truncate">
                  {organization?.brand_name || 'AI Closer'}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] truncate">
                  {organization?.plan || 'starter'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)

            const link = (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  'group relative',
                  isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                <item.icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-brand-500' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)]'
                  )}
                />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand-500 rounded-full"
                  />
                )}
              </NavLink>
            )

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return link
          })}
        </nav>

        {/* Collapse button */}
        <div className="px-2 py-3 border-t border-[var(--border-default)]">
          <button
            onClick={toggleSidebarCollapsed}
            className={cn(
              'w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-[var(--text-tertiary)]',
              'hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] transition-colors'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs"
                  >
                    Réduire
                  </motion.span>
                </AnimatePresence>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
