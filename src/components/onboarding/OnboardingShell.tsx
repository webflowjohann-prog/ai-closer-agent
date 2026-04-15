import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { StepBusiness } from './StepBusiness'
import { StepChannels } from './StepChannels'
import { StepActivation } from './StepActivation'
import type { VerticalType } from '@/types/database'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

const steps = ['Votre entreprise', 'Canaux', 'Activation']

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
}

export function OnboardingShell() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [activating, setActivating] = useState(false)

  const [businessData, setBusinessData] = useState({
    url: '',
    vertical: null as VerticalType | null,
    businessName: '',
  })
  const [channelData, setChannelData] = useState({
    whatsapp: false,
    instagram: false,
    webchat: true,
    sms: false,
  })

  const goNext = () => {
    setDirection(1)
    setStep((s) => s + 1)
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  const handleActivate = async () => {
    if (!user) return
    setActivating(true)

    try {
      // Create org
      const orgSlug = slugify(businessData.businessName) || `org-${Date.now()}`
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: businessData.businessName,
          slug: orgSlug,
          plan: 'starter',
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Create user record
      await supabase.from('users').insert({
        id: user.id,
        organization_id: org.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name,
        role: 'owner',
      })

      // Create sub-account
      const { data: subAccount, error: saError } = await supabase
        .from('sub_accounts')
        .insert({
          organization_id: org.id,
          name: businessData.businessName,
          slug: orgSlug,
          vertical: businessData.vertical || 'autre',
          website_url: businessData.url,
          bot_active: true,
        })
        .select()
        .single()

      if (saError) throw saError

      // Create active channels
      const activeChannels = Object.entries(channelData)
        .filter(([, active]) => active)
        .map(([type]) => ({
          sub_account_id: subAccount.id,
          type: type as any,
          status: 'pending' as const,
        }))

      if (activeChannels.length > 0) {
        await supabase.from('channels').insert(activeChannels)
      }

      toast.success('Agent activé !', {
        description: 'Votre assistant IA est prêt à prendre en charge vos prospects.',
      })
      navigate('/app')
    } catch (error: any) {
      toast.error('Erreur', { description: error.message })
    } finally {
      setActivating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-[var(--text-primary)] font-display">AI Closer</span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    i <= step
                      ? 'bg-brand-500 text-white'
                      : 'bg-[var(--color-gray-200)] text-[var(--text-tertiary)]'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px w-8 mx-2 transition-colors ${i < step ? 'bg-brand-400' : 'bg-[var(--color-gray-200)]'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-[var(--color-gray-200)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-500 rounded-full"
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface-primary)] rounded-2xl border border-[var(--border-default)] p-6 shadow-md overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <h2 className="text-lg font-semibold text-[var(--text-primary)] font-display mb-1">
                {step === 0 && 'Parlez-nous de votre activité'}
                {step === 1 && 'Connectez vos canaux'}
                {step === 2 && 'Prêt à lancer !'}
              </h2>
              <p className="text-sm text-[var(--text-tertiary)] mb-5">
                {step === 0 && 'En 30 secondes, configurez votre agent IA personnalisé'}
                {step === 1 && 'Choisissez sur quels canaux votre agent répondra'}
                {step === 2 && 'Testez la conversation et activez votre agent'}
              </p>

              {step === 0 && (
                <StepBusiness
                  data={businessData}
                  onChange={setBusinessData}
                  onNext={goNext}
                />
              )}
              {step === 1 && (
                <StepChannels
                  data={channelData}
                  onChange={setChannelData}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}
              {step === 2 && (
                <StepActivation
                  businessName={businessData.businessName}
                  onActivate={handleActivate}
                  onBack={goBack}
                  loading={activating}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
