import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AuthProvider } from './auth/context';
import { AuthNav } from './components/AuthNav';
import { CookieConsent } from './components/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';

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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
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
                    <li><a href="#contact" className="hover:text-green-200 transition-colors">Contact</a></li>
                  </ul>
                  <AuthNav />
                </div>
              </nav>
            </header>
            {children}
            <CookieConsent />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
