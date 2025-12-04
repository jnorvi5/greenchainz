'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { trackPageView, trackSearch } from '@/lib/analytics';
import { 
  Supplier, 
  CONSTRUCTION_CATEGORIES, 
  SUSTAINABILITY_CERTIFICATIONS,
  VerificationStatus 
} from '@/types/supplier';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minScore: '',
    location: '',
    certification: ''
  });

  // Track page view on mount
  useEffect(() => {
    trackPageView('search_page');
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search when debounced query or filters change
  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      // Track search event
      trackSearch(debouncedQuery, filters);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.append('q', debouncedQuery);
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
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters]);

  // Trigger search on debounced query or filter change
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

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

  const getVerificationBadge = (status?: VerificationStatus, verified?: boolean) => {
    if (verified || status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        Unverified
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gradient drop-shadow-lg">
          🔍 Search Sustainable Suppliers
        </h1>

        {/* Search Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 glass-effect">
            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search suppliers by name or description..."
                  className="input-field text-lg w-full"
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="spinner w-5 h-5"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl mb-6 border border-gray-200">
              <h3 className="font-bold text-xl mb-4 text-gray-800">⚙️ Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Construction Categories Dropdown */}
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

                {/* Sustainability Score Filter */}
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

                {/* Location Filter */}
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="📍 Location (city, state)"
                  className="input-field"
                />

                {/* Sustainability Certifications Dropdown */}
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

              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  className="btn-secondary"
                >
                  🔄 Clear Filters
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8 mr-3"></div>
                <span className="text-gray-600 text-lg">Searching suppliers...</span>
              </div>
            )}

            {/* Results */}
            {!loading && (
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
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/supplier/${item.id}`}
                            className="font-bold text-2xl text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            {item.name}
                          </Link>
                          {getVerificationBadge(item.verification_status, item.verified)}
                        </div>
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
                        {item.data_source && item.data_source !== 'manual' && (
                          <span className="bg-blue-100 px-3 py-2 rounded-lg font-medium text-blue-700">
                            📊 Source: {item.data_source}
                          </span>
                        )}
                      </div>
                      {item.certifications && item.certifications.length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm font-bold text-gray-700">🏆 Certifications: </span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.certifications.map((cert, index) => (
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
                {results.length === 0 && (debouncedQuery || Object.values(filters).some(v => v)) && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-xl">No suppliers found matching your criteria.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                )}
                {results.length === 0 && !debouncedQuery && !Object.values(filters).some(v => v) && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <div className="text-6xl mb-4">🌱</div>
                    <p className="text-gray-500 text-xl">Start searching for sustainable suppliers</p>
                    <p className="text-gray-400 mt-2">Use the search box or filters above to find suppliers.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
