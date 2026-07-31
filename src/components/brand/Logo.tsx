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

/** Brand slogan shown under the wordmark — fixed, not translated (identity, not content). */
const TAGLINE = 'つなぐ・創る・伝える'

/** Full lockup: mark + wordmark + JP tagline. Use tone="white" on dark/navy backgrounds. */
export function Logo({ className, tone = 'navy', markOnly = false }: LogoProps) {
  const textColor = tone === 'navy' ? 'text-navy' : 'text-white'
  const taglineColor = tone === 'navy' ? 'text-signal' : 'text-white/70'

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark tone={tone} className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'flex items-baseline gap-1.5 font-sans tracking-tight',
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
          <span className={cn('mt-0.5 text-[10px] tracking-[0.08em] sm:text-[11px]', taglineColor)}>
            {TAGLINE}
          </span>
        </span>
      )}
    </span>
  )
}
