import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const minScore = searchParams.get('minScore') || '';
    const location = searchParams.get('location') || '';
    const certification = searchParams.get('certification') || '';
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

    // Apply text search
    if (query.trim()) {
      dbQuery = dbQuery.ilike('name', `%${query}%`);
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

    // For non-authenticated requests, only show verified suppliers
    // Note: In a real app, you'd check auth tokens here
    const userId = searchParams.get('userId');
    if (!userId) {
      dbQuery = dbQuery.eq('verified', true);
    }

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
      suppliers: data || [],
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