'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../auth/context';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SupplierRegistration() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    established_year: '',
    employee_count: '',
    certifications: [] as string[],
    carbon_footprint: '',
    renewable_energy_percentage: '',
    waste_recycling_rate: '',
    water_usage_efficiency: '',
    supply_chain_transparency: ''
  });

  const categories = [
    'Manufacturing', 'Electronics', 'Textiles', 'Packaging',
    'Water Treatment', 'Forestry', 'Automotive', 'Food Processing',
    'Construction', 'Chemicals', 'Energy', 'Transportation'
  ];

  const certifications = [
    'ISO 14001', 'ISO 9001', 'FSC Certified', 'PEFC Certified',
    'USDA Organic', 'Fair Trade Certified', 'Energy Star Partner',
    'LEED Certified', 'Carbon Neutral Certified', 'GOTS Certified',
    'SA8000', 'B Corp Certified'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificationToggle = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be signed in to register as a supplier');
      return;
    }

    setLoading(true);
    try {
      // Calculate a basic sustainability score based on provided metrics
      let sustainabilityScore = 50; // Base score

      // Add points for certifications
      sustainabilityScore += formData.certifications.length * 5;

      // Add points for renewable energy
      if (formData.renewable_energy_percentage) {
        sustainabilityScore += Math.min(parseFloat(formData.renewable_energy_percentage) * 0.5, 20);
      }

      // Add points for waste recycling
      if (formData.waste_recycling_rate) {
        sustainabilityScore += Math.min(parseFloat(formData.waste_recycling_rate) * 0.3, 15);
      }

      // Cap at 100
      sustainabilityScore = Math.min(Math.round(sustainabilityScore), 100);

      const supplierData = {
        ...formData,
        established_year: formData.established_year ? parseInt(formData.established_year) : null,
        employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
        carbon_footprint: formData.carbon_footprint ? parseFloat(formData.carbon_footprint) : null,
        renewable_energy_percentage: formData.renewable_energy_percentage ? parseFloat(formData.renewable_energy_percentage) : null,
        waste_recycling_rate: formData.waste_recycling_rate ? parseFloat(formData.waste_recycling_rate) : null,
        sustainability_score: sustainabilityScore,
        verified: false, // Requires admin approval
        user_id: user.id // Link to the user account
      };

      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();

      if (error) throw error;

      alert('Supplier registration submitted successfully! Your profile will be reviewed by our team before going live.');
      router.push(`/supplier/${data.id}`);
    } catch (error: any) {
      console.error('Error registering supplier:', error);
      alert('Error registering supplier: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Supplier Registration</h1>
          <p className="mb-6 text-gray-600">You must be signed in to register as a supplier.</p>
          <a
            href="/auth"
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Register as a Supplier</h1>
          <p className="text-gray-600 mt-2">
            Join GreenChainz and showcase your sustainable business practices to potential partners.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="City, State/Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full p-3 border rounded-lg"
                placeholder="Describe your company, products, and sustainability practices..."
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="contact@yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Founded Year
                </label>
                <input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.established_year}
                  onChange={(e) => handleInputChange('established_year', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="2020"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Employees
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.employee_count}
                  onChange={(e) => handleInputChange('employee_count', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supply Chain Transparency
                </label>
                <select
                  value={formData.supply_chain_transparency}
                  onChange={(e) => handleInputChange('supply_chain_transparency', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select level</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Certifications</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select all certifications your company holds:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {certifications.map(cert => (
                <label key={cert} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.certifications.includes(cert)}
                    onChange={() => handleCertificationToggle(cert)}
                    className="mr-2"
                  />
                  <span className="text-sm">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sustainability Metrics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Sustainability Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Carbon Footprint (tons CO₂)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.carbon_footprint}
                  onChange={(e) => handleInputChange('carbon_footprint', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="1250.50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renewable Energy Usage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.renewable_energy_percentage}
                  onChange={(e) => handleInputChange('renewable_energy_percentage', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="85.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Recycling Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.waste_recycling_rate}
                  onChange={(e) => handleInputChange('waste_recycling_rate', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="92.3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Usage Efficiency
                </label>
                <select
                  value={formData.water_usage_efficiency}
                  onChange={(e) => handleInputChange('water_usage_efficiency', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select efficiency</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Register Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}