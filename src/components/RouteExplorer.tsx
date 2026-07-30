import { useEffect, useMemo, useRef, useState } from 'react'
import { ROUTES, ROUTE_COMPARISON } from '../data/routes'
import { STOPS, type Stop } from '../data/stops'
import { routeDistanceKm } from '../lib/geo'
import { TAG_EMOJI } from '../lib/mapIcons'
import { AdventureMap } from './AdventureMap'
import './RouteExplorer.css'

const COUNTRY_FLAG: Record<Stop['country'], string> = {
  DK: '🇩🇰',
  NO: '🇳🇴',
  SE: '🇸🇪',
}

function StopThumb({ stop }: { stop: Stop }) {
  if (!stop.image) {
    return (
      <div className="stop-thumb stop-thumb-fallback">
        <span>{TAG_EMOJI[stop.tag]}</span>
      </div>
    )
  }
  return (
    <div className="stop-thumb">
      <img src={stop.image.url} alt={stop.name} loading="lazy" />
    </div>
  )
}

function StopModal({ stop, onClose }: { stop: Stop; onClose: () => void }) {
  return (
    <div className="stop-modal-backdrop" onClick={onClose}>
      <div className="stop-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stop-modal-close" onClick={onClose} aria-label="Schließen">
          ✕
        </button>
        {stop.image ? (
          <img className="stop-modal-image" src={stop.image.url} alt={stop.name} />
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
          {stop.image && (
            <p className="stop-modal-credit">
              Foto:{' '}
              <a href={stop.image.sourceUrl} target="_blank" rel="noreferrer">
                {stop.image.author}
              </a>{' '}
              ({stop.image.license}, Wikimedia Commons)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function RouteExplorer() {
  const [routeId, setRouteId] = useState<'route1' | 'route2'>('route1')
  const [activeStopId, setActiveStopId] = useState<string | null>(null)
  const [modalStopId, setModalStopId] = useState<string | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

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
          {stops.map((stop, i) => (
            <div
              key={stop.id}
              data-stop-id={stop.id}
              ref={(el) => {
                cardRefs.current[stop.id] = el
              }}
              className={
                stop.id === activeStopId ? 'stop-card active' : 'stop-card'
              }
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
                <button
                  className="stop-detail-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setModalStopId(stop.id)
                  }}
                >
                  Details ansehen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="explorer-map">
        <AdventureMap stops={stops} activeStopId={activeStopId} onSelectStop={setActiveStopId} />
      </div>

      {modalStop && <StopModal stop={modalStop} onClose={() => setModalStopId(null)} />}
    </div>
  )
}
