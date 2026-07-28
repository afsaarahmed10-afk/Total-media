import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Reveal } from '@/components/shared/Reveal'
import { Seo } from '@/components/layout/Seo'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminDataTable, type AdminColumn } from '@/components/admin/AdminDataTable'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type AdminUser = Database['public']['Tables']['admin_users']['Row']
type AdminRole = Database['public']['Enums']['admin_role']

const ROLES: AdminRole[] = ['admin', 'editor']
const ROLE_LABELS: Record<AdminRole, string> = { admin: 'Admin', editor: 'Editor' }

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<AdminUser[] | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data, error } = await supabase.from('admin_users').select('*').order('created_at')
    if (error) {
      toast.error('Failed to load admin users.')
      return
    }
    setRows(data)
  }

  async function updateRole(id: string, role: AdminRole) {
    const { error } = await supabase.from('admin_users').update({ role }).eq('id', id)
    if (error) {
      toast.error('Could not update role.')
      return
    }
    setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, role } : r)) ?? prev)
    toast.success('Role updated.')
  }

  const columns: AdminColumn<AdminUser>[] = [
    {
      key: 'display_name',
      header: 'Name',
      render: (r) => (
        <span className="font-medium text-navy">
          {r.display_name}
          {r.id === user?.id && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (r) => (
        <Select
          value={r.role}
          onValueChange={(v) => updateRole(r.id, v as AdminRole)}
          disabled={r.id === user?.id}
        >
          <SelectTrigger className="w-32" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    { key: 'created_at', header: 'Added', render: (r) => formatDate(r.created_at) },
  ]

  return (
    <>
      <Seo title="Admin Users" description="Manage staff admin accounts." path="/admin/admin-users" noindex />

      <Reveal>
        <AdminPageHeader
          title="Admin Users"
          description="Staff accounts with dashboard access. Creating a new admin account is a manual step in Supabase Studio (see supabase/SCHEMA.md) since it requires the service-role key."
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-6">
        <AdminDataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          searchText={(r) => r.display_name}
          searchPlaceholder="Search admin users…"
          emptyMessage="No admin users found."
        />
      </Reveal>
    </>
  )
}
