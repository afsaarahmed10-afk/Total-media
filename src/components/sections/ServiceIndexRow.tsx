import { ArrowUpRight } from 'lucide-react'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { Reveal } from '@/components/shared/Reveal'
import type { Service } from '@/content/types'

interface ServiceIndexRowProps {
  service: Service
  /** 1-based position, rendered as "01". */
  index: number
  /** Stagger for the scroll reveal. */
  delay?: number
}

/** One numbered hairline row: the template's "01  Event Management  ↗".
 * On hover (pointer devices) the name nudges right, the description fades
 * and a photo preview slides in from the right edge. On touch it's simply
 * a large tap target. Renders an `<li>` — put it inside an `<ol>`. Used on
 * the homepage and the services index. */
export function ServiceIndexRow({ service, index, delay = 0 }: ServiceIndexRowProps) {
  return (
    <li className="border-b border-line">
      <Reveal delay={delay}>
        <LocalizedLink
          to={`/services/${service.slug}`}
          className="group relative grid min-h-[5.5rem] grid-cols-[2.25rem_1fr_auto] items-center gap-x-4 py-6 lg:grid-cols-[4.5rem_1.1fr_1fr_3rem] lg:gap-x-8 lg:py-9"
        >
          <span className="eyebrow tnum text-blue">{String(index).padStart(2, '0')}</span>
          <span className="text-[clamp(1.4rem,1rem+1.5vw,2.5rem)] font-normal leading-tight tracking-[-0.025em] transition-transform duration-500 ease-out group-hover:translate-x-2 lg:group-hover:translate-x-4">
            {service.name}
          </span>
          <span className="hidden max-w-md text-sm leading-relaxed text-muted-foreground transition-opacity duration-300 group-hover:opacity-0 lg:block">
            {service.shortDescription}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 justify-self-end text-ink transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue lg:size-6"
          />

          {service.imageUrl && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-16 top-1/2 z-10 hidden aspect-[4/3] w-64 -translate-y-1/2 translate-x-6 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100 xl:block"
            >
              <img src={service.imageUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </span>
          )}
        </LocalizedLink>
      </Reveal>
    </li>
  )
}
