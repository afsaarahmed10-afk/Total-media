import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Service = Database['public']['Tables']['services']['Row']

const CATEGORY_LABELS: Record<Service['category'], string> = {
  'event-type': 'Event Type',
  technical: 'Technical',
}

export default function AdminServicesPage() {
  const [rows, setRows] = useState<Service[] | null>(null)
  const [deleting, setDeleting] = useState<Service | null>(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('services').select('*').order('name_en')
    if (error) {
      toast.error('Failed to load services.')
      return
    }
    setRows(data)
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('services').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete service.')
      return
    }
    toast.success('Service deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<Service>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-navy">{r.name_en}</span> },
    {
      key: 'category',
      header: 'Category',
      render: (r) => <Badge variant="outline">{CATEGORY_LABELS[r.category]}</Badge>,
    },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild aria-label="Edit">
            <Link to={`/admin/services/${r.id}/edit`}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(r)} aria-label="Delete">
            <Trash2 className="size-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Seo title="Services" description="Manage the services catalogue." path="/admin/services" noindex />

      <Reveal>
        <AdminPageHeader
          title="Services"
          description="Services shown on /services and linked from solutions and portfolio."
          action={
            <Button asChild className="bg-navy text-white hover:bg-navy-deep">
              <Link to="/admin/services/new">
                <Plus className="size-4" /> New Service
              </Link>
            </Button>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <AdminDataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          searchText={(r) => `${r.name_en} ${r.short_description_en}`}
          searchPlaceholder="Search services…"
          emptyMessage="No services yet."
        />
      </Reveal>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        description={`Delete "${deleting?.name_en}"? This also removes it from any related services, equipment categories, FAQs, and solutions that reference it. This can't be undone.`}
        onConfirm={confirmDelete}
        loading={deletingBusy}
      />
    </>
  )
}
