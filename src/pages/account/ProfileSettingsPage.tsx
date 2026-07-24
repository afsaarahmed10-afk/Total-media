import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Reveal } from '@/components/shared/Reveal'
import { UserAvatar } from '@/components/shared/UserAvatar'
import { Seo } from '@/components/layout/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter'
import { AuthErrorCard } from '@/components/auth/AuthErrorCard'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'
import { mapAuthError } from '@/lib/auth/auth-errors'
import { MIN_PASSWORD_LENGTH } from '@/lib/auth/password-strength'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name.'),
  company: z.string().optional(),
  phone: z.string().optional(),
})
type ProfileFormValues = z.infer<typeof profileSchema>

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Please enter your current password.'),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords don’t match.',
    path: ['confirmPassword'],
  })
type PasswordFormValues = z.infer<typeof passwordSchema>

const MAX_AVATAR_SIZE = 5 * 1024 * 1024

export default function ProfileSettingsPage() {
  const { user, profile, updateProfile, updatePassword } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatarUploading, setAvatarUploading] = useState(false)
  const [profileSubmitting, setProfileSubmitting] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: profile?.full_name ?? '',
      company: profile?.company ?? '',
      phone: profile?.phone ?? '',
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })
  const newPassword = passwordForm.watch('newPassword')

  async function onProfileSubmit(values: ProfileFormValues) {
    setProfileSubmitting(true)
    const { error } = await updateProfile({
      full_name: values.fullName,
      company: values.company || null,
      phone: values.phone || null,
    })
    setProfileSubmitting(false)

    if (error) {
      toast.error(error)
      return
    }
    toast.success('Profile updated.')
  }

  async function onPasswordSubmit(values: PasswordFormValues) {
    if (!user?.email) return
    setPasswordSubmitting(true)
    setPasswordError(null)

    // Supabase's updateUser() doesn't itself verify the current password, so
    // we re-authenticate with it first — standard practice for a
    // security-sensitive change like this.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: values.currentPassword,
    })
    if (verifyError) {
      setPasswordSubmitting(false)
      setPasswordError('Current password is incorrect.')
      return
    }

    const { error } = await updatePassword(values.newPassword)
    setPasswordSubmitting(false)

    if (error) {
      setPasswordError(error)
      return
    }

    toast.success('Password updated.')
    passwordForm.reset()
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Image must be smaller than 5MB.')
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return
    }

    setAvatarUploading(true)
    const path = `${user.id}/${crypto.randomUUID()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
      upsert: true,
    })

    if (uploadError) {
      setAvatarUploading(false)
      toast.error(mapAuthError(uploadError))
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const { error } = await updateProfile({ avatar_url: data.publicUrl })
    setAvatarUploading(false)

    if (error) {
      toast.error(error)
      return
    }
    toast.success('Profile picture updated.')
  }

  return (
    <>
      <Seo
        title="Profile Settings"
        description="Manage your TOTAL MEDIA account settings."
        path="/dashboard/settings"
        noindex
      />

      <div className="container-page max-w-3xl py-10 lg:py-14">
        <Reveal>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Profile Settings
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Update your account information and password.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-8 rounded-xl border border-border bg-white p-6 sm:p-8">
            <h2 className="font-semibold text-navy">Profile Picture</h2>
            <div className="mt-4 flex items-center gap-5">
              <div className="relative">
                <UserAvatar
                  name={profile?.full_name ?? ''}
                  email={user?.email ?? ''}
                  avatarUrl={profile?.avatar_url}
                  className="size-16 text-lg"
                />
                {avatarUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                    <Loader2 className="size-5 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                >
                  <Camera className="mr-1.5 size-4" /> Change Photo
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">JPG or PNG, up to 5MB.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-6 rounded-xl border border-border bg-white p-6 sm:p-8">
            <h2 className="font-semibold text-navy">Personal Information</h2>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="mt-5 space-y-5">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-2">
                  <Label htmlFor="account-email">Email</Label>
                  <Input id="account-email" value={user?.email ?? ''} disabled />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+81 3-0000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={profileSubmitting}
                  className="bg-navy text-white hover:bg-navy-deep"
                >
                  {profileSubmitting ? 'Saving…' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6 rounded-xl border border-border bg-white p-6 sm:p-8">
            <h2 className="font-semibold text-navy">Change Password</h2>
            <div className="mt-5">
              <AuthErrorCard message={passwordError} />
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <PasswordInput autoComplete="current-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <PasswordInput autoComplete="new-password" {...field} />
                        </FormControl>
                        <PasswordStrengthMeter password={newPassword} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <PasswordInput autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={passwordSubmitting}
                    className="bg-navy text-white hover:bg-navy-deep"
                  >
                    {passwordSubmitting ? 'Updating…' : 'Update Password'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}
