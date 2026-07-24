import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { useAuth } from '@/lib/auth/AuthContext'

/** Google OAuth redirects here (redirectTo: /auth/callback). supabase-js
 * (detectSessionInUrl: true) exchanges the code for a session automatically
 * on load — this page just waits for that and forwards the user on. */
export default function AuthCallbackPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [timedOut, setTimedOut] = useState(false)

  const oauthError = searchParams.get('error_description') || searchParams.get('error')

  useEffect(() => {
    if (oauthError) return
    if (!loading && user) {
      toast.success('Login successful — welcome back!')
      navigate('/dashboard', { replace: true })
    }
  }, [loading, user, oauthError, navigate])

  useEffect(() => {
    const timeout = setTimeout(() => setTimedOut(true), 6000)
    return () => clearTimeout(timeout)
  }, [])

  const failed = Boolean(oauthError) || (timedOut && !user)

  return (
    <AuthLayout>
      <Seo title="Signing In" description="Completing sign-in." path="/auth/callback" noindex />

      {failed ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-navy">Sign-In Didn&apos;t Complete</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {oauthError || 'Something interrupted the Google sign-in. Please try again.'}
          </p>
          <Button asChild className="mt-8 bg-navy text-white hover:bg-navy-deep">
            <Link to="/login">Back to Sign In</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="flex items-end gap-1.5" role="status" aria-label="Signing in">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-1.5 animate-pulse rounded-full bg-navy/30"
                style={{ height: `${12 + i * 6}px`, animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Completing sign-in…</p>
        </div>
      )}
    </AuthLayout>
  )
}
