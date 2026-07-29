import { Link, useLocation } from 'react-router-dom'
import { useLocale, type Locale } from '@/lib/locale/LocaleContext'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

/** Strips a leading `/en` prefix so the current path can be rebuilt for the
 * other locale — mirrors the inverse of `buildLocalizedPath`. */
function toCanonicalPath(pathname: string): string {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, buildPath, isLocalized } = useLocale()
  const location = useLocation()
  const { t } = useTranslation('common')

  if (!isLocalized) return null

  const canonicalPath = toCanonicalPath(location.pathname)
  const options: { locale: Locale; label: string }[] = [
    { locale: 'ja', label: t('languageJa') },
    { locale: 'en', label: t('languageEn') },
  ]

  return (
    <div className={cn('flex items-center gap-1 text-sm', className)} aria-label={t('language')}>
      {options.map((opt, i) => (
        <span key={opt.locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground/40">/</span>}
          {opt.locale === locale ? (
            <span className="font-semibold text-navy">{opt.label}</span>
          ) : (
            // Plain Link, not LocalizedLink: buildPath already resolves the
            // FULL path for the target locale, so re-running it through
            // localizePath (which prefixes for the CURRENT locale) would be
            // wrong when switching away from /en.
            <Link
              to={buildPath(canonicalPath, opt.locale)}
              className="text-muted-foreground hover:text-signal"
            >
              {opt.label}
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}
