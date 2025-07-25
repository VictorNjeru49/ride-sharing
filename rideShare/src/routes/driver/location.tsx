import { getDriverLocationById, getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useState, useEffect } from 'react'
import type { LatLngExpression } from 'leaflet'

export const Route = createFileRoute('/driver/location')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user.id

  const {
    data: driverLocation,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['driverlocation', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  })

  const [position, setPosition] = useState<LatLngExpression | null>(null)

  useEffect(() => {
    if (
      driverLocation?.driverLocations &&
      driverLocation.driverLocations.length > 0
    ) {
      const firstLocation = driverLocation.driverLocations[0]

      if (
        firstLocation.location?.latitude &&
        firstLocation.location?.longitude
      ) {
        setPosition([
          firstLocation.location.latitude,
          firstLocation.location.longitude,
        ])
      }
    }
  }, [driverLocation])

  if (isLoading) return <div>Loading driver location...</div>
  if (isError || !position) return <div>Failed to load driver location.</div>

  return (
    <div className="h-[600px] w-full">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Driver Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
