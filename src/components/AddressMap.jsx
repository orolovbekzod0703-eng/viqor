import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Default OSM icon fix (Vite doesn't bundle Leaflet's built-in images by default)
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
})

// Olmaliq markazi
const DEFAULT_CENTER = [40.8447, 69.5983]

export function AddressMap({ value, onChange, height = 240 }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const center = value?.lat && value?.lng ? [value.lat, value.lng] : DEFAULT_CENTER
    const map = L.map(ref.current, { zoomControl: true }).setView(center, 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)
    const marker = L.marker(center, { icon, draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      onChange({ lat, lng })
    })
    map.on('click', (e) => {
      marker.setLatLng(e.latlng)
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    })
    mapRef.current = map
    markerRef.current = marker
    setTimeout(() => map.invalidateSize(), 100)
    return () => { map.remove(); mapRef.current = null; markerRef.current = null }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (markerRef.current && value?.lat && value?.lng) {
      markerRef.current.setLatLng([value.lat, value.lng])
    }
  }, [value?.lat, value?.lng])

  return (
    <div className="rounded-xl overflow-hidden border border-brand-100" style={{ height }}>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
