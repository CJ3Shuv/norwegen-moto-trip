import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import { STOPS } from '../data/stops'
import { BirthdayCelebration } from './BirthdayCelebration'
import './AuthGate.css'

const HIGHLIGHT_STOP_IDS = ['preikestolen', 'geirangerfjord', 'trollstigen']

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

function NameGate({
  hasSession,
  onDone,
}: {
  hasSession: boolean
  onDone: (profile: Profile) => void
}) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError(null)

    let userId: string
    if (hasSession) {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        setSaving(false)
        setError('Etwas ist schiefgelaufen. Bitte Seite neu laden.')
        return
      }
      userId = data.user.id
    } else {
      const { data, error: signInError } = await supabase.auth.signInAnonymously()
      if (signInError || !data.user) {
        setSaving(false)
        setError(signInError?.message ?? 'Anmeldung fehlgeschlagen.')
        return
      }
      userId = data.user.id
    }

    const trimmedName = name.trim()
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({ id: userId, display_name: trimmedName, avatar: DEFAULT_AVATAR })
    setSaving(false)

    if (upsertError) {
      setError(upsertError.message)
      return
    }
    onDone({ id: userId, display_name: trimmedName, avatar: DEFAULT_AVATAR })
  }

  return (
    <div className="auth-screen">
      <div className="auth-card welcome-card">
        <div className="auth-eyebrow">🎉 Alles Gute zum Geburtstag</div>
        <h1>Was dich auf dieser Tour erwartet, Papa</h1>
        <p className="auth-subtitle">
          Als Geschenk lade ich dich ein: eine Motorradtour durch Dänemark und
          Norwegen, mit Fjorden, Pässen und Küstenstraßen, die es in sich
          haben. Wirf schon mal einen Blick auf ein paar Stationen, bevor wir
          die Route gemeinsam planen.
        </p>

        <div className="welcome-highlights">
          {HIGHLIGHT_STOP_IDS.map((id) => {
            const stop = STOPS[id]
            return (
              <div className="welcome-highlight" key={id}>
                {stop.images[0] && (
                  <img src={stop.images[0].url} alt={stop.name} loading="lazy" />
                )}
                <div className="welcome-highlight-name">{stop.name}</div>
              </div>
            )
          })}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="Dein Name"
            aria-label="Dein Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit" disabled={saving || !name.trim()}>
            {saving ? '…' : 'Tour ansehen'}
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
  const [justArrived, setJustArrived] = useState(false)

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
  if (!session || !profile) {
    return (
      <NameGate
        hasSession={Boolean(session)}
        onDone={(p) => {
          setProfile(p)
          setJustArrived(true)
        }}
      />
    )
  }
  if (justArrived) {
    return (
      <BirthdayCelebration
        onContinue={() => setJustArrived(false)}
      />
    )
  }

  return <>{children(profile, () => void supabase?.auth.signOut())}</>
}
