import { createFileRoute } from '@tanstack/react-router'
import {
  FaBolt,
  FaShieldAlt,
  FaDollarSign,
  FaApple,
  FaGooglePlay,
} from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'


export const Route = createFileRoute('/')({
  component: App,
})



function App() {
  return (
    <>
      <section className="w-full bg-gradient-to-b from-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          {/* Left Side: Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Your ride is just a{' '}
              <span className="text-blue-600">tap away</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Safe, reliable, and affordable rides whenever you need them. Join
              millions of riders worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded">
                📱 Get the App
              </Button>
              <Button variant="outline" className="text-sm px-6 py-2">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src="../../images/fiv6vlrddnyrqu0ms82a.jpg"
              alt="Ride app preview"
              className="w-[320px] sm:w-[360px] md:w-[400px] drop-shadow-xl rounded-xl"
            />
          </div>
        </div>
      </section>

      <div className="bg-white text-gray-900">
        {/* Why Choose */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
            <h2 className="text-3xl font-bold">Why Choose RideShare?</h2>
            <p className="text-gray-600 text-lg">
              Experience the future of transportation with our cutting-edge
              features
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {/* Card 1 */}
              <div className="p-6 rounded-lg bg-blue-50 shadow-sm">
                <div className="text-blue-600 text-3xl mb-4">
                  <FaBolt />
                </div>
                <h3 className="font-semibold text-lg">Quick & Easy</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Book your ride in seconds with our intuitive app. No waiting,
                  no hassle.
                </p>
              </div>
              {/* Card 2 */}
              <div className="p-6 rounded-lg bg-green-50 shadow-sm">
                <div className="text-green-600 text-3xl mb-4">
                  <FaShieldAlt />
                </div>
                <h3 className="font-semibold text-lg">Safe & Secure</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  All drivers are verified and tracked. Your safety is our top
                  priority.
                </p>
              </div>
              {/* Card 3 */}
              <div className="p-6 rounded-lg bg-purple-50 shadow-sm">
                <div className="text-purple-600 text-3xl mb-4">
                  <FaDollarSign />
                </div>
                <h3 className="font-semibold text-lg">Affordable</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Transparent pricing with no hidden fees. Pay less, travel
                  more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-gray-600 text-lg">
              Getting your ride is as easy as 1-2-3
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {[
                {
                  title: 'Request',
                  desc: 'Open the app and enter your destination. We’ll find the nearest driver for you.',
                },
                {
                  title: 'Track',
                  desc: 'Watch your driver arrive in real-time. Get updates on their location and ETA.',
                },
                {
                  title: 'Ride',
                  desc: 'Hop in and enjoy your ride. Payment is automatic – no cash needed.',
                },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center space-y-3">
                  <div className="text-white bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-blue-600 text-white py-14">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 text-center gap-6">
            <div>
              <h4 className="text-2xl font-bold">10M+</h4>
              <p className="text-sm opacity-90">Happy Riders</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold">500K+</h4>
              <p className="text-sm opacity-90">Verified Drivers</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold">100+</h4>
              <p className="text-sm opacity-90">Cities Covered</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold">24/7</h4>
              <p className="text-sm opacity-90">Support</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 text-lg">
              Download the app and take your first ride today
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="#"
                className="bg-black text-white px-5 py-3 rounded-lg inline-flex items-center gap-2"
              >
                <FaApple className="text-xl" /> App Store
              </a>
              <a
                href="#"
                className="bg-black text-white px-5 py-3 rounded-lg inline-flex items-center gap-2"
              >
                <FaGooglePlay className="text-xl" /> Google Play
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  )
}
