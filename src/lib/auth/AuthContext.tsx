import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, setRememberMe } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'
import { mapAuthError } from './auth-errors'

export type CustomerProfile = Database['public']['Tables']['customers']['Row']
type ProfileUpdate = Partial<Pick<CustomerProfile, 'full_name' | 'company' | 'phone' | 'avatar_url'>>

interface AuthResult {
  error: string | null
}

interface SignUpResult extends AuthResult {
  needsEmailConfirmation: boolean
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: CustomerProfile | null
  /** True until the initial session check resolves — gates ProtectedRoute/GuestOnlyRoute. */
  loading: boolean
  signIn: (email: string, password: string, remember: boolean) => Promise<AuthResult>
  signUp: (params: { fullName: string; email: string; password: string }) => Promise<SignUpResult>
  signInWithGoogle: () => Promise<AuthResult>
  signOut: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<AuthResult>
  updatePassword: (password: string) => Promise<AuthResult>
  refreshProfile: () => Promise<void>
  updateProfile: (updates: ProfileUpdate) => Promise<AuthResult>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('customers').select('*').eq('id', userId).maybeSingle()
    setProfile(data ?? null)
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      const userId = data.session?.user.id
      if (userId) {
        loadProfile(userId).finally(() => mounted && setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      if (newSession?.user) {
        loadProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string, remember: boolean): Promise<AuthResult> {
    setRememberMe(remember)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? mapAuthError(error) : null }
  }

  async function signUp({
    fullName,
    email,
    password,
  }: {
    fullName: string
    email: string
    password: string
  }): Promise<SignUpResult> {
    setRememberMe(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return { error: mapAuthError(error), needsEmailConfirmation: false }
    return { error: null, needsEmailConfirmation: !data.session }
  }

  async function signInWithGoogle(): Promise<AuthResult> {
    setRememberMe(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    return { error: error ? mapAuthError(error) : null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function sendPasswordReset(email: string): Promise<AuthResult> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error ? mapAuthError(error) : null }
  }

  async function updatePassword(password: string): Promise<AuthResult> {
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error ? mapAuthError(error) : null }
  }

  async function refreshProfile() {
    if (session?.user) await loadProfile(session.user.id)
  }

  async function updateProfile(updates: ProfileUpdate): Promise<AuthResult> {
    if (!session?.user) return { error: 'You need to be signed in to do that.' }
    const { error } = await supabase.from('customers').update(updates).eq('id', session.user.id)
    if (!error) await loadProfile(session.user.id)
    return { error: error ? error.message : null }
  }

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    updatePassword,
    refreshProfile,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
