import { Link } from 'react-router-dom'
import { Logo } from '@/components/brand/Logo'
import { getEquipmentCategories } from '@/lib/data'

// Contact details below are placeholders — replace with the real
// registered address, phone, and inbox before launch.
const CONTACT = {
  addressLines: ['TOTAL MEDIA Inc.', 'Shibuya-ku, Tokyo 150-0002, Japan'],
  phone: '+81 3-4567-8901',
  email: 'hello@totalmedia.co.jp',
}

function getFooterColumns() {
  return [
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Industries', to: '/industries' },
        { label: 'Careers', to: '/careers' },
        { label: 'Blog', to: '/blog' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'All Services', to: '/services' },
        { label: 'Solutions', to: '/solutions' },
        { label: 'Equipment Rental', to: '/equipment' },
        { label: 'Portfolio', to: '/portfolio' },
        { label: 'Request a Quote', to: '/quote' },
      ],
    },
    {
      title: 'Equipment',
      links: getEquipmentCategories()
        .slice(0, 5)
        .map((c) => ({ label: c.name, to: `/equipment/${c.slug}` })),
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', to: '/faq' },
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms & Conditions', to: '/terms-conditions' },
      ],
    },
  ]
}

export function Footer() {
  const year = new Date().getFullYear()
  const footerColumns = getFooterColumns()

  return (
    <footer className="bg-navy text-white">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Logo tone="white" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Full-service event production and technical solutions for
              organizations operating across Japan.
            </p>
            <address className="mt-6 space-y-1 text-sm not-italic text-white/70">
              {CONTACT.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
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
                      <Link to={link.to} className="text-sm text-white/80 hover:text-white">
                        {link.label}
                      </Link>
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
          <p>© {year} TOTAL MEDIA Inc. All rights reserved.</p>
          <p>Creating Exceptional Events Across Japan.</p>
        </div>
      </div>
    </footer>
  )
}
