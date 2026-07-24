import { Link, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Settings, LogOut, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/brand/Logo'
import { UserAvatar } from '@/components/shared/UserAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth/AuthContext'

/** Lightweight app-shell chrome for the signed-in area — swaps the
 * marketing mega-menu for a minimal SaaS-style top bar, while keeping the
 * same logo, colors, and typography as the public site. */
export function DashboardLayout() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'there'

  async function handleSignOut() {
    await signOut()
    toast.success('Logout successful')
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-mist">
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/dashboard" aria-label="TOTAL MEDIA dashboard">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Account">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-charcoal hover:bg-accent"
            >
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-charcoal hover:bg-accent"
            >
              <Settings className="size-4" /> Settings
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <UserAvatar name={profile?.full_name ?? ''} email={user?.email ?? ''} avatarUrl={profile?.avatar_url} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="truncate">Signed in as {displayName}</DropdownMenuLabel>
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

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
