import type { ReactNode } from 'react'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/shared/Breadcrumbs'
import { cn } from '@/lib/utils'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  visualSeed?: string
  children?: ReactNode
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  visualSeed,
  children,
  className,
}: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden bg-navy text-white', className)}>
      <div className="absolute inset-0 opacity-40">
        <AbstractVisual seed={visualSeed ?? title} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />

      <div className="container-page relative py-16 lg:py-24">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-signal">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{description}</p>
        )}
        {children}
      </div>
    </section>
  )
}
