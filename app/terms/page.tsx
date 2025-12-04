import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - GreenChainz',
  description: 'Terms of Service for GreenChainz - Read our terms and conditions for using our sustainable supplier platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="GreenChainz" className="h-12 w-12" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Terms of Service
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
            <h2 className="text-2xl font-bold text-gray-800">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Statement about acceptance of terms when using GreenChainz services.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Description of GreenChainz as a sustainable supplier directory and sourcing platform.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Requirements for creating and maintaining user accounts, including responsibilities and restrictions.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">4. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Guidelines for acceptable use of the platform and prohibited activities.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">5. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Information about intellectual property rights, trademarks, and content ownership.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Disclaimer of warranties and limitation of liability for using the service.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">7. Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Conditions under which accounts may be terminated and the effects of termination.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@greenchainz.com" className="text-green-600 hover:underline">
                legal@greenchainz.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
