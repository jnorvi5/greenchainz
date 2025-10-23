import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface SupplierProfileProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierProfile({ params }: SupplierProfileProps) {
  const { id } = await params;

  // Create Supabase client inside the function to avoid build-time issues
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables not configured');
    notFound();
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: supplier, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !supplier) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          ← Back to Search
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{supplier.name}</h1>
              <p className="text-lg text-gray-600">{supplier.category} • {supplier.location}</p>
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

          <p className="text-gray-700 text-lg leading-relaxed">{supplier.description}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Company Info</h3>
            <div className="space-y-2 text-sm">
              {supplier.established_year && (
                <p><span className="font-medium">Founded:</span> {supplier.established_year}</p>
              )}
              {supplier.employee_count && (
                <p><span className="font-medium">Employees:</span> {supplier.employee_count.toLocaleString()}</p>
              )}
              {supplier.annual_revenue && (
                <p><span className="font-medium">Revenue:</span> ${supplier.annual_revenue.toLocaleString()}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Environmental Impact</h3>
            <div className="space-y-2 text-sm">
              {supplier.carbon_footprint && (
                <p><span className="font-medium">Carbon Footprint:</span> {supplier.carbon_footprint} tons CO₂/year</p>
              )}
              {supplier.renewable_energy_percentage && (
                <p><span className="font-medium">Renewable Energy:</span> {supplier.renewable_energy_percentage}%</p>
              )}
              {supplier.waste_recycling_rate && (
                <p><span className="font-medium">Waste Recycling:</span> {supplier.waste_recycling_rate}%</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Sustainability Ratings</h3>
            <div className="space-y-2 text-sm">
              {supplier.water_usage_efficiency && (
                <p><span className="font-medium">Water Efficiency:</span> {supplier.water_usage_efficiency}</p>
              )}
              {supplier.supply_chain_transparency && (
                <p><span className="font-medium">Supply Chain:</span> {supplier.supply_chain_transparency}</p>
              )}
            </div>
          </div>
        </div>

        {/* Certifications */}
        {supplier.certifications && supplier.certifications.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Certifications & Standards</h3>
            <div className="flex flex-wrap gap-3">
              {supplier.certifications.map((cert: string, index: number) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
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
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Certification Evidence</h3>
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
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    📄 View Environmental Product Declaration (EPD) →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplier.contact_email && (
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <a
                  href={`mailto:${supplier.contact_email}`}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  {supplier.contact_email}
                </a>
              </div>
            )}
            {supplier.contact_phone && (
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <a
                  href={`tel:${supplier.contact_phone}`}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  {supplier.contact_phone}
                </a>
              </div>
            )}
            {supplier.website && (
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Website:</span>
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  {supplier.website} ↗
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}