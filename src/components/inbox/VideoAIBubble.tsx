import { Video, Play } from 'lucide-react'

interface VideoAIBubbleProps {
  script?: string
  duration?: number
  isOutbound?: boolean
}

export function VideoAIBubble({ script, duration, isOutbound }: VideoAIBubbleProps) {
  return (
    <div className="max-w-56 rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-sm">
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-purple-600 to-brand-500 relative flex items-center justify-center">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
          <Play className="w-4 h-4 text-white translate-x-0.5" />
        </div>
        {duration && (
          <span className="absolute bottom-1.5 right-2 text-white text-[9px] font-mono bg-black/30 px-1 rounded">
            {duration}s
          </span>
        )}
      </div>
      {/* Footer */}
      <div className="bg-[var(--surface-primary)] px-3 py-2 flex items-center gap-2">
        <Video className="w-3 h-3 text-purple-500 flex-shrink-0" />
        <p className="text-[11px] text-[var(--text-secondary)] truncate">
          {script ? script.slice(0, 40) + '...' : 'Message vidéo personnalisé'}
        </p>
      </div>
    </div>
  )
}
