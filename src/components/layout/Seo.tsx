import { Helmet } from 'react-helmet-async'
import { useLocale } from '@/lib/locale/LocaleContext'

const SITE_NAME = 'TOTAL MEDIA'
const SITE_URL = 'https://www.totalmedia.co.jp'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`

interface BreadcrumbItem {
  name: string
  path: string
}

interface SeoProps {
  title: string
  description: string
  path: string
  image?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  breadcrumbs?: BreadcrumbItem[]
  noindex?: boolean
}

export function Seo({ title, description, path, image, jsonLd, breadcrumbs, noindex }: SeoProps) {
  // `path` is always the canonical, unprefixed form (e.g. "/about") —
  // callers never pass the `/en` prefix themselves. `isLocalized` is false
  // on reserved (auth/dashboard/admin) routes, which have no ja/en variant.
  const { locale, isLocalized, buildPath } = useLocale()
  const url = `${SITE_URL}${isLocalized ? buildPath(path, locale) : path}`
  const ogImage = image ?? DEFAULT_OG_IMAGE
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${SITE_URL}${isLocalized ? buildPath(item.path, locale) : item.path}`,
        })),
      }
    : null

  const schemas = [
    ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ]

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {isLocalized && (
        <>
          <link rel="alternate" hrefLang="ja" href={`${SITE_URL}${buildPath(path, 'ja')}`} />
          <link rel="alternate" hrefLang="en" href={`${SITE_URL}${buildPath(path, 'en')}`} />
          <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${buildPath(path, 'ja')}`} />
        </>
      )}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

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
