import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppShell } from '@/components/layout/AppShell'
import { useAuthInit } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { PageLoadingState } from '@/components/shared/LoadingState'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const OnboardingPage = lazy(() => import('@/pages/auth/OnboardingPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const InboxPage = lazy(() => import('@/pages/InboxPage'))
const ContactsPage = lazy(() => import('@/pages/ContactsPage'))
const BookingPage = lazy(() => import('@/pages/BookingPage'))
const PlaygroundPage = lazy(() => import('@/pages/PlaygroundPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const DealsPage = lazy(() => import('@/pages/DealsPage'))
const CampaignsPage = lazy(() => import('@/pages/CampaignsPage'))
const CampaignDetailPage = lazy(() => import('@/pages/CampaignDetailPage'))
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'))

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, initialized } = useAuthStore()

  if (!initialized || loading) {
    return <PageLoadingState />
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}

function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, initialized } = useAuthStore()

  if (!initialized || loading) {
    return <div className="min-h-screen bg-[var(--surface-secondary)]" />
  }

  if (user) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}

export default function App() {
  useAuthInit()
  const { theme } = useUIStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
          },
        }}
      />

      <ErrorBoundary>
        <Suspense fallback={<PageLoadingState />}>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
            <Route path="/auth/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
            <Route path="/auth/forgot-password" element={<GuestGuard><ForgotPasswordPage /></GuestGuard>} />

            {/* Onboarding */}
            <Route path="/onboarding" element={<AuthGuard><OnboardingPage /></AuthGuard>} />

            {/* App routes (protected) */}
            <Route path="/app" element={<AuthGuard><AppShell /></AuthGuard>}>
              <Route index element={<DashboardPage />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="booking" element={<BookingPage />} />
              <Route path="playground" element={<PlaygroundPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="deals" element={<DealsPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="campaigns/:id" element={<CampaignDetailPage />} />
              <Route path="templates" element={<TemplatesPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
