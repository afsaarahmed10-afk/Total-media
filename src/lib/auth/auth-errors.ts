import type { AuthError } from '@supabase/supabase-js'

/** Translates raw Supabase Auth error messages into copy suitable for the
 * elegant inline error cards on the auth pages, instead of surfacing
 * Postgres/GoTrue internals directly to the user. */
export function mapAuthError(error: AuthError | Error): string {
  const msg = error.message.toLowerCase()

  if (msg.includes('invalid login credentials')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (msg.includes('email not confirmed')) {
    return 'Please verify your email address before signing in — check your inbox for the confirmation link.'
  }
  if (msg.includes('already registered') || msg.includes('user already exists')) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (msg.includes('password should be at least') || msg.includes('password is too short')) {
    return 'Password is too short. Use at least 8 characters.'
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Network error — check your connection and try again.'
  }
  if (msg.includes('provider is not enabled')) {
    return 'Google sign-in isn’t configured yet. Please use email and password for now.'
  }

  return error.message || 'Something went wrong. Please try again.'
}
