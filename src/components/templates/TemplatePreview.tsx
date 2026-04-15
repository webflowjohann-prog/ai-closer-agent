import { MessageSquare } from 'lucide-react'

const SAMPLE_VALUES: Record<string, string> = {
  '{{first_name}}': 'Marie',
  '{{last_name}}': 'Dupont',
  '{{company_name}}': 'Votre entreprise',
  '{{personal_context}}': 'intéressée par nos services',
  '{{agent_name}}': 'Alex',
}

interface TemplatePreviewProps {
  content: string
  channelType?: string
}

export function TemplatePreview({ content, channelType }: TemplatePreviewProps) {
  const preview = content.replace(/\{\{(\w+)\}\}/g, (match) => SAMPLE_VALUES[match] || match)
  const charCount = content.length
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const isOverLimit = channelType === 'whatsapp' && charCount > 1024

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        <span className="text-xs font-medium text-[var(--text-secondary)]">Aperçu</span>
        {channelType && (
          <span className="text-[10px] text-[var(--text-tertiary)]">({channelType})</span>
        )}
      </div>

      <div className="bg-[var(--surface-secondary)] rounded-xl p-3 min-h-[80px]">
        {preview ? (
          <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{preview}</p>
        ) : (
          <p className="text-xs text-[var(--text-tertiary)] italic">Commencez à écrire pour voir l'aperçu...</p>
        )}
      </div>

      <div className={`flex items-center justify-between text-[10px] ${isOverLimit ? 'text-red-500' : 'text-[var(--text-tertiary)]'}`}>
        <span>{wordCount} mot{wordCount > 1 ? 's' : ''}</span>
        <span className={isOverLimit ? 'font-semibold' : ''}>
          {charCount} caractères{channelType === 'whatsapp' ? ' / 1024' : ''}
          {isOverLimit && ' ⚠ Limite WhatsApp dépassée'}
        </span>
      </div>
    </div>
  )
}
