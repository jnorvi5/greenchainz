'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../../auth/context';
import { trackSupplierView, trackContactClick } from '@/lib/analytics';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export default function SupplierProfile() {
  const params = useParams();
  const supplierId = params.id as string;
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    if (supplierId) {
      fetchSupplier();
    }
  }, [supplierId]);

  const fetchSupplier = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', supplierId)
        .single();

      if (error) throw error;
      setSupplier(data);
      
      // Track supplier profile view
      if (data) {
        trackSupplierView(data.id, data.name);
      }
    } catch (error) {
      console.error('Error fetching supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendContactEmail = async () => {
    if (!supplier?.contact_email) return;
    
    // Track contact click
    trackContactClick(supplier.id);

    try {
      const response = await fetch('/api/contact-supplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplierEmail: supplier.contact_email,
          supplierName: supplier.name,
          subject: contactForm.subject,
          message: contactForm.message,
          userEmail: user?.email
        }),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setContactForm({ subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      alert('Error sending message. Please try again.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p>Loading supplier profile...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Supplier Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Search
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{supplier.category}</p>
              <p className="text-gray-500 mt-1">📍 {supplier.location}</p>
            </div>
            <div className="text-right">
              <div className={`inline-block px-4 py-2 rounded-lg text-lg font-semibold ${
                supplier.sustainability_score >= 90 ? 'bg-green-100 text-green-800' :
                supplier.sustainability_score >= 80 ? 'bg-blue-100 text-blue-800' :
                supplier.sustainability_score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Sustainability Score: {supplier.sustainability_score}/100
              </div>
              {supplier.verified && (
                <div className="mt-2 text-sm text-green-600 font-medium">
                  ✓ Verified Supplier
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-gray-700">{supplier.description}</p>
            </div>

            {/* Certifications */}
            {supplier.certifications && supplier.certifications.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-3">Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {supplier.certifications.map((cert: string, index: number) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Evidence */}
            {(supplier.fsc_license_code || supplier.compostability_standard || 
              supplier.organic_textile_cert || supplier.recycled_content_cert || 
              supplier.ethical_agri_cert || supplier.epd_url) && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-3">Certifications &amp; Evidence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplier.fsc_license_code && (
                    <div className="flex items-start">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        FSC {supplier.fsc_license_code}
                      </span>
                    </div>
                  )}
                  {supplier.compostability_standard && (
                    <div className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        🌱 {supplier.compostability_standard}
                      </span>
                    </div>
                  )}
                  {supplier.organic_textile_cert && (
                    <div className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        🧵 {supplier.organic_textile_cert}
                      </span>
                    </div>
                  )}
                  {supplier.recycled_content_cert && (
                    <div className="flex items-start">
                      <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                        ♻️ {supplier.recycled_content_cert}
                      </span>
                    </div>
                  )}
                  {supplier.ethical_agri_cert && (
                    <div className="flex items-start">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        🌾 {supplier.ethical_agri_cert}
                      </span>
                    </div>
                  )}
                  {supplier.epd_url && (
                    <div className="md:col-span-2">
                      <a
                        href={supplier.epd_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        📄 View Environmental Product Declaration (EPD) →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sustainability Metrics */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Sustainability Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                {supplier.carbon_footprint && (
                  <div>
                    <div className="text-sm text-gray-600">Carbon Footprint</div>
                    <div className="text-lg font-semibold">{supplier.carbon_footprint} tons CO₂/year</div>
                  </div>
                )}
                {supplier.renewable_energy_percentage && (
                  <div>
                    <div className="text-sm text-gray-600">Renewable Energy</div>
                    <div className="text-lg font-semibold">{supplier.renewable_energy_percentage}%</div>
                  </div>
                )}
                {supplier.waste_recycling_rate && (
                  <div>
                    <div className="text-sm text-gray-600">Waste Recycling</div>
                    <div className="text-lg font-semibold">{supplier.waste_recycling_rate}%</div>
                  </div>
                )}
                {supplier.water_usage_efficiency && (
                  <div>
                    <div className="text-sm text-gray-600">Water Efficiency</div>
                    <div className="text-lg font-semibold">{supplier.water_usage_efficiency}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Company Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {supplier.established_year && (
                  <div>
                    <div className="text-sm text-gray-600">Founded</div>
                    <div className="font-semibold">{supplier.established_year}</div>
                  </div>
                )}
                {supplier.employee_count && (
                  <div>
                    <div className="text-sm text-gray-600">Employees</div>
                    <div className="font-semibold">{supplier.employee_count}</div>
                  </div>
                )}
                {supplier.annual_revenue && (
                  <div>
                    <div className="text-sm text-gray-600">Annual Revenue</div>
                    <div className="font-semibold">${supplier.annual_revenue?.toLocaleString()}</div>
                  </div>
                )}
                {supplier.supply_chain_transparency && (
                  <div>
                    <div className="text-sm text-gray-600">Supply Chain Transparency</div>
                    <div className="font-semibold">{supplier.supply_chain_transparency}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
              <div className="space-y-2">
                {supplier.contact_email && (
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-semibold">{supplier.contact_email}</div>
                  </div>
                )}
                {supplier.contact_phone && (
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-semibold">{supplier.contact_phone}</div>
                  </div>
                )}
                {supplier.website && (
                  <div className="mt-4">
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            {user && supplier.contact_email && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-3">Contact Supplier</h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Your message..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={sendContactEmail}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Sign In Required</h3>
                <p className="text-yellow-700 text-sm mb-3">
                  Sign in to contact suppliers and access premium features.
                </p>
                <Link
                  href="/auth"
                  className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors text-sm"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}