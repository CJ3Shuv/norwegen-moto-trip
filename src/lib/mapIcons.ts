import L from 'leaflet'
import type { StopTag } from '../data/stops'

export const TAG_EMOJI: Record<StopTag, string> = {
  ferry: '⛴️',
  bridge: '🌉',
  border: '🛂',
  city: '🏙️',
  landmark: '🏔️',
}

const BASE_COLOR = '#c1502e'
const ACTIVE_COLOR = '#2f6690'

export function numberedIcon(index: number, active = false) {
  const size = active ? 34 : 26
  const color = active ? ACTIVE_COLOR : BASE_COLOR
  return L.divIcon({
    className: 'numbered-marker',
    html: `<div style="
      background:${color};
      color:white;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow:0 2px ${active ? 10 : 6}px rgba(0,0,0,0.4);
      border:${active ? 3 : 2.5}px solid white;
      transition:all .2s ease;
    "><span style="font-size:${active ? 14 : 12}px;font-weight:700;font-family:system-ui;">${
      index + 1
    }</span></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}
