import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
type MessageStatus = Database['public']['Enums']['message_status']

const STATUS_OPTIONS: MessageStatus[] = ['new', 'read', 'archived']

const STATUS_STYLES: Record<MessageStatus, string> = {
  new: 'bg-signal-soft text-signal',
  read: 'bg-emerald-50 text-emerald-700',
  archived: 'bg-mist text-muted-foreground',
}

const STATUS_LABELS: Record<MessageStatus, string> = {
  new: 'New',
  read: 'Read',
  archived: 'Archived',
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null)
  const [statusFilter, setStatusFilter] = useState<MessageStatus | 'all'>('all')
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [])

  async function loadMessages() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error('Failed to load contact messages.')
      return
    }
    setMessages(data)
  }

  async function openDetail(message: ContactMessage) {
    setSelected(message)
    if (message.status === 'new') {
      await updateStatus(message.id, 'read')
    }
  }

  async function updateStatus(id: string, status: MessageStatus) {
    setUpdating(true)
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
    setUpdating(false)
    if (error) {
      toast.error('Could not update status.')
      return
    }
    setMessages((prev) => prev?.map((m) => (m.id === id ? { ...m, status } : m)) ?? prev)
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
  }

  const filtered = messages?.filter((m) => statusFilter === 'all' || m.status === statusFilter) ?? null

  const columns: AdminColumn<ContactMessage>[] = [
    { key: 'name', header: 'Name', render: (m) => <span className="font-medium text-navy">{m.name}</span> },
    { key: 'email', header: 'Email', render: (m) => m.email },
    { key: 'subject', header: 'Subject', render: (m) => <span className="line-clamp-1">{m.subject}</span> },
    { key: 'company', header: 'Company', render: (m) => m.company ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: (m) => <StatusBadge label={STATUS_LABELS[m.status]} className={STATUS_STYLES[m.status]} />,
    },
    { key: 'created_at', header: 'Received', render: (m) => formatDateTime(m.created_at) },
  ]

  return (
    <>
      <Seo
        title="Contact Messages"
        description="Manage incoming contact form messages."
        path="/admin/contact-messages"
        noindex
      />

      <Reveal>
        <AdminPageHeader
          title="Contact Messages"
          description="Every message submitted through the public Contact form."
          action={
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MessageStatus | 'all')}>
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
          getRowId={(m) => m.id}
          searchText={(m) => `${m.name} ${m.email} ${m.subject}`}
          searchPlaceholder="Search by name, email, or subject…"
          emptyMessage="No contact messages match this filter."
          onRowClick={openDetail}
        />
      </Reveal>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="border-b border-border">
                <SheetTitle>{selected.subject}</SheetTitle>
                <SheetDescription>Received {formatDateTime(selected.created_at)}</SheetDescription>
              </SheetHeader>

              <div className="space-y-5 px-4 pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => updateStatus(selected.id, v as MessageStatus)}
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
                  <div>
                    <dt className="text-xs text-muted-foreground">From</dt>
                    <dd className="mt-0.5 font-medium text-charcoal">{selected.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd className="mt-0.5 font-medium text-charcoal">{selected.email}</dd>
                  </div>
                  {selected.company && (
                    <div className="col-span-2">
                      <dt className="text-xs text-muted-foreground">Company</dt>
                      <dd className="mt-0.5 font-medium text-charcoal">{selected.company}</dd>
                    </div>
                  )}
                </dl>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-charcoal">{selected.message}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
