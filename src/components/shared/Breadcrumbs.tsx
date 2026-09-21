import { LocalizedLink } from '@/components/shared/LocalizedLink'

export interface BreadcrumbItem {
  label: string
  to?: string
}

/** Breadcrumb trail for dark heroes. Same markup contract as before
 * (nav > ol > li, aria-current on the last item) — only the look changed. */
export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em]">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2.5">
              {item.to && !isLast ? (
                <LocalizedLink to={item.to} className="text-white/60 transition-colors hover:text-white">
                  {item.label}
                </LocalizedLink>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-white/90">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-white/60">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
