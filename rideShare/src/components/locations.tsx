// components/MapDialog.tsx
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
  useMap,
} from 'react-leaflet'
import type { LatLngExpression, Map as LeafletMap } from 'leaflet'

interface MapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'pickup' | 'destination'
  setCoords: (coords: [number, number]) => void
  currentCoords: [number, number] | null
  pickupCoords?: [number, number] | null
  destinationCoords?: [number, number] | null
}

function LocationMarker({
  setCoords,
}: {
  setCoords: (coords: [number, number]) => void
}) {
  useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng]
      setCoords(coords)
    },
  })
  return null
}

function FitMapBounds({
  pickup,
  destination,
}: {
  pickup?: [number, number] | null
  destination?: [number, number] | null
}) {
  const map = useMap()

  useEffect(() => {
    if (pickup && destination) {
      map.fitBounds([pickup, destination], { padding: [50, 50] })
    } else if (pickup) {
      map.setView(pickup, 13)
    } else if (destination) {
      map.setView(destination, 13)
    }
  }, [pickup, destination, map])

  return null
}

export default function MapDialog({
  open,
  onOpenChange,
  mode,
  setCoords,
  currentCoords,
  pickupCoords,
  destinationCoords,
}: MapDialogProps) {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([])

  useEffect(() => {
    if (!search) {
      setSearchResults([])
      return
    }
    const delayDebounce = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search,
        )}`,
      )
      const data = await res.json()
      setSearchResults(data)
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [search])

  const showPolyline = pickupCoords && destinationCoords
  const path: LatLngExpression[] = showPolyline
    ? [pickupCoords, destinationCoords]
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold capitalize">
            Select {mode} Location
          </h2>
          <Input
            placeholder="Search for location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2"
          />
          {searchResults.length > 0 && (
            <ul className="mt-2 max-h-48 overflow-auto text-sm text-gray-700 space-y-1">
              {searchResults.map((place, index) => {
                const coords: [number, number] = [
                  parseFloat(place.lat),
                  parseFloat(place.lon),
                ]
                return (
                  <li
                    key={index}
                    className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => {
                      setCoords(coords)
                      onOpenChange(false)
                    }}
                  >
                    {place.display_name}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="w-full h-[600px]">
          <MapContainer
            center={currentCoords ?? [0, 0]}
            zoom={13}
            scrollWheelZoom
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationMarker setCoords={setCoords} />

            {pickupCoords && (
              <Marker position={pickupCoords}>
                <Popup>Pickup</Popup>
              </Marker>
            )}
            {destinationCoords && (
              <Marker position={destinationCoords}>
                <Popup>Destination</Popup>
              </Marker>
            )}

            {showPolyline && <Polyline positions={path} color="blue" />}
            <FitMapBounds
              pickup={pickupCoords}
              destination={destinationCoords}
            />
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}
