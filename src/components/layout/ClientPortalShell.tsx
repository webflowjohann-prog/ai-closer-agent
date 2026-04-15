import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Calendar, LogOut, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { useOrgStore } from '@/stores/orgStore'
import { useOrgInit } from '@/hooks/useOrgInit'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const portalNav = [
  { to: '/portal', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { to: '/portal/conversations', label: 'Conversations', icon: MessageSquare },
  { to: '/portal/bookings', label: 'Rendez-vous', icon: Calendar },
]

export function ClientPortalShell() {
  useOrgInit()
  const { user } = useAuthStore()
  const { organization, activeSubAccount } = useOrgStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)]">
      {/* Header */}
      <header className="bg-[var(--surface-primary)] border-b border-[var(--border-default)] px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] font-display leading-none">
              {activeSubAccount?.name || organization?.name || 'Mon espace'}
            </p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Portail client</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {portalNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]'
                )
              }
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-tertiary)] hidden sm:block">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Déconnexion</span>
          </Button>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface-primary)] border-t border-[var(--border-default)] flex z-30">
        {portalNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center py-2 text-[10px] gap-1 font-medium transition-colors',
                isActive ? 'text-brand-600' : 'text-[var(--text-tertiary)]'
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>
    </div>
  )
}
