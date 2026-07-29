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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Database } from '@/lib/supabase/database.types'

type Faq = Database['public']['Tables']['faqs']['Row']
type FaqCategory = Database['public']['Enums']['faq_category']

const CATEGORIES: FaqCategory[] = ['general', 'quotes-pricing', 'equipment', 'planning', 'technical']
const CATEGORY_LABELS: Record<FaqCategory, string> = {
  general: 'General',
  'quotes-pricing': 'Quotes & Pricing',
  equipment: 'Equipment',
  planning: 'Planning',
  technical: 'Technical',
}

const schema = z.object({
  questionEn: z.string().min(5, 'Question is required.'),
  questionJa: z.string(),
  answerEn: z.string().min(5, 'Answer is required.'),
  answerJa: z.string(),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only.'),
  category: z.string(),
})
type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  questionEn: '',
  questionJa: '',
  answerEn: '',
  answerJa: '',
  slug: '',
  category: 'none',
}

export default function AdminFaqsPage() {
  const [rows, setRows] = useState<Faq[] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [deleting, setDeleting] = useState<Faq | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingBusy, setDeletingBusy] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)
  const [activeLang, setActiveLang] = useState<'en' | 'ja'>('en')

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('faqs').select('*').order('question_en')
    if (error) {
      toast.error('Failed to load FAQs.')
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

  function openEdit(row: Faq) {
    setEditing(row)
    setAutoSlug(false)
    setActiveLang('en')
    form.reset({
      questionEn: row.question_en,
      questionJa: row.question_ja ?? '',
      answerEn: row.answer_en,
      answerJa: row.answer_ja ?? '',
      slug: row.slug,
      category: row.category ?? 'none',
    })
    setDialogOpen(true)
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    const payload = {
      question_en: values.questionEn,
      question_ja: values.questionJa || null,
      answer_en: values.answerEn,
      answer_ja: values.answerJa || null,
      slug: values.slug,
      category: values.category === 'none' ? null : (values.category as FaqCategory),
    }
    const { error } = editing
      ? await supabase.from('faqs').update(payload).eq('id', editing.id)
      : await supabase.from('faqs').insert(payload)
    setSubmitting(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(editing ? 'FAQ updated.' : 'FAQ created.')
    setDialogOpen(false)
    load()
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingBusy(true)
    const { error } = await supabase.from('faqs').delete().eq('id', deleting.id)
    setDeletingBusy(false)
    if (error) {
      toast.error('Could not delete FAQ.')
      return
    }
    toast.success('FAQ deleted.')
    setDeleting(null)
    load()
  }

  const columns: AdminColumn<Faq>[] = [
    { key: 'question', header: 'Question', render: (r) => <span className="line-clamp-1 max-w-md font-medium text-navy">{r.question_en}</span> },
    {
      key: 'category',
      header: 'Category',
      render: (r) => (r.category ? <Badge variant="outline">{CATEGORY_LABELS[r.category]}</Badge> : '—'),
    },
    { key: 'slug', header: 'Slug', render: (r) => <code className="text-xs text-muted-foreground">{r.slug}</code> },
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

  const jaComplete = Boolean(form.watch('questionJa'))

  return (
    <>
      <Seo title="FAQs" description="Manage frequently asked questions." path="/admin/faqs" noindex />

      <Reveal>
        <AdminPageHeader
          title="FAQs"
          description="Questions shown on the homepage and /faq page."
          action={
            <Button onClick={openCreate} className="bg-navy text-white hover:bg-navy-deep">
              <Plus className="size-4" /> New FAQ
            </Button>
          }
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <AdminDataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          searchText={(r) => `${r.question_en} ${r.answer_en}`}
          searchPlaceholder="Search FAQs…"
          emptyMessage="No FAQs yet."
        />
      </Reveal>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <DialogTitle>{editing ? 'Edit FAQ' : 'New FAQ'}</DialogTitle>
              <LangTabs active={activeLang} onChange={setActiveLang} jaComplete={jaComplete} />
            </div>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name={activeLang === 'en' ? 'questionEn' : 'questionJa'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question {activeLang === 'ja' && '(Japanese)'}</FormLabel>
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
                name={activeLang === 'en' ? 'answerEn' : 'answerJa'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer {activeLang === 'ja' && '(Japanese)'}</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No category</SelectItem>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {CATEGORY_LABELS[c]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
        description={`Delete "${deleting?.question_en}"? This can't be undone.`}
        onConfirm={confirmDelete}
        loading={deletingBusy}
      />
    </>
  )
}
