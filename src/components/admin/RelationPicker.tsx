import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export interface RelationOption {
  id: string
  label: string
}

interface RelationPickerProps {
  options: RelationOption[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  searchPlaceholder?: string
  emptyMessage?: string
}

/** Multi-select for a join-table relation (a service's related services,
 * its FAQs, a solution's included services, ...) — a filterable checkbox
 * list plus removable chips for the current selection. No combobox
 * dependency exists in ui/ yet, so this stays a plain checkbox list rather
 * than pulling one in for a single admin-only use case. */
export function RelationPicker({
  options,
  selectedIds,
  onChange,
  searchPlaceholder = 'Search…',
  emptyMessage = 'No options available.',
}: RelationPickerProps) {
  const [query, setQuery] = useState('')
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  }

  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border p-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-8"
        />
      </div>

      <div className="max-h-56 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          filtered.map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Checkbox checked={selectedIds.includes(o.id)} onCheckedChange={() => toggle(o.id)} />
              {o.label}
            </label>
          ))
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-border p-2">
          {selectedIds.map((id) => {
            const option = options.find((o) => o.id === id)
            if (!option) return null
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full bg-signal-soft px-2.5 py-1 text-xs font-medium text-signal"
              >
                {option.label}
                <button type="button" onClick={() => toggle(id)} aria-label={`Remove ${option.label}`}>
                  <X className="size-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
