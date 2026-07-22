import { cn } from '@/lib/utils'

type LogoTone = 'navy' | 'white'

interface LogoMarkProps {
  className?: string
  tone?: LogoTone
}

/**
 * Standalone glyph: four signal/equalizer bars forming an asymmetric peak,
 * with the tallest bar in the accent "signal" blue — the transmission point.
 */
export function LogoMark({ className, tone = 'navy' }: LogoMarkProps) {
  const base = tone === 'navy' ? '#0B1F3A' : '#FFFFFF'
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn('h-8 w-8', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TOTAL MEDIA"
    >
      <rect x="6" y="26" width="6" height="14" rx="1.5" fill={base} />
      <rect x="16" y="18" width="6" height="22" rx="1.5" fill={base} />
      <rect x="26" y="10" width="6" height="30" rx="1.5" fill="#2F6FEA" />
      <rect x="36" y="20" width="6" height="20" rx="1.5" fill={base} />
    </svg>
  )
}

interface LogoProps {
  className?: string
  tone?: LogoTone
  markOnly?: boolean
}

/** Full lockup: mark + wordmark. Use tone="white" on dark/navy backgrounds. */
export function Logo({ className, tone = 'navy', markOnly = false }: LogoProps) {
  const textColor = tone === 'navy' ? 'text-navy' : 'text-white'

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark tone={tone} className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
      {!markOnly && (
        <span
          className={cn(
            'flex items-baseline gap-1.5 font-sans leading-none tracking-tight',
            textColor,
          )}
        >
          <span className="text-[17px] font-extrabold tracking-tight sm:text-[19px]">
            TOTAL
          </span>
          <span className="text-[17px] font-medium tracking-[0.08em] sm:text-[19px]">
            MEDIA
          </span>
        </span>
      )}
    </span>
  )
}
