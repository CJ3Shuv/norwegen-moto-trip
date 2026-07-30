import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Single browser client for the whole app — this is a client-only SPA (no
// server/SSR component), so there is only ever one client and one session
// source (localStorage). Do not create a second client elsewhere.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseConfigured = supabase !== null
