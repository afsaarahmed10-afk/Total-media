import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { cn } from '@/lib/utils'

interface ContentVisualProps {
  /** Real uploaded photo URL, if one exists. Falsy falls back to AbstractVisual. */
  imageUrl?: string | null
  seed: string
  alt: string
  className?: string
  variant?: 'diagonal' | 'facet' | 'grid' | 'radial' | 'bars' | 'arcs'
}

/** Drop-in replacement for a bare `<AbstractVisual>` wherever the visual
 * stands in for real content photography (equipment, portfolio, blog,
 * services, solutions) — renders the actual photo once an admin uploads
 * one, and keeps the generated placeholder otherwise. Purely decorative
 * AbstractVisual usages (PageHero backdrop, CtaBand, 404/error states)
 * don't go through this — they never have a photo to fall back from. */
export function ContentVisual({ imageUrl, seed, alt, className, variant }: ContentVisualProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={cn('h-full w-full object-cover', className)}
        loading="lazy"
      />
    )
  }
  return <AbstractVisual seed={seed} className={className} variant={variant} />
}
