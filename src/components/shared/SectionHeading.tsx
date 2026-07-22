import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center'
  const isDark = tone === 'dark'

  return (
    <div
      className={cn(
        'max-w-2xl',
        isCenter && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl',
          isDark ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-4 text-lg leading-relaxed',
            isDark ? 'text-white/70' : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
