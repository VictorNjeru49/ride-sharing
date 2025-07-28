// import { getPromoCodeById, getPromoCodes } from '@/api/UserApi'
// import type { PromoCode } from '@/types/alltypes'
// import { useQuery } from '@tanstack/react-query'
// import { useParams } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  // // const { id } = useParams({ strict: false }) as { id?: string }

  // const {
  //   data: promos,
  //   isPending,
  //   isError,
  // } = useQuery<PromoCode[]>({
  //   queryKey: ['promo'],
  //   queryFn: getPromoCodes,
  // })

  return (
    <main className="max-w-[80%] mx-auto px-6 py-12 space-y-12">
      {/* Hero Section */}
      <section>
        <h1 className="text-4xl font-bold mb-4">About Our Platform</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Welcome to our Ride-Share & Investment Platform — where mobility meets
          opportunity. We aim to revolutionize the way people move and invest,
          all from one seamless platform.
        </p>
      </section>

      {/* Why Ride */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Why Ride with Us?</h2>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Reliable and safe rides across cities and towns</li>
          <li>Real-time tracking and secure digital payments</li>
          <li>Verified drivers and 24/7 support</li>
        </ul>
      </section>

      {/* Investment */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Investment Opportunities
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Join our community of investors who are fueling the next generation of
          transportation. Whether you're a driver looking to grow your fleet or
          an investor seeking returns, we offer:
        </p>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Vehicle leasing and partnership programs</li>
          <li>Profit-sharing models with real-time reporting</li>
          <li>Flexible investment plans for individuals and groups</li>
        </ul>
      </section>

      {/* Mission */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300">
          We’re building a smarter, greener, and more inclusive future — one
          ride and one investment at a time.
        </p>
      </section>

      {/* Pricing Plans */}
      <section
        id="pricing"
        className="py-10 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg"
      >
        <div className="lg:max-w-5xl lg:flex-row mx-auto px-5 md:flex-col md:w-full">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Pricing Plans
          </h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 w-full">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow py-28 px-6 flex flex-col ${
                  plan.popular
                    ? 'border-2 border-indigo-600 dark:border-indigo-400 relative'
                    : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-sm px-3 py-1 rounded-bl-md rounded-tr-md">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-4 text-center">
                  {plan.title}
                </h3>
                <p className="text-4xl font-bold text-center mb-4">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-700 dark:text-gray-300">
                    /trip
                  </span>
                </p>
                <ul className="text-gray-700 dark:text-gray-300 mb-6 flex-1 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium text-center transition"
                >
                  Choose Plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Section
      <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-12 hidden">
        <h2 className="text-2xl font-semibold mb-4">Promo Code Info</h2>

        {isPending ? (
          <p>Loading promo codes...</p>
        ) : isError || !promos || promos.length === 0 ? (
          <p className="text-red-500">No promo codes found or error loading.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {promos.map((promo) => (
              <div
                key={promo.code}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <p>
                  <strong>Code:</strong> {promo.code}
                </p>
                <p>
                  <strong>Discount:</strong> ${promo.discountAmount}
                </p>
                <p>
                  <strong>Usage Limit:</strong> {promo.usageLimit}
                </p>
                <p>
                  <strong>Active:</strong> {promo.isActive ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Expires:</strong>{' '}
                  {new Date(promo.expirationDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section> */}
    </main>
  )
}

const plans = [
  {
    title: 'Basic Ride',
    price: '$5',
    features: [
      'Single trip up to 5 km',
      'Standard vehicle',
      'Real-time tracking',
      'Cashless payment',
    ],
  },
  {
    title: 'Premium Ride',
    price: '$15',
    popular: true,
    features: [
      'Up to 20 km per trip',
      'Premium vehicle (AC & Wi-Fi)',
      'Priority pickup',
      '24/7 Customer support',
    ],
  },
  {
    title: 'Business Pass',
    price: '$49',
    features: [
      'Unlimited rides within city for 7 days',
      'Business class vehicles',
      'Personal driver support',
      'Invoice for corporate claims',
    ],
  },
]
