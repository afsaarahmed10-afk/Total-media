import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  MessageSquareText,
  Image as ImageIcon,
  Wrench,
  Layers,
  Boxes,
  Package,
  Briefcase,
  Tags,
  Newspaper,
  Quote,
  HelpCircle,
  Building2,
  Factory,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
} from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/brand/Logo'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth/AuthContext'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Inbox',
    items: [
      { label: 'Quote Requests', to: '/admin/quote-requests', icon: FileText },
      { label: 'Contact Messages', to: '/admin/contact-messages', icon: MessageSquareText },
    ],
  },
  {
    label: 'Media',
    items: [{ label: 'Media Library', to: '/admin/media', icon: ImageIcon }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Services', to: '/admin/services', icon: Wrench },
      { label: 'Solutions', to: '/admin/solutions', icon: Layers },
      { label: 'Equipment Categories', to: '/admin/equipment-categories', icon: Boxes },
      { label: 'Equipment', to: '/admin/equipment', icon: Package },
      { label: 'Portfolio', to: '/admin/portfolio', icon: Briefcase },
      { label: 'Blog Categories', to: '/admin/blog-categories', icon: Tags },
      { label: 'Blog Posts', to: '/admin/blog', icon: Newspaper },
      { label: 'Testimonials', to: '/admin/testimonials', icon: Quote },
      { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
      { label: 'Clients', to: '/admin/clients', icon: Building2 },
      { label: 'Industries', to: '/admin/industries', icon: Factory },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Site Settings', to: '/admin/settings', icon: Settings },
      { label: 'Admin Users', to: '/admin/admin-users', icon: ShieldCheck },
    ],
  },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {section.label}
          </p>
          <div className="mt-2 flex flex-col gap-0.5">
            {section.items.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-signal-soft text-signal'
                      : 'text-charcoal hover:bg-accent',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

/** Sidebar shell for /admin/* — distinct from the customer DashboardLayout's
 * top bar since the admin area has far more sections to navigate between. */
export function AdminLayout() {
  const { user, adminProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const displayName = adminProfile?.display_name || user?.email?.split('@')[0] || 'there'

  async function handleSignOut() {
    await signOut()
    toast.success('Logout successful')
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
            <Link to="/admin" aria-label="TOTAL MEDIA admin">
              <Logo />
            </Link>
            <span className="hidden rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-white sm:inline-block">
              Admin
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <UserAvatar name={adminProfile?.display_name ?? ''} email={user?.email ?? ''} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">Signed in as {displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ExternalLink className="size-4" /> Back to Site
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
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-border bg-white px-3 py-6 lg:block">
          <NavLinks />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 lg:px-8">
          <Outlet />
        </main>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle asChild>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto px-3 py-4">
            <NavLinks onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
