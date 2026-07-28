import { useMemo, useState, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface AdminColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

interface AdminDataTableProps<T> {
  columns: AdminColumn<T>[]
  /** null while the initial fetch is in flight — renders skeleton rows. */
  rows: T[] | null
  getRowId: (row: T) => string
  /** Builds the text a row is matched against for the search box. Omit to hide search. */
  searchText?: (row: T) => string
  searchPlaceholder?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

/** Column-config-driven list table shared by every /admin/* resource page —
 * client-side search, loading skeleton, and empty state, all in one place
 * so each resource page only supplies its columns and data. */
export function AdminDataTable<T>({
  columns,
  rows,
  getRowId,
  searchText,
  searchPlaceholder = 'Search…',
  emptyMessage = 'Nothing here yet.',
  onRowClick,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!rows) return null
    if (!searchText || !query.trim()) return rows
    const q = query.trim().toLowerCase()
    return rows.filter((row) => searchText(row).toLowerCase().includes(q))
  }, [rows, searchText, query])

  return (
    <div className="rounded-xl border border-border bg-white">
      {searchText && (
        <div className="border-b border-border p-3">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-8"
            />
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered === null ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <div className="h-4 w-full max-w-40 animate-pulse rounded bg-mist" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((row) => (
              <TableRow
                key={getRowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
