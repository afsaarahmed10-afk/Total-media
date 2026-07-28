import { useFieldArray, type ArrayPath, type FieldValues, type Path, type UseFormReturn } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface FieldDef {
  name: string
  label: string
  multiline?: boolean
}

interface ObjectListFieldProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  name: ArrayPath<TFieldValues>
  fields: FieldDef[]
  emptyItem: Record<string, string>
  addLabel?: string
}

/** Repeatable rows editor for a jsonb array-of-objects field (a service's
 * `process` steps, a solution's `highlights`) — every row is a plain
 * object of text fields defined by `fields`. Backed by react-hook-form's
 * useFieldArray so it drops straight into any form using the same
 * `control`/`register`. */
export function ObjectListField<TFieldValues extends FieldValues>({
  form,
  name,
  fields,
  emptyItem,
  addLabel = 'Add Item',
}: ObjectListFieldProps<TFieldValues>) {
  const { fields: rows, append, remove } = useFieldArray({ control: form.control, name })

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={row.id} className="flex gap-3 rounded-lg border border-border p-3">
          <div className="flex-1 space-y-2.5">
            {fields.map((f) => (
              <div key={f.name}>
                <Label className="text-xs text-muted-foreground">{f.label}</Label>
                {f.multiline ? (
                  <Textarea
                    rows={2}
                    className="mt-1"
                    {...form.register(`${name}.${index}.${f.name}` as Path<TFieldValues>)}
                  />
                ) : (
                  <Input className="mt-1" {...form.register(`${name}.${index}.${f.name}` as Path<TFieldValues>)} />
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(index)}
            aria-label="Remove item"
            className="self-start"
          >
            <Trash2 className="size-4 text-red-600" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyItem as never)}>
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  )
}
