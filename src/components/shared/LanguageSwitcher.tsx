import { Link, useLocation } from 'react-router-dom'
import { useLocale, type Locale } from '@/lib/locale/LocaleContext'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/** Strips a leading `/en` prefix so the current path can be rebuilt for the
 * other locale — mirrors the inverse of `buildLocalizedPath`. */
function toCanonicalPath(pathname: string): string {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}

export function LanguageSwitcher({
  className,
  tone = 'light',
}: {
  className?: string
  /** `dark` for use on ink surfaces (header, menu overlay). */
  tone?: 'light' | 'dark'
}) {
  const { locale, buildPath, isLocalized } = useLocale()
  const location = useLocation()
  const { t } = useTranslation('common')

  if (!isLocalized) return null

  const canonicalPath = toCanonicalPath(location.pathname)
  const options: { locale: Locale; label: string }[] = [
    { locale: 'ja', label: t('languageJa') },
    { locale: 'en', label: t('languageEn') },
  ]
  const dark = tone === 'dark'

  return (
    <div
      className={cn('flex shrink-0 items-center gap-1 whitespace-nowrap text-sm', className)}
      aria-label={t('language')}
    >
      {options.map((opt, i) => (
        <span key={opt.locale} className="flex items-center gap-1">
          {i > 0 && <span className={dark ? 'text-white/60' : 'text-muted-foreground'}>/</span>}
          {opt.locale === locale ? (
            <span aria-current="true" className={cn('font-semibold', dark ? 'text-white' : 'text-navy')}>
              {opt.label}
            </span>
          ) : (
            // Plain Link, not LocalizedLink: buildPath already resolves the
            // FULL path for the target locale, so re-running it through
            // localizePath (which prefixes for the CURRENT locale) would be
            // wrong when switching away from /en.
            <Link
              to={buildPath(canonicalPath, opt.locale)}
              lang={opt.locale}
              className={cn(
                'transition-colors',
                dark ? 'text-white/65 hover:text-white' : 'text-muted-foreground hover:text-signal',
              )}
              onClick={() => trackEvent('language_switch', { to_locale: opt.locale })}
            >
              {opt.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
