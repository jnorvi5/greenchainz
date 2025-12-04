'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth/context';
import { trackPageView, trackSearch } from '@/lib/analytics';
import Link from 'next/link';
import { Supplier, CONSTRUCTION_CATEGORIES, SUSTAINABILITY_CERTIFICATIONS } from '@/types/supplier';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Supplier[]>([]);
  const [featuredSuppliers, setFeaturedSuppliers] = useState<Supplier[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minScore: '',
    location: '',
    certification: ''
  });
  const { user } = useAuth();

  // Load featured suppliers on mount
  const loadFeaturedSuppliers = useCallback(async () => {
    setFeaturedLoading(true);
    try {
      const response = await fetch('/api/suppliers?featured=true&limit=6');
      if (response.ok) {
        const data = await response.json();
        setFeaturedSuppliers(data.suppliers || []);
      }
    } catch (error) {
      console.error('Error loading featured suppliers:', error);
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  // Track homepage view and load featured suppliers on mount
  useEffect(() => {
    trackPageView('homepage');
    loadFeaturedSuppliers();
  }, [loadFeaturedSuppliers]);

  const handleSearch = async () => {
    setSearchLoading(true);
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

      const response = await fetch(`/api/suppliers?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      setResults(data.suppliers || []);
    } catch (error) {
      alert('Error searching suppliers. Please try again.');
      console.error(error);
    } finally {
      setSearchLoading(false);
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
    setResults([]);
  };

  const handleContact = async () => {
    if (!email || !message) {
      alert('Please provide both email and message.');
      return;
    }
    
    setContactLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          message,
          subject: 'Green Sourcing Inquiry'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      alert('Message sent successfully!');
      setEmail('');
      setMessage('');
    } catch (error) {
      alert('Error sending message. Please try again.');
      console.error(error);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 text-gradient slide-up drop-shadow-lg">
          Go-To Source for Green Sourcing
        </h1>

        {/* Search Section - Available to everyone */}
        <section className="mb-12 slide-up">
          <div className="bg-white rounded-2xl shadow-xl p-8 glass-effect hover-lift">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🔍 Find Sustainable Suppliers
            </h2>

            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search suppliers by name or description..."
                  className="input-field flex-1 text-lg w-full"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="spinner w-5 h-5"></div>
                  </div>
                )}
              </div>
              <button onClick={handleSearch} disabled={searchLoading} className="btn-primary whitespace-nowrap">
                {searchLoading ? '⏳ Searching...' : '🚀 Search'}
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
                  {CONSTRUCTION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
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
                  {SUSTAINABILITY_CERTIFICATIONS.map((cert) => (
                    <option key={cert} value={cert}>{cert}</option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
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
                        (item.sustainability_score ?? 0) >= 90 ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                        (item.sustainability_score ?? 0) >= 80 ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' :
                        'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                      }`}>
                        ⭐ Score: {item.sustainability_score ?? 'N/A'}/100
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 text-lg leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                      {item.location && <span className="bg-gray-100 px-3 py-2 rounded-lg font-medium">📍 {item.location}</span>}
                      {item.category && <span className="bg-gray-100 px-3 py-2 rounded-lg font-medium">🏭 {item.category}</span>}
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
              {results.length === 0 && query && !searchLoading && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 text-xl">No suppliers found matching your criteria.</p>
                  <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Suppliers Section */}
        <section id="suppliers" className="mb-12 slide-up">
          <div className="bg-white rounded-2xl shadow-xl p-8 glass-effect hover-lift">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🌟 Featured Suppliers
            </h2>
            
            {featuredLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8 mr-3"></div>
                <span className="text-gray-600 text-lg">Loading featured suppliers...</span>
              </div>
            ) : featuredSuppliers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSuppliers.map((supplier) => (
                  <Link
                    key={supplier.id}
                    href={`/supplier/${supplier.id}`}
                    className="block p-6 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors">
                        {supplier.name}
                      </h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        ⭐ {supplier.sustainability_score}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{supplier.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {supplier.location && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">📍 {supplier.location}</span>
                      )}
                      {supplier.category && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">🏭 {supplier.category}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-lg text-center py-8">
                No featured suppliers available at the moment.
              </p>
            )}
            
            <div className="mt-6 text-center">
              <Link href="/search" className="btn-primary inline-block">
                🔍 Browse All Suppliers
              </Link>
            </div>
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
                  &ldquo;GreenSourcing Hub democratized sustainable sourcing for our B2B operations.&rdquo; - Investor A
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
            <button 
              onClick={handleContact} 
              disabled={contactLoading}
              className="btn-primary w-full text-lg"
            >
              {contactLoading ? '⏳ Sending...' : '🚀 Send Message'}
            </button>
          </div>
        </section>

        {/* Sign In CTA for non-logged in users */}
        {!user && (
          <section className="mt-12 text-center p-10 bg-white rounded-2xl shadow-2xl glass-effect bounce-in hover-glow max-w-2xl mx-auto">
            <div className="text-6xl mb-6 animate-bounce">🌱</div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Want More Features?
            </h2>
            <p className="mb-8 text-gray-700 text-lg leading-relaxed">
              Sign in to register as a supplier, access the admin dashboard, and more!
            </p>
            <Link
              href="/auth"
              className="btn-primary inline-block text-lg"
            >
              ✨ Sign In for More
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
