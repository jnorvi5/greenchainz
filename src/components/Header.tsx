'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-effect-dark border-b border-gray-700/50">
      <nav className="flex items-center justify-between h-full max-w-6xl mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span className="text-xl font-bold text-gradient">GREENCHAINZ</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#suppliers"
            className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium"
          >
            Compare Suppliers
          </Link>
          <Link
            href="/#resources"
            className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium"
          >
            Documentation
          </Link>
          <Link
            href="/#investors"
            className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium"
          >
            Pricing
          </Link>
          <Link
            href="/auth"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-700/50 transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-gray-300 transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-300 my-1 transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-300 transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-effect-dark border-t border-gray-700/50">
          <div className="flex flex-col px-4 py-4 gap-4">
            <Link
              href="/#suppliers"
              className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Compare Suppliers
            </Link>
            <Link
              href="/#resources"
              className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/#investors"
              className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/auth"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.5)] text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
