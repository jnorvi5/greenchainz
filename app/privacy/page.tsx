import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - GreenChainz',
  description: 'Privacy Policy for GreenChainz - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="GreenChainz" className="h-12 w-12" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Privacy Policy
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
            <h2 className="text-2xl font-bold text-gray-800">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Introduction to privacy policy explaining GreenChainz&apos;s commitment to protecting user privacy and data.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">2. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Details about personal information collected, including name, email, company information, and usage data.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Explanation of how collected data is used to provide services, improve user experience, and communicate with users.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">4. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Information about when and how data may be shared with third parties, including service providers and legal requirements.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Description of security measures implemented to protect user data.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">6. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Information about user rights regarding their data, including access, correction, and deletion rights.]
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">7. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
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
