import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { cn } from '@/lib/utils'

interface MediaFrameProps {
  src?: string | null
  alt: string
  /** CSS aspect-ratio value, e.g. "16 / 9", "4 / 5". */
  ratio?: string
  /** Fallback seed for the generated placeholder when there's no photo. */
  seed?: string
  /** Above-the-fold image: eager + high fetch priority, no reveal delay. */
  priority?: boolean
  /** Clip-path wipe + settle-scale when scrolled into view. */
  reveal?: boolean
  /** Slow zoom when an ancestor with `group` is hovered. */
  hoverZoom?: boolean
  className?: string
  imgClassName?: string
  children?: ReactNode
}

const EASE = [0.22, 1, 0.36, 1] as const

/** The site's one image primitive: fixed aspect ratio (so no layout
 * shift), lazy by default, optional reveal + hover zoom. Overlays go in
 * `children`. */
export function MediaFrame({
  src,
  alt,
  ratio = '16 / 9',
  seed,
  priority = false,
  reveal = false,
  hoverZoom = false,
  className,
  imgClassName,
  children,
}: MediaFrameProps) {
  const reduce = useReducedMotion()
  const doReveal = reveal && !reduce && !priority

  const media = src ? (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      className={cn(
        'h-full w-full object-cover',
        hoverZoom && 'transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]',
        imgClassName,
      )}
    />
  ) : (
    <AbstractVisual seed={seed ?? alt} className={imgClassName} />
  )

  return (
    <motion.div
      className={cn('relative overflow-hidden bg-ink-2', className)}
      style={{ aspectRatio: ratio }}
      {...(doReveal
        ? {
            initial: { clipPath: 'inset(0 0 100% 0)' },
            whileInView: { clipPath: 'inset(0 0 0% 0)' },
            viewport: { once: true, margin: '0px 0px -10% 0px' },
            transition: { duration: 1.1, ease: EASE },
          }
        : {})}
    >
      {media}
      {children}
    </motion.div>
  )
}
