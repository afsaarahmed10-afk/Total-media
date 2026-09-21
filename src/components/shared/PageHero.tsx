import type { ReactNode } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/shared/Breadcrumbs'
import { Display } from '@/components/cinematic/Display'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  /** Kept for API compatibility with the pre-Cinematic hero; the generated
   * pattern art it seeded has been retired. */
  visualSeed?: string
  /** Real photo shown full-bleed behind the title (with a legibility scrim). */
  image?: string | null
  /** Trailing substring of `title` set in the accent face. */
  accent?: string
  children?: ReactNode
  className?: string
}

/** Cinematic page opener: ink field (or a real photo), hairline column
 * grid, breadcrumb top-left, headline anchored to the bottom. Sits flush
 * under the ink header so the two read as one surface. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  image,
  accent,
  children,
  className,
}: PageHeroProps) {
  return (
    <section className={cn('on-dark relative isolate overflow-hidden bg-ink text-white', className)}>
      {image ? (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 60% 80% at 92% 0%, rgba(14,59,183,0.42), transparent 70%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '100% 100%, calc(100% / 6) 100%',
            }}
          />
        </>
      )}

      <div className="container-page relative flex min-h-[46vh] flex-col pb-14 pt-8 lg:min-h-[54vh] lg:pb-20 lg:pt-10">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-16 lg:mb-24" />}
        <div className="mt-auto">
          {eyebrow && <Eyebrow tone="dark" className="mb-6">{eyebrow}</Eyebrow>}
          <Display as="h1" size="lg" tone="dark" accent={accent} className="max-w-5xl">
            {title}
          </Display>
          {description && (
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>
      <div className="border-b border-white/10" />
    </section>
  )
}
