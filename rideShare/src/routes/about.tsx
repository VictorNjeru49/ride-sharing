import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
          About Our Platform
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Welcome to our Ride-Share & Investment Platform — where mobility meets
          opportunity. We aim to revolutionize the way people move and invest,
          all from one seamless platform.
        </p>
      </section>

      {/* Why Ride */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-5 text-gray-900 dark:text-white">
          Why Ride with Us?
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          <li>Reliable and safe rides across cities and towns</li>
          <li>Real-time tracking and secure digital payments</li>
          <li>Verified drivers and 24/7 support</li>
        </ul>
      </section>

      {/* Investment */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-5 text-gray-900 dark:text-white">
          Investment Opportunities
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          Join our community of investors who are fueling the next generation of
          transportation. Whether you're a driver looking to grow your fleet or
          an investor seeking returns, we offer:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          <li>Vehicle leasing and partnership programs</li>
          <li>Profit-sharing models with real-time reporting</li>
          <li>Flexible investment plans for individuals and groups</li>
        </ul>
      </section>

      {/* Mission */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-5 text-gray-900 dark:text-white">
          Our Mission
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          We’re building a smarter, greener, and more inclusive future — one
          ride and one investment at a time.
        </p>
      </section>

      {/* Pricing Plans */}
      <section
        id="pricing"
        className="py-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-md"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <h2 className="text-4xl font-extrabold mb-12 text-center">
            Pricing Plans
          </h2>
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 flex flex-col hover:shadow-2xl transition-shadow duration-300 ${
                  plan.popular
                    ? 'border-4 border-indigo-600 dark:border-indigo-400'
                    : 'border border-transparent'
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-sm px-4 py-1 rounded-bl-lg font-semibold select-none">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-semibold mb-6 text-center">
                  {plan.title}
                </h3>
                <p className="text-center text-5xl font-extrabold mb-8">
                  {plan.price}
                  <span className="text-xl font-normal text-gray-600 dark:text-gray-400">
                    /trip
                  </span>
                </p>
                <ul className="flex-1 space-y-4 text-gray-700 dark:text-gray-300 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-3 text-indigo-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
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
                  className="block text-center bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-400 text-white font-semibold py-3 rounded-lg transition"
                >
                  Choose Plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
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
