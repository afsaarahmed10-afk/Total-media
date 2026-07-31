import { cn } from '@/lib/utils'

type LogoTone = 'navy' | 'white'

interface LogoMarkProps {
  className?: string
  tone?: LogoTone
}

/** Standalone glyph: the interlocking four-loop "signal knot" mark. */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <img
      src="/images/logo-mark.webp"
      alt=""
      className={cn('h-8 w-8 shrink-0 object-contain', className)}
    />
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
