import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 mt-20 border-t-4 border-green-500">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="GreenChainz" className="h-10 w-10" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                GreenChainz
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting businesses with verified sustainable suppliers for a greener future.
            </p>
            <div className="mt-6 flex gap-4">
              <a 
                href="https://twitter.com/greenchainz" 
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/greenchainz" 
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/greenchainz" 
                className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:shadow-lg"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-green-400">🚀 Platform</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Search Suppliers
                </Link>
              </li>
              <li>
                <Link href="/register-supplier" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Register as Supplier
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Analytics
                </Link>
              </li>
              <li>
                <Link href="/clock" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → World Clock
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-blue-400">📚 Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#suppliers" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Supplier Directory
                </a>
              </li>
              <li>
                <a href="#resources" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Sustainability Guides
                </a>
              </li>
              <li>
                <a href="#investors" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → For Investors
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-purple-400">⚖️ Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-400">🏢 Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → FAQ
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  → Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 <span className="text-green-400 font-semibold">GreenChainz</span>. All rights reserved. Built with 💚 for sustainability.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Powered by renewable energy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}