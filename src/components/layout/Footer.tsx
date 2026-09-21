import { useTranslation } from 'react-i18next'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { Logo } from '@/components/brand/Logo'
import { Eyebrow } from '@/components/cinematic/Eyebrow'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getEquipmentCategories } from '@/lib/data'
import { getWhatsAppUrl, WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp'
import { CONTACT } from '@/lib/contact'

interface FooterOffice {
  name: string
  lines: string[]
}

export function Footer() {
  const { t } = useTranslation('footer')
  const { locale } = useLocale()
  const year = new Date().getFullYear()
  const offices = t('address.offices', { returnObjects: true }) as FooterOffice[]

  const footerColumns = [
    {
      title: t('columns.company'),
      links: [
        { label: t('links.about'), to: '/about' },
        { label: t('links.industries'), to: '/industries' },
        { label: t('links.careers'), to: '/careers' },
        { label: t('links.blog'), to: '/blog' },
        { label: t('links.contact'), to: '/contact' },
      ],
    },
    {
      title: t('columns.services'),
      links: [
        { label: t('links.allServices'), to: '/services' },
        { label: t('links.solutions'), to: '/solutions' },
        { label: t('links.equipmentRental'), to: '/equipment' },
        { label: t('links.portfolio'), to: '/portfolio' },
        { label: t('links.requestQuote'), to: '/quote' },
      ],
    },
    {
      title: t('columns.equipment'),
      links: getEquipmentCategories(locale)
        .slice(0, 5)
        .map((c) => ({ label: c.name, to: `/equipment/${c.slug}` })),
    },
    {
      title: t('columns.support'),
      links: [
        { label: t('links.faq'), to: '/faq' },
        { label: t('links.privacyPolicy'), to: '/privacy-policy' },
        { label: t('links.termsConditions'), to: '/terms-conditions' },
      ],
    },
  ]

  return (
    <footer className="on-dark bg-ink text-white">
      <div className="container-page py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_2fr] lg:gap-24">
          <div>
            <Logo tone="white" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/65">{t('tagline')}</p>
            <address className="mt-10 space-y-6 text-sm not-italic text-white/65">
              <div className="space-y-5">
                {offices.map((office) => (
                  <div key={office.name}>
                    <p className="eyebrow mb-2 text-white/85">{office.name}</p>
                    {office.lines.map((line) => (
                      <p key={line} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <p>
                  <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="transition-colors hover:text-white">
                    {CONTACT.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-white">
                    {CONTACT.email}
                  </a>
                </p>
                <p>
                  <a
                    href={getWhatsAppUrl("Hi TOTAL MEDIA, I'd like to know more about your services.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    {t('whatsappPrefix')}
                    {WHATSAPP_DISPLAY_NUMBER}
                  </a>
                </p>
              </div>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <Eyebrow tone="dark" className="mb-5 border-b border-white/10 pb-5 !text-white/60">
                  {col.title}
                </Eyebrow>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <LocalizedLink to={link.to} className="text-sm text-white/75 transition-colors hover:text-white">
                        {link.label}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-7 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>{t('copyright', { year })}</p>
          <p>{t('bottomTagline')}</p>
        </div>
      </div>
    </footer>
  )
}
