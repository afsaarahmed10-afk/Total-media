import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/auth/AuthContext'
import { PageLoader } from '@/components/shared/PageLoader'

/** Wraps the login/signup/forgot-password pages — signed-in users are
 * redirected straight to the dashboard instead of seeing the auth forms. */
export function GuestOnlyRoute() {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader />
  if (user) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
