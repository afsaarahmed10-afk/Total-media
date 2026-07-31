import { useTranslation } from 'react-i18next'
import { LocalizedLink } from '@/components/shared/LocalizedLink'
import { Logo } from '@/components/brand/Logo'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getEquipmentCategories } from '@/lib/data'
import { getWhatsAppUrl, WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp'

// Phone matches WHATSAPP_DISPLAY_NUMBER (lib/whatsapp.ts) — same number for
// calls and WhatsApp. Office addresses come from footer.json (translated),
// not from here, since they differ by locale.
const CONTACT = {
  phone: '+81 80-5500-2929',
  email: 'uno@nippon-group.com',
}

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
    <footer className="bg-navy text-white">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo tone="white" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{t('tagline')}</p>
            <address className="mt-6 space-y-4 text-sm not-italic text-white/70">
              <div className="space-y-3">
                {offices.map((office) => (
                  <div key={office.name}>
                    <p className="font-semibold text-white/90">{office.name}</p>
                    {office.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                ))}
              </div>
              <p>
                <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white">
                  {CONTACT.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                  {CONTACT.email}
                </a>
              </p>
              <p>
                <a
                  href={getWhatsAppUrl("Hi TOTAL MEDIA, I'd like to know more about your services.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {t('whatsappPrefix')}
                  {WHATSAPP_DISPLAY_NUMBER}
                </a>
              </p>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <LocalizedLink to={link.to} className="text-sm text-white/80 hover:text-white">
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
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>{t('copyright', { year })}</p>
          <p>{t('bottomTagline')}</p>
        </div>
      </div>
    </footer>
  )
}
