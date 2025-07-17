import { getUserById } from '@/api/UserApi'
import { authStore } from '@/app/store'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BeatLoader, RingLoader } from 'react-spinners'

export const Route = createFileRoute('/user/reviews')({
  component: RouteComponent,
})

function RouteComponent() {
  const userId = authStore.state.user?.id

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user-details', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  if (isLoading)
    return (
      <div className=" w-fit text-center py-10 m-auto">
        <BeatLoader color="#1f00ff" margin={10} size={20} />
        Loading...
      </div>
    )
  if (error)
    return (
      <div className="text-center text-red-500 py-8">
        Error loading reviews.
      </div>
    )
  if (!user || !user.ratingsReceived || user.ratingsReceived.length === 0)
    return (
      <div className="text-center text-gray-600 py-8">
        No reviews received yet.
      </div>
    )

  return (
    <div className="mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">
        Reviews Received by {user.firstName || 'User'}
      </h1>
      <ul className="space-y-6 flex flex-row flex-wrap gap-3">
        {user.ratingsReceived.map((rating: any) => (
          <li
            key={rating.id}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-200 dark:bg-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-yellow-500 font-semibold">
                ⭐ {rating.score} / 5
              </span>
              <span className="text-sm text-gray-500 dark:text-white">
                {new Date(rating.createdAt).toLocaleDateString()}{' '}
                {new Date(rating.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-gray-700 mb-3 dark:text-white">
              <strong>Comment:</strong>{' '}
              {rating.comment ? rating.comment : <em>No comment</em>}
            </p>

            <div className="text-sm text-gray-600 space-y-1 dark:text-white">
              <div>
                <strong>From:</strong> {rating.rater.firstName}{' '}
                {rating.rater.lastName}
              </div>
              <div>
                <strong>Ride Fare:</strong> $
                {Number(rating.ride.fare).toFixed(2)} |{' '}
                <strong>Distance:</strong> {rating.ride.distanceKm} km
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
