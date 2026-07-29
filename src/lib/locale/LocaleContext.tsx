import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import i18n from '@/lib/i18n/i18n'

export type Locale = 'ja' | 'en'

/** Routes outside the public marketing site (`<Layout>` tree) — auth,
 * customer dashboard, and the internal admin CMS — stay English/unprefixed
 * regardless of what precedes them in the URL. */
const RESERVED_PREFIXES = [
  '/admin',
  '/dashboard',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/auth',
]

function isReservedPath(pathname: string) {
  return RESERVED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

/** `path` is always the canonical, unprefixed form (e.g. "/about",
 * "/services/corporate-events") — callers never author the `/en` prefix
 * themselves. */
export function buildLocalizedPath(path: string, locale: Locale): string {
  if (locale !== 'en') return path
  return path === '/' ? '/en' : `/en${path}`
}

interface LocaleContextValue {
  locale: Locale
  /** False on reserved (auth/dashboard/admin) routes — those are never
   * locale-prefixed, so links there should render unprefixed regardless of
   * the current public-site locale. */
  isLocalized: boolean
  /** Prefixes `path` for the CURRENT locale. Use for nav links. */
  localizePath: (path: string) => string
  /** Prefixes `path` for an EXPLICIT locale — used by the language switcher
   * and hreflang alternates, which need the "other" language's URL. */
  buildPath: (path: string, locale: Locale) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const reserved = isReservedPath(location.pathname)
  // Reserved (auth/dashboard/admin) routes are always English, unprefixed —
  // only the public site branches ja (default, root) vs en (/en prefix).
  const locale: Locale = reserved ? 'en' : location.pathname.startsWith('/en') ? 'en' : 'ja'

  useEffect(() => {
    void i18n.changeLanguage(locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      isLocalized: !reserved,
      localizePath: (path: string) => (reserved ? path : buildLocalizedPath(path, locale)),
      buildPath: buildLocalizedPath,
    }),
    [locale, reserved],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
