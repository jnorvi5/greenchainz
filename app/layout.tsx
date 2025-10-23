import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './auth/context';
import { AuthNav } from './components/AuthNav';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
 copilot/fix-and-spruce-up-code
import { Footer } from './components/Footer';

import { AnalyticsProvider } from './components/AnalyticsProvider';
 main

export const metadata: Metadata = {
  title: 'GreenChainz - Sustainable Supplier Directory',
  description: 'Find and connect with verified sustainable suppliers. Reduce your carbon footprint with our comprehensive green sourcing platform.',
  keywords: 'sustainable suppliers, green sourcing, eco-friendly, carbon neutral, sustainable business',
  authors: [{ name: 'GreenChainz Team' }],
  creator: 'GreenChainz',
  publisher: 'GreenChainz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://greenchainz.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GreenChainz - Sustainable Supplier Directory',
    description: 'Find and connect with verified sustainable suppliers. Reduce your carbon footprint with our comprehensive green sourcing platform.',
    url: 'https://greenchainz.com',
    siteName: 'GreenChainz',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GreenChainz - Sustainable Supplier Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GreenChainz - Sustainable Supplier Directory',
    description: 'Find and connect with verified sustainable suppliers. Reduce your carbon footprint with our comprehensive green sourcing platform.',
    images: ['/og-image.jpg'],
    creator: '@greenchainz',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Animated background shapes */}
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <ErrorBoundary>
copilot/fix-and-spruce-up-code
          <AuthProvider>
            <header className="bg-gradient-primary text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
              <nav className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto p-4 gap-4">
                <h1 className="text-2xl font-bold tracking-tight hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <span className="inline-block">🌱</span> GreenChainz
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
                    <li>
                      <a href="/" className="hover:text-green-100 transition-all duration-300 hover:scale-110 inline-block font-medium relative group">
                        Search
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-100 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                    <li>
                      <a href="#suppliers" className="hover:text-green-100 transition-all duration-300 hover:scale-110 inline-block font-medium relative group">
                        Suppliers
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-100 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                    <li>
                      <a href="#resources" className="hover:text-green-100 transition-all duration-300 hover:scale-110 inline-block font-medium relative group">
                        Resources
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-100 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                    <li>
                      <a href="#investors" className="hover:text-green-100 transition-all duration-300 hover:scale-110 inline-block font-medium relative group">
                        For Investors
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-100 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                    <li>
                      <a href="/admin" className="hover:text-green-100 transition-all duration-300 hover:scale-110 inline-block font-medium relative group">
                        Dashboard
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-100 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                    <li>
                      <a href="#contact" className="hover:text-green-100 transition-all duration-300 hover:scale-110 inline-block font-medium relative group">
                        Contact
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-100 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                  </ul>
                  <AuthNav />
                </div>
              </nav>
            </header>
            {children}
            <Footer />
            <CookieConsent />
            <Analytics />
          </AuthProvider>

          <AnalyticsProvider>
            <AuthProvider>
              <header className="bg-green-700 text-white p-4 shadow">
                <nav className="flex justify-between max-w-6xl mx-auto">
                  <h1 className="text-xl font-bold">GreenChainz</h1>
                  <div className="flex items-center space-x-4">
                    <ul className="flex space-x-4">
                      <li><a href="/" className="hover:text-green-200 transition-colors">Search</a></li>
                      <li><a href="#suppliers" className="hover:text-green-200 transition-colors">Suppliers</a></li>
                      <li><a href="#resources" className="hover:text-green-200 transition-colors">Resources</a></li>
                      <li><a href="#investors" className="hover:text-green-200 transition-colors">For Investors</a></li>
                      <li><a href="/admin" className="hover:text-green-200 transition-colors">Dashboard</a></li>
                      <li><a href="#contact" className="hover:text-green-200 transition-colors">Contact</a></li>
                    </ul>
                    <AuthNav />
                  </div>
                </nav>
              </header>
              {children}
              <CookieConsent />
              <Analytics />
            </AuthProvider>
          </AnalyticsProvider>
main
        </ErrorBoundary>
      </body>
    </html>
  );
}
