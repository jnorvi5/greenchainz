import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - GreenChainz',
  description: 'Learn about GreenChainz - Our mission to connect businesses with sustainable suppliers and promote green sourcing.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header with Logo */}
        <div className="flex items-center gap-4 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="GreenChainz" className="h-12 w-12" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            About GreenChainz
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
        <div className="space-y-8">
          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              [PLACEHOLDER: GreenChainz mission statement about connecting businesses with verified sustainable suppliers and promoting environmental responsibility in supply chains.]
            </p>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: The origin story of GreenChainz, how it was founded, and the problem it set out to solve in sustainable sourcing.]
            </p>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-xl mb-2 text-green-800">🌱 Sustainability</h3>
                <p className="text-gray-700">
                  [PLACEHOLDER: Commitment to environmental sustainability in all operations.]
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-xl mb-2 text-blue-800">🤝 Transparency</h3>
                <p className="text-gray-700">
                  [PLACEHOLDER: Commitment to transparency in supplier verification and data.]
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-xl mb-2 text-purple-800">💡 Innovation</h3>
                <p className="text-gray-700">
                  [PLACEHOLDER: Commitment to innovative solutions for green sourcing.]
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
                <h3 className="font-bold text-xl mb-2 text-yellow-800">🌍 Impact</h3>
                <p className="text-gray-700">
                  [PLACEHOLDER: Commitment to making a positive environmental impact.]
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Team</h2>
            <p className="text-gray-700 leading-relaxed">
              [PLACEHOLDER: Information about the GreenChainz team, their expertise, and passion for sustainability.]
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="mb-6 text-green-100">
              Ready to make your supply chain more sustainable?
            </p>
            <Link 
              href="/auth" 
              className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
