import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from './AuthGate'
import './IdeasBoard.css'

interface Note {
  id: string
  userId: string
  displayName: string
  message: string
  createdAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function IdeasBoard({ profile }: { profile: Profile }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    supabase
      .from('trip_notes')
      .select('id, user_id, display_name, message, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled || !data) return
        setNotes(
          data.map((row) => ({
            id: row.id,
            userId: row.user_id,
            displayName: row.display_name,
            message: row.message,
            createdAt: row.created_at,
          })),
        )
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    const trimmed = draft.trim()
    if (!trimmed) return
    setSending(true)
    setError(null)
    const { data, error: insertError } = await supabase
      .from('trip_notes')
      .insert({ user_id: profile.id, display_name: profile.display_name, message: trimmed })
      .select('id, user_id, display_name, message, created_at')
      .single()
    setSending(false)
    if (insertError || !data) {
      setError(insertError?.message ?? 'Konnte nicht gespeichert werden.')
      return
    }
    setNotes((prev) => [
      {
        id: data.id,
        userId: data.user_id,
        displayName: data.display_name,
        message: data.message,
        createdAt: data.created_at,
      },
      ...prev,
    ])
    setDraft('')
  }

  async function handleDelete(id: string) {
    if (!supabase) return
    const { error: deleteError } = await supabase.from('trip_notes').delete().eq('id', id)
    if (deleteError) return
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="ideas-board">
      <div className="ideas-card">
        <div className="eyebrow">Feedback</div>
        <h1>💡 Ideen &amp; Anmerkungen</h1>
        <p className="subtitle">
          Hast du Ideen, Wünsche oder Verbesserungsvorschläge für die Tour?
          Schreib sie hier rein — ich nehme sie mit in die Planung auf.
        </p>

        <form onSubmit={handleSubmit} className="ideas-form">
          <textarea
            placeholder="z. B. Lass uns einen Tag mehr für Bergen einplanen…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
          />
          {error && <p className="ideas-error">{error}</p>}
          <button type="submit" disabled={sending || !draft.trim()}>
            {sending ? '…' : 'Absenden'}
          </button>
        </form>

        <div className="ideas-list">
          {notes.length === 0 ? (
            <p className="ideas-empty">Noch keine Notizen — sei der Erste.</p>
          ) : (
            notes.map((note) => (
              <div className="ideas-note" key={note.id}>
                <div className="ideas-note-head">
                  <strong>{note.displayName}</strong>
                  <span className="ideas-note-date">{formatDate(note.createdAt)}</span>
                  {note.userId === profile.id && (
                    <button
                      className="ideas-note-delete"
                      onClick={() => handleDelete(note.id)}
                      title="Löschen"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p>{note.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
