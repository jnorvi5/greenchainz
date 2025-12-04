'use client';
import { useEffect, useState } from 'react';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

function MetricCard({ title, value, description, trend }: MetricCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <span className={`text-sm ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    searchesPerformed: 0,
    suppliersInDb: 0,
    rfqsCreated: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      // Get analytics events from localStorage
      const totalEvents = analytics.getEventCount();
      const searchCount = analytics.getEventCount('search_initiated');
      const profileViews = analytics.getEventCount('supplier_profile_view');
      const contactClicks = analytics.getEventCount('contact_click');

      // Get supplier count from Supabase
      const { count: supplierCount } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact', head: true });

      // Get RFQ count from Supabase
      const { count: rfqCount } = await supabase
        .from('rfqs')
        .select('*', { count: 'exact', head: true });

      // Calculate conversion rate (contacts / profile views)
      const conversionRate = profileViews > 0 
        ? ((contactClicks / profileViews) * 100).toFixed(1)
        : 0;

      setMetrics({
        totalVisitors: totalEvents,
        searchesPerformed: searchCount,
        suppliersInDb: supplierCount || 0,
        rfqsCreated: rfqCount || 0,
        conversionRate: Number(conversionRate),
      });
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Platform metrics and performance overview</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Events"
            value={metrics.totalVisitors}
            description="Tracked analytics events"
            trend="neutral"
          />
          <MetricCard
            title="Searches Performed"
            value={metrics.searchesPerformed}
            description="User search queries"
            trend="neutral"
          />
          <MetricCard
            title="Suppliers in Database"
            value={metrics.suppliersInDb}
            description="Verified sustainable suppliers"
            trend="neutral"
          />
          <MetricCard
            title="RFQs Created"
            value={metrics.rfqsCreated}
            description="Request for quotations"
            trend="neutral"
          />
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span className="font-medium">Homepage Visits</span>
              <span className="text-xl font-bold">{metrics.totalVisitors}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span className="font-medium">Searches</span>
              <span className="text-xl font-bold">{metrics.searchesPerformed}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span className="font-medium">Profile Views</span>
              <span className="text-xl font-bold">{analytics.getEventCount('supplier_profile_view')}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span className="font-medium">Contact Clicks</span>
              <span className="text-xl font-bold">{analytics.getEventCount('contact_click')}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded border-2 border-green-200">
              <span className="font-medium text-green-800">Conversion Rate</span>
              <span className="text-xl font-bold text-green-600">{metrics.conversionRate}%</span>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Health</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Suppliers</span>
                <span className="font-semibold">{metrics.suppliersInDb}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Open RFQs</span>
                <span className="font-semibold">{metrics.rfqsCreated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Search Engagement</span>
                <span className="font-semibold">
                  {metrics.totalVisitors > 0 
                    ? ((metrics.searchesPerformed / metrics.totalVisitors) * 100).toFixed(0)
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => analytics.clearEvents()}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Clear Analytics Data
              </button>
              <Link
                href="/admin"
                className="block w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                Manage Suppliers
              </Link>
              <Link
                href="/register-supplier"
                className="block w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 rounded transition-colors"
              >
                Register New Supplier
              </Link>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Analytics events are stored locally in the browser. 
            For production use, integrate with PostHog, Mixpanel, or your preferred analytics platform.
          </p>
        </div>
      </div>
    </div>
  );
}
