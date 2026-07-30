import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet'
import type L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { routeDistanceKm } from '../lib/geo'
import { numberedIcon } from '../lib/mapIcons'
import { usePrefersDark } from '../lib/usePrefersDark'
import '../App.css'

interface Waypoint {
  id: string
  lat: number
  lng: number
  name: string
}

interface SearchResult {
  display_name: string
  lat: string
  lon: string
}

const STORAGE_KEY = 'moto-trip-waypoints'

// Norway + a bit of the approach route (Germany/Denmark/Sweden), roughly centered.
const DEFAULT_CENTER: [number, number] = [61.5, 9.5]
const DEFAULT_ZOOM = 5

const ROUTE_COLOR = '#c1502e'

function ClickToAddWaypoint({ onAdd }: { onAdd: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function FreeformPlanner() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Waypoint[]) : []
    } catch {
      return []
    }
  })
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [panelExpanded, setPanelExpanded] = useState(true)
  const prefersDark = usePrefersDark()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(waypoints))
  }, [waypoints])

  const totalKm = useMemo(() => routeDistanceKm(waypoints), [waypoints])
  const estimatedHours = useMemo(() => totalKm / 65, [totalKm])

  function addWaypoint(lat: number, lng: number, name?: string) {
    setWaypoints((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        lat,
        lng,
        name: name ?? `Wegpunkt ${prev.length + 1}`,
      },
    ])
  }

  function removeWaypoint(id: string) {
    setWaypoints((prev) => prev.filter((w) => w.id !== id))
  }

  function moveWaypoint(index: number, direction: -1 | 1) {
    setWaypoints((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function clearAll() {
    setWaypoints([])
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setSearchError(null)
    setResults([])
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
        query,
      )}`
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Suche fehlgeschlagen')
      const data = (await res.json()) as SearchResult[]
      if (data.length === 0) {
        setSearchError('Kein Ort gefunden.')
      }
      setResults(data)
    } catch {
      setSearchError('Suche fehlgeschlagen. Bitte erneut versuchen.')
    } finally {
      setSearching(false)
    }
  }

  function pickResult(r: SearchResult) {
    addWaypoint(parseFloat(r.lat), parseFloat(r.lon), r.display_name.split(',')[0])
    setResults([])
    setQuery('')
  }

  const polylinePositions = waypoints.map((w) => [w.lat, w.lng] as [number, number])

  const tileUrl = prefersDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  return (
    <div className="app">
      <aside className={`sidebar ${panelExpanded ? 'expanded' : 'collapsed'}`}>
        <button type="button" className="sheet-handle" onClick={() => setPanelExpanded((v) => !v)}>
          <span className="grip" />
          <span className="summary">
            {waypoints.length === 0 ? 'Route planen' : `${totalKm.toFixed(0)} km`}{' '}
            {waypoints.length > 0 && (
              <span className="muted">
                · {estimatedHours.toFixed(1)} h · {waypoints.length} Stopps
              </span>
            )}
          </span>
          <span className="chevron">▲</span>
        </button>

        <div className="sidebar-content">
          <div>
            <div className="eyebrow">Eigene Route</div>
            <h1>✏️ Frei planen</h1>
            <p className="subtitle">Eigene Stopps setzen und Distanz berechnen</p>
          </div>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Ort suchen (z. B. Trollstigen)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" disabled={searching}>
              {searching ? '…' : 'Suchen'}
            </button>
          </form>
          {searchError && <p className="search-error">{searchError}</p>}
          {results.length > 0 && (
            <ul className="waypoint-list">
              {results.map((r, i) => (
                <li key={i} className="waypoint-item">
                  <span className="name">{r.display_name}</span>
                  <div className="actions">
                    <button onClick={() => pickResult(r)} title="Als Stopp hinzufügen">
                      ➕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="hint">
            Tipp: Klicke auf die Karte, um Stopps hinzuzufügen. Marker lassen sich per Drag &
            Drop verschieben.
          </p>

          <div className="stats">
            <div className="stat">
              <div className="value">{totalKm.toFixed(0)} km</div>
              <div className="label">Gesamtstrecke</div>
            </div>
            <div className="stat">
              <div className="value">{estimatedHours.toFixed(1)} h</div>
              <div className="label">Fahrzeit (~65 km/h)</div>
            </div>
          </div>

          <div className="toolbar">
            <button className="secondary" onClick={clearAll} disabled={waypoints.length === 0}>
              Route leeren
            </button>
          </div>

          {waypoints.length === 0 ? (
            <p className="empty-state">
              Noch keine Stopps. Suche einen Ort oder klicke auf die Karte.
            </p>
          ) : (
            <ul className="waypoint-list">
              {waypoints.map((w, i) => (
                <li className="waypoint-item" key={w.id}>
                  <span className="index">{i + 1}</span>
                  <span className="name" title={w.name}>
                    {w.name}
                  </span>
                  <div className="actions">
                    <button onClick={() => moveWaypoint(i, -1)} disabled={i === 0} title="Nach oben">
                      ↑
                    </button>
                    <button
                      onClick={() => moveWaypoint(i, 1)}
                      disabled={i === waypoints.length - 1}
                      title="Nach unten"
                    >
                      ↓
                    </button>
                    <button onClick={() => removeWaypoint(w.id)} title="Entfernen">
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="footer-note">Kartendaten © OpenStreetMap-Mitwirkende, © CARTO</p>
        </div>
      </aside>

      <div className="map-area">
        <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Mitwirkende &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
            subdomains="abcd"
          />
          <ClickToAddWaypoint onAdd={(lat, lng) => addWaypoint(lat, lng)} />
          {polylinePositions.length > 1 && (
            <Polyline positions={polylinePositions} pathOptions={{ color: ROUTE_COLOR, weight: 4 }} />
          )}
          {waypoints.map((w, i) => (
            <Marker
              key={w.id}
              position={[w.lat, w.lng]}
              icon={numberedIcon(i)}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target as L.Marker
                  const pos = marker.getLatLng()
                  setWaypoints((prev) =>
                    prev.map((p) => (p.id === w.id ? { ...p, lat: pos.lat, lng: pos.lng } : p)),
                  )
                },
              }}
            >
              <Popup>{w.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
