import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type SectionTone = 'paper' | 'mist' | 'ink' | 'blue'

const TONE: Record<SectionTone, string> = {
  paper: 'bg-paper text-ink',
  mist: 'bg-mist text-ink',
  ink: 'bg-ink text-white on-dark',
  blue: 'bg-blue text-white on-dark',
}

interface SectionProps {
  tone?: SectionTone
  /** Vertical rhythm: `lg` is the default editorial spacing, `sm` for dense strips. */
  space?: 'sm' | 'md' | 'lg' | 'none'
  container?: boolean
  id?: string
  className?: string
  innerClassName?: string
  'aria-labelledby'?: string
  children: ReactNode
}

const SPACE = {
  none: '',
  sm: 'py-14 lg:py-20',
  md: 'py-20 lg:py-28',
  lg: 'py-24 lg:py-36',
}

/** One horizontal band of the page — sets background, text colour, focus
 * ring mode (`on-dark`) and vertical rhythm so pages never hand-roll them. */
export function Section({
  tone = 'paper',
  space = 'lg',
  container = true,
  id,
  className,
  innerClassName,
  children,
  ...aria
}: SectionProps) {
  return (
    <section id={id} className={cn('relative', TONE[tone], SPACE[space], className)} {...aria}>
      {container ? <div className={cn('container-page', innerClassName)}>{children}</div> : children}
    </section>
  )
}
