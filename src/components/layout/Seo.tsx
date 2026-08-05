import { Helmet } from 'react-helmet-async'
import { useLocale } from '@/lib/locale/LocaleContext'
import { useHreflangLinks } from '@/lib/seo/useHreflangLinks'

const SITE_NAME = 'TOTAL MEDIA'
const SITE_URL = 'https://totalmedia.jp'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`

const OG_LOCALE: Record<'ja' | 'en', string> = { ja: 'ja_JP', en: 'en_US' }

/** Same shape PageHero's breadcrumbs prop uses — pages pass one array to
 * both, so the visible trail and the BreadcrumbList JSON-LD can never
 * drift apart. The last item (no `to`) resolves to the current page's own
 * `path`. */
export interface SeoBreadcrumbItem {
  label: string
  to?: string
}

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string[]
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  breadcrumbs?: SeoBreadcrumbItem[]
  /** 'article' for blog posts — adds article: OG tags. Defaults to 'website'. */
  ogType?: 'website' | 'article'
  publishedTime?: string
  noindex?: boolean
}

export function Seo({
  title,
  description,
  path,
  image,
  keywords,
  jsonLd,
  breadcrumbs,
  ogType = 'website',
  publishedTime,
  noindex,
}: SeoProps) {
  // `path` is always the canonical, unprefixed form (e.g. "/about") —
  // callers never pass the `/en` prefix themselves. `isLocalized` is false
  // on reserved (auth/dashboard/admin) routes, which have no ja/en variant.
  const { locale, isLocalized, buildPath } = useLocale()
  const url = `${SITE_URL}${isLocalized ? buildPath(path, locale) : path}`
  const ogImage = image ?? DEFAULT_OG_IMAGE
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const otherLocale = locale === 'ja' ? 'en' : 'ja'

  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: `${SITE_URL}${isLocalized ? buildPath(item.to ?? path, locale) : (item.to ?? path)}`,
        })),
      }
    : null

  const schemas = [
    ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ]

  useHreflangLinks(
    isLocalized
      ? [
          { hreflang: 'ja', href: `${SITE_URL}${buildPath(path, 'ja')}` },
          { hreflang: 'en', href: `${SITE_URL}${buildPath(path, 'en')}` },
          { hreflang: 'x-default', href: `${SITE_URL}${buildPath(path, 'ja')}` },
        ]
      : [],
  )

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      {isLocalized && <meta property="og:locale" content={OG_LOCALE[locale]} />}
      {isLocalized && <meta property="og:locale:alternate" content={OG_LOCALE[otherLocale]} />}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

export { SITE_NAME, SITE_URL }
