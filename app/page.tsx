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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-800 slide-up text-gradient">
          Go-To Source for Green Sourcing
        </h1>

        {!user ? (
          <div className="text-center mb-12 p-8 bg-white rounded-lg shadow glass-effect bounce-in">
            <h2 className="text-2xl font-semibold mb-4">Welcome to GreenChainz</h2>
            <p className="mb-6 text-gray-600">
              Sign in to access our database of sustainable suppliers and start your green sourcing journey.
            </p>
            <a
              href="/auth"
              className="btn-primary inline-block"
            >
              Sign In to Get Started
            </a>
          </div>
        ) : (
          <>
            {/* Search Section */}
            <section className="mb-12 slide-up">
              <h2 className="text-2xl font-semibold mb-4">Find Sustainable Suppliers</h2>

              {/* Search Input */}
              <div className="flex mb-4 mobile-stack">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search suppliers by name..."
                  className="input-field mobile-full"
                />
                <button onClick={handleSearch} className="btn-primary ml-2 mobile-full mobile-center">
                  Search
                </button>
              </div>

              {/* Advanced Filters */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-3">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <option value="90">90+ (Excellent)</option>
                    <option value="80">80+ (Very Good)</option>
                    <option value="70">70+ (Good)</option>
                    <option value="60">60+ (Fair)</option>
                  </select>

                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Location (city, state)"
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

                <div className="mt-3 flex gap-2 mobile-stack">
                  <button
                    onClick={handleSearch}
                    className="btn-primary"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                {results.length > 0 && (
                  <p className="mb-4 text-gray-600">Found {results.length} suppliers</p>
                )}
                {results.map((item) => (
                  <div key={item.id} className="p-4 border bg-white rounded mb-2 shadow hover:shadow-md transition-shadow bounce-in">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        href={`/supplier/${item.id}`}
                        className="font-semibold text-lg text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <span className={`px-2 py-1 rounded text-sm ${
                        item.sustainability_score >= 90 ? 'bg-green-100 text-green-800' :
                        item.sustainability_score >= 80 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        Score: {item.sustainability_score}/100
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                      <span>📍 {item.location}</span>
                      <span>🏭 {item.category}</span>
                      {item.employee_count && <span>👥 {item.employee_count} employees</span>}
                    </div>
                    {item.certifications && item.certifications.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Certifications: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.certifications.map((cert: string, index: number) => (
                            <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                              {cert}
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
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        🌐 Visit Website
                      </a>
                    )}
                  </div>
                ))}
                {results.length === 0 && query && (
                  <p className="text-gray-500 text-center py-8">No suppliers found matching your criteria.</p>
                )}
              </div>
            </section>

            {/* Suppliers Section */}
            <section id="suppliers" className="mb-12 slide-up">
              <h2 className="text-2xl font-semibold mb-4">Featured Suppliers</h2>
              <p>Directory of verified green suppliers. (Data from Supabase)</p>
            </section>

            {/* Resources Section */}
            <section id="resources" className="mb-12 slide-up">
              <h2 className="text-2xl font-semibold mb-4">Sustainability Resources</h2>
              <p>Guides, certifications, and tools for green sourcing.</p>
            </section>

            {/* Investors Section */}
            <section id="investors" className="mb-12 slide-up">
              <h2 className="text-2xl font-semibold mb-4">For Investors</h2>
              <p>Impact metrics: Reduced carbon footprint by 30% for partnered businesses. Hosted on Cloudflare for global reach and low latency.</p>
              <div className="mt-4">
                <h3 className="font-semibold">Trusted Certifications</h3>
                <ul className="list-disc list-inside">
                  <li>ISO 14001 Compliant</li>
                  <li>Carbon Neutral Verified</li>
                </ul>
                <h3 className="font-semibold mt-4">Testimonials</h3>
                <blockquote className="italic">"GreenSourcing Hub democratized sustainable sourcing for our B2B operations." - Investor A</blockquote>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-white p-6 rounded shadow glass-effect slide-up">
              <h2 className="text-xl font-bold mb-4">Contact Us</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="input-field mb-2"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Inquiry or partnership interest"
                className="input-field mb-4"
              />
              <button onClick={handleContact} className="btn-primary">Send via Zoho</button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
