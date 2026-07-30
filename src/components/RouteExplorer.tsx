import { useEffect, useMemo, useRef, useState } from 'react'
import { ROUTES, ROUTE_COMPARISON } from '../data/routes'
import { STOPS, type Stop } from '../data/stops'
import { routeDistanceKm } from '../lib/geo'
import { TAG_EMOJI } from '../lib/mapIcons'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from './AuthGate'
import { AdventureMap } from './AdventureMap'
import './RouteExplorer.css'

const COUNTRY_FLAG: Record<Stop['country'], string> = {
  DK: '🇩🇰',
  NO: '🇳🇴',
  SE: '🇸🇪',
}

interface Reaction {
  userId: string
  displayName: string
  wish: string | null
}

function useStopReactions(profile: Profile) {
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({})

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    supabase
      .from('stop_reactions')
      .select('stop_id, user_id, display_name, wish')
      .then(({ data }) => {
        if (cancelled || !data) return
        const grouped: Record<string, Reaction[]> = {}
        for (const row of data) {
          const list = grouped[row.stop_id] ?? (grouped[row.stop_id] = [])
          list.push({ userId: row.user_id, displayName: row.display_name, wish: row.wish })
        }
        setReactions(grouped)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function toggleLike(stopId: string) {
    if (!supabase) return
    const mine = reactions[stopId]?.find((r) => r.userId === profile.id)
    if (mine) {
      const { error } = await supabase
        .from('stop_reactions')
        .delete()
        .eq('stop_id', stopId)
        .eq('user_id', profile.id)
      if (error) return
      setReactions((prev) => ({
        ...prev,
        [stopId]: (prev[stopId] ?? []).filter((r) => r.userId !== profile.id),
      }))
    } else {
      const { error } = await supabase
        .from('stop_reactions')
        .upsert({ stop_id: stopId, user_id: profile.id, display_name: profile.display_name, wish: null })
      if (error) return
      setReactions((prev) => ({
        ...prev,
        [stopId]: [
          ...(prev[stopId] ?? []),
          { userId: profile.id, displayName: profile.display_name, wish: null },
        ],
      }))
    }
  }

  async function submitWish(stopId: string, wishText: string) {
    if (!supabase) return
    const trimmed = wishText.trim() || null
    const { error } = await supabase
      .from('stop_reactions')
      .upsert({ stop_id: stopId, user_id: profile.id, display_name: profile.display_name, wish: trimmed })
    if (error) return
    setReactions((prev) => {
      const others = (prev[stopId] ?? []).filter((r) => r.userId !== profile.id)
      return {
        ...prev,
        [stopId]: [...others, { userId: profile.id, displayName: profile.display_name, wish: trimmed }],
      }
    })
  }

  return { reactions, toggleLike, submitWish }
}

function StopThumb({ stop }: { stop: Stop }) {
  if (!stop.images[0]) {
    return (
      <div className="stop-thumb stop-thumb-fallback">
        <span>{TAG_EMOJI[stop.tag]}</span>
      </div>
    )
  }
  return (
    <div className="stop-thumb">
      <img src={stop.images[0].url} alt={stop.name} loading="lazy" />
    </div>
  )
}

function StopModal({
  stop,
  onClose,
  reactions,
  profile,
  onSubmitWish,
}: {
  stop: Stop
  onClose: () => void
  reactions: Reaction[]
  profile: Profile
  onSubmitWish: (stopId: string, wish: string) => void
}) {
  const myReaction = reactions.find((r) => r.userId === profile.id)
  const [wishDraft, setWishDraft] = useState(myReaction?.wish ?? '')
  const others = reactions.filter((r) => r.wish)

  return (
    <div className="stop-modal-backdrop" onClick={onClose}>
      <div className="stop-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stop-modal-close" onClick={onClose} aria-label="Schließen">
          ✕
        </button>
        {stop.images.length > 0 ? (
          <div className="stop-modal-carousel">
            {stop.images.map((img, i) => (
              <img key={i} src={img.url} alt={`${stop.name} ${i + 1}`} />
            ))}
          </div>
        ) : (
          <div className="stop-modal-image stop-thumb-fallback large">
            <span>{TAG_EMOJI[stop.tag]}</span>
          </div>
        )}
        <div className="stop-modal-body">
          <div className="stop-modal-flag">
            {COUNTRY_FLAG[stop.country]} {TAG_EMOJI[stop.tag]}
          </div>
          <h2>{stop.name}</h2>
          <p className="stop-modal-fact">{stop.fact}</p>
          <p className="stop-modal-description">{stop.description}</p>
          {stop.images[0] && (
            <p className="stop-modal-credit">
              Fotos:{' '}
              {stop.images.map((img, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  <a href={img.sourceUrl} target="_blank" rel="noreferrer">
                    {img.author}
                  </a>{' '}
                  ({img.license})
                </span>
              ))}
              , Wikimedia Commons
            </p>
          )}

          <div className="wish-section">
            <div className="wish-heading">💬 Wünsche &amp; Eindrücke</div>
            {others.length === 0 ? (
              <p className="wish-empty">Noch keine Kommentare — sei der Erste.</p>
            ) : (
              <ul className="wish-list">
                {others.map((r) => (
                  <li key={r.userId}>
                    <strong>{r.displayName}:</strong> {r.wish}
                  </li>
                ))}
              </ul>
            )}
            <form
              className="wish-form"
              onSubmit={(e) => {
                e.preventDefault()
                onSubmitWish(stop.id, wishDraft)
              }}
            >
              <input
                type="text"
                placeholder="Dein Kommentar oder Wunsch zu diesem Stopp…"
                value={wishDraft}
                onChange={(e) => setWishDraft(e.target.value)}
              />
              <button type="submit">Speichern</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RouteExplorer({ profile }: { profile: Profile }) {
  const [routeId, setRouteId] = useState<'route1' | 'route2'>('route1')
  const [activeStopId, setActiveStopId] = useState<string | null>(null)
  const [modalStopId, setModalStopId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const { reactions, toggleLike, submitWish } = useStopReactions(profile)

  const route = ROUTES.find((r) => r.id === routeId)!
  const stops = useMemo(() => route.stopIds.map((id) => STOPS[id]), [route])

  useEffect(() => {
    setActiveStopId(stops[0]?.id ?? null)
  }, [stops])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.getAttribute('data-stop-id')
          if (!id) continue
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { id, ratio: entry.intersectionRatio }
          }
        }
        if (best) setActiveStopId(best.id)
      },
      { threshold: [0.25, 0.5, 0.75, 1], rootMargin: '-15% 0px -15% 0px' },
    )
    Object.values(cardRefs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [stops])

  const totalKm = useMemo(
    () => routeDistanceKm(stops.map((s) => ({ lat: s.lat, lng: s.lng }))),
    [stops],
  )
  const estimatedDays = Math.max(1, Math.round(totalKm / 350))
  const activeIndex = stops.findIndex((s) => s.id === activeStopId)
  const progressPct = stops.length > 1 ? (Math.max(activeIndex, 0) / (stops.length - 1)) * 100 : 0
  const modalStop = modalStopId ? STOPS[modalStopId] : null

  return (
    <div className="explorer">
      <div className="explorer-panel">
        <div className="route-tabs">
          {ROUTES.map((r) => (
            <button
              key={r.id}
              className={r.id === routeId ? 'route-tab active' : 'route-tab'}
              onClick={() => setRouteId(r.id)}
            >
              <span className="route-tab-title">{r.title}</span>
              <span className="route-tab-subtitle">{r.subtitle}</span>
            </button>
          ))}
        </div>

        <div className="ferry-badge">{route.ferryBadge}</div>
        <p className="route-comparison">{ROUTE_COMPARISON}</p>

        <div className="explorer-stats">
          <div className="stat">
            <div className="value">{totalKm.toFixed(0)} km</div>
            <div className="label">Luftlinie</div>
          </div>
          <div className="stat">
            <div className="value">{stops.length}</div>
            <div className="label">Stopps</div>
          </div>
          <div className="stat">
            <div className="value">~{estimatedDays}</div>
            <div className="label">Tage (Richtwert)</div>
          </div>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="timeline">
          {stops.map((stop, i) => {
            const stopReactions = reactions[stop.id] ?? []
            const liked = stopReactions.some((r) => r.userId === profile.id)
            return (
              <div
                key={stop.id}
                data-stop-id={stop.id}
                ref={(el) => {
                  cardRefs.current[stop.id] = el
                }}
                className={stop.id === activeStopId ? 'stop-card active' : 'stop-card'}
                onClick={() => setActiveStopId(stop.id)}
              >
                <div className="stop-card-index">{i + 1}</div>
                <StopThumb stop={stop} />
                <div className="stop-card-body">
                  <div className="stop-card-heading">
                    <span className="stop-flag">{COUNTRY_FLAG[stop.country]}</span>
                    <h3>{stop.name}</h3>
                    <span className="stop-tag-icon" title={stop.tag}>
                      {TAG_EMOJI[stop.tag]}
                    </span>
                  </div>
                  <p className="stop-fact">{stop.fact}</p>
                  <div className="stop-card-footer">
                    <button
                      className="stop-detail-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setModalStopId(stop.id)
                      }}
                    >
                      Details ansehen
                    </button>
                    <button
                      className={liked ? 'stop-like-btn liked' : 'stop-like-btn'}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(stop.id)
                      }}
                      title="Gefällt mir"
                    >
                      {liked ? '❤️' : '🤍'}
                      {stopReactions.length > 0 && (
                        <span className="stop-like-names">
                          {stopReactions.map((r) => r.displayName).join(', ')}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="explorer-map">
        <AdventureMap stops={stops} activeStopId={activeStopId} onSelectStop={setActiveStopId} />
      </div>

      {modalStop && (
        <StopModal
          stop={modalStop}
          onClose={() => setModalStopId(null)}
          reactions={reactions[modalStop.id] ?? []}
          profile={profile}
          onSubmitWish={submitWish}
        />
      )}
    </div>
  )
}
