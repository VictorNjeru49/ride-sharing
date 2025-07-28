import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-blue-700 text-white text-center py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Ride Bookings & Support
        </h1>
        <p className="mt-4 text-lg sm:text-xl max-w-3xl mx-auto">
          Need help with a booking? We're here for you.
        </p>
      </header>

      {/* Contact Options */}
      <section className="text-center py-16 px-6 sm:px-12 lg:px-24">
        <h2 className="text-3xl font-bold mb-6">Quick Support</h2>
        <p className="mx-auto max-w-3xl text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          Reach out to our support team for any issues or inquiries related to
          your ride bookings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: '📞 Call Support',
              detail: '+254 700 123 456',
            },
            {
              title: '📧 Email Support',
              detail: 'support@rideshare.co.ke',
            },
            {
              title: '📍 Office Visit',
              detail: '1st Floor, Highway Plaza, Nairobi',
            },
          ].map(({ title, detail }) => (
            <div
              key={title}
              className="p-8 bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={title}
            >
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Issue Form */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16 px-6 sm:px-12 lg:px-24 flex-grow">
        <h2 className="text-3xl font-bold text-center mb-10">
          Report a Booking Issue
        </h2>
        <form
          className="max-w-3xl mx-auto space-y-8"
          onSubmit={(e) => e.preventDefault()}
        >
          {[
            { id: 'name', label: 'Full Name', type: 'text', placeholder: '' },
            {
              id: 'email',
              label: 'Email Address',
              type: 'email',
              placeholder: '',
            },
            {
              id: 'rideId',
              label: 'Ride Booking ID',
              type: 'text',
              placeholder: '#RB123456',
            },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block font-semibold text-gray-900 dark:text-gray-100 mb-2"
              >
                {label}
              </label>
              <input
                type={type}
                id={id}
                placeholder={placeholder}
                required
                className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500 transition"
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="message"
              className="block font-semibold text-gray-900 dark:text-gray-100 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Describe the issue with your ride..."
              required
              className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500 transition resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-700 hover:bg-blue-800 focus-visible:ring-4 focus-visible:ring-blue-400 text-white font-semibold rounded-lg transition"
          >
            Submit Issue
          </button>
        </form>
      </section>

      {/* FAQ Section */}
      <section className="text-center py-16 px-6 sm:px-12 lg:px-24">
        <h2 className="text-3xl font-bold mb-10">FAQs</h2>
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          {[
            {
              question: '❓ How do I cancel a ride?',
              answer:
                'Go to your ride history and click on the cancel button before the driver is dispatched.',
            },
            {
              question: '❓ What if my driver didn’t show up?',
              answer:
                'Contact us immediately via phone or form above. We’ll investigate and issue a refund where necessary.',
            },
            {
              question: '❓ Can I reschedule my ride?',
              answer:
                'Yes. Use the booking dashboard to reschedule at least 1 hour before the ride.',
            },
          ].map(({ question, answer }) => (
            <div
              key={question}
              className="p-6 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{question}</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                {answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-6 mt-auto">
        <p className="text-sm select-none">
          &copy; {new Date().getFullYear()} RideShare. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
