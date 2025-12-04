import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Supplier, VerificationStatus, DataSource } from '@/types/supplier';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const minScore = searchParams.get('minScore') || '';
    const location = searchParams.get('location') || '';
    const certification = searchParams.get('certification') || '';
    const verificationStatus = searchParams.get('verificationStatus') as VerificationStatus | null;
    const dataSource = searchParams.get('dataSource') as DataSource | null;
    const includeUnverified = searchParams.get('includeUnverified') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build query
    let dbQuery = supabase.from('suppliers').select('*', { count: 'exact' });

    // Apply full-text search on name AND description using .or()
    if (query.trim()) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Apply filters
    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    if (minScore) {
      dbQuery = dbQuery.gte('sustainability_score', parseInt(minScore));
    }

    if (location) {
      dbQuery = dbQuery.ilike('location', `%${location}%`);
    }

    if (certification) {
      dbQuery = dbQuery.contains('certifications', [certification]);
    }

    // Filter by verification_status if provided
    if (verificationStatus) {
      dbQuery = dbQuery.eq('verification_status', verificationStatus);
    }

    // Filter by data_source if provided
    if (dataSource) {
      dbQuery = dbQuery.eq('data_source', dataSource);
    }

    // For featured suppliers, only show verified with high sustainability scores
    if (featured) {
      dbQuery = dbQuery
        .eq('verified', true)
        .gte('sustainability_score', 80);
    } else if (!includeUnverified) {
      // By default, only show verified suppliers unless includeUnverified is true (for admin)
      dbQuery = dbQuery.eq('verified', true);
    }

    // Order by sustainability_score descending
    dbQuery = dbQuery.order('sustainability_score', { ascending: false, nullsFirst: false });

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await dbQuery;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Failed to search suppliers' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      suppliers: (data || []) as Supplier[],
      total: count || 0,
      limit,
      offset
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}