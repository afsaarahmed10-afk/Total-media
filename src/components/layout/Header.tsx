import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Menu, LayoutDashboard, Settings, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/brand/Logo'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { getServices, getEquipmentCategories } from '@/lib/data'
import { useAuth } from '@/lib/auth/AuthContext'
import { cn } from '@/lib/utils'

const primaryLinks = [
  { label: 'Solutions', to: '/solutions' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Industries', to: '/industries' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    toast.success('Logout successful')
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const services = getServices()
  const equipmentCategories = getEquipmentCategories()
  const eventServices = services.filter((s) => s.category === 'event-type')
  const technicalServices = services.filter((s) => s.category === 'technical')

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        scrolled
          ? 'border-border bg-white/90 backdrop-blur-md'
          : 'border-transparent bg-white',
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div className="container-page flex h-16 items-center justify-between lg:h-20">
        <Link to="/" aria-label="TOTAL MEDIA home">
          <Logo />
        </Link>

        <nav className="hidden lg:block" aria-label="Primary">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-[15px] font-medium text-charcoal">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[640px] grid-cols-2 gap-6 p-6">
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        By Event Type
                      </p>
                      <ul className="space-y-1">
                        {eventServices.map((s) => (
                          <li key={s.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/services/${s.slug}`}
                                className="block rounded-md px-2 py-1.5 text-sm text-charcoal hover:bg-accent hover:text-accent-foreground"
                              >
                                {s.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        By Technical Discipline
                      </p>
                      <ul className="space-y-1">
                        {technicalServices.map((s) => (
                          <li key={s.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/services/${s.slug}`}
                                className="block rounded-md px-2 py-1.5 text-sm text-charcoal hover:bg-accent hover:text-accent-foreground"
                              >
                                {s.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/services"
                          className="mt-4 block rounded-md px-2 py-1.5 text-sm font-semibold text-signal hover:bg-accent"
                        >
                          View all services →
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-[15px] font-medium text-charcoal">
                  Equipment
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[480px] p-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Rental Categories
                    </p>
                    <ul className="grid grid-cols-2 gap-1">
                      {equipmentCategories.map((c) => (
                        <li key={c.slug}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/equipment/${c.slug}`}
                              className="block rounded-md px-2 py-1.5 text-sm text-charcoal hover:bg-accent hover:text-accent-foreground"
                            >
                              {c.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/equipment"
                        className="mt-4 block rounded-md px-2 py-1.5 text-sm font-semibold text-signal hover:bg-accent"
                      >
                        View full catalogue →
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {primaryLinks.map((link) => (
                <NavigationMenuItem key={link.to}>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          'inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-[15px] font-medium text-charcoal hover:bg-accent hover:text-accent-foreground',
                          isActive && 'text-signal',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost">
            <Link to="/contact">Contact</Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <UserAvatar
                  name={profile?.full_name ?? ''}
                  email={user.email ?? ''}
                  avatarUrl={profile?.avatar_url}
                  className="size-9"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {profile?.full_name || user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="size-4" /> Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="size-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost">
              <Link to="/login">Log In</Link>
            </Button>
          )}
          <Button asChild className="bg-navy text-white hover:bg-navy-deep">
            <Link to="/quote">Request a Quote</Link>
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4 pb-8" aria-label="Mobile">
              <MobileSection title="Services">
                {services.map((s) => (
                  <SheetClose asChild key={s.slug}>
                    <Link to={`/services/${s.slug}`} className="block rounded-md px-3 py-2 text-sm text-charcoal hover:bg-mist">
                      {s.name}
                    </Link>
                  </SheetClose>
                ))}
              </MobileSection>
              <MobileSection title="Equipment">
                {equipmentCategories.map((c) => (
                  <SheetClose asChild key={c.slug}>
                    <Link to={`/equipment/${c.slug}`} className="block rounded-md px-3 py-2 text-sm text-charcoal hover:bg-mist">
                      {c.name}
                    </Link>
                  </SheetClose>
                ))}
              </MobileSection>
              {[
                ...primaryLinks,
                { label: 'FAQ', to: '/faq' },
                { label: 'Careers', to: '/careers' },
                { label: 'Contact', to: '/contact' },
              ].map((link) => (
                <SheetClose asChild key={link.to}>
                  <Link
                    to={link.to}
                    className="block rounded-md px-3 py-3 text-base font-medium text-charcoal hover:bg-mist"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <div className="my-2 border-t border-border" />
              {user ? (
                <>
                  <SheetClose asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-charcoal hover:bg-mist"
                    >
                      <LayoutDashboard className="size-4" /> Dashboard
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-charcoal hover:bg-mist"
                    >
                      <Settings className="size-4" /> Profile Settings
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2 rounded-md px-3 py-3 text-left text-base font-medium text-red-600 hover:bg-mist"
                    >
                      <LogOut className="size-4" /> Sign Out
                    </button>
                  </SheetClose>
                </>
              ) : (
                <SheetClose asChild>
                  <Link
                    to="/login"
                    className="block rounded-md px-3 py-3 text-base font-medium text-charcoal hover:bg-mist"
                  >
                    Log In
                  </Link>
                </SheetClose>
              )}
              <SheetClose asChild>
                <Button asChild className="mt-4 bg-navy text-white hover:bg-navy-deep">
                  <Link to="/quote">Request a Quote</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border py-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium text-charcoal"
        aria-expanded={open}
      >
        {title}
        <span className={cn('transition-transform', open && 'rotate-180')}>⌄</span>
      </button>
      {open && <div className="flex flex-col gap-0.5 pb-2">{children}</div>}
    </div>
  )
}
