import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wrench,
  PackageSearch,
  Briefcase,
  Newspaper,
  Users,
  FileText,
  MessageSquareText,
  ArrowRight,
} from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Counts {
  services: number
  equipmentItems: number
  projects: number
  blogPosts: number
  customers: number
  newQuoteRequests: number
  newContactMessages: number
}

interface ActivityItem {
  id: string
  kind: 'quote' | 'contact'
  title: string
  subtitle: string
  createdAt: string
}

const COUNT_TILES = [
  { key: 'services', label: 'Services', icon: Wrench, to: '/services' },
  { key: 'equipmentItems', label: 'Equipment Items', icon: PackageSearch, to: '/equipment' },
  { key: 'projects', label: 'Portfolio Projects', icon: Briefcase, to: '/portfolio' },
  { key: 'blogPosts', label: 'Blog Posts', icon: Newspaper, to: '/blog' },
  { key: 'customers', label: 'Customer Accounts', icon: Users, to: null },
] as const

async function count(table: 'services' | 'equipment_items' | 'projects' | 'blog_posts' | 'customers') {
  const { count: value } = await supabase.from(table).select('*', { count: 'exact', head: true })
  return value ?? 0
}

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [activity, setActivity] = useState<ActivityItem[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [
        services,
        equipmentItems,
        projects,
        blogPosts,
        customers,
        newQuoteRequestsRes,
        newContactMessagesRes,
        recentQuotesRes,
        recentMessagesRes,
      ] = await Promise.all([
        count('services'),
        count('equipment_items'),
        count('projects'),
        count('blog_posts'),
        count('customers'),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase
          .from('quote_requests')
          .select('id, event_type, company, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('contact_messages')
          .select('id, subject, name, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      if (cancelled) return

      setCounts({
        services,
        equipmentItems,
        projects,
        blogPosts,
        customers,
        newQuoteRequests: newQuoteRequestsRes.count ?? 0,
        newContactMessages: newContactMessagesRes.count ?? 0,
      })

      const merged: ActivityItem[] = [
        ...(recentQuotesRes.data ?? []).map((r) => ({
          id: r.id,
          kind: 'quote' as const,
          title: `Quote request — ${r.event_type}`,
          subtitle: r.company,
          createdAt: r.created_at,
        })),
        ...(recentMessagesRes.data ?? []).map((m) => ({
          id: m.id,
          kind: 'contact' as const,
          title: `Contact message — ${m.subject}`,
          subtitle: m.name,
          createdAt: m.created_at,
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setActivity(merged.slice(0, 8))
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Seo title="Admin Dashboard" description="TOTAL MEDIA admin overview." path="/admin" noindex />

      <Reveal>
        <AdminPageHeader
          title="Overview"
          description="A snapshot of your content, leads, and accounts."
        />
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {COUNT_TILES.map(({ key, label, icon: Icon, to }) => {
            const value = counts?.[key]
            const tile = (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-signal-soft text-signal">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-extrabold tabular-nums text-navy">
                    {value === undefined ? (
                      <span className="inline-block h-7 w-10 animate-pulse rounded bg-mist align-middle" />
                    ) : (
                      value
                    )}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            )
            return to ? (
              <Link key={key} to={to} className="transition-transform hover:-translate-y-0.5">
                {tile}
              </Link>
            ) : (
              <div key={key}>{tile}</div>
            )
          })}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Reveal delay={0.1} className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent Activity
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
            {activity === null ? (
              <div className="space-y-3 p-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-mist" />
                ))}
              </div>
            ) : activity.length === 0 ? (
              <p className="px-6 py-14 text-center text-sm text-muted-foreground">
                No quote requests or contact messages yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {activity.map((item) => (
                  <li key={`${item.kind}-${item.id}`} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-navy">{item.title}</p>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Needs Attention
          </h2>
          <div className="mt-4 space-y-3">
            <Link
              to="/admin/quote-requests"
              className={cn(
                'flex items-center justify-between rounded-xl border border-border bg-white p-5 transition-colors hover:border-signal/40',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-signal-soft text-signal">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-navy">{counts?.newQuoteRequests ?? '—'}</p>
                  <p className="text-sm text-muted-foreground">New quote requests</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
            <Link
              to="/admin/contact-messages"
              className="flex items-center justify-between rounded-xl border border-border bg-white p-5 transition-colors hover:border-signal/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-signal-soft text-signal">
                  <MessageSquareText className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-navy">{counts?.newContactMessages ?? '—'}</p>
                  <p className="text-sm text-muted-foreground">New contact messages</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  )
}
