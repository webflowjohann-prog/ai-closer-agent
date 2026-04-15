import { motion } from 'framer-motion'
import { Building2, Stethoscope, GraduationCap, UtensilsCrossed, Car, Briefcase } from 'lucide-react'
import type { VerticalType } from '@/types/database'
import { cn } from '@/lib/utils'

const verticals: Array<{
  id: VerticalType
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}> = [
  {
    id: 'immobilier_luxe',
    label: 'Immobilier Luxe',
    description: 'Agences premium, biens d\'exception',
    icon: Building2,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    id: 'clinique_esthetique',
    label: 'Clinique Esthétique',
    description: 'Médecine esthétique, chirurgie',
    icon: Stethoscope,
    color: 'bg-rose-50 text-rose-600 border-rose-200',
  },
  {
    id: 'coach_formateur',
    label: 'Coach / Formateur',
    description: 'Coaching, formations en ligne',
    icon: GraduationCap,
    color: 'bg-violet-50 text-violet-600 border-violet-200',
  },
  {
    id: 'restaurant_hotel',
    label: 'Restaurant / Hôtel',
    description: 'Restauration, hôtellerie',
    icon: UtensilsCrossed,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  {
    id: 'concession_auto',
    label: 'Concession Auto',
    description: 'Vente et leasing automobile',
    icon: Car,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    id: 'autre',
    label: 'Autre secteur',
    description: 'Personnalisez votre assistant',
    icon: Briefcase,
    color: 'bg-gray-50 text-gray-600 border-gray-200',
  },
]

interface VerticalSelectorProps {
  value: VerticalType | null
  onChange: (vertical: VerticalType) => void
}

export function VerticalSelector({ value, onChange }: VerticalSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {verticals.map((v, i) => (
        <motion.button
          key={v.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onChange(v.id)}
          className={cn(
            'flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150',
            value === v.id
              ? 'border-brand-500 bg-brand-50'
              : 'border-[var(--border-default)] bg-[var(--surface-primary)] hover:border-[var(--color-gray-300)] hover:bg-[var(--surface-secondary)]'
          )}
        >
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border', v.color)}>
            <v.icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className={cn(
              'text-sm font-semibold truncate',
              value === v.id ? 'text-brand-600' : 'text-[var(--text-primary)]'
            )}>
              {v.label}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] truncate">{v.description}</p>
          </div>
          {value === v.id && (
            <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 ml-auto mt-0.5">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </motion.button>
      ))}
    </div>
  )
}
