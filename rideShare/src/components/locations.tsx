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
import type { LatLngExpression } from 'leaflet'

interface MapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'pickup' | 'destination'
  setCoords: (coords: [number, number]) => void
  currentCoords: [number, number] | null
  pickupCoords?: [number, number] | null
  destinationCoords?: [number, number] | null
}

// Fetch route geometry from OSRM public API
async function fetchRoute(
  pickup: [number, number],
  destination: [number, number],
): Promise<[number, number][]> {
  try {
    // OSRM expects coordinates as lon,lat
    const url = `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`
    const res = await fetch(url)
    const data = await res.json()
    if (data.routes && data.routes.length > 0) {
      // Convert [lon, lat] to [lat, lon] for Leaflet
      return data.routes[0].geometry.coordinates.map(
        ([lon, lat]: [number, number]) => [lat, lon] as [number, number],
      )
    }
    return []
  } catch (error) {
    console.error('Failed to fetch route:', error)
    return []
  }
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
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])

  // Fetch search results for location input
  useEffect(() => {
    if (!search) {
      setSearchResults([])
      return
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            search,
          )}`,
        )
        const data = await res.json()
        setSearchResults(data)
      } catch {
        setSearchResults([])
      }
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [search])

  // Fetch route whenever pickup or destination changes
  useEffect(() => {
    async function getRoute() {
      if (pickupCoords && destinationCoords) {
        const coords = await fetchRoute(pickupCoords, destinationCoords)
        setRouteCoords(coords)
      } else {
        setRouteCoords([])
      }
    }
    getRoute()
  }, [pickupCoords, destinationCoords])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-8xl w-full p-0">
        <div className="flex h-[600px]">
          {/* Left side: Search and results */}
          <div className="w-2/5 p-4 border-r overflow-auto flex flex-col">
            <h2 className="text-lg font-semibold capitalize mb-4">
              Select {mode} Location
            </h2>
            <Input
              placeholder="Search for location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4"
            />
            {searchResults.length > 0 && (
              <ul className="overflow-auto text-sm text-gray-700 space-y-1 flex-grow">
                {searchResults.map((place, index) => {
                  const coords: [number, number] = [
                    parseFloat(place.lat),
                    parseFloat(place.lon),
                  ]
                  return (
                    <li
                      key={index}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded"
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

          {/* Right side: Map */}
          <div className="flex-1">
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

              {/* Render real route if available */}
              {routeCoords.length > 0 ? (
                <Polyline positions={routeCoords} color="blue" />
              ) : (
                // Fallback: dashed straight line
                pickupCoords &&
                destinationCoords && (
                  <Polyline
                    positions={[pickupCoords, destinationCoords]}
                    color="gray"
                    dashArray="4"
                  />
                )
              )}

              <FitMapBounds
                pickup={pickupCoords}
                destination={destinationCoords}
              />
            </MapContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
