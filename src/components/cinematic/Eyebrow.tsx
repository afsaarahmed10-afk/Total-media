import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EyebrowProps {
  children: ReactNode
  /** Optional "01" style index rendered before the label. */
  index?: string
  tone?: 'light' | 'dark'
  className?: string
}

/** Tiny uppercase label — the template's "FEATURED WORK" / "OUR EXPERTISE". */
export function Eyebrow({ children, index, tone = 'light', className }: EyebrowProps) {
  return (
    <p className={cn('eyebrow', tone === 'dark' ? 'text-blue-tint' : 'text-blue', className)}>
      {index && (
        <span className={cn('tnum mr-3', tone === 'dark' ? 'text-white/50' : 'text-ink/45')}>
          {index}
        </span>
      )}
      {children}
    </p>
  )
}
