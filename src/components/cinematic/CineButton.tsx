import type { ComponentProps, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { cn } from '@/lib/utils'

type Variant = 'solid' | 'outline' | 'white' | 'link'
type Tone = 'light' | 'dark'

interface CommonProps {
  variant?: Variant
  /** Background the button sits on — drives outline/link colours. */
  tone?: Tone
  arrow?: boolean
  className?: string
  children: ReactNode
}

type LinkButtonProps = CommonProps & { to: string } & Omit<ComponentProps<typeof LocalizedLink>, 'to' | 'className' | 'children'>
type ExternalButtonProps = CommonProps & { href: string } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>

const BASE =
  'group/btn inline-flex min-h-12 items-center justify-center gap-3 px-6 text-[0.75rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-300 outline-none'

function classes(variant: Variant, tone: Tone) {
  switch (variant) {
    case 'solid':
      return 'bg-blue text-white hover:bg-blue-deep'
    case 'white':
      return 'bg-white text-ink hover:bg-blue-tint'
    case 'outline':
      return tone === 'dark'
        ? 'border border-white/35 text-white hover:border-white hover:bg-white hover:text-ink'
        : 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-white'
    case 'link':
      return cn(
        'min-h-0 px-0 py-1 border-b',
        tone === 'dark'
          ? 'border-white/40 text-white hover:border-white'
          : 'border-ink/30 text-ink hover:border-ink',
      )
  }
}

/** Square, uppercase, hairline-edged button with a ↗ that nudges on hover.
 * Renders a router link when given `to`, a plain anchor for `href`. */
export function CineButton(props: LinkButtonProps | ExternalButtonProps) {
  const { variant = 'solid', tone = 'light', arrow = true, className, children } = props
  const cls = cn(BASE, classes(variant, tone), className)
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  )

  if ('to' in props) {
    const { to, variant: _v, tone: _t, arrow: _a, className: _c, children: _ch, ...rest } = props
    return (
      <LocalizedLink to={to} className={cls} {...rest}>
        {inner}
      </LocalizedLink>
    )
  }
  const { href, variant: _v, tone: _t, arrow: _a, className: _c, children: _ch, ...rest } = props
  return (
    <a href={href} className={cls} {...rest}>
      {inner}
    </a>
  )
}
