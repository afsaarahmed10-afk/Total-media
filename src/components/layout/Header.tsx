import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/components/brand/Logo'
import { CineButton } from '@/components/cinematic/CineButton'
import { LocalizedLink, LocalizedNavLink } from '@/components/shared/LocalizedLink'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { useLocalizedNavigate } from '@/lib/locale/useLocalizedNavigate'
import { useLocale } from '@/lib/locale/LocaleContext'
import { getServices, getEquipmentCategories } from '@/lib/data'
import { useAuth } from '@/lib/auth/AuthContext'
import { trackEvent } from '@/lib/analytics'
import { CONTACT } from '@/lib/contact'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

export function Header() {
  const { t } = useTranslation(['header', 'common'])
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // The homepage hero is a full-bleed photograph, so the header floats over
  // it (transparent, hairline underneath) and turns solid on scroll. Every
  // other page opens with a dark hero of its own, so the header is solid ink
  // there and the two read as one surface.
  const isHome = /^\/(en\/?)?$/.test(location.pathname)
  const solid = !isHome || scrolled || menuOpen

  const primaryLinks = [
    { label: t('servicesMenu'), to: '/services' },
    { label: t('nav.portfolio'), to: '/portfolio' },
    { label: t('equipmentMenu'), to: '/equipment' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.contact'), to: '/contact', track: 'contact_click' as const },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'on-dark z-50 w-full border-b text-white transition-colors duration-300',
        isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0',
        solid ? 'border-white/10 bg-ink' : 'border-white/15 bg-transparent',
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-blue focus:px-4 focus:py-3 focus:text-white"
      >
        {t('skipToContent')}
      </a>

      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <LocalizedLink to="/" aria-label={t('homeAriaLabel')} className="shrink-0">
          <Logo tone="white" />
        </LocalizedLink>

        <nav className="hidden xl:block" aria-label="Primary">
          <ul className="flex items-center gap-9">
            {primaryLinks.map((link) => (
              <li key={link.to}>
                <LocalizedNavLink
                  to={link.to}
                  onClick={() => link.track && trackEvent(link.track, { location: 'header' })}
                  className={({ isActive }) =>
                    cn(
                      'relative inline-block py-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-colors',
                      'after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:bg-white after:transition-transform after:duration-300',
                      isActive
                        ? 'text-white after:scale-x-100'
                        : 'text-white/70 after:scale-x-0 hover:text-white hover:after:scale-x-100',
                    )
                  }
                >
                  {link.label}
                </LocalizedNavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 lg:gap-6">
          <LanguageSwitcher tone="dark" className="hidden sm:flex" />
          <div className="hidden md:block">
            <CineButton
              to="/quote"
              className="min-h-10 px-5"
              onClick={() => trackEvent('request_quote_click', { location: 'header_desktop' })}
            >
              {t('requestQuote')}
            </CineButton>
          </div>
          <MenuOverlay open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </div>
    </header>
  )
}

function MenuOverlay({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation(['header', 'common'])
  const { locale } = useLocale()
  const reduce = useReducedMotion()
  const navigate = useLocalizedNavigate()
  const { user, profile, signOut } = useAuth()

  const services = getServices(locale)
  const equipmentCategories = getEquipmentCategories(locale)
  const eventServices = services.filter((s) => s.category === 'event-type')
  const technicalServices = services.filter((s) => s.category === 'technical')

  const bigLinks = [
    { label: t('servicesMenu'), to: '/services' },
    { label: t('nav.portfolio'), to: '/portfolio' },
    { label: t('equipmentMenu'), to: '/equipment' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.contact'), to: '/contact' },
  ]
  const moreLinks = [
    { label: t('nav.solutions'), to: '/solutions' },
    { label: t('nav.industries'), to: '/industries' },
    { label: t('nav.blog'), to: '/blog' },
    { label: t('nav.faq'), to: '/faq' },
    { label: t('nav.careers'), to: '/careers' },
  ]

  async function handleSignOut() {
    await signOut()
    toast.success(t('logoutSuccess'))
    onOpenChange(false)
    navigate('/')
  }

  const close = () => onOpenChange(false)
  const dur = reduce ? 0 : 0.6

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group/menu flex h-10 items-center gap-3 border border-white/30 px-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
        >
          <span>{t('menu')}</span>
          <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current transition-[width] duration-300 group-hover/menu:w-2/3" />
          </span>
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="cinematic on-dark fixed inset-0 z-[60] overflow-y-auto bg-ink text-white"
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                exit={{ clipPath: 'inset(0 0 100% 0)' }}
                transition={{ duration: dur, ease: EASE }}
              >
                <Dialog.Title className="sr-only">{t('menuTitle')}</Dialog.Title>

                <div className="border-b border-white/10">
                  <div className="container-page flex h-16 items-center justify-between lg:h-20">
                    <LocalizedLink to="/" onClick={close} aria-label={t('homeAriaLabel')}>
                      <Logo tone="white" />
                    </LocalizedLink>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label={t('closeMenu')}
                        className="group/menu flex h-10 items-center gap-3 border border-white/30 px-4 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
                      >
                        <span>{t('buttons.close', { ns: 'common' })}</span>
                        <span aria-hidden="true" className="relative block size-4">
                          <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
                          <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
                        </span>
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                <div className="container-page grid gap-14 pb-16 pt-10 lg:grid-cols-[1.15fr_1fr] lg:gap-24 lg:pt-16">
                  <nav aria-label={t('menuTitle')}>
                    <ol className="border-t border-white/10">
                      {bigLinks.map((link, i) => (
                        <motion.li
                          key={link.to}
                          initial={reduce ? false : { opacity: 0, y: 28 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.25 + i * 0.06 }}
                          className="border-b border-white/10"
                        >
                          <LocalizedLink
                            to={link.to}
                            onClick={close}
                            className="group flex items-baseline gap-5 py-4 lg:gap-8 lg:py-6"
                          >
                            <span className="eyebrow tnum w-6 shrink-0 text-white/40">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[clamp(2rem,1rem+3.4vw,4rem)] font-medium leading-none tracking-[-0.035em] transition-colors duration-300 group-hover:text-blue-tint">
                              {link.label}
                            </span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="ml-auto size-6 shrink-0 -translate-x-2 self-center text-blue-tint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                            />
                          </LocalizedLink>
                        </motion.li>
                      ))}
                    </ol>

                    <p className="eyebrow mt-10 text-white/40">{t('menuMore')}</p>
                    <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                      {moreLinks.map((link) => (
                        <li key={link.to}>
                          <LocalizedLink
                            to={link.to}
                            onClick={close}
                            className="text-base text-white/75 transition-colors hover:text-white"
                          >
                            {link.label}
                          </LocalizedLink>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="grid content-start gap-10 sm:grid-cols-2 lg:gap-12">
                    <MenuList title={t('byEventType')} onNavigate={close}>
                      {eventServices.map((s) => ({ label: s.name, to: `/services/${s.slug}` }))}
                    </MenuList>
                    <MenuList title={t('byTechnicalDiscipline')} onNavigate={close}>
                      {technicalServices.map((s) => ({ label: s.name, to: `/services/${s.slug}` }))}
                    </MenuList>
                    <div className="sm:col-span-2">
                      <MenuList title={t('rentalCategories')} onNavigate={close} columns>
                        {equipmentCategories.map((c) => ({ label: c.name, to: `/equipment/${c.slug}` }))}
                      </MenuList>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10">
                  <div className="container-page flex flex-col gap-8 py-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1 text-sm text-white/70">
                      <p className="eyebrow mb-3 text-white/40">{t('getInTouch')}</p>
                      <a href={`mailto:${CONTACT.email}`} className="block hover:text-white">
                        {CONTACT.email}
                      </a>
                      <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="block hover:text-white">
                        {CONTACT.phone}
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                      <LanguageSwitcher tone="dark" />
                      {user ? (
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/75">
                          <span className="truncate text-white/50">{profile?.full_name || user.email}</span>
                          <LocalizedLink to="/dashboard" onClick={close} className="flex items-center gap-2 hover:text-white">
                            <LayoutDashboard className="size-4" /> {t('dashboard')}
                          </LocalizedLink>
                          <LocalizedLink
                            to="/dashboard/settings"
                            onClick={close}
                            className="flex items-center gap-2 hover:text-white"
                          >
                            <Settings className="size-4" /> {t('profileSettings')}
                          </LocalizedLink>
                          <button type="button" onClick={handleSignOut} className="flex items-center gap-2 hover:text-white">
                            <LogOut className="size-4" /> {t('signOut')}
                          </button>
                        </div>
                      ) : (
                        <LocalizedLink to="/login" onClick={close} className="text-sm text-white/75 hover:text-white">
                          {t('logIn')}
                        </LocalizedLink>
                      )}
                      <CineButton
                        to="/quote"
                        onClick={() => {
                          trackEvent('request_quote_click', { location: 'header_mobile' })
                          close()
                        }}
                      >
                        {t('requestQuote')}
                      </CineButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

function MenuList({
  title,
  children,
  onNavigate,
  columns = false,
}: {
  title: string
  children: { label: string; to: string }[]
  onNavigate: () => void
  columns?: boolean
}) {
  return (
    <div>
      <p className="eyebrow mb-4 border-b border-white/10 pb-4 text-white/40">{title}</p>
      <ul className={cn('space-y-2.5', columns && 'sm:columns-2 sm:gap-8 sm:space-y-0 [&>li]:mb-2.5')}>
        {children.map((item) => (
          <li key={item.to} className="break-inside-avoid">
            <LocalizedLink
              to={item.to}
              onClick={onNavigate}
              className="text-[0.9375rem] text-white/75 transition-colors hover:text-white"
            >
              {item.label}
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
