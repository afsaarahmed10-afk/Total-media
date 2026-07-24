import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, PackageSearch, MessageSquareText, ArrowRight, Inbox } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type QuoteRequestRow = {
  id: string
  event_type: string
  city: string
  event_date: string | null
  status: string
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-signal-soft text-signal',
  in_review: 'bg-amber-50 text-amber-700',
  quoted: 'bg-emerald-50 text-emerald-700',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-red-50 text-red-600',
  archived: 'bg-mist text-muted-foreground',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  in_review: 'In Review',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
  archived: 'Archived',
}

const QUICK_ACTIONS = [
  {
    label: 'Request a Quote',
    description: 'Start a new quotation for an event, rental, or booking.',
    to: '/quote',
    icon: FileText,
  },
  {
    label: 'Browse Equipment',
    description: 'Explore the full rental catalogue.',
    to: '/equipment',
    icon: PackageSearch,
  },
  {
    label: 'Contact Us',
    description: 'Reach the team directly with a question.',
    to: '/contact',
    icon: MessageSquareText,
  },
]

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [requests, setRequests] = useState<QuoteRequestRow[] | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    supabase
      .from('quote_requests')
      .select('id, event_type, city, event_date, status, created_at')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setRequests(data ?? [])
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const displayName = profile?.full_name || user?.email?.split('@')[0] || ''
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null

  return (
    <>
      <Seo title="Dashboard" description="Your TOTAL MEDIA account dashboard." path="/dashboard" noindex />

      <div className="container-page py-10 lg:py-14">
        <Reveal>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Welcome back, {displayName || 'there'}
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Here&apos;s what&apos;s happening with your account.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <Reveal delay={0.05}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Quick Actions
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {QUICK_ACTIONS.map(({ label, description, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex flex-col rounded-xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-signal/40 hover:shadow-md"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-signal-soft text-signal">
                      <Icon className="size-5" />
                    </div>
                    <p className="mt-4 font-semibold text-navy">{label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    <span className="mt-3 flex items-center gap-1 text-sm font-medium text-signal opacity-0 transition-opacity group-hover:opacity-100">
                      Go <ArrowRight className="size-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  My Quotations &amp; Requests
                </h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/quote">New Request</Link>
                </Button>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
                {requests === null ? (
                  <div className="space-y-3 p-5">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-14 animate-pulse rounded-lg bg-mist" />
                    ))}
                  </div>
                ) : requests.length === 0 ? (
                  <div className="flex flex-col items-center px-6 py-14 text-center">
                    <Inbox className="size-8 text-muted-foreground/50" />
                    <p className="mt-3 text-sm font-medium text-navy">No requests yet</p>
                    <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                      Quotations, equipment rentals, and event bookings you submit will show up
                      here.
                    </p>
                    <Button asChild className="mt-5 bg-navy text-white hover:bg-navy-deep" size="sm">
                      <Link to="/quote">Request a Quote</Link>
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {requests.map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-navy">{r.event_type}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {r.city}
                            {r.event_date &&
                              ` · ${new Date(r.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                            STATUS_STYLES[r.status] ?? 'bg-mist text-muted-foreground',
                          )}
                        >
                          {STATUS_LABELS[r.status] ?? r.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Account Settings
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <UserAvatar
                  name={profile?.full_name ?? ''}
                  email={user?.email ?? ''}
                  avatarUrl={profile?.avatar_url}
                  className="size-14 text-base"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-navy">
                    {profile?.full_name || 'Add your name'}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              {memberSince && (
                <p className="mt-4 text-sm text-muted-foreground">Member since {memberSince}</p>
              )}
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link to="/dashboard/settings">Edit Profile</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  )
}
