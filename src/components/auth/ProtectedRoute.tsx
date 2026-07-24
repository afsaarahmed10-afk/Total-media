import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth/AuthContext'
import { PageLoader } from '@/components/shared/PageLoader'

/** Wraps routes that require a signed-in user. Redirects to /login,
 * preserving the attempted location so the login page can send the user
 * back after a successful sign-in. */
export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}
