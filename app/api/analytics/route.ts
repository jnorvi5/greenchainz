import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client with service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get supplier statistics
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .select('verified, category, sustainability_score, created_at');

    if (suppliersError) {
      console.error('Analytics suppliers error:', suppliersError);
      return NextResponse.json(
        { error: 'Failed to fetch supplier data' },
        { status: 500 }
      );
    }

    // Calculate metrics
    const totalSuppliers = suppliers?.length || 0;
    const verifiedSuppliers = suppliers?.filter(s => s.verified).length || 0;
    const pendingSuppliers = totalSuppliers - verifiedSuppliers;

    // Category distribution
    const categoryStats = {};
    suppliers?.forEach(supplier => {
      const category = supplier.category || 'Other';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    // Score distribution
    const scoreRanges = {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      '0-59': 0
    };

    suppliers?.forEach(supplier => {
      const score = supplier.sustainability_score || 0;
      if (score >= 90) scoreRanges['90-100']++;
      else if (score >= 80) scoreRanges['80-89']++;
      else if (score >= 70) scoreRanges['70-79']++;
      else if (score >= 60) scoreRanges['60-69']++;
      else scoreRanges['0-59']++;
    });

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = suppliers?.filter(supplier => {
      const createdAt = new Date(supplier.created_at);
      return createdAt >= thirtyDaysAgo;
    }).length || 0;

    // Average sustainability score
    const avgScore = suppliers?.length
      ? Math.round((suppliers.reduce((sum, s) => sum + (s.sustainability_score || 0), 0) / suppliers.length) * 100) / 100
      : 0;

    const analytics = {
      overview: {
        totalSuppliers,
        verifiedSuppliers,
        pendingSuppliers,
        recentRegistrations,
        averageScore: avgScore
      },
      categories: categoryStats,
      scoreDistribution: scoreRanges,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}