import { Link, NavLink, type LinkProps, type NavLinkProps } from 'react-router-dom'
import { useLocale } from '@/lib/locale/LocaleContext'

/** Drop-in replacement for react-router's `<Link>` — callers keep authoring
 * canonical, unprefixed `to` paths (e.g. `to="/about"`); the `/en` prefix is
 * added automatically based on the current locale. */
export function LocalizedLink({ to, ...props }: LinkProps) {
  const { localizePath } = useLocale()
  const resolvedTo = typeof to === 'string' ? localizePath(to) : to
  return <Link to={resolvedTo} {...props} />
}

/** Same idea as `LocalizedLink`, for react-router's `<NavLink>` (used where
 * active-route styling is needed, e.g. the header nav). */
export function LocalizedNavLink({ to, ...props }: NavLinkProps) {
  const { localizePath } = useLocale()
  const resolvedTo = typeof to === 'string' ? localizePath(to) : to
  return <NavLink to={resolvedTo} {...props} />
}
