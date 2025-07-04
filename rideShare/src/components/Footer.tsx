import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="bg-blue-600 p-2 rounded">
              <span role="img" aria-label="car">
                🚗
              </span>
            </div>
            <span className="text-lg font-semibold">RideShare</span>
          </div>
          <p className="text-sm text-gray-400">
            Making transportation accessible, safe, and affordable for everyone.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Company</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Support</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Safety
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Terms
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-2">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Instagram size={18} />
            </a>
            <a href="#" className="hover:text-white">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        © 2024 RideShare. All rights reserved.
      </div>
    </footer>
  )
}
