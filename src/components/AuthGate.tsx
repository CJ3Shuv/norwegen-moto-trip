import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import './AuthGate.css'

export interface Profile {
  id: string
  display_name: string
  avatar: string
}

const DEFAULT_AVATAR = '🏍️'

function SupabaseNotConfigured() {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-eyebrow">Setup nötig</div>
        <h1>Supabase ist noch nicht verbunden</h1>
        <p className="auth-subtitle">
          Lege ein kostenloses Projekt auf{' '}
          <a href="https://supabase.com" target="_blank" rel="noreferrer">
            supabase.com
          </a>{' '}
          an und trage Project URL + anon key in <code>.env.local</code> ein
          (siehe <code>.env.example</code> und <code>SUPABASE_SETUP.md</code>).
          Danach die Seite neu laden.
        </p>
      </div>
    </div>
  )
}

function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)
    setError(null)
    setInfo(null)

    const { error: authError, data } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    if (mode === 'signup' && !data.session) {
      setInfo(
        'Fast geschafft! Bitte bestätige deine E-Mail-Adresse über den Link, dann kannst du dich anmelden.',
      )
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-eyebrow">Motorrad Roadtrip</div>
        <h1>🏍️ Bereit für dein Abenteuer?</h1>
        <p className="auth-subtitle">
          Melde dich an, um deine Route durch Skandinavien zu planen.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => setMode('signin')}
          >
            Anmelden
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Registrieren
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            E-Mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            Passwort
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '…' : mode === 'signin' ? 'Los geht’s' : 'Konto erstellen'}
          </button>
        </form>
      </div>
    </div>
  )
}

function ProfileSetup({ onSaved }: { onSaved: (profile: Profile) => void }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user
    if (!user) return

    setSaving(true)
    setError(null)
    const trimmedName = name.trim()
    const avatar = DEFAULT_AVATAR
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, display_name: trimmedName, avatar })
    setSaving(false)

    if (upsertError) {
      setError(upsertError.message)
      return
    }
    onSaved({ id: user.id, display_name: trimmedName, avatar })
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-eyebrow">Fast geschafft</div>
        <h1>Wie dürfen wir dich nennen?</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              required
              placeholder="z. B. Cedric"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={saving || !name.trim()}>
            {saving ? '…' : 'Abenteuer starten'}
          </button>
        </form>
      </div>
    </div>
  )
}

export function AuthGate({
  children,
}: {
  children: (profile: Profile, signOut: () => void) => ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!newSession) setProfile(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('id, display_name, avatar')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile(data)
      })
    return () => {
      cancelled = true
    }
  }, [session])

  if (!isSupabaseConfigured) return <SupabaseNotConfigured />
  if (loading) return <div className="auth-screen" />
  if (!session) return <AuthForm />
  if (!profile) return <ProfileSetup onSaved={setProfile} />

  return <>{children(profile, () => void supabase?.auth.signOut())}</>
}
