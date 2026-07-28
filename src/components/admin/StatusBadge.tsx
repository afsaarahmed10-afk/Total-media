import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  label: string
  className?: string
}

/** Renders a status pill. Callers pass the bg/text classes for the specific
 * status (see the STATUS_STYLES maps in each inbox page) so this stays a
 * dumb presentational piece. */
export function StatusBadge({ label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        className ?? 'bg-mist text-muted-foreground',
      )}
    >
      {label}
    </span>
  )
}
