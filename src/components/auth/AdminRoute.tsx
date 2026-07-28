import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth/AuthContext'
import { PageLoader } from '@/components/shared/PageLoader'

/** Wraps routes that require an admin_users row, not just a signed-in
 * session. Assumes it's nested under `ProtectedRoute` (still redirects to
 * /login itself if somehow reached without one). Signed-in non-admins are
 * sent to their customer dashboard rather than an error page. */
export function AdminRoute() {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
