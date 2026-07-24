import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { AuthErrorCard } from '@/components/auth/AuthErrorCard'
import { SuccessCheck } from '@/components/auth/SuccessCheck'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { useAuth } from '@/lib/auth/AuthContext'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password-strength'

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Please enter your full name.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don’t match.',
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<'idle' | 'confirmed' | 'needs-verification'>('idle')
  const [submittedEmail, setSubmittedEmail] = useState('')

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  })

  const password = form.watch('password')

  async function onSubmit(values: SignupFormValues) {
    setIsSubmitting(true)
    setError(null)

    const { error: signUpError, needsEmailConfirmation } = await signUp({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    })

    setIsSubmitting(false)

    if (signUpError) {
      setError(signUpError)
      return
    }

    setSubmittedEmail(values.email)

    if (needsEmailConfirmation) {
      setResult('needs-verification')
      toast.success('Account created — check your email to verify it.')
    } else {
      setResult('confirmed')
      toast.success('Account created successfully!')
      setTimeout(() => navigate('/dashboard', { replace: true }), 900)
    }
  }

  async function onGoogleClick() {
    setGoogleLoading(true)
    setError(null)
    const { error: googleError } = await signInWithGoogle()
    if (googleError) {
      setError(googleError)
      setGoogleLoading(false)
    }
  }

  return (
    <AuthLayout
      panelTitle="Create your TOTAL MEDIA account."
      panelDescription="One account for quote requests, rental history, and every event you run with us."
    >
      <Seo title="Create Account" description="Create a TOTAL MEDIA account." path="/signup" noindex />

      <AnimatePresence mode="wait">
        {result === 'needs-verification' ? (
          <motion.div key="verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-signal-soft">
                <Mail className="size-7 text-signal" />
              </div>
              <h1 className="mt-5 text-xl font-bold tracking-tight text-navy">
                Check Your Email
              </h1>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                We&apos;ve sent a confirmation link to <strong>{submittedEmail}</strong>. Verify
                your email to finish creating your account, then sign in.
              </p>
              <Button asChild className="mt-8 bg-navy text-white hover:bg-navy-deep">
                <Link to="/login">Back to Sign In</Link>
              </Button>
            </div>
          </motion.div>
        ) : result === 'confirmed' ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SuccessCheck
              title="Account created!"
              description="Taking you to your dashboard…"
            />
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join TOTAL MEDIA to track quotations, rentals, and bookings in one place.
            </p>

            <div className="mt-8">
              <AuthErrorCard message={error} />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input autoComplete="name" placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        <FormLabel>Password</FormLabel>
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
                    {isSubmitting ? 'Creating Account…' : 'Create Account'}
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
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-signal hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}
