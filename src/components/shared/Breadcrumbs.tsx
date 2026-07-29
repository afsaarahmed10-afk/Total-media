import { ChevronRight } from 'lucide-react'
import { LocalizedLink } from '@/components/shared/LocalizedLink'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.to && !isLast ? (
                <LocalizedLink to={item.to} className="text-white/60 hover:text-white">
                  {item.label}
                </LocalizedLink>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-white/90">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3.5 text-white/40" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
