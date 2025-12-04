import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy - GreenChainz',
  description: 'Cookie Policy for GreenChainz - Learn how we use cookies and similar technologies.',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="GreenChainz" className="h-12 w-12" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
        </div>

        {/* Back to Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-8 transition-colors"
        >
          ← Back to Home
        </Link>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <p className="text-gray-600 text-sm">Last updated: January 2025</p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Explanation of what cookies are and how they work on websites.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">2. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Essential Cookies</h3>
                <p className="text-gray-700">
                  [PLACEHOLDER: Description of essential cookies required for the website to function.]
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700">
                  [PLACEHOLDER: Description of analytics cookies used to understand user behavior.]
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Functional Cookies</h3>
                <p className="text-gray-700">
                  [PLACEHOLDER: Description of functional cookies that enhance user experience.]
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">3. Managing Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Instructions on how users can manage and disable cookies in their browser settings.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Information about third-party cookies from analytics and service providers.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">5. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our use of cookies, please contact us at{' '}
              <a href="mailto:privacy@greenchainz.com" className="text-green-600 hover:underline">
                privacy@greenchainz.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
