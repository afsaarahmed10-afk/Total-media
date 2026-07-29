import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { ConfirmDeleteDialog } from '@/components/admin/ConfirmDeleteDialog'
import { LangTabs } from '@/components/admin/LangTabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Database } from '@/lib/supabase/database.types'

type Industry = Database['public']['Tables']['industries']['Row']

const schema = z.object({
  nameEn: z.string().min(1, 'Name is required.'),
  nameJa: z.string(),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only.'),
  descriptionEn: z.string().min(10, 'Description is required.'),
  descriptionJa: z.string(),
  useCasesTextEn: z.string(),
  useCasesTextJa: z.string(),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  nameEn: '',
  nameJa: '',
  slug: '',
  descriptionEn: '',
  descriptionJa: '',
  useCasesTextEn: '',
  useCasesTextJa: '',
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AdminIndustriesPage() {
  const [rows, setRows] = useState<Industry[] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Industry | null>(null)
  const [deleting, setDeleting] = useState<Industry | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingBusy, setDeletingBusy] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)
  const [activeLang, setActiveLang] = useState<'en' | 'ja'>('en')

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('industries').select('*').order('name_en')
    if (error) {
      toast.error('Failed to load industries.')
      return
    }
    setRows(data)
  }

  function openCreate() {
    setEditing(null)
    setAutoSlug(true)
    setActiveLang('en')
    form.reset(DEFAULT_VALUES)
    setDialogOpen(true)
  }

  function openEdit(row: Industry) {
    setEditing(row)
    setAutoSlug(false)
    setActiveLang('en')
    form.reset({
      nameEn: row.name_en,
      nameJa: row.name_ja ?? '',
      slug: row.slug,
      descriptionEn: row.description_en,
      descriptionJa: row.description_ja ?? '',
      useCasesTextEn: row.use_cases_en.join('\n'),
      useCasesTextJa: row.use_cases_ja.join('\n'),
    })
    setDialogOpen(true)
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      name_en: values.nameEn,
      name_ja: values.nameJa || null,
      slug: values.slug,
      description_en: values.descriptionEn,
      description_ja: values.descriptionJa || null,
      use_cases_en: linesToArray(values.useCasesTextEn),
      use_cases_ja: linesToArray(values.useCasesTextJa),
    }
    const { error } = editing
      ? await supabase.from('industries').update(payload).eq('id', editing.id)
      : await supabase.from('industries').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(editing ? 'Industry updated.' : 'Industry created.')
    setDialogOpen(false)
    load()
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('industries').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete industry.')
      return
    }
    toast.success('Industry deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<Industry>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-navy">{r.name_en}</span> },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
    { key: 'use_cases', header: 'Use Cases', render: (r) => r.use_cases_en.length },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(r)} aria-label="Edit">
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(r)} aria-label="Delete">
            <Trash2 className="size-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  const jaComplete = Boolean(form.watch('nameJa'))

  return (
    <>
      <Seo title="Industries" description="Manage industries served." path="/admin/industries" noindex />

      <Reveal>
        <AdminPageHeader
          title="Industries"
          description="Sectors shown on the /industries page."
          action={
            <Button onClick={openCreate} className="bg-navy text-white hover:bg-navy-deep">
              <Plus className="size-4" /> New Industry
            </Button>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <AdminDataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          searchText={(r) => `${r.name_en} ${r.description_en}`}
          searchPlaceholder="Search industries…"
          emptyMessage="No industries yet."
        />
      </Reveal>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <DialogTitle>{editing ? 'Edit Industry' : 'New Industry'}</DialogTitle>
              <LangTabs active={activeLang} onChange={setActiveLang} jaComplete={jaComplete} />
            </div>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name={activeLang === 'en' ? 'nameEn' : 'nameJa'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (autoSlug && activeLang === 'en') form.setValue('slug', slugify(e.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          setAutoSlug(false)
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={activeLang === 'en' ? 'descriptionEn' : 'descriptionJa'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={activeLang === 'en' ? 'useCasesTextEn' : 'useCasesTextJa'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Use Cases {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormDescription>One use case per line.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-navy text-white hover:bg-navy-deep">
                  {submitting ? 'Saving…' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
