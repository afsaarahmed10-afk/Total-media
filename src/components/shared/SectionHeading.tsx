import { Display } from '@/components/cinematic/Display'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  /** Optional "01" style index before the eyebrow label. */
  index?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  /** Trailing substring of `title` set in the accent face. */
  accent?: string
  className?: string
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = 'left',
  tone = 'light',
  accent,
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center'
  const isDark = tone === 'dark'

  return (
    <div className={cn('max-w-3xl', isCenter && 'mx-auto text-center', className)}>
      {eyebrow && (
        <Eyebrow tone={tone} index={index} className="mb-5">
          {eyebrow}
        </Eyebrow>
      )}
      <Display as="h2" size="sec" tone={tone} accent={accent}>
        {title}
      </Display>
      {description && (
        <p
          className={cn(
            'mt-6 text-base leading-relaxed lg:text-lg',
            isDark ? 'text-white/65' : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
