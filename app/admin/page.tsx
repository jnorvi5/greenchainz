'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../auth/context';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    verifiedSuppliers: 0,
    pendingApprovals: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchSuppliers();
      fetchStats();
    }
  }, [user]);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Get supplier stats
      const { data: allSuppliers, error: suppliersError } = await supabase
        .from('suppliers')
        .select('verified');

      if (suppliersError) throw suppliersError;

      const totalSuppliers = allSuppliers?.length || 0;
      const verifiedSuppliers = allSuppliers?.filter(s => s.verified).length || 0;
      const pendingApprovals = totalSuppliers - verifiedSuppliers;

      // Get user stats (this would require admin privileges in a real app)
      const totalUsers = 1; // Placeholder - would need admin API access

      setStats({
        totalSuppliers,
        verifiedSuppliers,
        pendingApprovals,
        totalUsers
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveSupplier = async (supplierId: string) => {
    try {
      // Use the vetting API endpoint for consistent auditing
      const response = await fetch('/api/admin/vetting', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          action: 'approve',
          actor: user?.email || 'admin',
          notes: 'Approved via admin dashboard',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve supplier');
      }

      const result = await response.json();

      // Update local state
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === supplierId
            ? { ...supplier, verified: true, vetting_status: 'verified', verification_date: new Date().toISOString() }
            : supplier
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        verifiedSuppliers: prev.verifiedSuppliers + 1,
        pendingApprovals: prev.pendingApprovals - 1
      }));

      alert('Supplier approved successfully!');
    } catch (error) {
      console.error('Error approving supplier:', error);
      alert('Error approving supplier');
    }
  };

  const rejectSupplier = async (supplierId: string) => {
    if (!confirm('Are you sure you want to reject this supplier?')) {
      return;
    }

    try {
      // Use the vetting API endpoint for consistent auditing
      const response = await fetch('/api/admin/vetting', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          action: 'reject',
          actor: user?.email || 'admin',
          notes: 'Rejected via admin dashboard',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject supplier');
      }

      // Update local state
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === supplierId
            ? { ...supplier, verified: false, vetting_status: 'rejected' }
            : supplier
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1
      }));

      alert('Supplier rejected.');
    } catch (error) {
      console.error('Error rejecting supplier:', error);
      alert('Error rejecting supplier');
    }
  };

  const requestDocs = async (supplierId: string) => {
    const notes = prompt('Enter notes for the supplier about required documents:');
    if (!notes) return;

    try {
      const response = await fetch('/api/admin/vetting', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          action: 'request_docs',
          actor: user?.email || 'admin',
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to request documents');
      }

      // Update local state
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === supplierId
            ? { ...supplier, vetting_status: 'needs_info', vetting_notes: notes }
            : supplier
        )
      );

      alert('Document request sent successfully!');
    } catch (error) {
      console.error('Error requesting documents:', error);
      alert('Error requesting documents');
    }
  };

  const verifyCert = async (supplierId: string) => {
    const notes = prompt('Enter verification notes (optional):');

    try {
      const response = await fetch('/api/admin/vetting', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_id: supplierId,
          action: 'verify_cert',
          actor: user?.email || 'admin',
          notes: notes || undefined,
          checklist: {
            certifications_verified: true,
            documentation_complete: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify certification');
      }

      // Update local state
      setSuppliers(prev =>
        prev.map(supplier =>
          supplier.id === supplierId
            ? { ...supplier, last_verified_at: new Date().toISOString() }
            : supplier
        )
      );

      alert('Certification verified successfully!');
    } catch (error) {
      console.error('Error verifying certification:', error);
      alert('Error verifying certification');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="mb-6 text-gray-600">You must be signed in as an administrator to access this page.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage suppliers, approvals, and platform content.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'suppliers', label: 'Supplier Management' },
              { id: 'approvals', label: 'Pending Approvals' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.id
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Suppliers</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalSuppliers}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Verified Suppliers</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.verifiedSuppliers}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
            </div>
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Suppliers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map(supplier => (
                    <tr key={supplier.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                          <div className="text-sm text-gray-500">{supplier.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {supplier.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          supplier.sustainability_score >= 90 ? 'bg-green-100 text-green-800' :
                          supplier.sustainability_score >= 80 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {supplier.sustainability_score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          supplier.verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {supplier.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <a
                          href={`/supplier/${supplier.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </a>
                        {!supplier.verified && (
                          <>
                            <button
                              onClick={() => approveSupplier(supplier.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectSupplier(supplier.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pending Supplier Approvals</h2>
            {suppliers.filter(s => !s.verified).length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-500">No pending approvals at this time.</p>
              </div>
            ) : (
              suppliers.filter(s => !s.verified).map(supplier => (
                <div key={supplier.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{supplier.name}</h3>
                      <p className="text-gray-600">{supplier.category} • {supplier.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Sustainability Score: {supplier.sustainability_score}/100
                      </p>
                      {supplier.vetting_status && (
                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                          supplier.vetting_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          supplier.vetting_status === 'needs_info' ? 'bg-orange-100 text-orange-800' :
                          supplier.vetting_status === 'verified' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Vetting Status: {supplier.vetting_status}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => approveSupplier(supplier.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectSupplier(supplier.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => requestDocs(supplier.id)}
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                      >
                        Request Docs
                      </button>
                      <button
                        onClick={() => verifyCert(supplier.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Verify Cert
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{supplier.description}</p>

                  {/* Certification Evidence Section */}
                  {(supplier.fsc_license_code || supplier.compostability_standard || 
                    supplier.organic_textile_cert || supplier.recycled_content_cert || 
                    supplier.ethical_agri_cert || supplier.epd_url) && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Certification Evidence</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {supplier.fsc_license_code && (
                          <div>
                            <span className="font-medium">FSC License: </span>
                            <span className="text-gray-700">{supplier.fsc_license_code}</span>
                          </div>
                        )}
                        {supplier.compostability_standard && (
                          <div>
                            <span className="font-medium">Compostability: </span>
                            <span className="text-gray-700">{supplier.compostability_standard}</span>
                          </div>
                        )}
                        {supplier.organic_textile_cert && (
                          <div>
                            <span className="font-medium">Organic Textile: </span>
                            <span className="text-gray-700">{supplier.organic_textile_cert}</span>
                          </div>
                        )}
                        {supplier.recycled_content_cert && (
                          <div>
                            <span className="font-medium">Recycled Content: </span>
                            <span className="text-gray-700">{supplier.recycled_content_cert}</span>
                          </div>
                        )}
                        {supplier.ethical_agri_cert && (
                          <div>
                            <span className="font-medium">Ethical Agriculture: </span>
                            <span className="text-gray-700">{supplier.ethical_agri_cert}</span>
                          </div>
                        )}
                        {supplier.epd_url && (
                          <div className="md:col-span-2">
                            <span className="font-medium">EPD: </span>
                            <a href={supplier.epd_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {supplier.epd_url}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {supplier.vetting_notes && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <span className="font-medium text-yellow-900">Vetting Notes: </span>
                      <span className="text-yellow-800">{supplier.vetting_notes}</span>
                    </div>
                  )}

                  {supplier.certifications && supplier.certifications.length > 0 && (
                    <div className="mb-4">
                      <span className="font-medium">Certifications: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {supplier.certifications.map((cert: string, index: number) => (
                          <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    Registered on {new Date(supplier.created_at).toLocaleDateString()}
                    {supplier.last_verified_at && (
                      <span className="ml-4">
                        Last verified: {new Date(supplier.last_verified_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}