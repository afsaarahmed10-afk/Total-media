import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { AuthErrorCard } from '@/components/auth/AuthErrorCard'
import { SuccessCheck } from '@/components/auth/SuccessCheck'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password-strength'

const schema = z
  .object({
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don’t match.',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const { updatePassword, session } = useAuth()
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)
  const readyRef = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })
  const password = form.watch('password')

  // The recovery link authenticates the browser via a token in the URL —
  // supabase-js exchanges it automatically (detectSessionInUrl: true), which
  // fires a PASSWORD_RECOVERY event shortly after this page mounts.
  useEffect(() => {
    if (session) {
      readyRef.current = true
      setReady(true)
      return
    }

    const { data: subscription } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY' || newSession) {
        readyRef.current = true
        setReady(true)
      }
    })

    const timeout = setTimeout(() => {
      if (!readyRef.current) setInvalidLink(true)
    }, 4000)

    return () => {
      subscription.subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [session])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)
    const { error: updateError } = await updatePassword(values.password)
    setIsSubmitting(false)

    if (updateError) {
      setError(updateError)
      return
    }

    setDone(true)
    toast.success('Password updated successfully.')
  }

  return (
    <AuthLayout
      panelTitle="Set a new password."
      panelDescription="Choose something strong you haven't used before on this account."
    >
      <Seo title="Reset Password" description="Set a new TOTAL MEDIA account password." path="/reset-password" noindex />

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SuccessCheck
              title="Password Updated"
              description="Your password has been changed successfully."
            />
            <Button
              onClick={() => navigate('/dashboard', { replace: true })}
              className="mt-6 w-full bg-navy text-white hover:bg-navy-deep"
              size="lg"
            >
              Continue to Dashboard
            </Button>
          </motion.div>
        ) : invalidLink ? (
          <motion.div key="invalid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
                <ShieldAlert className="size-7 text-red-600" />
              </div>
              <h1 className="mt-5 text-xl font-bold tracking-tight text-navy">
                Link Expired or Invalid
              </h1>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                This password reset link is no longer valid. Request a new one to continue.
              </p>
              <Button asChild className="mt-8 bg-navy text-white hover:bg-navy-deep">
                <Link to="/forgot-password">Request New Link</Link>
              </Button>
            </div>
          </motion.div>
        ) : !ready ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-10"
          >
            <div className="flex items-end gap-1.5" role="status" aria-label="Verifying link">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-1.5 animate-pulse rounded-full bg-navy/30"
                  style={{ height: `${12 + i * 6}px`, animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Verifying your reset link…</p>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Create New Password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your new password must be different from previous passwords.
            </p>

            <div className="mt-8">
              <AuthErrorCard message={error} />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <PasswordInput autoComplete="new-password" {...field} />
                        </FormControl>
                        <PasswordStrengthMeter password={password} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordInput autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-navy text-white hover:bg-navy-deep"
                    size="lg"
                  >
                    {isSubmitting ? 'Updating…' : 'Update Password'}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}
