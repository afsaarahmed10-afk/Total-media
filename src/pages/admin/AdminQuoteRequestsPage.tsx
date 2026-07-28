import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Paperclip, Loader2 } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type QuoteRequest = Database['public']['Tables']['quote_requests']['Row']
type QuoteAttachment = Database['public']['Tables']['quote_request_attachments']['Row']
type QuoteStatus = Database['public']['Enums']['quote_status']

const STATUS_OPTIONS: QuoteStatus[] = ['new', 'in_review', 'quoted', 'won', 'lost', 'archived']

const STATUS_STYLES: Record<QuoteStatus, string> = {
  new: 'bg-signal-soft text-signal',
  in_review: 'bg-amber-50 text-amber-700',
  quoted: 'bg-emerald-50 text-emerald-700',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-red-50 text-red-600',
  archived: 'bg-mist text-muted-foreground',
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
  archived: 'Archived',
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminQuoteRequestsPage() {
  const [requests, setRequests] = useState<QuoteRequest[] | null>(null)
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all')
  const [selected, setSelected] = useState<QuoteRequest | null>(null)
  const [attachments, setAttachments] = useState<{ attachment: QuoteAttachment; url: string | null }[] | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error('Failed to load quote requests.')
      return
    }
    setRequests(data)
  }

  async function openDetail(request: QuoteRequest) {
    setSelected(request)
    setAttachments(null)
    const { data } = await supabase
      .from('quote_request_attachments')
      .select('*')
      .eq('quote_request_id', request.id)
    if (!data || data.length === 0) {
      setAttachments([])
      return
    }
    const withUrls = await Promise.all(
      data.map(async (attachment) => {
        const { data: signed } = await supabase.storage
          .from('quote-attachments')
          .createSignedUrl(attachment.storage_path, 60 * 10)
        return { attachment, url: signed?.signedUrl ?? null }
      }),
    )
    setAttachments(withUrls)
  }

  async function updateStatus(id: string, status: QuoteStatus) {
    setUpdating(true)
    const { error } = await supabase.from('quote_requests').update({ status }).eq('id', id)
    setUpdating(false)
    if (error) {
      toast.error('Could not update status.')
      return
    }
    setRequests((prev) => prev?.map((r) => (r.id === id ? { ...r, status } : r)) ?? prev)
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
    toast.success('Status updated.')
  }

  const filtered = requests?.filter((r) => statusFilter === 'all' || r.status === statusFilter) ?? null

  const columns: AdminColumn<QuoteRequest>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-navy">{r.name}</span> },
    { key: 'company', header: 'Company', render: (r) => r.company },
    { key: 'event_type', header: 'Event Type', render: (r) => r.event_type },
    { key: 'city', header: 'City', render: (r) => r.city },
    { key: 'event_date', header: 'Event Date', render: (r) => formatDate(r.event_date) },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge label={STATUS_LABELS[r.status]} className={STATUS_STYLES[r.status]} />,
    },
    { key: 'created_at', header: 'Submitted', render: (r) => formatDate(r.created_at) },
  ]

  return (
    <>
      <Seo title="Quote Requests" description="Manage incoming quote requests." path="/admin/quote-requests" noindex />

      <Reveal>
        <AdminPageHeader
          title="Quote Requests"
          description="Every quotation request submitted through the public Quote form."
          action={
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as QuoteStatus | 'all')}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <AdminDataTable
          columns={columns}
          rows={filtered}
          getRowId={(r) => r.id}
          searchText={(r) => `${r.name} ${r.company} ${r.email}`}
          searchPlaceholder="Search by name, company, or email…"
          emptyMessage="No quote requests match this filter."
          onRowClick={openDetail}
        />
      </Reveal>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="border-b border-border">
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  Submitted {new Date(selected.created_at).toLocaleString('en-US')}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => updateStatus(selected.id, v as QuoteStatus)}
                    disabled={updating}
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <Field label="Company" value={selected.company} />
                  <Field label="Country" value={selected.country} />
                  <Field label="Email" value={selected.email} />
                  <Field label="Phone" value={selected.phone} />
                  <Field label="Event Type" value={selected.event_type} />
                  <Field label="Venue" value={selected.venue ?? '—'} />
                  <Field label="City" value={selected.city} />
                  <Field label="Event Date" value={formatDate(selected.event_date)} />
                  <Field label="Attendees" value={selected.attendees?.toString() ?? '—'} />
                  <Field label="Budget" value={selected.budget ?? '—'} />
                </dl>

                {selected.requested_services.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Requested Services
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {selected.requested_services.map((s) => (
                        <span key={s} className="rounded-full bg-mist px-2.5 py-1 text-xs text-charcoal">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selected.notes && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-charcoal">{selected.notes}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Attachments</p>
                  {attachments === null ? (
                    <Loader2 className="mt-2 size-4 animate-spin text-muted-foreground" />
                  ) : attachments.length === 0 ? (
                    <p className="mt-1.5 text-sm text-muted-foreground">No files attached.</p>
                  ) : (
                    <ul className="mt-1.5 space-y-1.5">
                      {attachments.map(({ attachment, url }) => (
                        <li key={attachment.id}>
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-sm text-signal hover:underline"
                            >
                              <Paperclip className="size-3.5" /> {attachment.file_name}
                            </a>
                          ) : (
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Paperclip className="size-3.5" /> {attachment.file_name}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-charcoal">{value}</dd>
    </div>
  )
}
