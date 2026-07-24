import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { AuthErrorCard } from '@/components/auth/AuthErrorCard'
import { SuccessCheck } from '@/components/auth/SuccessCheck'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { useAuth } from '@/lib/auth/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard'

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true)
    setError(null)
    const { error: signInError } = await signIn(values.email, values.password, remember)
    setIsSubmitting(false)

    if (signInError) {
      setError(signInError)
      return
    }

    setSuccess(true)
    toast.success('Login successful — welcome back!')
    setTimeout(() => navigate(from, { replace: true }), 900)
  }

  async function onGoogleClick() {
    setGoogleLoading(true)
    setError(null)
    const { error: googleError } = await signInWithGoogle()
    if (googleError) {
      setError(googleError)
      setGoogleLoading(false)
    }
    // On success the browser navigates away to Google, so no need to reset loading.
  }

  return (
    <AuthLayout
      panelTitle="Welcome back to TOTAL MEDIA."
      panelDescription="Sign in to pick up right where you left off — quotations, rental requests, and event bookings, all in one place."
    >
      <Seo title="Sign In" description="Sign in to your TOTAL MEDIA account." path="/login" noindex />

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" exit={{ opacity: 0 }}>
            <SuccessCheck title="Welcome back!" description="Taking you to your dashboard…" />
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your dashboard, quotations and bookings.
            </p>

            <div className="mt-8">
              <AuthErrorCard message={error} />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="you@company.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            to="/forgot-password"
                            className="text-xs font-medium text-signal hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal">
                    <Checkbox
                      checked={remember}
                      onCheckedChange={(checked) => setRemember(checked === true)}
                    />
                    Remember Me
                  </label>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-navy text-white hover:bg-navy-deep"
                    size="lg"
                  >
                    {isSubmitting ? 'Signing In…' : 'Sign In'}
                  </Button>
                </form>
              </Form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <GoogleButton onClick={onGoogleClick} loading={googleLoading} />

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-semibold text-signal hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}
