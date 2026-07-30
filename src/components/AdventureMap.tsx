import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Stop } from '../data/stops'
import { numberedIcon } from '../lib/mapIcons'
import { usePrefersDark } from '../lib/usePrefersDark'

const ROUTE_COLOR = '#c1502e'
const DEFAULT_CENTER: [number, number] = [61.5, 9.5]
const DEFAULT_ZOOM = 5

function FlyToActive({ stops, activeStopId }: { stops: Stop[]; activeStopId: string | null }) {
  const map = useMap()
  useEffect(() => {
    if (!activeStopId) return
    const stop = stops.find((s) => s.id === activeStopId)
    if (!stop) return
    map.flyTo([stop.lat, stop.lng], Math.max(map.getZoom(), 8), { duration: 1.1 })
  }, [activeStopId, stops, map])
  return null
}

export function AdventureMap({
  stops,
  activeStopId,
  onSelectStop,
}: {
  stops: Stop[]
  activeStopId: string | null
  onSelectStop: (id: string) => void
}) {
  const prefersDark = usePrefersDark()
  const tileUrl = prefersDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const polylinePositions = stops.map((s) => [s.lat, s.lng] as [number, number])

  return (
    <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Mitwirkende &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={tileUrl}
        subdomains="abcd"
      />
      <FlyToActive stops={stops} activeStopId={activeStopId} />
      {polylinePositions.length > 1 && (
        <Polyline positions={polylinePositions} pathOptions={{ color: ROUTE_COLOR, weight: 4 }} />
      )}
      {stops.map((stop, i) => (
        <Marker
          key={stop.id}
          position={[stop.lat, stop.lng]}
          icon={numberedIcon(i, stop.id === activeStopId)}
          eventHandlers={{ click: () => onSelectStop(stop.id) }}
        >
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
