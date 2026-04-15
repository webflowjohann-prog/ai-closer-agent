import { Euro, ExternalLink, Clock, CheckCircle } from 'lucide-react'
import type { PaymentLink } from '@/types/database'

interface PaymentLinkBubbleProps {
  link: PaymentLink
}

const statusConfig = {
  pending: { icon: Clock, label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  paid: { icon: CheckCircle, label: 'Payé', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  expired: { icon: Clock, label: 'Expiré', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
  cancelled: { icon: Clock, label: 'Annulé', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
}

export function PaymentLinkBubble({ link }: PaymentLinkBubbleProps) {
  const config = statusConfig[link.status] || statusConfig.pending
  const StatusIcon = config.icon

  return (
    <div className={`max-w-64 rounded-2xl border ${config.border} ${config.bg} p-3.5 space-y-2`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
          <Euro className="w-3.5 h-3.5 text-white" />
        </div>
        <p className="text-xs font-semibold text-[var(--text-primary)]">Demande de paiement</p>
      </div>

      <div>
        <p className="text-xs text-[var(--text-secondary)]">{link.title}</p>
        <p className="text-xl font-bold text-[var(--text-primary)] font-mono mt-0.5">
          {(link.amount / 100).toLocaleString('fr-FR', { style: 'currency', currency: link.currency.toUpperCase() })}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1 text-[10px] font-medium ${config.color}`}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </div>
        {link.stripe_payment_link_url && link.status === 'pending' && (
          <a
            href={link.stripe_payment_link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-brand-500 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Payer
          </a>
        )}
      </div>
    </div>
  )
}
