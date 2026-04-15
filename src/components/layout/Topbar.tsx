import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon, Sun, Bell, Menu, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { useOrgStore } from '@/stores/orgStore'
import { supabase } from '@/lib/supabase'
import { getInitials } from '@/lib/utils'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function Topbar() {
  const { theme, toggleTheme, setSidebarOpen } = useUIStore()
  const { user } = useAuthStore()
  const { organization, subAccounts, activeSubAccount, setActiveSubAccount } = useOrgStore()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/auth/login')
  }

  return (
    <header className="h-[60px] border-b border-[var(--border-default)] bg-[var(--surface-primary)] flex items-center px-4 gap-3 flex-shrink-0">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Sub-account switcher */}
      {subAccounts.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-default)] hover:bg-[var(--surface-secondary)] transition-colors text-sm">
              <div className="w-5 h-5 bg-brand-100 rounded-md flex items-center justify-center">
                <span className="text-[10px] font-bold text-brand-600">
                  {activeSubAccount?.name?.[0] || '?'}
                </span>
              </div>
              <span className="font-medium text-[var(--text-primary)] max-w-[140px] truncate">
                {activeSubAccount?.name || 'Sélectionner un compte'}
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--text-tertiary)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Comptes clients</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {subAccounts.map((sa) => (
              <DropdownMenuItem
                key={sa.id}
                onClick={() => setActiveSubAccount(sa)}
                className={activeSubAccount?.id === sa.id ? 'bg-brand-50 text-brand-600' : ''}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-brand-100 rounded-md flex items-center justify-center">
                    <span className="text-[10px] font-bold text-brand-600">{sa.name[0]}</span>
                  </div>
                  <span className="truncate">{sa.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <AnimatePresence mode="wait">
            {theme === 'light' ? (
              <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Moon className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Sun className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" onClick={() => setNotifOpen(!notifOpen)}>
          <Bell className="w-4 h-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[var(--surface-secondary)] transition-colors">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{getInitials(user?.user_metadata?.full_name || user?.email || 'U')}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div>
                <p className="font-semibold text-[var(--text-primary)] text-sm">
                  {user?.user_metadata?.full_name || 'Utilisateur'}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/app/settings')}>
              <User className="w-4 h-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/app/settings')}>
              <Settings className="w-4 h-4" />
              Réglages
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-danger focus:text-danger focus:bg-red-50">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
