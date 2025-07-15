import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
return (
  <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    {/* Hero Section */}
    <header className="bg-blue-700 text-white text-center py-16">
      <h1 className="text-4xl font-bold">Ride Bookings & Support</h1>
      <p className="mt-2 text-lg">
        Need help with a booking? We're here for you.
      </p>
    </header>

    {/* Contact Options */}
    <section className="text-center py-12 px-4">
      <h2 className="text-2xl font-bold">Quick Support</h2>
      <p className="mt-4 max-w-2xl mx-auto">
        Reach out to our support team for any issues or inquiries related to
        your ride bookings.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        <div className="p-6 shadow-md rounded-lg bg-blue-50 hover:bg-blue-100 transition">
          <h3 className="text-lg font-semibold">📞 Call Support</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            +254 700 123 456
          </p>
        </div>
        <div className="p-6 shadow-md rounded-lg bg-blue-50 hover:bg-blue-100 transition">
          <h3 className="text-lg font-semibold">📧 Email Support</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            support@rideshare.co.ke
          </p>
        </div>
        <div className="p-6 shadow-md rounded-lg bg-blue-50 hover:bg-blue-100 transition">
          <h3 className="text-lg font-semibold">📍 Office Visit</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            1st Floor, Highway Plaza, Nairobi
          </p>
        </div>
      </div>
    </section>

    {/* Booking Issue Form */}
    <section className="bg-gray-100 dark:bg-gray-800 py-12 px-4">
      <h2 className="text-2xl font-bold text-center">Report a Booking Issue</h2>
      <form className="max-w-2xl mx-auto mt-10 space-y-8">
        <div>
          <label htmlFor="name" className="block font-semibold">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="rideId" className="block font-semibold">
            Ride Booking ID
          </label>
          <input
            type="text"
            id="rideId"
            placeholder="#RB123456"
            className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block font-semibold">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
            placeholder="Describe the issue with your ride..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition"
        >
          Submit Issue
        </button>
      </form>
    </section>

    {/* FAQ Section */}
    <section className="text-center py-12 px-4">
      <h2 className="text-2xl font-bold">FAQs</h2>
      <div className="mt-8 space-y-6 max-w-3xl mx-auto text-left">
        <div className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-semibold">❓ How do I cancel a ride?</h3>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            Go to your ride history and click on the cancel button before the
            driver is dispatched.
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-semibold">
            ❓ What if my driver didn’t show up?
          </h3>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            Contact us immediately via phone or form above. We’ll investigate
            and issue a refund where necessary.
          </p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-semibold">❓ Can I reschedule my ride?</h3>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            Yes. Use the booking dashboard to reschedule at least 1 hour before
            the ride.
          </p>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-blue-700 text-white text-center py-6 mt-12">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} RideShare. All rights reserved.
      </p>
    </footer>
  </div>
)}
