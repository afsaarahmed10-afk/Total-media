import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthErrorCard } from '@/components/auth/AuthErrorCard'
import { useAuth } from '@/lib/auth/AuthContext'

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)
    const { error: resetError } = await sendPasswordReset(values.email)
    setIsSubmitting(false)

    if (resetError) {
      setError(resetError)
      return
    }

    setSentTo(values.email)
    toast.success('Password reset email sent.')
  }

  return (
    <AuthLayout
      panelTitle="Forgot your password?"
      panelDescription="It happens. We'll get you a secure link to set a new one in a minute."
    >
      <Seo title="Forgot Password" description="Reset your TOTAL MEDIA account password." path="/forgot-password" noindex />

      <AnimatePresence mode="wait">
        {sentTo ? (
          <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-signal-soft">
                <Mail className="size-7 text-signal" />
              </div>
              <h1 className="mt-5 text-xl font-bold tracking-tight text-navy">
                Check Your Email
              </h1>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                We&apos;ve sent a password reset link to <strong>{sentTo}</strong>. Click the link
                in the email to set a new password.
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link to="/login">
                  <ArrowLeft className="mr-1 size-4" /> Back to Sign In
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the email address on your account and we&apos;ll send you a link to reset
              your password.
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

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-navy text-white hover:bg-navy-deep"
                    size="lg"
                  >
                    {isSubmitting ? 'Sending…' : 'Send Reset Email'}
                  </Button>
                </form>
              </Form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Remembered your password?{' '}
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
