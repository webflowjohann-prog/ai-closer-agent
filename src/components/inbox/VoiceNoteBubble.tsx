import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { transcribeVoiceNote } from '@/lib/ai/voice'
import { cn } from '@/lib/utils'

interface VoiceNoteBubbleProps {
  mediaUrl: string
  isOutbound?: boolean
}

export function VoiceNoteBubble({ mediaUrl, isOutbound }: VoiceNoteBubbleProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [loadingTranscription, setLoadingTranscription] = useState(false)

  useEffect(() => {
    // Auto-transcribe on mount
    setLoadingTranscription(true)
    transcribeVoiceNote(mediaUrl)
      .then((result) => setTranscription(result.text))
      .catch(() => setTranscription(null))
      .finally(() => setLoadingTranscription(false))
  }, [mediaUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    setProgress((audio.currentTime / audio.duration) * 100)
    setDuration(audio.duration)
  }

  const handleEnded = () => {
    setPlaying(false)
    setProgress(0)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('max-w-64 space-y-1.5', isOutbound ? 'items-end' : 'items-start')}>
      {/* Audio player */}
      <div className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 rounded-2xl',
        isOutbound ? 'bg-brand-500 rounded-br-sm' : 'bg-[var(--surface-primary)] border border-[var(--border-default)] rounded-bl-sm'
      )}>
        <audio
          ref={audioRef}
          src={mediaUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={handleEnded}
        />

        <button
          onClick={togglePlay}
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
            isOutbound
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-brand-100 hover:bg-brand-200 text-brand-600'
          )}
        >
          {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 translate-x-0.5" />}
        </button>

        {/* Waveform bars (decorative) */}
        <div className="flex items-center gap-0.5 flex-1">
          {[...Array(20)].map((_, i) => {
            const heightPct = Math.sin(i * 0.8) * 0.5 + 0.5
            const filled = progress > (i / 20) * 100
            return (
              <div
                key={i}
                className={cn(
                  'w-0.5 rounded-full transition-all',
                  filled
                    ? isOutbound ? 'bg-white' : 'bg-brand-500'
                    : isOutbound ? 'bg-white/40' : 'bg-[var(--color-gray-300)]'
                )}
                style={{ height: `${8 + heightPct * 14}px` }}
              />
            )
          })}
        </div>

        <span className={cn(
          'text-[10px] font-mono flex-shrink-0',
          isOutbound ? 'text-white/80' : 'text-[var(--text-tertiary)]'
        )}>
          {playing ? formatTime(audioRef.current?.currentTime || 0) : formatTime(duration)}
        </span>

        <Volume2 className={cn('w-3 h-3 flex-shrink-0', isOutbound ? 'text-white/60' : 'text-[var(--text-tertiary)]')} />
      </div>

      {/* Transcription */}
      {loadingTranscription ? (
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[11px] text-[var(--text-tertiary)] italic px-1"
        >
          Transcription en cours...
        </motion.p>
      ) : transcription ? (
        <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed px-1">
          " {transcription} "
        </p>
      ) : null}
    </div>
  )
}
