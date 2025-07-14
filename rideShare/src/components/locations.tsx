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
} from 'react-leaflet'

interface MapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'pickup' | 'destination'
  setCoords: (coords: [number, number]) => void
  currentCoords: [number, number] | null
}

function LocationMarker({
  mode,
  setCoords,
}: {
  mode: 'pickup' | 'destination'
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

export default function MapDialog({
  open,
  onOpenChange,
  mode,
  setCoords,
  currentCoords,
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
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`,
      )
      const data = await res.json()
      setSearchResults(data)
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [search])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-7xl w-[800px] p-0">
        <div className="p-4 border-b w-full">
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
              {searchResults.map((place, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => {
                    const coords: [number, number] = [
                      parseFloat(place.lat),
                      parseFloat(place.lon),
                    ]
                    setCoords(coords)
                    onOpenChange(false)
                  }}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full h-[800px]">
          <MapContainer
            center={currentCoords ?? [0, 0]}
            zoom={13}
            scrollWheelZoom
            // style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker mode={mode} setCoords={setCoords} />
            {currentCoords && (
              <Marker position={currentCoords}>
                <Popup>{mode === 'pickup' ? 'Pickup' : 'Destination'}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}
