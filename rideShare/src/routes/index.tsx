import { createFileRoute } from '@tanstack/react-router'
import {
  FaBolt,
  FaShieldAlt,
  FaDollarSign,
  FaApple,
  FaGooglePlay,
  FaQuoteLeft,
  FaCar,
  FaHeadset,
  FaStar,
  FaUsers,
  FaEnvelopeOpenText,
} from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-700">
        <section className="w-full py-16 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left Side: Text Content */}
          <div className="space-y-8">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
              Your ride is just a{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                tap away
              </span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md">
              Safe, reliable, and affordable rides whenever you need them. Join
              millions of riders worldwide.
            </p>
            <div className="flex flex-wrap gap-6">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-purple-700 hover:to-blue-600 text-white text-sm px-8 py-3 rounded-lg shadow-lg transform transition-transform hover:-translate-y-1">
                📱 Get the App
              </Button>
              <Button
                variant="outline"
                className="text-sm px-8 py-3 rounded-lg border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src="../../images/fiv6vlrddnyrqu0ms82a.jpg"
              alt="Ride app preview"
              className="w-[320px] sm:w-[360px] md:w-[420px] rounded-2xl shadow-2xl"
            />
          </div>
        </section>

        {/* Why Choose */}
        <section className="py-20 bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900 dark:to-pink-900">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              Why Choose RideShare?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg max-w-xl mx-auto">
              Experience the future of transportation with our cutting-edge
              features
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
              {[
                {
                  icon: (
                    <FaBolt className="text-4xl text-blue-600 dark:text-blue-400" />
                  ),
                  title: 'Quick & Easy',
                  desc: 'Book your ride in seconds with our intuitive app. No waiting, no hassle.',
                  bg: 'bg-blue-100 dark:bg-blue-900',
                },
                {
                  icon: (
                    <FaShieldAlt className="text-4xl text-green-600 dark:text-green-400" />
                  ),
                  title: 'Safe & Secure',
                  desc: 'All drivers are verified and tracked. Your safety is our top priority.',
                  bg: 'bg-green-100 dark:bg-green-900',
                },
                {
                  icon: (
                    <FaDollarSign className="text-4xl text-purple-600 dark:text-purple-400" />
                  ),
                  title: 'Affordable',
                  desc: 'Transparent pricing with no hidden fees. Pay less, travel more.',
                  bg: 'bg-purple-100 dark:bg-purple-900',
                },
              ].map(({ icon, title, desc, bg }, i) => (
                <div
                  key={i}
                  className={`${bg} p-8 rounded-xl shadow-lg flex flex-col items-center text-center`}
                >
                  <div className="mb-4">{icon}</div>
                  <h3 className="font-semibold text-xl">{title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              What Our Riders Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Emily R.',
                  text: 'The app is so easy to use and the drivers are always friendly and punctual!',
                },
                {
                  name: 'James T.',
                  text: 'Affordable rides and great customer support. Highly recommend!',
                },
                {
                  name: 'Sophia L.',
                  text: 'I love the real-time tracking feature. Makes me feel safe every time.',
                },
              ].map(({ name, text }, i) => (
                <div
                  key={i}
                  className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md relative"
                >
                  <FaQuoteLeft className="text-blue-400 dark:text-blue-600 text-3xl absolute top-4 left-4 opacity-30" />
                  <p className="text-gray-700 dark:text-gray-300 mt-6">
                    {text}
                  </p>
                  <p className="mt-4 font-semibold text-blue-700 dark:text-blue-400">
                    — {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg max-w-md mx-auto">
              Download the app and take your first ride today
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a
                href="#"
                className="bg-black bg-opacity-80 px-6 py-3 rounded-lg inline-flex items-center gap-3 shadow-lg hover:bg-opacity-100 transition"
              >
                <FaApple className="text-xl" /> App Store
              </a>
              <a
                href="#"
                className="bg-black bg-opacity-80 px-6 py-3 rounded-lg inline-flex items-center gap-3 shadow-lg hover:bg-opacity-100 transition"
              >
                <FaGooglePlay className="text-xl" /> Google Play
              </a>
            </div>
          </div>
        </section>
        {/* Features Overview */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-10">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              Features that Drive You Forward
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-12">
              {[
                {
                  icon: (
                    <FaCar className="text-5xl text-blue-600 dark:text-blue-400" />
                  ),
                  title: 'Real-Time Tracking',
                  desc: 'Track your ride live and know exactly when your driver will arrive.',
                },
                {
                  icon: (
                    <FaHeadset className="text-5xl text-green-600 dark:text-green-400" />
                  ),
                  title: '24/7 Support',
                  desc: 'Our support team is always available to help you with any issues.',
                },
                {
                  icon: (
                    <FaStar className="text-5xl text-purple-600 dark:text-purple-400" />
                  ),
                  title: 'Driver Ratings',
                  desc: 'Rate your driver and help us maintain a high-quality community.',
                },
              ].map(({ icon, title, desc }, i) => (
                <div
                  key={i}
                  className="p-8 rounded-xl bg-blue-50 dark:bg-blue-900 shadow-md flex flex-col items-center text-center"
                >
                  <div className="mb-6">{icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Driver Benefits */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-4xl font-bold">Why Drivers Love RideShare</h2>
            <p className="max-w-3xl mx-auto text-lg opacity-90">
              Flexible hours, competitive earnings, and a supportive community.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-12 text-black">
              {[
                {
                  icon: <FaDollarSign className="text-5xl" />,
                  title: 'Competitive Pay',
                  desc: 'Earn more with transparent pricing and bonuses.',
                },
                {
                  icon: <FaUsers className="text-5xl" />,
                  title: 'Community Support',
                  desc: 'Join a network of drivers who help each other succeed.',
                },
                {
                  icon: <FaShieldAlt className="text-5xl" />,
                  title: 'Safety First',
                  desc: '24/7 safety monitoring and insurance coverage included.',
                },
              ].map(({ icon, title, desc }, i) => (
                <div
                  key={i}
                  className="bg-white bg-opacity-20 rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
                >
                  <div className="mb-4">{icon}</div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
            <dl className="space-y-6">
              {[
                {
                  question: 'How do I book a ride?',
                  answer:
                    'Simply open the app, enter your destination, and confirm your pickup location. We’ll handle the rest!',
                },
                {
                  question: 'What payment methods are accepted?',
                  answer:
                    'We accept credit/debit cards, digital wallets, and in some locations, cash payments.',
                },
                {
                  question: 'Is RideShare safe?',
                  answer:
                    'Yes! All drivers are background-checked, and rides are tracked in real-time for your safety.',
                },
                {
                  question: 'Can I schedule rides in advance?',
                  answer:
                    'Currently, we support immediate bookings, but scheduled rides are coming soon!',
                },
              ].map(({ question, answer }, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md"
                >
                  <dt className="font-semibold text-lg text-blue-700 dark:text-blue-400 mb-2">
                    {question}
                  </dt>
                  <dd className="text-gray-700 dark:text-gray-300">{answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-lg max-w-md mx-auto">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="flex flex-col sm:flex-row justify-center gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                required
                className="px-4 py-3 rounded-lg text-gray-900 flex-grow"
              />
              <Button
                type="submit"
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
              >
                <FaEnvelopeOpenText className="inline mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10">
              Trusted by Leading Companies
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {[
                'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
                'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
                'https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/768px-Spotify_icon.svg.png?20220821125323',
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Partner logo"
                  className="h-12 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg max-w-md mx-auto">
              Download the app and take your first ride today
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              <a
                href="#"
                className="bg-black bg-opacity-80 px-6 py-3 rounded-lg inline-flex items-center gap-3 shadow-lg hover:bg-opacity-100 transition"
              >
                <FaApple className="text-xl" /> App Store
              </a>
              <a
                href="#"
                className="bg-black bg-opacity-80 px-6 py-3 rounded-lg inline-flex items-center gap-3 shadow-lg hover:bg-opacity-100 transition"
              >
                <FaGooglePlay className="text-xl" /> Google Play
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
