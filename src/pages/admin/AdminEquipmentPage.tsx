import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type EquipmentItem = Database['public']['Tables']['equipment_items']['Row']
type EquipmentCategory = Database['public']['Tables']['equipment_categories']['Row']
type Availability = Database['public']['Enums']['equipment_availability']

const AVAILABILITY_STYLES: Record<Availability, string> = {
  'in-stock': 'bg-emerald-50 text-emerald-700',
  limited: 'bg-amber-50 text-amber-700',
  'made-to-order': 'bg-signal-soft text-signal',
}

const AVAILABILITY_LABELS: Record<Availability, string> = {
  'in-stock': 'In Stock',
  limited: 'Limited',
  'made-to-order': 'Made to Order',
}

export default function AdminEquipmentPage() {
  const [rows, setRows] = useState<EquipmentItem[] | null>(null)
  const [categories, setCategories] = useState<Map<string, string>>(new Map())
  const [deleting, setDeleting] = useState<EquipmentItem | null>(null)
  const [deletingBusy, setDeletingBusy] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const [itemsRes, categoriesRes] = await Promise.all([
      supabase.from('equipment_items').select('*').order('name_en'),
      supabase.from('equipment_categories').select('id, name_en'),
    ])
    if (itemsRes.error) {
      toast.error('Failed to load equipment.')
      return
    }
    setRows(itemsRes.data)
    setCategories(new Map((categoriesRes.data ?? []).map((c: Pick<EquipmentCategory, 'id' | 'name_en'>) => [c.id, c.name_en])))
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('equipment_items').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete equipment item.')
      return
    }
    toast.success('Equipment item deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<EquipmentItem>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-navy">{r.name_en}</span> },
    { key: 'category', header: 'Category', render: (r) => categories.get(r.category_id) ?? '—' },
    {
      key: 'availability',
      header: 'Availability',
      render: (r) => (
        <StatusBadge label={AVAILABILITY_LABELS[r.availability]} className={AVAILABILITY_STYLES[r.availability]} />
      ),
    },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild aria-label="Edit">
            <Link to={`/admin/equipment/${r.id}/edit`}>
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
      <Seo title="Equipment" description="Manage the equipment catalogue." path="/admin/equipment" noindex />

      <Reveal>
        <AdminPageHeader
          title="Equipment"
          description="Rental items shown on /equipment."
          action={
            <Button asChild className="bg-navy text-white hover:bg-navy-deep">
              <Link to="/admin/equipment/new">
                <Plus className="size-4" /> New Equipment Item
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
          searchText={(r) => `${r.name_en} ${r.summary_en}`}
          searchPlaceholder="Search equipment…"
          emptyMessage="No equipment items yet."
        />
      </Reveal>

      <ConfirmDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        description={`Delete "${deleting?.name_en}"? This can't be undone.`}
        onConfirm={confirmDelete}
        loading={deletingBusy}
      />
    </>
  )
}
