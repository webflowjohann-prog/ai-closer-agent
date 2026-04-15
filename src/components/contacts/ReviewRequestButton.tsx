import { useState } from 'react'
import { Star, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReviewRequests } from '@/hooks/useReviewRequests'

interface ReviewRequestButtonProps {
  contactId: string
  conversationId?: string
}

export function ReviewRequestButton({ contactId, conversationId }: ReviewRequestButtonProps) {
  const { sendRequest } = useReviewRequests()
  const [platform, setPlatform] = useState<'google' | 'trustpilot'>('google')
  const [showPicker, setShowPicker] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    const urls = {
      google: 'https://g.page/r/example-review',
      trustpilot: 'https://fr.trustpilot.com/review/example',
    }
    await sendRequest.mutateAsync({
      contact_id: contactId,
      conversation_id: conversationId,
      platform,
      review_url: urls[platform],
    })
    setSent(true)
    setShowPicker(false)
    setTimeout(() => setSent(false), 5000)
  }

  if (sent) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 py-1.5">
        <Check className="w-3.5 h-3.5" />
        Demande d'avis envoyée
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex gap-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50 text-xs"
          onClick={handleSend}
          disabled={sendRequest.isPending}
        >
          <Star className="w-3 h-3" />
          {sendRequest.isPending ? 'Envoi...' : 'Demander un avis'}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-amber-600 border-amber-200 hover:bg-amber-50"
          onClick={() => setShowPicker(!showPicker)}
        >
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>

      {showPicker && (
        <div className="absolute bottom-full mb-1 left-0 right-0 bg-[var(--surface-elevated)] border border-[var(--border-default)] rounded-lg shadow-lg p-1 z-10">
          {(['google', 'trustpilot'] as const).map((p) => (
            <button
              key={p}
              onClick={() => { setPlatform(p); setShowPicker(false) }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                platform === p ? 'bg-brand-50 text-brand-600' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]'
              }`}
            >
              {p === 'google' ? 'Google Reviews' : 'TrustPilot'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
