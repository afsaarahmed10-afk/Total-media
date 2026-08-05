import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SITE_NAME, SITE_URL } from '@/components/layout/Seo'
import { useLocale } from '@/lib/locale/LocaleContext'
import { WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp'

interface FooterOffice {
  name: string
  lines: string[]
}

/** Organization + WebSite JSON-LD, present on every public page (mounted
 * once in Layout) rather than repeated per-page — these describe the
 * business itself, not the current page. The Tokyo office (first entry in
 * footer.json) is used as the structured-data address since schema.org's
 * LocalBusiness/PostalAddress expects one canonical address; the Ibaraki
 * office stays visible-only (Footer, Contact page) rather than modeled as
 * a second entity. */
export function SiteSchema() {
  const { t } = useTranslation('footer')
  const { locale } = useLocale()
  const offices = t('address.offices', { returnObjects: true }) as FooterOffice[]
  const hq = offices[0]

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og-default.png`,
    description: t('tagline'),
    telephone: '+81-80-5500-2929',
    email: 'uno@nippon-group.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: hq.lines[0],
      addressLocality: hq.lines[1] ?? hq.lines[0],
      addressCountry: 'JP',
    },
    areaServed: 'JP',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+81-80-5500-2929',
      email: 'uno@nippon-group.com',
      areaServed: 'JP',
      availableLanguage: ['ja', 'en'],
    },
    sameAs: [`https://wa.me/${WHATSAPP_DISPLAY_NUMBER.replace(/[^\d]/g, '')}`],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
    </Helmet>
  )
}
