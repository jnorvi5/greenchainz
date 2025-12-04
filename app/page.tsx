'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './auth/context';
import { trackPageView, trackSearch, trackContactClick } from '@/lib/analytics';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minScore: '',
    location: '',
    certification: ''
  });
  const { user } = useAuth();

  // Track homepage view on mount
  useEffect(() => {
    trackPageView('homepage');
  }, []);

  // Create clients only when needed
  const getSupabaseClient = () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables not configured');
    }
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  };

  const sendZohoEmail = async (to: string[], subject: string, content: string) => {
    const accessToken = process.env.ZOHO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('Zoho access token not configured');
    }

    const response = await fetch('https://mail.zoho.com/api/accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get Zoho account info');
    }

    const accounts = await response.json();
    const accountId = accounts.data[0]?.accountId;

    if (!accountId) {
      throw new Error('No Zoho Mail account found');
    }

    // Send email
    const emailResponse = await fetch(`https://mail.zoho.com/api/accounts/${accountId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        toRecipients: to.map(email => ({ address: email })),
        subject: subject,
        content: content,
        mailFormat: 'html'
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send email');
    }

    return emailResponse.json();
  };

  const handleSearch = async () => {
    try {
      // Track search event
      trackSearch(query, filters);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minScore) params.append('minScore', filters.minScore);
      if (filters.location) params.append('location', filters.location);
      if (filters.certification) params.append('certification', filters.certification);
      if (user?.id) params.append('userId', user.id);

      const response = await fetch(`/api/suppliers?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      setResults(data.suppliers || []);
    } catch (error) {
      alert('Error searching suppliers. Please try again.');
      console.error(error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minScore: '',
      location: '',
      certification: ''
    });
    setQuery('');
  };

  const handleContact = async () => {
    try {
      await sendZohoEmail(
        ['support@greensourcing.com'],
        'Green Sourcing Inquiry',
        `From: ${email}\n\n${message}`
      );
      alert('Message sent via Zoho!');
    } catch (error) {
      alert('Error sending email. Please check your Zoho configuration.');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Hero Section with Logo */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="GreenChainz" className="h-24 w-24 drop-shadow-lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Go-To Source for Green Sourcing
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
            [PLACEHOLDER: Tagline about connecting businesses with verified sustainable suppliers]
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth"
                className="inline-block bg-white text-green-600 font-bold py-4 px-8 rounded-lg hover:bg-green-50 transition-colors text-lg shadow-lg"
              >
                🚀 Get Started Free
              </a>
              <a
                href="#video"
                className="inline-block bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-green-600 transition-colors text-lg"
              >
                ▶️ Watch Demo
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Video Placeholder Section */}
      <section id="video" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            See GreenChainz in Action
          </h2>
          <div className="aspect-video bg-gray-200 rounded-2xl shadow-xl flex items-center justify-center border-4 border-dashed border-gray-400">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-2xl font-bold text-gray-600">[INSERT VIDEO HERE]</p>
              <p className="text-gray-500 mt-2">Product demo or promotional video placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Why Choose GreenChainz?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Verified Suppliers</h3>
              <p className="text-gray-600">
                [PLACEHOLDER: Description of supplier verification process and sustainability metrics]
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Sustainability Scores</h3>
              <p className="text-gray-600">
                [PLACEHOLDER: Description of how sustainability scores help businesses make informed decisions]
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Easy Connections</h3>
              <p className="text-gray-600">
                [PLACEHOLDER: Description of how GreenChainz facilitates supplier-buyer connections]
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto p-8">

        {!user ? (
          <div className="text-center mb-12 p-10 bg-white rounded-2xl shadow-2xl glass-effect bounce-in hover-glow max-w-2xl mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="GreenChainz" className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to GreenChainz
            </h2>
            <p className="mb-8 text-gray-700 text-lg leading-relaxed">
              [PLACEHOLDER: Brief description of GreenChainz value proposition for new visitors]
            </p>
            <p className="mb-8 text-gray-600">
              Sign in to access our database of sustainable suppliers and start your green sourcing journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth"
                className="btn-primary inline-block text-lg"
              >
                ✨ Sign In to Get Started
              </a>
              <a
                href="/about"
                className="btn-secondary inline-block text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Search Section */}
            <section className="mb-12 slide-up">
              <div className="bg-white rounded-2xl shadow-xl p-8 glass-effect hover-lift">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  🔍 Find Sustainable Suppliers
                </h2>

                {/* Search Input */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search suppliers by name..."
                    className="input-field flex-1 text-lg"
                  />
                  <button onClick={handleSearch} className="btn-primary whitespace-nowrap">
                    🚀 Search
                  </button>
                </div>

                {/* Advanced Filters */}
                <div className="bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl mb-6 border border-gray-200">
                  <h3 className="font-bold text-xl mb-4 text-gray-800">⚙️ Advanced Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="input-field"
                    >
                      <option value="">All Categories</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Water Treatment">Water Treatment</option>
                      <option value="Forestry">Forestry</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Food Processing">Food Processing</option>
                    </select>

                    <select
                      value={filters.minScore}
                      onChange={(e) => handleFilterChange('minScore', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Any Sustainability Score</option>
                      <option value="90">⭐ 90+ (Excellent)</option>
                      <option value="80">✨ 80+ (Very Good)</option>
                      <option value="70">💫 70+ (Good)</option>
                      <option value="60">🌟 60+ (Fair)</option>
                    </select>

                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="📍 Location (city, state)"
                      className="input-field"
                    />

                    <select
                      value={filters.certification}
                      onChange={(e) => handleFilterChange('certification', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Any Certification</option>
                      <option value="ISO 14001">ISO 14001</option>
                      <option value="FSC Certified">FSC Certified</option>
                      <option value="USDA Organic">USDA Organic</option>
                      <option value="Energy Star Partner">Energy Star</option>
                      <option value="GOTS Certified">GOTS Certified</option>
                    </select>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSearch}
                      className="btn-primary flex-1"
                    >
                      ✅ Apply Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className="btn-secondary flex-1"
                    >
                      🔄 Clear Filters
                    </button>
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                  {results.length > 0 && (
                    <p className="mb-6 text-gray-600 font-medium text-lg">
                      ✨ Found {results.length} supplier{results.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  {results.map((item) => (
                    <div key={item.id} className="p-6 border-2 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover-glow relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-bl-full opacity-50"></div>
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <Link
                            href={`/supplier/${item.id}`}
                            className="font-bold text-2xl text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            {item.name}
                          </Link>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                            item.sustainability_score >= 90 ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                            item.sustainability_score >= 80 ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' :
                            'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                          }`}>
                            ⭐ Score: {item.sustainability_score}/100
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 text-lg leading-relaxed">{item.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                          <span className="bg-gray-100 px-3 py-2 rounded-lg font-medium">📍 {item.location}</span>
                          <span className="bg-gray-100 px-3 py-2 rounded-lg font-medium">🏭 {item.category}</span>
                          {item.employee_count && <span className="bg-gray-100 px-3 py-2 rounded-lg font-medium">👥 {item.employee_count} employees</span>}
                        </div>
                        {item.certifications && item.certifications.length > 0 && (
                          <div className="mb-4">
                            <span className="text-sm font-bold text-gray-700">🏆 Certifications: </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.certifications.map((cert: string, index: number) => (
                                <span key={index} className="badge-success shadow-sm">
                                  ✓ {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.website && (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                          >
                            🌐 Visit Website →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {results.length === 0 && query && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-gray-500 text-xl">No suppliers found matching your criteria.</p>
                      <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Suppliers Section */}
            <section id="suppliers" className="mb-12 slide-up">
              <div className="bg-white rounded-2xl shadow-xl p-8 glass-effect hover-lift">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  🌟 Featured Suppliers
                </h2>
                <p className="text-gray-700 text-lg">Directory of verified green suppliers. (Data from Supabase)</p>
              </div>
            </section>

            {/* Resources Section */}
            <section id="resources" className="mb-12 slide-up">
              <div className="bg-white rounded-2xl shadow-xl p-8 glass-effect hover-lift">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  📚 Sustainability Resources
                </h2>
                <p className="text-gray-700 text-lg">Guides, certifications, and tools for green sourcing.</p>
              </div>
            </section>

            {/* Investors Section */}
            <section id="investors" className="mb-12 slide-up">
              <div className="bg-white rounded-2xl shadow-xl p-8 glass-effect hover-lift">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  💼 For Investors
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  Impact metrics: Reduced carbon footprint by 30% for partnered businesses. Hosted on Cloudflare for global reach and low latency.
                </p>
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                    <h3 className="font-bold text-xl mb-4 text-green-800">✅ Trusted Certifications</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">●</span>
                        <span className="text-gray-700">ISO 14001 Compliant</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">●</span>
                        <span className="text-gray-700">Carbon Neutral Verified</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                    <h3 className="font-bold text-xl mb-4 text-blue-800">💬 Testimonials</h3>
                    <blockquote className="italic text-gray-700 border-l-4 border-blue-500 pl-4">
                      "GreenSourcing Hub democratized sustainable sourcing for our B2B operations." - Investor A
                    </blockquote>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-white p-8 rounded-2xl shadow-2xl glass-effect slide-up hover-lift">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                📧 Contact Us
              </h2>
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="✉️ Your email"
                  className="input-field"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="💬 Inquiry or partnership interest"
                  className="input-field min-h-[150px]"
                />
                <button onClick={handleContact} className="btn-primary w-full text-lg">
                  🚀 Send via Zoho
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
