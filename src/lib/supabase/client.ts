import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False when no Supabase project is configured (no .env.local yet). The
 * client is still created below with placeholder values in that case —
 * AuthProvider wraps the entire app, so throwing here would blank-screen
 * every page, not just the ones that need Supabase. Callers that depend on
 * a live project (content-store, auth pages) check this flag instead. */
export const isSupabaseConfigured = Boolean(url && anonKey)

const REMEMBER_ME_KEY = 'totalmedia-remember-me'

/** "Remember me" unchecked means the session lives in sessionStorage (gone
 * when the tab closes) instead of localStorage. Defaults to persistent
 * (localStorage) whenever the flag hasn't been set yet, matching Supabase's
 * own default — so OAuth/signup flows that never call this still persist. */
function getPreferredStorage(): Storage {
  return localStorage.getItem(REMEMBER_ME_KEY) === 'false' ? sessionStorage : localStorage
}

export function setRememberMe(remember: boolean) {
  localStorage.setItem(REMEMBER_ME_KEY, String(remember))
}

const authStorage = {
  getItem: (key: string) => getPreferredStorage().getItem(key),
  setItem: (key: string, value: string) => getPreferredStorage().setItem(key, value),
  removeItem: (key: string) => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
}

export const supabase = createClient<Database>(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      storage: authStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)
